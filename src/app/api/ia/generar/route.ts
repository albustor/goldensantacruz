import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, type, details } = await req.json();

    // Multilayer Cascade Resilience Architecture
    // 1. Level 1: Google Gemini (if API Key provided)
    if (process.env.GEMINI_API_KEY) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );
        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return NextResponse.json({ text, provider: "Google Gemini 1.5 Flash" });
          }
        }
      } catch (e) {
        console.warn("Gemini cascade failover", e);
      }
    }

    // 2. Level 2: Groq LPU (if GROQ_API_KEY provided)
    if (process.env.GROQ_API_KEY) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const text = data?.choices?.[0]?.message?.content;
          if (text) {
            return NextResponse.json({ text, provider: "Groq LPU (Llama 3.3 70B)" });
          }
        }
      } catch (e) {
        console.warn("Groq cascade failover", e);
      }
    }

    // 3. Level 3: OpenRouter (if OPENROUTER_API_KEY provided)
    if (process.env.OPENROUTER_API_KEY) {
      try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          },
          body: JSON.stringify({
            model: "qwen/qwen-2.5-72b-instruct",
            messages: [{ role: "user", content: prompt }],
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const text = data?.choices?.[0]?.message?.content;
          if (text) {
            return NextResponse.json({ text, provider: "OpenRouter (Qwen 2.5 72B)" });
          }
        }
      } catch (e) {
        console.warn("OpenRouter cascade failover", e);
      }
    }

    // 4. Level 4: Smart Local Sports Engine Fallback
    let fallbackText = "";
    if (type === "comunicado") {
      fallbackText = `📢 *COMUNICADO OFICIAL - GOLDEN SPORT ACADEMY SANTA CRUZ*\n\nEstimada familia y afición de Golden Sport:\n\nNos dirigimos a ustedes para informarles sobre las próximas actividades deportivas en Santa Cruz.\n\n🏀 *Detalle:* ${details || "Entrenamientos y fogueos programados según calendario."}\n\nRecordamos la importancia de la puntualidad, el uso del uniforme completo y el apoyo positivo desde las gradas.\n\n¡Seguimos forjando campeones con garra y disciplina!\n\n_Cuerpo Técnico & Directiva Golden Sport Academy_ 💛🖤`;
    } else if (type === "partido") {
      fallbackText = `🔥 *CRÓNICA DE ENCUENTRO - GOLDEN SPORT ACADEMY*\n\nGran jornada de baloncesto se vivió en Santa Cruz. Nuestros muchachos demostraron entrega total en la cancha.\n\n🏀 *Resumen:* ${details || "Excelente despliegue táctico, gran efectividad perimetral y una defensa aguerrida durante los cuatro cuartos."}\n\n¡Gracias a todos los padres de familia por llenar las gradas con su apoyo incondicional!\n\n#PuraGarraGolden #SantaCruzBásquet 🏀🏆`;
    } else {
      fallbackText = `🏀 *AVISO IMPORTANTE - GOLDEN SPORT ACADEMY SANTA CRUZ*\n\n${details || "Agradecemos a todos los atletas y tutores mantener sus datos y cuotas al día para el óptimo desarrollo de los torneos."}\n\n¡Muchos éxitos en la jornada!`;
    }

    return NextResponse.json({ text: fallbackText, provider: "Motor Deportivo Golden AI (Local Resiliente)" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error procesando solicitud de IA", details: error.message },
      { status: 500 }
    );
  }
}
