/**
 * Golden Sport Academy — Arquitectura SOLID de Repositorio y Multicámara (SRP + ISP + DIP + LSP)
 * ----------------------------------------------------------------------------------------------
 * 1. Desacopla las vistas administrativas (AdminGalleryTab, AdminLiveStreamTab, AdminPaymentsTab)
 *    de la capa de almacenamiento concreto (IndexedDB / Firebase / Supabase) mediante ISportDataRepository (DIP).
 * 2. Segrega el contrato del Visor Multicámara Interactivo (ISP) para las 4 señales de campo:
 *    - Cancha completa (GoPro HERO)
 *    - Acción de cerca (DJI Osmo Pocket)
 *    - Vista aérea (Dron DJI)
 *    - Fotos en vivo (Sony α7 III Wi-Fi FTP :2121 -> HP Roja -> Web)
 * 3. Aplica la Regla Universal de No Presentación / Reprogramación (0 pts y 0 PJ).
 */

export type MultiCamChannelId = 'cancha_completa' | 'accion_cerca' | 'vista_aerea' | 'fotos_en_vivo';

/**
 * Interfaz segregada para cada flujo del visor multicámara (ISP)
 */
export interface IMultiCamStreamChannel {
  readonly channelId: MultiCamChannelId;
  readonly label: string;
  readonly hardwareSource: string;
  readonly streamProtocol: 'HLS' | 'WebRTC' | 'BUNNY_CDN' | 'PHOTO_CASCADE_WEBP';
  readonly playbackUrl: string;
  readonly isOnline: boolean;
  readonly batteryPercentage?: number;
}

/**
 * Contrato de inversión de dependencias para persistencia de academia deportiva (DIP + LSP)
 */
export interface ISportAcademyRepository<TEntity, TKey = string> {
  readonly providerName: string;
  getAll(): Promise<readonly TEntity[]>;
  getById(id: TKey): Promise<TEntity | null>;
  save(entity: TEntity): Promise<void>;
}

/**
 * Regla Universal Curiol Studio (SRP + DRY):
 * Ningún partido no disputado se declara como derrota punitiva; pasa a 'postponed' con 0 pts y 0 PJ.
 */
export interface IPostponedMatchResolution {
  readonly matchId: string;
  readonly status: 'postponed';
  readonly currentPeriod: 'Por reprogramar';
  readonly homeScore: 0;
  readonly awayScore: 0;
  readonly pointsAwardedHome: 0;
  readonly pointsAwardedAway: 0;
  readonly playedIncrement: 0;
  readonly officialLegend: string;
}

export function resolveNonAttendanceAsPostponed(
  matchId: string,
  teamName?: string
): IPostponedMatchResolution {
  const officialLegend = teamName
    ? `${teamName} no se presentó · Partido por reprogramar (sin asignación de puntos a ningún equipo)`
    : 'Partido por reprogramar (sin asignación de puntos a ningún equipo)';

  return {
    matchId,
    status: 'postponed',
    currentPeriod: 'Por reprogramar',
    homeScore: 0,
    awayScore: 0,
    pointsAwardedHome: 0,
    pointsAwardedAway: 0,
    playedIncrement: 0,
    officialLegend,
  };
}

export const DEFAULT_MULTICAM_CHANNELS: readonly IMultiCamStreamChannel[] = [
  {
    channelId: 'cancha_completa',
    label: 'Cancha completa',
    hardwareSource: 'GoPro HERO (Fija Panorámica + Power Bank)',
    streamProtocol: 'BUNNY_CDN',
    playbackUrl: '',
    isOnline: true,
  },
  {
    channelId: 'accion_cerca',
    label: 'Acción de cerca',
    hardwareSource: 'DJI Osmo Pocket (Gimbal a ras de cancha)',
    streamProtocol: 'BUNNY_CDN',
    playbackUrl: '',
    isOnline: true,
  },
  {
    channelId: 'vista_aerea',
    label: 'Vista aérea',
    hardwareSource: 'Dron DJI (Waypoints / Spotlight / Tele 3x)',
    streamProtocol: 'BUNNY_CDN',
    playbackUrl: '',
    isOnline: true,
  },
  {
    channelId: 'fotos_en_vivo',
    label: 'Fotos en vivo',
    hardwareSource: 'Sony α7 III (Tethering FTP :2121 -> IA 16 bits)',
    streamProtocol: 'PHOTO_CASCADE_WEBP',
    playbackUrl: '',
    isOnline: true,
  },
] as const;
