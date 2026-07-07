import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

/** Datos de conexión a un equipo Hikvision (compartidos por probar/crear). */
export class ConexionHikDto {
  @IsString() ip: string;
  @IsOptional() @IsInt() puerto_http?: number;
  @IsOptional() @IsInt() puerto_rtsp?: number;
  @IsString() usuario: string;
  @IsString() password: string;
  @IsOptional() @IsBoolean() https?: boolean;
}

export class ProbarDispositivoDto extends ConexionHikDto {}

export class CrearDispositivoDto extends ConexionHikDto {
  @IsUUID() objetivo_id: string;
  @IsString() tipo: string; // DVR | NVR | CAMARA_IP | PANEL_ALARMA | ...
  @IsOptional() @IsString() protocolo?: string; // default ISAPI
  @IsOptional() @IsString() marca?: string; // default Hikvision
  @IsOptional() @IsString() modelo?: string;
  @IsOptional() @IsString() nro_abonado?: string;
}

export class ActualizarDispositivoDto {
  @IsOptional() @IsString() nombre?: string;
  @IsOptional() @IsString() modelo?: string;
  @IsOptional() @IsString() nro_abonado?: string;
  @IsOptional() @IsInt() puerto_http?: number;
  @IsOptional() @IsInt() puerto_rtsp?: number;
  @IsOptional() @IsString() usuario?: string;
  @IsOptional() @IsString() password?: string;
  @IsOptional() @IsBoolean() https?: boolean;
  @IsOptional() @IsBoolean() en_prueba?: boolean; // walk-test
}

export class ActualizarCanalDto {
  @IsOptional() @IsString() nombre?: string;
  @IsOptional() @IsString() rtsp_path?: string;
  @IsOptional() @IsBoolean() tiene_ptz?: boolean;
  @IsOptional() @IsBoolean() habilitado?: boolean;
}

/** Mapea una zona de alarma al canal de video que la verifica. */
export class MapearZonaCanalDto {
  @IsUUID() zona_id: string;
  @IsOptional() @IsUUID() canal_id?: string | null; // null = desvincular
}

export class PtzDto {
  @IsOptional() @IsInt() @Min(-100) pan?: number;
  @IsOptional() @IsInt() @Min(-100) tilt?: number;
  @IsOptional() @IsInt() @Min(-100) zoom?: number;
}
