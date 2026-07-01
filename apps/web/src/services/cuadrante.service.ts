import api from './api';

export type TipoDia = 'TRABAJO' | 'FRANCO';

export interface BloqueDef {
  hora_inicio: string;
  duracion_horas: number;
  tipo_bloque?: string;
}

export interface DiaDef {
  tipo: TipoDia;
  bloques?: BloqueDef[];
}

export interface EsquemaTurno {
  id: string;
  nombre: string;
  dias_ciclo: number;
  definicion: { dias_ciclo: number; dias: DiaDef[] };
}

export interface CreateEsquemaTurnoData {
  nombre: string;
  dias_ciclo: number;
  dias: DiaDef[];
}

export interface AsignacionEsquema {
  id: string;
  puestoId: string;
  puestoNombre: string | null;
  vigiladorId: string;
  vigilador: { id: string; nombre: string; apellido: string; legajo_nro: string } | null;
  esquemaId: string;
  esquemaNombre: string;
  posicionCiclo: number;
  fechaAncla: string;
  vigenteDesde: string;
}

export interface CreateAsignacionEsquemaData {
  puesto_id: string;
  vigilador_id: string;
  esquema_id: string;
  posicion_ciclo?: number;
  fecha_ancla: string;
  vigente_desde: string;
  generar_desde?: string;
  generar_hasta?: string;
}

export interface GeneracionResultado {
  generados: number;
  creados: number;
  rechazados: { inicio_plan: string; errores: string[] }[];
}

export interface VentanaCobertura {
  horas_dia: number;
  dias: number[];
}

export interface PuestoCobertura {
  id: string;
  puesto_id: string;
  dotacion_requerida: number;
  ventana: VentanaCobertura;
}

export interface UpsertPuestoCoberturaData {
  dotacion_requerida?: number;
  ventana: VentanaCobertura;
}

export interface HuecoCobertura {
  inicio: string;
  fin: string;
  dotacion: number;
  requerida: number;
  tipo: 'HUECO' | 'OK' | 'SOBRE';
}

export interface CoberturaResultado {
  puestoId: string;
  dotacionRequerida: number;
  huecos: HuecoCobertura[];
  sobreDotacion: HuecoCobertura[];
}

export interface TurnoPlanificado {
  id: string;
  inicioPlan: string;
  finPlan: string;
  tipoBloque: string;
  estado: string;
  motivo: string | null;
  vigiladorId: string;
  vigilador: { id: string; nombre: string; apellido: string } | null;
}

export interface CuadrantePuesto {
  puestoId: string;
  puestoNombre: string;
  turnos: TurnoPlanificado[];
  dotacionRequerida: number | null;
  cobertura: { huecos: HuecoCobertura[]; sobreDotacion: HuecoCobertura[] } | null;
}

/** Sugiere la dotación requerida con la misma fórmula que usa el backend, para previsualizar en el form. */
export function sugerirDotacion(horasDia: number, dias: number, jornadaMaxSemanalH: number): number {
  if (horasDia <= 0 || dias <= 0 || jornadaMaxSemanalH <= 0) return 0;
  return Math.ceil((horasDia * dias) / jornadaMaxSemanalH);
}

/** Horas de trabajo promedio por semana de un esquema, a partir de su definición (1 persona). */
export function horasSemanaEsquema(esquema: Pick<EsquemaTurno, 'definicion'>): number {
  const { dias_ciclo, dias } = esquema.definicion;
  if (!dias?.length || dias_ciclo <= 0) return 0;
  const totalTrabajo = dias
    .slice(0, dias_ciclo)
    .reduce(
      (acc, d) =>
        acc + (d.tipo === 'TRABAJO' ? (d.bloques ?? []).reduce((a, b) => a + b.duracion_horas, 0) : 0),
      0,
    );
  return Math.round((totalTrabajo / dias_ciclo) * 7);
}

export const cuadranteService = {
  crearEsquema: async (data: CreateEsquemaTurnoData): Promise<EsquemaTurno> => {
    const response = await api.post<EsquemaTurno>('/cuadrante/esquemas', data);
    return response.data;
  },

  listarEsquemas: async (): Promise<EsquemaTurno[]> => {
    const response = await api.get<EsquemaTurno[]>('/cuadrante/esquemas');
    return response.data;
  },

  eliminarEsquema: async (id: string): Promise<void> => {
    await api.delete(`/cuadrante/esquemas/${id}`);
  },

  crearAsignacion: async (
    data: CreateAsignacionEsquemaData,
  ): Promise<{ asignacion: AsignacionEsquema; generacion: GeneracionResultado }> => {
    const response = await api.post('/cuadrante/asignaciones', data);
    return response.data;
  },

  listarAsignacionesPorObjetivo: async (objetivoId: string): Promise<AsignacionEsquema[]> => {
    const response = await api.get<AsignacionEsquema[]>('/cuadrante/asignaciones', {
      params: { objetivoId },
    });
    return response.data;
  },

  finalizarAsignacion: async (id: string, vigenteHasta: string): Promise<AsignacionEsquema> => {
    const response = await api.post<AsignacionEsquema>(`/cuadrante/asignaciones/${id}/finalizar`, {
      vigente_hasta: vigenteHasta,
    });
    return response.data;
  },

  upsertCobertura: async (puestoId: string, data: UpsertPuestoCoberturaData): Promise<PuestoCobertura> => {
    const response = await api.put<PuestoCobertura>(`/cuadrante/puestos/${puestoId}/cobertura`, data);
    return response.data;
  },

  obtenerCobertura: async (puestoId: string): Promise<PuestoCobertura | null> => {
    const response = await api.get<PuestoCobertura | null>(`/cuadrante/puestos/${puestoId}/cobertura`);
    return response.data;
  },

  cuadranteDeObjetivo: async (
    objetivoId: string,
    desde: string,
    hasta: string,
  ): Promise<CuadrantePuesto[]> => {
    const response = await api.get<CuadrantePuesto[]>(`/cuadrante/objetivos/${objetivoId}`, {
      params: { desde, hasta },
    });
    return response.data;
  },
};
