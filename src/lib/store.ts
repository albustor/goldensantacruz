import {
  AcademySettings,
  GalleryAlbum,
  GalleryPhoto,
  Match,
  PaymentRecord,
  Player,
  Sponsor,
} from '../types';
import {
  INITIAL_ALBUMS,
  INITIAL_GALLERY_PHOTOS,
  INITIAL_MATCHES,
  INITIAL_PAYMENTS,
  INITIAL_PLAYERS,
  INITIAL_SETTINGS,
  INITIAL_SPONSORS,
  INITIAL_CATEGORIES,
} from './initialData';
import { supabase, isSupabaseConfigured } from './supabase';

export interface DirectivaAudioNote {
  id: string;
  title: string;
  audioUrl: string;
  duration: number;
  transcript?: string;
  author: string;
  createdAt: string;
}

const STORAGE_KEYS = {
  PLAYERS: 'golden_players_v5',
  PAYMENTS: 'golden_payments_v5',
  MATCHES: 'golden_matches_v5',
  ALBUMS: 'golden_albums_v5',
  GALLERY: 'golden_gallery_v5',
  SPONSORS: 'golden_sponsors_v5',
  SETTINGS: 'golden_settings_v5',
  AUDIO_NOTES: 'golden_audio_notes_v5',
  CATEGORIES: 'golden_categories_v5',
};

function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`Error writing storage [${key}]:`, err);
  }
}

export const Store = {
  // SETTINGS
  getSettings(): AcademySettings {
    return getFromStorage<AcademySettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },
  updateSettings(settings: AcademySettings): void {
    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
  },

  // PLAYERS
  async getPlayers(): Promise<Player[]> {
    return getFromStorage<Player[]>(STORAGE_KEYS.PLAYERS, INITIAL_PLAYERS);
  },

  async addPlayer(player: Omit<Player, 'id' | 'createdAt'>): Promise<Player> {
    const newPlayer: Player = {
      ...player,
      id: `ply-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const current = getFromStorage<Player[]>(STORAGE_KEYS.PLAYERS, INITIAL_PLAYERS);
    saveToStorage(STORAGE_KEYS.PLAYERS, [newPlayer, ...current]);
    return newPlayer;
  },

  async updatePlayer(player: Player): Promise<void> {
    const current = getFromStorage<Player[]>(STORAGE_KEYS.PLAYERS, INITIAL_PLAYERS);
    saveToStorage(STORAGE_KEYS.PLAYERS, current.map(p => (p.id === player.id ? player : p)));
  },

  async deletePlayer(id: string): Promise<void> {
    const current = getFromStorage<Player[]>(STORAGE_KEYS.PLAYERS, INITIAL_PLAYERS);
    saveToStorage(STORAGE_KEYS.PLAYERS, current.filter(p => p.id !== id));
  },

  // PAYMENTS
  async getPayments(): Promise<PaymentRecord[]> {
    return getFromStorage<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
  },

  async addPayment(payment: Omit<PaymentRecord, 'id'>): Promise<PaymentRecord> {
    const newRecord: PaymentRecord = {
      ...payment,
      id: `pay-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    const current = getFromStorage<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
    saveToStorage(STORAGE_KEYS.PAYMENTS, [newRecord, ...current]);
    return newRecord;
  },

  async updatePayment(payment: PaymentRecord): Promise<void> {
    const current = getFromStorage<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
    saveToStorage(STORAGE_KEYS.PAYMENTS, current.map(p => (p.id === payment.id ? payment : p)));
  },

  async deletePayment(id: string): Promise<void> {
    const current = getFromStorage<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
    saveToStorage(STORAGE_KEYS.PAYMENTS, current.filter(p => p.id !== id));
  },

  async updatePaymentStatus(id: string, status: "pagado" | "pendiente" | "atrasado", sinpeReference?: string): Promise<void> {
    const current = getFromStorage<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
    const updated = current.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status,
          sinpeReference: sinpeReference || p.sinpeReference,
          paymentDate: status === "pagado" ? (p.paymentDate || new Date().toISOString().split("T")[0]) : undefined,
        };
      }
      return p;
    });
    saveToStorage(STORAGE_KEYS.PAYMENTS, updated);
  },

  async markPaymentPaid(id: string, method: 'Sinpe Móvil' | 'Transferencia' | 'Efectivo', notes?: string): Promise<void> {
    const current = getFromStorage<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
    const updated = current.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: 'paid' as const,
          paidDate: new Date().toISOString().split('T')[0],
          paymentMethod: method,
          notes: notes || p.notes,
        };
      }
      return p;
    });
    saveToStorage(STORAGE_KEYS.PAYMENTS, updated);
  },

  async generateMonthlyPaymentsForActivePlayers(monthName: string, monthIndex: number, year: number): Promise<PaymentRecord[]> {
    const players = await this.getPlayers();
    const existing = await this.getPayments();
    const newRecords: PaymentRecord[] = [];

    const activePlayers = players.filter(p => p.isActive);
    for (const player of activePlayers) {
      const alreadyExists = existing.some(
        e => e.playerId === player.id && e.monthIndex === monthIndex && e.year === year
      );

      if (!alreadyExists) {
        const dueDayFormatted = String(player.dueDay || 5).padStart(2, '0');
        const monthFormatted = String(monthIndex).padStart(2, '0');
        const dueDate = `${year}-${monthFormatted}-${dueDayFormatted}`;

        const record: PaymentRecord = {
          id: `pay-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          playerId: player.id,
          playerName: player.fullName,
          guardianName: player.guardianName,
          guardianPhone: player.guardianPhone,
          month: monthName,
          monthIndex,
          year,
          amount: player.monthlyFee,
          status: 'pendiente',
          dueDate,
        };
        newRecords.push(record);
      }
    }

    const merged = [...newRecords, ...existing];
    saveToStorage(STORAGE_KEYS.PAYMENTS, merged);
    return merged;
  },

  // MATCHES
  async getMatches(): Promise<Match[]> {
    return getFromStorage<Match[]>(STORAGE_KEYS.MATCHES, INITIAL_MATCHES);
  },

  async addMatch(match: Omit<Match, 'id'>): Promise<Match> {
    const newMatch: Match = { ...match, id: `mtc-${Date.now()}` };
    const current = getFromStorage<Match[]>(STORAGE_KEYS.MATCHES, INITIAL_MATCHES);
    saveToStorage(STORAGE_KEYS.MATCHES, [newMatch, ...current]);
    return newMatch;
  },

  async updateMatch(match: Match): Promise<void> {
    const current = getFromStorage<Match[]>(STORAGE_KEYS.MATCHES, INITIAL_MATCHES);
    saveToStorage(STORAGE_KEYS.MATCHES, current.map(m => m.id === match.id ? match : m));
  },

  async deleteMatch(id: string): Promise<void> {
    const current = getFromStorage<Match[]>(STORAGE_KEYS.MATCHES, INITIAL_MATCHES);
    saveToStorage(STORAGE_KEYS.MATCHES, current.filter(m => m.id !== id));
  },

  // ALBUMS
  async getAlbums(): Promise<GalleryAlbum[]> {
    return getFromStorage<GalleryAlbum[]>(STORAGE_KEYS.ALBUMS, INITIAL_ALBUMS);
  },

  async getOrCreateDailyAlbum(
    eventDate: string,
    proposedTitle: string,
    uploaderName: string,
    category: any
  ): Promise<GalleryAlbum> {
    const current = await this.getAlbums();
    const existing = current.find(a => a.eventDate === eventDate);
    if (existing) {
      return existing;
    }

    const newAlbum: GalleryAlbum = {
      id: `alb-${Date.now()}`,
      title: proposedTitle || `Evento Golden Sport (${eventDate})`,
      eventDate,
      category: category || 'General',
      createdBy: uploaderName || 'Papá Golden',
      description: `Álbum colectivo del día ${eventDate} iniciado por ${uploaderName || 'un padre de familia'}.`,
      isOpenForUploads: true,
    };
    saveToStorage(STORAGE_KEYS.ALBUMS, [newAlbum, ...current]);
    return newAlbum;
  },

  async updateAlbum(album: GalleryAlbum): Promise<void> {
    const current = await this.getAlbums();
    const updated = current.map(a => a.id === album.id ? album : a);
    saveToStorage(STORAGE_KEYS.ALBUMS, updated);

    // Update photos associated with this album
    const photos = await this.getGalleryPhotos();
    const updatedPhotos = photos.map(p => p.albumId === album.id ? { ...p, title: album.title, category: album.category } : p);
    saveToStorage(STORAGE_KEYS.GALLERY, updatedPhotos);
  },

  async updateAlbumTitle(albumId: string, newTitle: string): Promise<void> {
    const current = await this.getAlbums();
    const updated = current.map(a => a.id === albumId ? { ...a, title: newTitle } : a);
    saveToStorage(STORAGE_KEYS.ALBUMS, updated);

    // Also update all photos with this albumId
    const photos = await this.getGalleryPhotos();
    const updatedPhotos = photos.map(p => p.albumId === albumId ? { ...p, title: newTitle } : p);
    saveToStorage(STORAGE_KEYS.GALLERY, updatedPhotos);
  },

  async addAlbum(album: Omit<GalleryAlbum, 'id'>): Promise<GalleryAlbum> {
    const newAlbum: GalleryAlbum = { ...album, id: `alb-${Date.now()}` };
    const current = await this.getAlbums();
    saveToStorage(STORAGE_KEYS.ALBUMS, [newAlbum, ...current]);
    return newAlbum;
  },

  async toggleAlbumUploads(albumId: string, isOpen: boolean): Promise<void> {
    const current = await this.getAlbums();
    saveToStorage(STORAGE_KEYS.ALBUMS, current.map(a => a.id === albumId ? { ...a, isOpenForUploads: isOpen } : a));
  },

  async deleteAlbum(albumId: string): Promise<void> {
    const current = await this.getAlbums();
    saveToStorage(STORAGE_KEYS.ALBUMS, current.filter(a => a.id !== albumId));
  },

  // GALLERY PHOTOS
  async getGalleryPhotos(): Promise<GalleryPhoto[]> {
    return getFromStorage<GalleryPhoto[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY_PHOTOS);
  },

  async addGalleryPhoto(photo: Omit<GalleryPhoto, 'id' | 'likesCount' | 'createdAt'>): Promise<GalleryPhoto> {
    const newPhoto: GalleryPhoto = {
      ...photo,
      id: `gal-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      likesCount: 0,
      createdAt: new Date().toISOString(),
      watermarkTag: photo.watermarkTag || "Curiol Studio Santa Cruz",
    };
    const current = await this.getGalleryPhotos();
    saveToStorage(STORAGE_KEYS.GALLERY, [newPhoto, ...current]);
    return newPhoto;
  },

  async likeGalleryPhoto(id: string): Promise<void> {
    const current = await this.getGalleryPhotos();
    const updated = current.map(p => p.id === id ? { ...p, likesCount: p.likesCount + 1 } : p);
    saveToStorage(STORAGE_KEYS.GALLERY, updated);
  },

  async deleteGalleryPhoto(id: string): Promise<void> {
    const current = await this.getGalleryPhotos();
    saveToStorage(STORAGE_KEYS.GALLERY, current.filter(p => p.id !== id));
  },

  // SPONSORS
  async getSponsors(): Promise<Sponsor[]> {
    return getFromStorage<Sponsor[]>(STORAGE_KEYS.SPONSORS, INITIAL_SPONSORS);
  },

  async addSponsor(sponsor: Omit<Sponsor, 'id'>): Promise<Sponsor> {
    const newSponsor: Sponsor = { ...sponsor, id: `spn-${Date.now()}` };
    const current = await this.getSponsors();
    saveToStorage(STORAGE_KEYS.SPONSORS, [...current, newSponsor]);
    return newSponsor;
  },

  async updateSponsor(sponsor: Sponsor): Promise<void> {
    const current = await this.getSponsors();
    saveToStorage(STORAGE_KEYS.SPONSORS, current.map(s => s.id === sponsor.id ? sponsor : s));
  },

  async deleteSponsor(id: string): Promise<void> {
    const current = await this.getSponsors();
    saveToStorage(STORAGE_KEYS.SPONSORS, current.filter(s => s.id !== id));
  },

  // DIRECTIVA AUDIO NOTES
  async getAudioNotes(): Promise<DirectivaAudioNote[]> {
    return getFromStorage<DirectivaAudioNote[]>(STORAGE_KEYS.AUDIO_NOTES, [
      {
        id: "aud-1",
        title: "Estrategia de patrocinadores y recuerdos con Curiol Studio",
        audioUrl: "",
        duration: 45,
        transcript: "Coordinar con las marcas locales de Santa Bárbara para incluir sus logos en las fotos impresas de los niños para los imanes de nevera y retablos de Curiol Studio.",
        author: "Jenny / Directiva",
        createdAt: "2026-09-02T10:00:00Z"
      }
    ]);
  },

  async addAudioNote(note: Omit<DirectivaAudioNote, 'id' | 'createdAt'>): Promise<DirectivaAudioNote> {
    const newNote: DirectivaAudioNote = {
      ...note,
      id: `aud-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const current = await this.getAudioNotes();
    saveToStorage(STORAGE_KEYS.AUDIO_NOTES, [newNote, ...current]);
    return newNote;
  },

  async deleteAudioNote(id: string): Promise<void> {
    const current = await this.getAudioNotes();
    saveToStorage(STORAGE_KEYS.AUDIO_NOTES, current.filter(n => n.id !== id));
  },

  // CATEGORIES DYNAMIC MANAGEMENT
  async getCategories(): Promise<string[]> {
    return getFromStorage<string[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  async addCategory(name: string): Promise<string[]> {
    const trimmed = name.trim();
    if (!trimmed) return this.getCategories();
    const current = await this.getCategories();
    if (!current.includes(trimmed)) {
      const updated = [...current, trimmed];
      saveToStorage(STORAGE_KEYS.CATEGORIES, updated);
      return updated;
    }
    return current;
  },

  async updateCategory(oldName: string, newName: string): Promise<string[]> {
    const trimmed = newName.trim();
    if (!trimmed) return this.getCategories();
    const current = await this.getCategories();
    const updated = current.map(c => c === oldName ? trimmed : c);
    saveToStorage(STORAGE_KEYS.CATEGORIES, updated);
    return updated;
  },

  async deleteCategory(name: string): Promise<string[]> {
    const current = await this.getCategories();
    const updated = current.filter(c => c !== name);
    saveToStorage(STORAGE_KEYS.CATEGORIES, updated);
    return updated;
  }
};
