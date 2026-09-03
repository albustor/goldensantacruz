export type PlayerCategory = 
  | 'Iniciación / Menores de U8 (U6-U8)'
  | 'Mini-Básquet (U8-U10)'
  | 'Infantil (U12-U14)'
  | 'Juvenil (U16-U18)'
  | 'Clínicas de Tecnificación & Tiro';

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  category: PlayerCategory;
  jerseyNumber?: number;
  position?: 'Base (PG)' | 'Escolta (SG)' | 'Alero (SF)' | 'Ala-Pívot (PF)' | 'Pívot (C)' | 'Formativo' | 'Iniciación';
  medicalNotes?: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string;
  monthlyFee: number;
  dueDay: number;
  isActive: boolean;
  photoUrl?: string;
  createdAt: string;
}

export type PaymentStatus = 'paid' | 'pending' | 'overdue';

export interface PaymentRecord {
  id: string;
  playerId: string;
  playerName: string;
  guardianName: string;
  guardianPhone: string;
  month: string;
  monthIndex: number;
  year: number;
  amount: number;
  status: PaymentStatus;
  dueDate: string;
  paidDate?: string;
  paymentMethod?: 'Sinpe Móvil' | 'Transferencia' | 'Efectivo';
  receiptUrl?: string;
  notes?: string;
}

export interface Match {
  id: string;
  opponent: string;
  opponentLogo?: string;
  category: PlayerCategory;
  matchDate: string;
  matchTime: string;
  location: string;
  locationUrl?: string;
  homeAway: 'local' | 'visita';
  status: 'upcoming' | 'live' | 'finished';
  scoreGolden?: number;
  scoreOpponent?: number;
  summary?: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  eventDate: string;
  category: PlayerCategory | 'General' | 'Entrenamiento';
  description?: string;
  createdBy?: string;
  isOpenForUploads: boolean;
  coverPhotoUrl?: string;
}

export type PhotoType = 'community' | 'pro_studio';

export interface GalleryPhoto {
  id: string;
  albumId?: string;
  eventDate: string;
  title: string;
  category?: PlayerCategory | 'General' | 'Entrenamiento';
  photoUrl: string;
  caption?: string;
  uploaderName: string;
  isApproved: boolean;
  likesCount: number;
  createdAt: string;
  photoType: PhotoType;
  watermarkTag?: string; // "Curiol Studio Santa Cruz"
  priceDigital?: number; // 2500 (convenio) vs 4000 regular
  priceRegularDigital?: number; // 4000
  pricePrintedFridge?: number; // 3500 (imán nevera)
  hasCanvasRetablo?: boolean; // Retablos y Canvas (consultar precio)
}

export interface Sponsor {
  id: string;
  name: string;
  tier: 'oro' | 'plata' | 'bronce';
  logoUrl: string;
  tagline: string;
  websiteUrl?: string;
  whatsappPhone?: string;
  isActive: boolean;
  orderIndex: number;
}

export interface AcademySettings {
  name: string;
  brandStudio: string; // "Curiol Studio"
  locationName: string;
  address: string;
  venueNote: string;
  wazeUrl: string;
  googleMapsUrl: string;
  sinpePhone: string;
  sinpeOwner: string;
  ibanAccount: string;
  bankName: string;
  contactPhone: string;
  contactEmail: string;
  instagramUrl: string;
  facebookUrl: string;
  defaultMonthlyFee: number;
  defaultDueDay: number;
}
