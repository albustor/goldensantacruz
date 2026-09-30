export type PlayerCategory = string;

export type PaymentStatus = "al_dia" | "pendiente" | "vencido";

export interface Player {
  id: string;
  fullName: string;
  birthDate: string;
  category: PlayerCategory;
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string;
  photoUrl?: string;
  jerseyNumber?: number;
  position?: string;
  medicalNotes?: string;
  address?: string;
  school?: string;
  age?: string | number;
  photoAuthorized?: boolean;
  photoAuthNotes?: string;
  tshirtSize?: string;
  bloodType?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  idCardNumber?: string;
  dominantHand?: string;
  registrationDate: string;
  monthlyFee: number;
  paymentStatus: PaymentStatus;
  isActive: boolean;
  createdAt?: string;
  dueDay?: number;
}

export interface PaymentRecord {
  id: string;
  playerId: string;
  playerName: string;
  guardianName: string;
  guardianPhone: string;
  month: string;
  monthIndex?: number;
  year: number;
  amount: number;
  status: "pagado" | "pendiente" | "atrasado";
  paymentDate?: string;
  paidDate?: string;
  paymentMethod?: string;
  notes?: string;
  sinpeReference?: string;
  receiptUrl?: string;
  dueDate: string;
  // Campos de Prórroga / Convenio Especial
  extensionDate?: string;
  extensionReason?: string;
  isExemptFromSweep?: boolean;
}

export interface Match {
  id: string;
  category: PlayerCategory;
  opponent: string;
  opponentLogo?: string;
  matchDate: string;
  matchTime: string;
  location: string;
  locationUrl?: string;
  isHome: boolean;
  homeAway?: "local" | "visita";
  ourScore?: number;
  opponentScore?: number;
  scoreGolden?: number;
  scoreOpponent?: number;
  status: "upcoming" | "finished" | "live";
  summary?: string;
  mvp?: string;
}

export interface GalleryPhoto {
  id: string;
  photoUrl: string;
  title: string;
  caption?: string;
  category: PlayerCategory;
  uploaderName: string;
  uploaderPhone?: string;
  uploaderRole?: "padre" | "madre" | "entrenador" | "aficionado" | "staff" | "familia";
  photoType: "community" | "pro_studio";
  albumId?: string;
  eventDate?: string;
  likesCount: number;
  isApproved: boolean;
  uploadedAt?: string;
  createdAt?: string;
  watermarkTag?: string; // "Curiol Studio Santa Cruz"
  priceDigital?: number; // Precios para fotos de estudio
  pricePrint?: number;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  coverPhotoUrl?: string;
  eventDate: string;
  category: string;
  description?: string;
  createdBy: string;
  isLocked?: boolean;
  isOpenForUploads?: boolean;
  albumType?: "community" | "pro_studio";
  photoCount?: number;
  isArbolHito?: boolean;
  arbolSlug?: string;
  arbolNodeUrl?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  tier: "oro" | "plata" | "bronce";
  tagline?: string;
  websiteUrl?: string;
  phone?: string;
  whatsappPhone?: string;
  contactName?: string;
  isActive: boolean;
  orderIndex?: number;
}

export interface AudioNote {
  id: string;
  title: string;
  audioBlobUrl?: string;
  transcript: string;
  summaryIA?: string;
  actionItems?: string[];
  category: "directiva" | "entrenador" | "patrocinio" | "reunion";
  recordedAt: string;
  author: string;
}

export interface SystemSettings {
  academyName: string;
  sinpePhone: string;
  sinpeOwner: string;
  ibanAccount: string;
  bankName: string;
  monthlyFeeDefault: number;
  coachPhone: string;
  adminPin: string;
  brandStudio: string; // "Curiol Studio"
  arbolGuanacasteUrl: string; // "https://www.curiol.studio/linea-de-tiempo/golden-academy-santa-cruz"
  address: string;
  bunnyApiKey?: string;
  bunnyStreamLibraryId?: string;
}

export type AcademySettings = SystemSettings;

// MULTI-CAMERA LIVE STREAMING & SCOREBOARD TYPES (Bunny.net + GoPro 12 + DJI Osmo Pocket + Smartphone)
export interface LiveCameraConfig {
  id: string; // 'cam-gopro' | 'cam-dji' | 'cam-phone' | 'cam-main' | 'cam-youtube'
  name: string;
  shortName: string;
  deviceModel: "GoPro HERO 12 Black" | "DJI Osmo Pocket" | "Smartphone 4K / Móvil en Trípode" | "YouTube Live / Señal Externa" | "OBS / Señal Mezclada" | "Cámara Secundaria";
  role: "Cancha Completa" | "Seguimiento Dinámico" | "Bajo el Aro / Lateral" | "Gradas / Afición" | "Banquillo / Reacciones" | "Mesa Técnica";
  streamType: "bunny_stream" | "hls_direct" | "youtube" | "iframe_custom";
  youtubeUrl?: string;
  youtubeVideoId?: string;
  bunnyVideoId?: string;
  bunnyLibraryId?: string;
  hlsUrl?: string;
  embedUrl?: string;
  rtmpServer: string;
  streamKey: string;
  isActive: boolean;
  status: "live" | "offline" | "connecting";
}

export interface LiveScoreboard {
  homeTeam: string; // "Golden Sport Santa Cruz"
  homeScore: number;
  homeFouls: number;
  awayTeam: string; // "Parajeles"
  awayScore: number;
  awayFouls: number;
  period: "Q1" | "Q2" | "Q3" | "Q4" | "OT" | "Medio Tiempo" | "Final" | "Próximo";
  gameTime: string; // "08:45"
  isClockRunning: boolean;
  possession: "home" | "away" | "none";
}

export interface LiveChatMessage {
  id: string;
  authorName: string;
  authorRole: "padre" | "madre" | "atleta" | "staff" | "aficionado";
  message: string;
  timestamp: string;
}

export interface LiveStreamConfig {
  id: string;
  isLive: boolean;
  broadcastMode: "video_and_scoreboard" | "scoreboard_only";
  scoreboardVisible?: boolean; // Toggle overlay marcador
  sponsorsVisible?: boolean;   // Toggle publicidad / marca de agua
  title: string;
  matchDate: string;
  startTime: string;
  category: PlayerCategory;
  location: string;
  opponentName: string;
  selectedCameraId: string; // ID of active camera for viewer
  cameras: LiveCameraConfig[];
  scoreboard: LiveScoreboard;
  chatEnabled: boolean;
  reactionsEnabled?: boolean;
  reactions: {
    fire: number;
    clap: number;
    star: number;
    basketball: number;
  };
  chatMessages: LiveChatMessage[];
  sponsorWatermark: {
    name: string;
    logoUrl: string;
    tagline: string;
    websiteUrl: string;
  };
  bunnyApiKey?: string;
  bunnyStreamLibraryId?: string;
}

