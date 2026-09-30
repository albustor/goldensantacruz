import {
  AcademySettings,
  GalleryAlbum,
  GalleryPhoto,
  Match,
  PaymentRecord,
  Player,
  Sponsor,
  LiveStreamConfig,
  LiveCameraConfig,
  LiveScoreboard,
  LiveChatMessage,
} from '../types';
import {
  INITIAL_ALBUMS,
  INITIAL_PHOTOS,
  INITIAL_GALLERY_PHOTOS,
  INITIAL_MATCHES,
  INITIAL_PAYMENTS,
  INITIAL_PLAYERS,
  INITIAL_SETTINGS,
  INITIAL_SPONSORS,
  INITIAL_CATEGORIES,
  INITIAL_LIVE_STREAM_CONFIG,
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
  PLAYERS: 'golden_players_v7',
  PAYMENTS: 'golden_payments_v7',
  MATCHES: 'golden_matches_v6',
  ALBUMS: 'golden_albums_v12',
  GALLERY: 'golden_gallery_v8',
  SPONSORS: 'golden_sponsors_v5',
  SETTINGS: 'golden_settings_v5',
  AUDIO_NOTES: 'golden_audio_notes_v5',
  CATEGORIES: 'golden_categories_v5',
  LIVE_STREAM: 'golden_live_stream_v1',
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

  async updatePaymentExtension(id: string, extensionDate?: string, extensionReason?: string, isExemptFromSweep?: boolean): Promise<void> {
    const current = getFromStorage<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
    const updated = current.map(p => {
      if (p.id === id) {
        return {
          ...p,
          extensionDate,
          extensionReason,
          isExemptFromSweep: isExemptFromSweep ?? Boolean(extensionDate),
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
    const rawMatches = getFromStorage<Match[]>(STORAGE_KEYS.MATCHES, INITIAL_MATCHES);
    const today = new Date().toISOString().split('T')[0];
    
    // Regla automática obligatoria: Si la fecha del partido ya es en tiempo pasado (< today), se asigna automáticamente como 'finished' (JUGADO)
    let hasChanges = false;
    const updated = (rawMatches && rawMatches.length > 0 ? rawMatches : INITIAL_MATCHES).map(m => {
      if (m.matchDate && m.matchDate < today && m.status !== 'finished') {
        hasChanges = true;
        return { ...m, status: 'finished' as const };
      }
      return m;
    });

    if (hasChanges || !rawMatches || rawMatches.length === 0) {
      saveToStorage(STORAGE_KEYS.MATCHES, updated);
    }
    return updated;
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

  // ALBUMS (Direct Hybrid Sync: LocalStorage + Supabase Cloud Auto-Discovery)
  async getAlbums(): Promise<GalleryAlbum[]> {
    const stored = getFromStorage<GalleryAlbum[]>(STORAGE_KEYS.ALBUMS, INITIAL_ALBUMS);
    const cleaned = (stored || INITIAL_ALBUMS).filter(a => a.id !== 'alb-3');
    const albumMap = new Map<string, GalleryAlbum>();

    // 1. Registrar álbumes base iniciales
    INITIAL_ALBUMS.forEach(a => albumMap.set(a.id, { ...a }));

    // 2. Sobreponer modificaciones locales únicamente de álbumes reconocidos
    cleaned.forEach(a => {
      if (albumMap.has(a.id)) {
        albumMap.set(a.id, { ...albumMap.get(a.id)!, ...a });
      }
    });

    // 3. Auto-descubrir y sincronizar álbumes desde Supabase y la caché de IndexedDB
    try {
      let photosMeta: Array<{
        albumId?: string;
        title?: string;
        category?: string;
        eventDate?: string;
        uploaderName?: string;
        photoType?: string;
        photoUrl?: string;
      }> = [];

      // Si Supabase está disponible, consultar metadatos livianos (<300ms)
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: cloudMeta } = await supabase
            .from('gallery_photos')
            .select('album_id, title, category, event_date, uploader_name, photo_type')
            .order('created_at', { ascending: false });

          if (cloudMeta && cloudMeta.length > 0) {
            photosMeta = cloudMeta.map((m: any) => ({
              albumId: m.album_id || undefined,
              title: m.title,
              category: m.category,
              eventDate: m.event_date,
              uploaderName: m.uploader_name,
              photoType: m.photo_type,
            }));
          }
        } catch (cloudErr) {
          console.warn('[Store] Error al consultar metadatos de álbumes en Supabase:', cloudErr);
        }
      }

      // Si no hay datos de nube o para complementar, leer IndexedDB
      if (photosMeta.length === 0) {
        const localPhotos = await getGalleryPhotosFromDB();
        photosMeta = localPhotos.map(p => ({
          albumId: p.albumId,
          title: p.title,
          category: p.category,
          eventDate: p.eventDate,
          uploaderName: p.uploaderName,
          photoType: p.photoType,
          photoUrl: p.photoUrl,
        }));
      }

      // Agrupar metadatos por álbum
      const grouped = new Map<string, typeof photosMeta>();
      photosMeta.forEach(p => {
        if (p.albumId) {
          if (!grouped.has(p.albumId)) grouped.set(p.albumId, []);
          grouped.get(p.albumId)!.push(p);
        }
      });

      grouped.forEach((pList, albId) => {
        const sample = pList[0];
        const hasCommunity = pList.some(p => p.photoType === 'community');
        const hasPro = pList.some(p => p.photoType === 'pro_studio');

        // Títulos estandarizados para álbumes conocidos
        let cleanTitle = sample.title || `Evento (${sample.eventDate || 'Reciente'})`;
        cleanTitle = cleanTitle
          .replace(/^Fotograf[ií]a Oficial\s*[•\-–]\s*/i, '')
          .replace(/^Recuerdo Familiar\s*#?\d*\s*[•\-–]\s*/i, '')
          .replace(/^Sesi[oó]n Oficial\s*[•\-–]\s*/i, '')
          .replace(/\s*#\d+.*$/, '')
          .replace(/\s*•\s*$/, '')
          .trim();

        if (albId === 'alb-1790721881901') {
          cleanTitle = 'Entrega de balones por parte de FECOBA';
        } else if (albId === 'alb-1789690146392') {
          cleanTitle = 'Visita de Julio "Yiyo" • Evento Especial';
        } else if (albId === 'alb-comunidad-yiyo-2026') {
          cleanTitle = 'Álbum Familiar • Visita de Julio "Yiyo"';
        } else if (albId === 'alb-curiol-liberia-2026') {
          cleanTitle = 'Galería Oficial Curiol Studio • Gran Jornada de Liberia 2026';
        } else if (albId === 'alb-comunidad-liberia-2026') {
          cleanTitle = 'Álbum Familiar • Gran Jornada de Liberia';
        } else if (albId === 'alb-david-fundador-2026' || albId === 'clinatecnicagp' || albId === 'gJ74JX7Y75v4eagaxjXf') {
          cleanTitle = 'Clínica Técnica de David • Técnico Fundador';
        }

        if (!cleanTitle || cleanTitle.length < 3) {
          cleanTitle = `Jornada Deportiva (${sample.eventDate || '2026'})`;
        }

        const isKnownCommunity = albId.includes('comunidad') || albId.includes('familia') || (hasCommunity && !hasPro);

        if (!albumMap.has(albId)) {
          albumMap.set(albId, {
            id: albId,
            title: cleanTitle,
            eventDate: sample.eventDate || '2026-09-24',
            category: (sample.category as any) || 'Eventos Especiales',
            coverPhotoUrl: sample.photoUrl || '/photos/partidos/liberia_portada.webp',
            createdBy: sample.uploaderName || (isKnownCommunity ? 'Familias & Papás' : 'Curiol Studio Oficial'),
            albumType: isKnownCommunity ? 'community' : 'pro_studio',
            isLocked: false,
            isOpenForUploads: true,
          });
        } else {
          // Actualizar datos faltantes
          const existing = albumMap.get(albId)!;
          if (cleanTitle && cleanTitle.length > 3 && existing.title.startsWith('Evento (')) {
            existing.title = cleanTitle;
          }
          if (sample.category && !existing.category) {
            existing.category = sample.category as any;
          }
        }
      });
    } catch (e) {
      console.warn('[Store] Error al auto-descubrir álbumes:', e);
    }

    // Filtrar cualquier álbum huérfano o vacío que no esté en INITIAL_ALBUMS y ordenar cronológicamente descendente
    const finalAlbums = Array.from(albumMap.values())
      .filter(a => {
        if (a.id === 'alb-3' || a.title === 'Fotografía Oficial') return false;
        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.eventDate || '1970-01-01').getTime();
        const timeB = new Date(b.eventDate || '1970-01-01').getTime();
        return timeB - timeA;
      });

    saveToStorage(STORAGE_KEYS.ALBUMS, finalAlbums);
    return finalAlbums;
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

  // GALLERY PHOTOS (Ultra-fast Cache-First IndexedDB + Zero-Timeout Progressive Streaming)
  async loadGalleryPhotosProgressive(
    onUpdate: (photos: GalleryPhoto[], progress?: { loaded: number; total: number; isDone: boolean }) => void
  ): Promise<GalleryPhoto[]> {
    // 1. Cargar caché local de IndexedDB inmediatamente (0ms)
    const localPhotos = await getGalleryPhotosFromDB();
    const cleanLocal = localPhotos.filter(
      p => !p.id.startsWith('pht-eq-') && 
           !p.id.startsWith('pht-hb-') && 
           !p.id.startsWith('pht-lib-') && 
           !p.id.startsWith('pht-partido-') &&
           !p.id.startsWith('gal-178862') &&
           !p.id.startsWith('gal-178863') &&
           !p.id.startsWith('gal-178864')
    );

    const currentPhotosMap = new Map<string, GalleryPhoto>();

    // Sembrar INITIAL_PHOTOS
    INITIAL_PHOTOS.forEach(p => currentPhotosMap.set(p.id, p));
    cleanLocal.forEach(p => currentPhotosMap.set(p.id, p));

    const initialCombined = Array.from(currentPhotosMap.values());
    const initialWithImages = initialCombined.filter(p => Boolean(p.photoUrl)).length;

    if (initialCombined.length > 0) {
      onUpdate(initialCombined, { loaded: initialWithImages, total: initialCombined.length, isDone: false });
    }

    if (!isSupabaseConfigured || !supabase) {
      onUpdate(initialCombined, { loaded: initialWithImages, total: initialCombined.length, isDone: true });
      return initialCombined;
    }

    try {
      // 2. Consulta ultrarrápida de METADATOS SIN PHOTO_URL (< 300ms, cero timeouts garantizado)
      const { data: metaRows, error: metaErr } = await supabase
        .from('gallery_photos')
        .select('id, album_id, event_date, title, category, caption, uploader_name, uploader_role, photo_type, likes_count, is_approved, created_at, watermark_tag, price_digital, price_print')
        .order('created_at', { ascending: false });

      if (!metaErr && metaRows && metaRows.length > 0) {
        const cloudIdSet = new Set(metaRows.map((r: any) => r.id));

        // Purgar de la memoria local cualquier foto que haya sido eliminada o depurada de Supabase
        Array.from(currentPhotosMap.keys()).forEach((id) => {
          if (!cloudIdSet.has(id) && (id.startsWith('gal-') || id.startsWith('pht-179') || id.startsWith('pht-fecoba'))) {
            currentPhotosMap.delete(id);
          }
        });

        metaRows.forEach((row: any) => {
          const existing = currentPhotosMap.get(row.id);
          currentPhotosMap.set(row.id, {
            id: row.id,
            albumId: row.album_id || (row.photo_type === 'pro_studio' ? 'alb-curiol-liberia-2026' : 'alb-comunidad-liberia-2026'),
            eventDate: row.event_date || '2026-09-05',
            title: row.title || 'Fotografía Oficial',
            category: row.category || 'Intercantonal',
            photoUrl: existing?.photoUrl || '',
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
        });

        // Notificar metadatos completos inmediatamente (<300ms): ahora todos los álbumes muestran su conteo exacto
        const metaPhotoList = Array.from(currentPhotosMap.values());
        const readyCount = metaPhotoList.filter(p => Boolean(p.photoUrl)).length;
        onUpdate(metaPhotoList, { loaded: readyCount, total: metaPhotoList.length, isDone: readyCount >= metaPhotoList.length });
      }

      // 3. Descarga progresiva de imágenes en lotes pequeños (15 fotos por lote)
      const allPhotos = Array.from(currentPhotosMap.values());
      const missingPhotos = allPhotos.filter(p => !p.photoUrl || p.photoUrl.length < 50);

      const batchSize = 15;
      for (let i = 0; i < missingPhotos.length; i += batchSize) {
        const batch = missingPhotos.slice(i, i + batchSize);
        const batchIds = batch.map(b => b.id);

        try {
          const { data: imgRows, error: imgErr } = await supabase
            .from('gallery_photos')
            .select('id, photo_url')
            .in('id', batchIds);

          if (!imgErr && imgRows) {
            imgRows.forEach((r: any) => {
              const p = currentPhotosMap.get(r.id);
              if (p && r.photo_url) {
                p.photoUrl = r.photo_url;
              }
            });

            const currentUpdatedList = Array.from(currentPhotosMap.values());
            const currentWithImg = currentUpdatedList.filter(p => Boolean(p.photoUrl)).length;

            // Guardar lote en IndexedDB para persistencia permanente (0ms en futuras cargas)
            await saveGalleryPhotosToDB(currentUpdatedList.filter(p => Boolean(p.photoUrl)));

            onUpdate(currentUpdatedList, {
              loaded: currentWithImg,
              total: currentUpdatedList.length,
              isDone: i + batchSize >= missingPhotos.length,
            });
          }
        } catch (batchErr) {
          console.warn('[Store] Error al descargar lote de imágenes:', batchErr);
        }
      }

      const finalList = Array.from(currentPhotosMap.values());
      const finalLoaded = finalList.filter(p => Boolean(p.photoUrl)).length;
      onUpdate(finalList, { loaded: finalLoaded, total: finalList.length, isDone: true });
      return finalList;
    } catch (err) {
      console.warn('[Store] Error en carga progresiva de fotos:', err);
      return Array.from(currentPhotosMap.values());
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
    const current = await getGalleryPhotosFromDB();
    const updated = current.map(p => p.id === id ? { ...p, likesCount: (p.likesCount || 0) + 1 } : p);
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
  },

  // LIVE STREAMING & SCOREBOARD MANAGEMENT (Bunny.net + GoPro 12 + DJI Osmo Pocket)
  async getLiveStreamConfig(): Promise<LiveStreamConfig> {
    return getFromStorage<LiveStreamConfig>(STORAGE_KEYS.LIVE_STREAM, INITIAL_LIVE_STREAM_CONFIG);
  },

  async updateLiveStreamConfig(updates: Partial<LiveStreamConfig>): Promise<LiveStreamConfig> {
    const current = await this.getLiveStreamConfig();
    const updated: LiveStreamConfig = {
      ...current,
      ...updates,
      scoreboard: updates.scoreboard ? { ...current.scoreboard, ...updates.scoreboard } : current.scoreboard,
      reactions: updates.reactions ? { ...current.reactions, ...updates.reactions } : current.reactions,
      sponsorWatermark: updates.sponsorWatermark ? { ...current.sponsorWatermark, ...updates.sponsorWatermark } : current.sponsorWatermark,
    };
    saveToStorage(STORAGE_KEYS.LIVE_STREAM, updated);
    return updated;
  },

  async toggleLiveStatus(isLive: boolean): Promise<LiveStreamConfig> {
    return this.updateLiveStreamConfig({ isLive });
  },

  async updateScoreboard(updates: Partial<LiveScoreboard>): Promise<LiveStreamConfig> {
    const current = await this.getLiveStreamConfig();
    const updatedScoreboard: LiveScoreboard = {
      ...current.scoreboard,
      ...updates,
    };
    return this.updateLiveStreamConfig({ scoreboard: updatedScoreboard });
  },

  async addScore(team: 'home' | 'away', points: number): Promise<LiveStreamConfig> {
    const current = await this.getLiveStreamConfig();
    const sb = current.scoreboard;
    if (team === 'home') {
      const newScore = Math.max(0, (sb.homeScore || 0) + points);
      return this.updateScoreboard({ homeScore: newScore });
    } else {
      const newScore = Math.max(0, (sb.awayScore || 0) + points);
      return this.updateScoreboard({ awayScore: newScore });
    }
  },

  async addFoul(team: 'home' | 'away', delta: number): Promise<LiveStreamConfig> {
    const current = await this.getLiveStreamConfig();
    const sb = current.scoreboard;
    if (team === 'home') {
      const newFouls = Math.max(0, (sb.homeFouls || 0) + delta);
      return this.updateScoreboard({ homeFouls: newFouls });
    } else {
      const newFouls = Math.max(0, (sb.awayFouls || 0) + delta);
      return this.updateScoreboard({ awayFouls: newFouls });
    }
  },

  async switchActiveCamera(cameraId: string): Promise<LiveStreamConfig> {
    return this.updateLiveStreamConfig({ selectedCameraId: cameraId });
  },

  async updateCamera(cameraId: string, updates: Partial<LiveCameraConfig>): Promise<LiveStreamConfig> {
    const current = await this.getLiveStreamConfig();
    const updatedCameras = current.cameras.map(cam => {
      if (cam.id === cameraId) {
        return { ...cam, ...updates };
      }
      return cam;
    });
    return this.updateLiveStreamConfig({ cameras: updatedCameras });
  },

  async toggleCameraActive(cameraId: string, isActive: boolean): Promise<LiveStreamConfig> {
    const current = await this.getLiveStreamConfig();
    let newSelectedId = current.selectedCameraId;

    const updatedCameras = current.cameras.map(cam => {
      if (cam.id === cameraId) {
        return { ...cam, isActive, status: isActive ? ('live' as const) : ('offline' as const) };
      }
      return cam;
    });

    // Si la cámara que se apaga era la activa, buscar la siguiente cámara activa disponible
    if (!isActive && current.selectedCameraId === cameraId) {
      const fallback = updatedCameras.find(c => c.isActive && c.id !== cameraId);
      if (fallback) {
        newSelectedId = fallback.id;
      }
    }

    return this.updateLiveStreamConfig({ cameras: updatedCameras, selectedCameraId: newSelectedId });
  },

  async addCamera(camera: LiveCameraConfig): Promise<LiveStreamConfig> {
    const current = await this.getLiveStreamConfig();
    const updatedCameras = [...current.cameras, camera];
    return this.updateLiveStreamConfig({ cameras: updatedCameras });
  },

  async deleteCamera(cameraId: string): Promise<LiveStreamConfig> {
    const current = await this.getLiveStreamConfig();
    const updatedCameras = current.cameras.filter(c => c.id !== cameraId);
    let newSelectedId = current.selectedCameraId;
    if (current.selectedCameraId === cameraId) {
      newSelectedId = updatedCameras[0]?.id || "";
    }
    return this.updateLiveStreamConfig({ cameras: updatedCameras, selectedCameraId: newSelectedId });
  },

  async addLiveReaction(reaction: 'fire' | 'clap' | 'star' | 'basketball'): Promise<LiveStreamConfig> {
    const current = await this.getLiveStreamConfig();
    const currentReactions = current.reactions || { fire: 0, clap: 0, star: 0, basketball: 0 };
    const updatedReactions = {
      ...currentReactions,
      [reaction]: (currentReactions[reaction] || 0) + 1,
    };
    return this.updateLiveStreamConfig({ reactions: updatedReactions });
  },

  async addLiveChatMessage(msg: Omit<LiveChatMessage, 'id' | 'timestamp'>): Promise<LiveChatMessage> {
    const current = await this.getLiveStreamConfig();
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: LiveChatMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      timestamp: timeStr,
    };
    const updatedMessages = [...(current.chatMessages || []), newMsg];
    await this.updateLiveStreamConfig({ chatMessages: updatedMessages });
    return newMsg;
  }
};
