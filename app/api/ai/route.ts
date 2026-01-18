import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { loadAllVehicles, filterAndSortVehicles } from "@/lib/getVehicles";
import type { Vehicle } from "@/lib/types";

type Prefs = {
  location?: string;
  maxPrice?: number;
  minRange?: number;
  seats?: number;
  preferNew?: boolean;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prefs: Prefs = body.preferences ?? {};

    // start with all vehicles then score
    const all = await loadAllVehicles();

    // lightweight scoring heuristic
    const scored = all.map(v => {
      let score = 0;
      // prefer lower price
      score += ((v.range_km ?? 0) / 100) * 1.0; // range
      score -= (v.price ?? 0) / 10000; // penalty for price
      score += (v.seats ?? 0) * 0.2;
      if (v.autopilot) score += 0.5;
      // location match bonus
      if (prefs.location && v.location && v.location.toLowerCase().includes(prefs.location.toLowerCase())) score += 1.0;
      // preference filters
      if (prefs.maxPrice && v.price && v.price > prefs.maxPrice) score -= 5;
      if (prefs.minRange && v.range_km && v.range_km < prefs.minRange) score -= 3;
      if (prefs.seats && (v.seats ?? 0) < prefs.seats) score -= 2;
      if (prefs.preferNew && ((v.condition ?? "").toLowerCase() === "new")) score += 1;

      return { vehicle: v, score };
    });
    scored.sort((a, b) => b.score - a.score);

    // If OPENAI_API_KEY is present, optionally re-rank top candidates via OpenAI
    const openaiKey = process.env.OPENAI_API_KEY;
    let top = scored.slice(0, 10);
    if (openaiKey) {
      try {
        const prompt = `You are an assistant that ranks EVs given user preferences. Preferences: ${JSON.stringify(prefs)}. Vehicles: ${JSON.stringify(top.map(s => ({ id: s.vehicle.id, brand: s.vehicle.brand, model: s.vehicle.model, year: s.vehicle.year, price: s.vehicle.price, range_km: s.vehicle.range_km })))}`;

        const oaRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: "Rank the following vehicles from best to worst for the user preferences." }, { role: "user", content: prompt }],
            temperature: 0.0,
            max_tokens: 300,
          }),
        });

        const oa = await oaRes.json();
        const content = oa?.choices?.[0]?.message?.content as string | undefined;
        if (content) {
          // simple parse: look for vehicle ids in order
          const lines = content.split(/\n+/).map(l => l.trim()).filter(Boolean);
          const order: string[] = [];
          for (const line of lines) {
            const m = line.match(/\b(id\s*[:=]?\s*)?(\w[\w-]*)/i);
            if (m) {
              const id = m[2];
              if (!order.includes(id)) order.push(id);
            }
          }
          if (order.length) {
            // re-order top based on order array
            top.sort((a, b) => {
              const ai = order.indexOf(a.vehicle.id);
              const bi = order.indexOf(b.vehicle.id);
              return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
            });
          }
        }
      } catch (e) {
        // ignore OpenAI errors and fallback to heuristic
      }
    }

    const out = top.slice(0, 5).map(s => ({ id: s.vehicle.id, brand: s.vehicle.brand, model: s.vehicle.model, year: s.vehicle.year, price: s.vehicle.price, score: Number(s.score.toFixed(2)) }));

    return NextResponse.json({ ok: true, recommendations: out });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "AI optimizer ready" });
}
