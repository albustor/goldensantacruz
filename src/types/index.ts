export type PlayerCategory =
  | "Iniciación / Menores de U8 (U6-U8)"
  | "Mini-Básquet (U8-U10)"
  | "Infantil (U12-U14)"
  | "Juvenil (U16-U18)"
  | "Clínicas de Tecnificación & Tiro";

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
  registrationDate: string;
  monthlyFee: number;
  paymentStatus: PaymentStatus;
  isActive: boolean;
}

export interface PaymentRecord {
  id: string;
  playerId: string;
  playerName: string;
  guardianName: string;
  guardianPhone: string;
  month: string;
  year: number;
  amount: number;
  status: "pagado" | "pendiente" | "atrasado";
  paymentDate?: string;
  sinpeReference?: string;
  receiptUrl?: string;
  dueDate: string;
}

export interface Match {
  id: string;
  category: PlayerCategory;
  opponent: string;
  matchDate: string;
  matchTime: string;
  location: string;
  locationUrl?: string;
  isHome: boolean;
  ourScore?: number;
  opponentScore?: number;
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
  uploaderRole: "padre" | "madre" | "entrenador" | "aficionado" | "staff";
  photoType: "community" | "pro_studio";
  albumId?: string;
  eventDate?: string;
  likesCount: number;
  isApproved: boolean;
  uploadedAt: string;
  watermarkTag?: string; // "Curiol Studio Santa Cruz"
  priceDigital?: number; // Precios para fotos de estudio
  pricePrint?: number;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  coverPhotoUrl: string;
  eventDate: string;
  category: string;
  createdBy: string;
  isLocked?: boolean;
}

export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  tier: "oro" | "plata" | "bronce";
  websiteUrl?: string;
  phone?: string;
  contactName?: string;
  isActive: boolean;
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
}
