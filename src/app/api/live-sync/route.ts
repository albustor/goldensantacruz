import { NextRequest, NextResponse } from "next/server";
import { curiolDb } from "@/lib/firebaseAdmin";
import { INITIAL_LIVE_STREAM_CONFIG } from "@/lib/initialData";

export const dynamic = "force-dynamic";

const COLLECTION = "golden_live_stream";
const DOC_ID = "current_match_lapaz_2026_11_07";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  try {
    const docRef = curiolDb.collection(COLLECTION).doc(DOC_ID);
    const snap = await docRef.get();
    if (!snap.exists) {
      const initialPayload = {
        config: INITIAL_LIVE_STREAM_CONFIG,
        tunnelUrl: "https://link-gnu-eat-ivory.trycloudflare.com",
        publishedPhotos: [],
        updatedAt: new Date().toISOString(),
      };
      await docRef.set(initialPayload, { merge: true });
      return NextResponse.json({ ok: true, ...initialPayload }, { headers: CORS_HEADERS });
    }
    const data = snap.data() || {};
    return NextResponse.json(
      {
        ok: true,
        config: data.config || INITIAL_LIVE_STREAM_CONFIG,
        tunnelUrl: data.tunnelUrl || "https://link-gnu-eat-ivory.trycloudflare.com",
        publishedPhotos: Array.isArray(data.publishedPhotos) ? data.publishedPhotos : [],
        updatedAt: data.updatedAt || new Date().toISOString(),
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error("[/api/live-sync GET] Error:", error);
    return NextResponse.json(
      {
        ok: false,
        config: INITIAL_LIVE_STREAM_CONFIG,
        tunnelUrl: "https://link-gnu-eat-ivory.trycloudflare.com",
        publishedPhotos: [],
        error: error?.message || "Error reading live sync state",
      },
      { status: 200, headers: CORS_HEADERS }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || "update_config";
    const docRef = curiolDb.collection(COLLECTION).doc(DOC_ID);
    const snap = await docRef.get();
    const currentData = snap.exists ? snap.data() || {} : {};

    if (action === "update_config" && body.config) {
      const mergedConfig = {
        ...(currentData.config || INITIAL_LIVE_STREAM_CONFIG),
        ...body.config,
        scoreboard: body.config.scoreboard
          ? {
              ...(currentData.config?.scoreboard || INITIAL_LIVE_STREAM_CONFIG.scoreboard),
              ...body.config.scoreboard,
            }
          : currentData.config?.scoreboard || INITIAL_LIVE_STREAM_CONFIG.scoreboard,
      };
      await docRef.set(
        {
          config: mergedConfig,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      return NextResponse.json({ ok: true, config: mergedConfig }, { headers: CORS_HEADERS });
    }

    if (action === "update_tunnel" && body.tunnelUrl) {
      await docRef.set(
        {
          tunnelUrl: String(body.tunnelUrl).trim().replace(/\/+$/, ""),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      return NextResponse.json({ ok: true, tunnelUrl: body.tunnelUrl }, { headers: CORS_HEADERS });
    }

    if (action === "publish_photo" && body.photo) {
      const existing: any[] = Array.isArray(currentData.publishedPhotos)
        ? currentData.publishedPhotos
        : [];
      const incoming = body.photo;
      const key = incoming.base_id || incoming.id || incoming.filename;
      const filtered = existing.filter((p) => (p.base_id || p.id || p.filename) !== key);
      const updatedPhotos = [
        {
          ...incoming,
          published_live: true,
          published_at: new Date().toLocaleTimeString("es-CR", { hour12: false }),
        },
        ...filtered,
      ].slice(0, 60);

      await docRef.set(
        {
          publishedPhotos: updatedPhotos,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      return NextResponse.json(
        { ok: true, totalPublished: updatedPhotos.length },
        { headers: CORS_HEADERS }
      );
    }

    if (action === "unpublish_photo" && body.base_id) {
      const existing: any[] = Array.isArray(currentData.publishedPhotos)
        ? currentData.publishedPhotos
        : [];
      const updatedPhotos = existing.filter(
        (p) => (p.base_id || p.id || p.filename) !== body.base_id
      );
      await docRef.set(
        {
          publishedPhotos: updatedPhotos,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      return NextResponse.json(
        { ok: true, totalPublished: updatedPhotos.length },
        { headers: CORS_HEADERS }
      );
    }

    return NextResponse.json({ ok: false, error: "Acción no reconocida" }, { status: 400, headers: CORS_HEADERS });
  } catch (error: any) {
    console.error("[/api/live-sync POST] Error:", error);
    return NextResponse.json(
      { ok: false, error: error?.message || "Error updating live sync" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
