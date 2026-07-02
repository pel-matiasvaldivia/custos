import mobileApi from '../services/mobileApi';

/**
 * Cola de acciones offline (outbox) para la app del guardia.
 *
 * Cada acción (checkin, checkout, pánico, scan) se guarda primero en IndexedDB
 * con un id propio (client_event_id, para idempotencia) y el timestamp del
 * dispositivo (momento real de la acción). Se sincroniza con el backend apenas
 * hay señal; si falla por red, se reintenta. El servidor deduplica por
 * client_event_id, así que reintentar es seguro.
 */

export type OutboxTipo = 'checkin' | 'checkout' | 'panic' | 'checkpoint' | 'novedad';

export interface OutboxFile {
  field: string;
  filename: string;
  blob: Blob;
}

export interface OutboxItem {
  id: string; // client_event_id (UUID)
  tipo: OutboxTipo;
  url: string; // endpoint relativo, ej '/mobile/asistencia/checkin'
  body: Record<string, unknown>;
  files?: OutboxFile[]; // adjuntos (foto/audio) → se envían como multipart
  ts: string; // ISO, timestamp del dispositivo al crear la acción
  createdAt: number;
  intentos: number;
}

const DB_NAME = 'custos-go';
const DB_VERSION = 1;
const STORE = 'outbox';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function tx<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDB().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(STORE, mode);
        const req = fn(t.objectStore(STORE));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      }),
  );
}

async function getAll(): Promise<OutboxItem[]> {
  const items = await tx<OutboxItem[]>('readonly', (s) => s.getAll() as IDBRequest<OutboxItem[]>);
  return items.sort((a, b) => a.createdAt - b.createdAt);
}

// ─── Suscripción al contador de pendientes ───
type Listener = (count: number) => void;
const listeners = new Set<Listener>();

async function notify() {
  const items = await getAll().catch(() => []);
  listeners.forEach((l) => l(items.length));
}

export function subscribePending(listener: Listener): () => void {
  listeners.add(listener);
  getAll()
    .then((items) => listener(items.length))
    .catch(() => listener(0));
  return () => listeners.delete(listener);
}

export async function pendingCount(): Promise<number> {
  return (await getAll().catch(() => [])).length;
}

const uuid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

/** Encola una acción y dispara la sincronización si hay señal. */
export async function enqueue(
  tipo: OutboxTipo,
  url: string,
  body: Record<string, unknown>,
  files?: OutboxFile[],
): Promise<OutboxItem> {
  const item: OutboxItem = {
    id: uuid(),
    tipo,
    url,
    body,
    files,
    ts: new Date().toISOString(),
    createdAt: Date.now(),
    intentos: 0,
  };
  await tx('readwrite', (s) => s.put(item));
  await notify();
  void flush();
  return item;
}

let flushing = false;

/** Intenta enviar todas las acciones pendientes. Seguro de llamar múltiples veces. */
export async function flush(): Promise<void> {
  if (flushing) return;
  if (typeof navigator !== 'undefined' && !navigator.onLine) return;
  flushing = true;
  try {
    const items = await getAll();
    for (const item of items) {
      try {
        if (item.files && item.files.length > 0) {
          // Adjuntos → multipart. Los valores no-string se serializan a JSON.
          const fd = new FormData();
          for (const [k, v] of Object.entries(item.body)) {
            if (v === undefined || v === null) continue;
            fd.append(k, typeof v === 'string' ? v : JSON.stringify(v));
          }
          fd.append('clientEventId', item.id);
          fd.append('ts', item.ts);
          for (const f of item.files) fd.append(f.field, f.blob, f.filename);
          await mobileApi.post(item.url, fd);
        } else {
          await mobileApi.post(item.url, {
            ...item.body,
            clientEventId: item.id,
            ts: item.ts,
          });
        }
        await tx('readwrite', (s) => s.delete(item.id));
        await notify();
      } catch (err) {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status && status >= 400 && status < 500 && status !== 401 && status !== 408 && status !== 429) {
          // Rechazo permanente del servidor (validación, turno inválido, etc.):
          // se descarta para no bloquear la cola. Los de red / 401 se conservan.
          await tx('readwrite', (s) => s.delete(item.id));
          await notify();
          // eslint-disable-next-line no-console
          console.warn(`[outbox] acción ${item.tipo} descartada (HTTP ${status})`);
          continue;
        }
        // Error de red o transitorio: cortar y reintentar en el próximo flush.
        break;
      }
    }
  } finally {
    flushing = false;
  }
}

let iniciado = false;
/** Arranca la sincronización automática (al cargar, al recuperar señal, al volver a foco). */
export function initOutbox(): void {
  if (iniciado || typeof window === 'undefined') return;
  iniciado = true;
  window.addEventListener('online', () => void flush());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void flush();
  });
  void flush();
}
