import { NextResponse } from "next/server";
import { lookupProviders } from "@/lib/providers";

type Req = { id?: string; brand?: string; model?: string };

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Req;
    const providers = lookupProviders(body.brand, body.model);
    const q = encodeURIComponent(`${body.brand ?? ""} ${body.model ?? ""}`.trim());
    const decorated = providers.map((p) => ({ name: p.name, url: p.url ? `${p.url}?q=${q}` : undefined, note: p.note }));
    return NextResponse.json({ ok: true, providers: decorated });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ ok: true, message: "Providers lookup ready" });
}
