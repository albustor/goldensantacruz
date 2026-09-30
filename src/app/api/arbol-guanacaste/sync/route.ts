import { NextResponse } from "next/server";
import { curiolDb } from "@/lib/firebaseAdmin";

const TIMELINE_DOC_ID = "PvTV4T9ATzNOwd4EzOfP";
const TIMELINE_SLUG = "golden-academy-santa-cruz";

export async function GET() {
  try {
    const docRef = curiolDb.collection("evolutive_timelines").doc(TIMELINE_DOC_ID);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({
        success: false,
        error: "Timeline no encontrada en Curiol Studio",
      }, { status: 404 });
    }

    const data = docSnap.data() || {};
    const events = data.events || [];
    const syncedAlbumIds = events.map((e: any) => e.albumId).filter(Boolean);

    return NextResponse.json({
      success: true,
      timelineId: TIMELINE_DOC_ID,
      timelineSlug: TIMELINE_SLUG,
      clientName: data.clientName,
      events,
      syncedAlbumIds,
      updatedAt: data.updatedAt,
    });
  } catch (error: any) {
    console.error("[Arbol Guanacaste Sync GET] Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Error al consultar Árbol de Guanacaste",
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, album, isArbolHito, allAlbums, photosCount, coverPhotoUrl } = body;

    const docRef = curiolDb.collection("evolutive_timelines").doc(TIMELINE_DOC_ID);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({
        success: false,
        error: "Timeline no encontrada en Curiol Studio",
      }, { status: 404 });
    }

    const data = docSnap.data() || {};
    let currentEvents: any[] = data.events || [];

    if (action === "toggle" || action === "sync_album") {
      if (!album || !album.id) {
        return NextResponse.json({ success: false, error: "Datos de álbum requeridos" }, { status: 400 });
      }

      const albumId = album.id;
      const shouldBeMilestone = isArbolHito !== false;

      if (shouldBeMilestone) {
        const eventId = albumId === "alb-curiol-liberia-2026" 
          ? "golden-liberia-2026-09-05" 
          : albumId === "alb-2" 
            ? "JDzJ69plnhqjKx8lIIiZ"
            : albumId === "alb-david-fundador-2026"
              ? "6z6WckmoouRzxS4d8wEu"
              : albumId.startsWith("golden-") ? albumId : `golden-${album.eventDate || "evento"}-${albumId}`;

        const countNum = photosCount || 16;
        const finalMedia = coverPhotoUrl || album.coverPhotoUrl || (
          albumId === "alb-david-fundador-2026" 
            ? "https://firebasestorage.googleapis.com/v0/b/curiol-studio.firebasestorage.app/o/albums%2F1784456110563_EntrenamientoGPJulio.jpg?alt=media"
            : "https://firebasestorage.googleapis.com/v0/b/curiol-studio.firebasestorage.app/o/albums%2F1787049814984_1.jpg?alt=media"
        );

        const newEvent: any = {
          id: eventId,
          date: album.eventDate || new Date().toISOString().split("T")[0],
          title: album.title || "Evento Oficial Golden Sport Academy",
          description: album.description || `Sesión oficial y cobertura fotográfica de Golden Sport Academy Santa Cruz. ${countNum} fotografías capturan el momento.`,
          mediaUrl: finalMedia,
          mediaType: "image",
          location: album.location || "Santa Cruz / Guanacaste",
          albumId: albumId,
          albumLink: `https://goldensantacruz.vercel.app/galeria?album=${albumId}&tab=pro_studio`,
          isMilestone: true,
          tags: ["Golden Sport Academy", "Santa Cruz", "Baloncesto", "Curiol Studio"],
          createdAt: new Date().toISOString(),
          buttonText: `✨ ABRIR ÁLBUM DIGITAL (${countNum} FOTOS)`,
        };

        if (album.arbolSlug && !album.arbolSlug.startsWith("http")) {
          newEvent.albumSlug = album.arbolSlug;
        }

        // Reemplazar o insertar
        const existingIdx = currentEvents.findIndex((e: any) => e.albumId === albumId || e.id === eventId);
        if (existingIdx >= 0) {
          currentEvents[existingIdx] = { ...currentEvents[existingIdx], ...newEvent };
        } else {
          currentEvents.push(newEvent);
        }

        // Guardar también en la subcolección events
        await docRef.collection("events").doc(eventId).set(newEvent, { merge: true });
      } else {
        // Remover hito
        const targetEvent = currentEvents.find((e: any) => e.albumId === albumId || e.id === albumId);
        if (targetEvent?.id) {
          try {
            await docRef.collection("events").doc(targetEvent.id).delete();
          } catch {}
        }
        currentEvents = currentEvents.filter((e: any) => e.albumId !== albumId && e.id !== albumId);
      }

      // Ordenar cronológicamente ascendente (raíces = más antiguo, copa = más reciente)
      currentEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      await docRef.update({
        events: currentEvents,
        updatedAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: shouldBeMilestone ? "Álbum vinculado y publicado en el Árbol de Guanacaste" : "Hito desvinculado del Árbol de Guanacaste",
        events: currentEvents,
      });
    }

    if (action === "sync_all" && Array.isArray(allAlbums)) {
      const milestonesToSync: any[] = [];

      for (const alb of allAlbums) {
        if (alb.isArbolHito === false) continue;
        const albumId = alb.id;
        const eventId = albumId === "alb-curiol-liberia-2026" 
          ? "golden-liberia-2026-09-05" 
          : albumId === "alb-2" 
            ? "JDzJ69plnhqjKx8lIIiZ"
            : albumId === "alb-david-fundador-2026"
              ? "6z6WckmoouRzxS4d8wEu"
              : albumId.startsWith("golden-") ? albumId : `golden-${alb.eventDate || "evento"}-${albumId}`;

        const item: any = {
          id: eventId,
          date: alb.eventDate || new Date().toISOString().split("T")[0],
          title: alb.title,
          description: alb.description || `Sesión oficial y cobertura fotográfica de Golden Sport Academy Santa Cruz. Fotografías oficiales por Curiol Studio.`,
          mediaUrl: alb.coverPhotoUrl || "https://firebasestorage.googleapis.com/v0/b/curiol-studio.firebasestorage.app/o/albums%2F1787049814984_1.jpg?alt=media",
          mediaType: "image",
          location: "Santa Cruz / Guanacaste",
          albumId: albumId,
          albumLink: `https://goldensantacruz.vercel.app/galeria?album=${albumId}&tab=pro_studio`,
          isMilestone: true,
          tags: ["Golden Sport Academy", "Santa Cruz", "Baloncesto", "Curiol Studio"],
          createdAt: new Date().toISOString(),
          buttonText: `✨ ABRIR ÁLBUM DIGITAL`,
        };

        if (alb.arbolSlug && !alb.arbolSlug.startsWith("http")) {
          item.albumSlug = alb.arbolSlug;
        }

        milestonesToSync.push(item);
        await docRef.collection("events").doc(eventId).set(item, { merge: true });
      }

      milestonesToSync.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      await docRef.update({
        events: milestonesToSync,
        updatedAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: `Se sincronizaron ${milestonesToSync.length} álbumes en el Árbol de Guanacaste`,
        events: milestonesToSync,
      });
    }

    return NextResponse.json({ success: false, error: "Acción no reconocida" }, { status: 400 });
  } catch (error: any) {
    console.error("[Arbol Guanacaste Sync POST] Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Error al sincronizar con el Árbol de Guanacaste",
    }, { status: 500 });
  }
}
