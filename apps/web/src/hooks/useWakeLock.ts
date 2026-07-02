import { useEffect } from 'react';

/**
 * Mantiene la pantalla del dispositivo encendida mientras el componente está
 * montado y la pestaña visible (Screen Wake Lock API). Pensado para la app del
 * guardia: evita que el bloqueo automático del celular corte el turno o el
 * seguimiento en curso.
 *
 * El lock se libera solo cuando la pantalla se apaga o se cambia de app; al
 * volver a primer plano se vuelve a pedir. Si el navegador no soporta la API
 * (o lo niega por batería baja), degrada silenciosamente.
 */
export function useWakeLock(activo: boolean = true): void {
  useEffect(() => {
    if (!activo) return;
    const nav = navigator as Navigator & {
      wakeLock?: { request: (type: 'screen') => Promise<WakeLockSentinelLike> };
    };
    if (!nav.wakeLock) return;

    let sentinel: WakeLockSentinelLike | null = null;
    let cancelado = false;

    const pedir = async () => {
      try {
        sentinel = await nav.wakeLock!.request('screen');
      } catch {
        // negado (batería/permiso) → se ignora
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible' && !cancelado) void pedir();
    };

    void pedir();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelado = true;
      document.removeEventListener('visibilitychange', onVisibility);
      sentinel?.release().catch(() => undefined);
      sentinel = null;
    };
  }, [activo]);
}

interface WakeLockSentinelLike {
  release: () => Promise<void>;
}
