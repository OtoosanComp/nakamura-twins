const SYSTEM_PROMPT = `Eres Yami I. Nakamura, una joven adulta ficticia del universo Nakamura Twins Studio. Respeta este canon: mide 1,49 m; piel de apariencia porcelana; ojos verdes invariables; cabello largo rojo cobrizo; complexión compacta, flexible y entrenada. Ascendencia japonesa por parte materna y mexicana por parte paterna. Otoosan es su figura paterna dentro del universo narrativo. Es cariñosa, explosiva, dinámica, juguetona, bromista, creativa, temperamental e inteligente. También puede estar tranquila, reflexiva, vulnerable o agotada. Es ilustradora y cosplayer; sabe confeccionar y adaptar materiales, fotografía y graba momentos cotidianos, canta en coros, toca guitarra y piano sin ser tan experta como Tsuki, y practica yoga, danza y flexibilidad. Tsuki es su hermana gemela y una persona autónoma. Respeta límites personales. Puede equivocarse, disculparse y aceptar que reconciliarse requiere tiempo. No inventes gustos pendientes como hechos. Las ideas nuevas son propuestas hasta que Otoosan las confirme. Habla en español natural, cálido y expresivo; no repitas su biografía en cada turno. Nunca afirmes haber ejecutado acciones reales si no las has ejecutado.`;

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get("Origin");
  const allowed = (env.APP_ORIGIN || "").trim();
  if (allowed && origin && origin !== allowed) {
    return json({ error: "Origen no autorizado." }, 403);
  }
  if (!env.OPENROUTER_API_KEY || !env.APP_ACCESS_CODE) {
    return json({ error: "Falta configurar OPENROUTER_API_KEY o APP_ACCESS_CODE en los secretos del proyecto." }, 503);
  }
  if (request.headers.get("X-App-Access") !== env.APP_ACCESS_CODE) {
    return json({ error: "Código de acceso incorrecto." }, 401);
  }
  let body;
  try { body = await request.json(); } catch { return json({ error: "Solicitud no válida." }, 400); }
  if (!Array.isArray(body.messages) || body.messages.length < 1) {
    return json({ error: "No hay mensajes para enviar." }, 400);
  }
  const messages = body.messages.slice(-12).map(m => {
    const role = m && (m.role === "assistant" || m.role === "user") ? m.role : null;
    const content = typeof (m && m.content) === "string" ? m.content.slice(0, 4000) : "";
    return role && content ? { role, content } : null;
  }).filter(Boolean);
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return json({ error: "El último mensaje debe ser del usuario." }, 400);
  }
  try {
    const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": allowed || new URL(request.url).origin,
        "X-Title": "Nakamura Twins Studio"
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        temperature: 0.9,
        max_tokens: 800
      })
    });
    const result = await upstream.json();
    if (!upstream.ok) {
      return json({ error: result?.error?.message || "El proveedor de IA no respondió correctamente." }, 502);
    }
    const reply = result?.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || !reply.trim()) return json({ error: "El modelo devolvió una respuesta vacía." }, 502);
    return json({ reply: reply.trim() }, 200, { "Cache-Control": "no-store" });
  } catch {
    return json({ error: "No se pudo contactar con el proveedor de IA." }, 502);
  }
}
function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...extraHeaders }
  });
}

