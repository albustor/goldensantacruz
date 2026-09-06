/**
 * IndexedDB Storage Engine for Golden Sport Academy
 * Provides high-capacity, reliable client-side storage for gallery photos and audio notes,
 * completely eliminating localStorage 5MB quota errors.
 */

import { GalleryPhoto } from '@/types';
import { DirectivaAudioNote } from './store';
import { INITIAL_GALLERY_PHOTOS } from './initialData';

const DB_NAME = 'GoldenSportDB_v1';
const DB_VERSION = 1;

const STORES = {
  GALLERY: 'gallery_photos',
  AUDIO_NOTES: 'audio_notes',
  KEYVAL: 'keyval_store',
} as const;

function isIndexedDBAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isIndexedDBAvailable()) {
      return reject(new Error('IndexedDB not available in this environment'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORES.GALLERY)) {
        db.createObjectStore(STORES.GALLERY, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.AUDIO_NOTES)) {
        db.createObjectStore(STORES.AUDIO_NOTES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.KEYVAL)) {
        db.createObjectStore(STORES.KEYVAL);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open IndexedDB'));
    };
  });
}

/**
 * GALLERY PHOTOS STORAGE
 */
export async function getGalleryPhotosFromDB(): Promise<GalleryPhoto[]> {
  if (!isIndexedDBAvailable()) {
    return INITIAL_GALLERY_PHOTOS;
  }

  try {
    const db = await openDB();
    const photos: GalleryPhoto[] = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.GALLERY, 'readonly');
      const store = tx.objectStore(STORES.GALLERY);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    if (photos && photos.length > 0) {
      // Limpiar fotos mock de prueba para que solo queden las fotos reales
      const cleanPhotos = photos.filter(p => !p.id.startsWith('pht-eq-') && !p.id.startsWith('pht-hb-') && !p.id.startsWith('pht-lib-') && !p.id.startsWith('pht-partido-'));
      
      // Deduplicar estrictamente por ID único
      const seenIds = new Set<string>();
      const deduplicated: GalleryPhoto[] = [];
      for (const p of cleanPhotos) {
        if (!seenIds.has(p.id)) {
          seenIds.add(p.id);
          deduplicated.push(p);
        }
      }

      const existingIds = new Set(deduplicated.map(p => p.id));
      const missingInitial = INITIAL_GALLERY_PHOTOS.filter(p => !existingIds.has(p.id));
      
      let finalPhotos = [...deduplicated, ...missingInitial];
      if (finalPhotos.length !== photos.length) {
        await saveGalleryPhotosToDB(finalPhotos);
      }

      // Ordenar cronológicamente ascendente
      return finalPhotos.sort((a, b) => {
        const timeA = new Date(a.createdAt || a.uploadedAt || 0).getTime();
        const timeB = new Date(b.createdAt || b.uploadedAt || 0).getTime();
        if (timeA !== timeB && !isNaN(timeA) && !isNaN(timeB)) {
          return timeA - timeB;
        }
        return (a.title || '').localeCompare(b.title || '', undefined, { numeric: true, sensitivity: 'base' });
      });
    }

    // Si IndexedDB está vacío, migrar desde localStorage si existe
    let migratedPhotos: GalleryPhoto[] = [];
    try {
      const rawLocal = localStorage.getItem('golden_gallery_v7');
      if (rawLocal) {
        migratedPhotos = JSON.parse(rawLocal);
      }
    } catch (e) {
      console.warn('[IndexedDB] No se pudo leer localStorage antiguo:', e);
    }

    const initialToSave = migratedPhotos.length > 0 ? migratedPhotos : INITIAL_GALLERY_PHOTOS;

    // Guardar en IndexedDB
    await saveGalleryPhotosToDB(initialToSave);

    // Liberar localStorage para evitar problemas de cuota de 5MB
    try {
      localStorage.removeItem('golden_gallery_v7');
      localStorage.removeItem('golden_gallery_v6');
      localStorage.removeItem('golden_gallery_v5');
    } catch (e) {
      // ignore
    }

    return initialToSave;
  } catch (err) {
    console.error('[IndexedDB] Error en getGalleryPhotosFromDB:', err);
    return INITIAL_GALLERY_PHOTOS;
  }
}

export async function saveGalleryPhotosToDB(photos: GalleryPhoto[]): Promise<void> {
  if (!isIndexedDBAvailable()) return;

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORES.GALLERY, 'readwrite');
      const store = tx.objectStore(STORES.GALLERY);
      store.clear(); // Limpiar y repoblar ordenado
      for (const photo of photos) {
        store.put(photo);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } catch (err) {
    console.error('[IndexedDB] Error en saveGalleryPhotosToDB:', err);
    throw err;
  }
}

export async function addGalleryPhotoToDB(photo: GalleryPhoto): Promise<void> {
  if (!isIndexedDBAvailable()) return;

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORES.GALLERY, 'readwrite');
      const store = tx.objectStore(STORES.GALLERY);
      store.put(photo);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('[IndexedDB] Error en addGalleryPhotoToDB:', err);
    throw err;
  }
}

export async function deleteGalleryPhotoFromDB(id: string): Promise<void> {
  if (!isIndexedDBAvailable()) return;

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORES.GALLERY, 'readwrite');
      const store = tx.objectStore(STORES.GALLERY);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('[IndexedDB] Error en deleteGalleryPhotoFromDB:', err);
    throw err;
  }
}

/**
 * AUDIO NOTES STORAGE
 */
export async function getAudioNotesFromDB(fallbackNotes: DirectivaAudioNote[]): Promise<DirectivaAudioNote[]> {
  if (!isIndexedDBAvailable()) return fallbackNotes;

  try {
    const db = await openDB();
    const notes: DirectivaAudioNote[] = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.AUDIO_NOTES, 'readonly');
      const store = tx.objectStore(STORES.AUDIO_NOTES);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    if (notes && notes.length > 0) {
      return notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Migrar de localStorage si existía
    let migrated: DirectivaAudioNote[] = [];
    try {
      const raw = localStorage.getItem('golden_audio_notes_v5');
      if (raw) migrated = JSON.parse(raw);
    } catch (e) {}

    const initial = migrated.length > 0 ? migrated : fallbackNotes;
    await saveAudioNotesToDB(initial);

    try {
      localStorage.removeItem('golden_audio_notes_v5');
    } catch (e) {}

    return initial;
  } catch (err) {
    console.error('[IndexedDB] Error en getAudioNotesFromDB:', err);
    return fallbackNotes;
  }
}

export async function saveAudioNotesToDB(notes: DirectivaAudioNote[]): Promise<void> {
  if (!isIndexedDBAvailable()) return;

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORES.AUDIO_NOTES, 'readwrite');
      const store = tx.objectStore(STORES.AUDIO_NOTES);
      store.clear();
      for (const note of notes) {
        store.put(note);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('[IndexedDB] Error en saveAudioNotesToDB:', err);
    throw err;
  }
}

export async function addAudioNoteToDB(note: DirectivaAudioNote): Promise<void> {
  if (!isIndexedDBAvailable()) return;

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORES.AUDIO_NOTES, 'readwrite');
      const store = tx.objectStore(STORES.AUDIO_NOTES);
      store.put(note);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('[IndexedDB] Error en addAudioNoteToDB:', err);
    throw err;
  }
}

export async function deleteAudioNoteFromDB(id: string): Promise<void> {
  if (!isIndexedDBAvailable()) return;

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORES.AUDIO_NOTES, 'readwrite');
      const store = tx.objectStore(STORES.AUDIO_NOTES);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('[IndexedDB] Error en deleteAudioNoteFromDB:', err);
    throw err;
  }
}
