import { NextResponse } from "next/server";

const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

export async function POST(request: Request) {
  if (!WEBHOOK_URL) {
    console.error("N8N_WEBHOOK_URL is not configured");
    return NextResponse.json(
      { message: "Erro de configuração no servidor." },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const whatsapp = String(body.whatsapp ?? "").trim();

    if (!name || !email || !whatsapp) {
      return NextResponse.json(
        { message: "Informe nome, e-mail e WhatsApp para receber o cupom." },
        { status: 400 },
      );
    }

    // Enviar para o N8N
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        whatsapp,
        date: new Date().toISOString(),
        source: "menu-digital",
      }),
    });

    if (!response.ok) {
      throw new Error(`N8N webhook failed with status ${response.status}`);
    }

    return NextResponse.json({ message: "Lead enviado com sucesso" });
  } catch (error) {
    console.error("Failed to send lead to N8N", error);
    return NextResponse.json(
      { message: "Não foi possível cadastrar agora. Tente novamente." },
      { status: 500 },
    );
  }
}
