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
import {
  getGalleryPhotosFromDB,
  saveGalleryPhotosToDB,
  addGalleryPhotoToDB,
  deleteGalleryPhotoFromDB,
  getAudioNotesFromDB,
  addAudioNoteToDB,
  deleteAudioNoteFromDB,
  saveAudioNotesToDB,
} from './indexedDb';

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
  PLAYERS: 'golden_players_v6',
  PAYMENTS: 'golden_payments_v6',
  MATCHES: 'golden_matches_v6',
  ALBUMS: 'golden_albums_v7',
  GALLERY: 'golden_gallery_v7',
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
    console.warn(`[Store] Cuota excedida en localStorage al guardar [${key}]. Limpiando claves pesadas heredadas...`, err);
    try {
      // Liberar espacio eliminando imágenes/audios viejos que ahora viven en IndexedDB
      localStorage.removeItem('golden_gallery_v7');
      localStorage.removeItem('golden_gallery_v6');
      localStorage.removeItem('golden_gallery_v5');
      localStorage.removeItem('golden_audio_notes_v5');
      localStorage.setItem(key, JSON.stringify(data));
    } catch (retryErr) {
      console.error(`[Store] Error definitivo al guardar en localStorage [${key}]:`, retryErr);
    }
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
    const stored = getFromStorage<GalleryAlbum[]>(STORAGE_KEYS.ALBUMS, INITIAL_ALBUMS);
    if (!stored || !Array.isArray(stored) || stored.length === 0) {
      saveToStorage(STORAGE_KEYS.ALBUMS, INITIAL_ALBUMS);
      return INITIAL_ALBUMS;
    }
    // Asegurar que los álbumes esenciales siempre existan
    const existingIds = new Set(stored.map(a => a.id));
    let hasAll = true;
    const merged = [...stored];
    for (const initAlb of INITIAL_ALBUMS) {
      if (!existingIds.has(initAlb.id)) {
        merged.push(initAlb);
        hasAll = false;
      }
    }
    if (!hasAll) {
      saveToStorage(STORAGE_KEYS.ALBUMS, merged);
    }
    return merged;
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
    await saveGalleryPhotosToDB(updatedPhotos);
  },

  async updateAlbumTitle(albumId: string, newTitle: string): Promise<void> {
    const current = await this.getAlbums();
    const updated = current.map(a => a.id === albumId ? { ...a, title: newTitle } : a);
    saveToStorage(STORAGE_KEYS.ALBUMS, updated);

    // Also update all photos with this albumId
    const photos = await this.getGalleryPhotos();
    const updatedPhotos = photos.map(p => p.albumId === albumId ? { ...p, title: newTitle } : p);
    await saveGalleryPhotosToDB(updatedPhotos);
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

  // GALLERY PHOTOS (Ultra-fast Cache-First IndexedDB + Background/Manual Cloud Sync + Progressive Streaming)
  async loadGalleryPhotosProgressive(
    onUpdate: (photos: GalleryPhoto[], progress?: { loaded: number; total: number; isDone: boolean }) => void
  ): Promise<GalleryPhoto[]> {
    // 1. Cargar caché local de IndexedDB inmediatamente (0ms) filtrando cualquier foto residual de pruebas
    const localPhotos = await getGalleryPhotosFromDB();
    const cleanLocal = localPhotos.filter(
      p => !p.id.startsWith('pht-eq-') && 
           !p.id.startsWith('pht-hb-') && 
           !p.id.startsWith('pht-lib-') && 
           !p.id.startsWith('pht-partido-') &&
           !p.title?.toLowerCase().includes('foto de alberto') &&
           !p.id.startsWith('gal-178862') &&
           !p.id.startsWith('gal-178863') &&
           !p.id.startsWith('gal-178864')
    );

    if (cleanLocal.length > 0) {
      onUpdate(cleanLocal, { loaded: cleanLocal.length, total: Math.max(cleanLocal.length, 152), isDone: cleanLocal.length >= 152 });
      if (cleanLocal.length >= 152) {
        return cleanLocal;
      }
    }

    if (!isSupabaseConfigured || !supabase) {
      onUpdate(cleanLocal, { loaded: cleanLocal.length, total: cleanLocal.length, isDone: true });
      return cleanLocal;
    }

    try {
      // 2. Consulta ultra-rápida de metadatos (< 800ms) para sincronizar exactamente los registros vigentes en la nube (152 fotos de Curiol Studio)
      const { data: metaRows, error: metaErr } = await supabase
        .from('gallery_photos')
        .select('id, album_id, event_date, title, category, caption, uploader_name, uploader_role, photo_type, likes_count, is_approved, created_at, watermark_tag, price_digital, price_print')
        .order('created_at', { ascending: true });

      const currentPhotosMap = new Map<string, GalleryPhoto>();

      if (!metaErr && metaRows && metaRows.length > 0) {
        const cloudIdSet = new Set(metaRows.map((r: any) => r.id));

        // Mantener solo fotos locales que existan en la nube
        cleanLocal.forEach(p => {
          if (cloudIdSet.has(p.id)) {
            currentPhotosMap.set(p.id, p);
          }
        });

        metaRows.forEach((row: any) => {
          if (!currentPhotosMap.has(row.id)) {
            currentPhotosMap.set(row.id, {
              id: row.id,
              albumId: row.album_id || (row.photo_type === 'pro_studio' ? 'alb-curiol-liberia-2026' : 'alb-comunidad-liberia-2026'),
              eventDate: row.event_date || '2026-09-05',
              title: row.title || 'Fotografía de la Jornada',
              category: row.category || 'Intercantonal',
              photoUrl: '', // Se llena progresivamente al descargar el lote
              caption: row.caption || '',
              uploaderName: row.uploader_name || (row.photo_type === 'pro_studio' ? 'Curiol Studio Oficial' : 'Papá Golden'),
              uploaderRole: (row.uploader_role || (row.photo_type === 'pro_studio' ? 'staff' : 'padre')) as any,
              photoType: (row.photo_type || (row.uploader_role === 'staff' || row.uploader_name?.includes('Curiol') ? 'pro_studio' : 'community')) as any,
              likesCount: row.likes_count ?? 0,
              isApproved: row.is_approved ?? true,
              createdAt: row.created_at,
              watermarkTag: row.watermark_tag || (row.photo_type === 'pro_studio' ? 'Curiol Studio Santa Cruz' : 'Golden Sport Santa Cruz'),
              priceDigital: row.price_digital,
              pricePrint: row.price_print,
            });
          }
        });

        // Notificar metadatos limpios de inmediato
        const metaPhotoList = Array.from(currentPhotosMap.values());
        onUpdate(metaPhotoList, { loaded: cleanLocal.length, total: metaPhotoList.length, isDone: false });
      }

      // 3. Descarga progresiva de imágenes en lotes de 25
      const pageSize = 25;
      let from = 0;
      let hasMore = true;

      while (hasMore) {
        let chunkData: any[] | null = null;
        let attempts = 0;

        while (attempts < 3) {
          attempts++;
          const { data, error } = await supabase
            .from('gallery_photos')
            .select('*')
            .order('created_at', { ascending: true })
            .range(from, from + pageSize - 1);

          if (!error && data) {
            chunkData = data;
            break;
          } else {
            await new Promise(r => setTimeout(r, 300));
          }
        }

        if (chunkData && chunkData.length > 0) {
          chunkData.forEach((row: any) => {
            currentPhotosMap.set(row.id, {
              id: row.id,
              albumId: row.album_id || row.albumId || (row.photo_type === 'pro_studio' ? 'alb-curiol-liberia-2026' : 'alb-comunidad-liberia-2026'),
              eventDate: row.event_date || row.eventDate || '2026-09-05',
              title: row.title || 'Fotografía de la Jornada',
              category: row.category || 'Intercantonal',
              photoUrl: row.photo_url || row.photoUrl,
              caption: row.caption || '',
              uploaderName: row.uploader_name || row.uploaderName || (row.photo_type === 'pro_studio' ? 'Curiol Studio Oficial' : 'Papá Golden'),
              uploaderRole: (row.uploader_role || row.uploaderRole || (row.photo_type === 'pro_studio' ? 'staff' : 'padre')) as any,
              photoType: (row.photo_type || row.photoType || (row.uploader_role === 'staff' || row.uploader_name?.includes('Curiol') ? 'pro_studio' : 'community')) as any,
              likesCount: row.likes_count ?? row.likesCount ?? 0,
              isApproved: row.is_approved ?? row.isApproved ?? true,
              createdAt: row.created_at || row.createdAt,
              watermarkTag: row.watermark_tag || row.watermarkTag || (row.photo_type === 'pro_studio' ? 'Curiol Studio Santa Cruz' : 'Golden Sport Santa Cruz'),
              priceDigital: row.price_digital || row.priceDigital,
              pricePrint: row.price_print || row.pricePrint,
            });
          });

          from += pageSize;
          const currentList = Array.from(currentPhotosMap.values());
          const withImagesCount = currentList.filter(p => Boolean(p.photoUrl)).length;
          
          await saveGalleryPhotosToDB(currentList.filter(p => Boolean(p.photoUrl)));
          onUpdate(currentList, { loaded: withImagesCount, total: currentList.length, isDone: withImagesCount >= currentList.length });

          if (chunkData.length < pageSize) {
            hasMore = false;
          }
        } else {
          hasMore = false;
        }
      }

      const finalList = Array.from(currentPhotosMap.values());
      onUpdate(finalList, { loaded: finalList.filter(p => Boolean(p.photoUrl)).length, total: finalList.length, isDone: true });
      return finalList;
    } catch (err) {
      console.warn('[Store] Error en carga progresiva de fotos:', err);
      return cleanLocal;
    }
  },

  async getGalleryPhotos(): Promise<GalleryPhoto[]> {
    return this.loadGalleryPhotosProgressive(() => {});
  },

  async getUnsyncedLocalPhotos(): Promise<GalleryPhoto[]> {
    if (!isSupabaseConfigured || !supabase) return [];
    try {
      const localPhotos = await getGalleryPhotosFromDB();
      const { data: cloudRows, error } = await supabase.from('gallery_photos').select('id');
      if (error) return [];
      const cloudIds = new Set((cloudRows || []).map((r: any) => r.id));
      return localPhotos.filter(p => !cloudIds.has(p.id) && !p.id.startsWith('pht-uni-'));
    } catch (e) {
      return [];
    }
  },

  async syncLocalPhotosToSupabase(): Promise<{ syncedCount: number; errors: number }> {
    if (!isSupabaseConfigured || !supabase) {
      return { syncedCount: 0, errors: 0 };
    }

    const localPhotos = await getGalleryPhotosFromDB();
    const { data: cloudRows } = await supabase.from('gallery_photos').select('id');
    const cloudIds = new Set((cloudRows || []).map((r: any) => r.id));

    // Filtrar fotos que estén en este teléfono y falten en Supabase
    const toUpload = localPhotos.filter(p => !cloudIds.has(p.id) && !p.id.startsWith('pht-uni-'));
    let syncedCount = 0;
    let errors = 0;

    for (const p of toUpload) {
      try {
        const { error } = await supabase.from('gallery_photos').insert([{
          id: p.id,
          album_id: p.albumId || 'alb-1',
          event_date: p.eventDate || new Date().toISOString().split('T')[0],
          title: p.title || 'Foto de la Jornada',
          category: p.category || 'General',
          photo_url: p.photoUrl,
          caption: p.caption || '',
          uploader_name: p.uploaderName || 'Papá Golden',
          uploader_role: p.uploaderRole || 'padre',
          photo_type: p.photoType || 'community',
          is_approved: true,
          likes_count: p.likesCount || 0,
          watermark_tag: p.watermarkTag || 'Golden Sport Santa Cruz',
          price_digital: p.priceDigital,
          price_print: p.pricePrint,
          created_at: p.createdAt || new Date().toISOString(),
        }]);
        if (!error) syncedCount++;
        else errors++;
      } catch (e) {
        errors++;
      }
    }

    return { syncedCount, errors };
  },

  async addGalleryPhoto(photo: Omit<GalleryPhoto, 'id' | 'likesCount' | 'createdAt'>): Promise<GalleryPhoto> {
    const newPhoto: GalleryPhoto = {
      ...photo,
      id: `gal-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      likesCount: 0,
      createdAt: new Date().toISOString(),
      watermarkTag: photo.watermarkTag || "Curiol Studio Santa Cruz",
    };
    
    // Guardar inmediatamente en IndexedDB local
    await addGalleryPhotoToDB(newPhoto);

    // Sincronizar en la nube si Supabase está activo
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('gallery_photos').insert([{
          id: newPhoto.id,
          album_id: newPhoto.albumId,
          event_date: newPhoto.eventDate,
          title: newPhoto.title,
          category: newPhoto.category,
          photo_url: newPhoto.photoUrl,
          caption: newPhoto.caption,
          uploader_name: newPhoto.uploaderName,
          uploader_role: newPhoto.uploaderRole,
          photo_type: newPhoto.photoType,
          is_approved: newPhoto.isApproved,
          likes_count: newPhoto.likesCount,
          watermark_tag: newPhoto.watermarkTag,
          price_digital: newPhoto.priceDigital,
          price_print: newPhoto.pricePrint,
          created_at: newPhoto.createdAt,
        }]);
      } catch (err) {
        console.warn('[Store] No se pudo sincronizar la foto con Supabase en la nube:', err);
      }
    }

    return newPhoto;
  },

  async likeGalleryPhoto(id: string): Promise<void> {
    const current = await this.getGalleryPhotos();
    const updated = current.map(p => p.id === id ? { ...p, likesCount: p.likesCount + 1 } : p);
    await saveGalleryPhotosToDB(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const photo = updated.find(p => p.id === id);
        if (photo) {
          await supabase.from('gallery_photos').update({ likes_count: photo.likesCount }).eq('id', id);
        }
      } catch (e) {
        console.warn('[Store] Error al sincronizar like con Supabase:', e);
      }
    }
  },

  async deleteGalleryPhoto(id: string): Promise<void> {
    await deleteGalleryPhotoFromDB(id);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('gallery_photos').delete().eq('id', id);
      } catch (e) {
        console.warn('[Store] Error al eliminar foto de Supabase:', e);
      }
    }
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

  // DIRECTIVA AUDIO NOTES (Stored in IndexedDB)
  async getAudioNotes(): Promise<DirectivaAudioNote[]> {
    return getAudioNotesFromDB([
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
    await addAudioNoteToDB(newNote);
    return newNote;
  },

  async deleteAudioNote(id: string): Promise<void> {
    await deleteAudioNoteFromDB(id);
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
