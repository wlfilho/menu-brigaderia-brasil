import { ImageResponse } from "next/og";
import { getSiteConfig } from "@/lib/config-service";

export const runtime = "edge";

function buildLogoUrl(configLogoUrl: string, requestUrl?: string): string | null {
    if (!configLogoUrl || !configLogoUrl.trim()) {
        return null;
    }

    const trimmed = configLogoUrl.trim();
    
    // Se já é uma URL absoluta (http/https), retorna como está
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        return trimmed;
    }

    // Tenta usar a URL da requisição atual primeiro (mais confiável)
    let baseUrl: string | undefined;
    
    if (requestUrl) {
        try {
            const url = new URL(requestUrl);
            baseUrl = `${url.protocol}//${url.host}`;
        } catch (error) {
            console.warn(`[OG] Failed to parse request URL: ${requestUrl}`, error);
        }
    }
    
    // Fallback para variáveis de ambiente ou valores padrão
    if (!baseUrl) {
        baseUrl = process.env.NEXT_PUBLIC_SITE_URL 
            || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    }
    
    // Garante que o caminho começa com /
    const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    
    const fullUrl = `${baseUrl}${path}`;
    console.log(`[OG] Built logo URL: ${fullUrl} (from base: ${baseUrl}, path: ${path})`);
    
    return fullUrl;
}

async function verifyImageUrl(logoUrl: string): Promise<boolean> {
    try {
        const response = await fetch(logoUrl, {
            method: "HEAD",
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; Next.js OG Image)",
            },
        });
        return response.ok;
    } catch (error) {
        console.warn(`[OG] Error verifying image URL ${logoUrl}:`, error);
        return false;
    }
}

export async function GET(request: Request) {
    try {
        const config = await getSiteConfig();
        
        // Obter a URL da requisição atual para construir URLs relativas corretamente
        const requestUrl = request.url;
        console.log(`[OG] Generating OG image for: ${requestUrl}`);
        console.log(`[OG] Logo URL from config: ${config.logoUrl}`);
        
        // Construir URL absoluta do logo usando a URL da requisição
        const logoUrl = buildLogoUrl(config.logoUrl, requestUrl);
        console.log(`[OG] Built logo URL: ${logoUrl}`);
        
        // O ImageResponse do Next.js no Edge Runtime funciona melhor com URLs absolutas
        // Ele faz o fetch internamente quando necessário
        let logoSrc: string | null = null;
        if (logoUrl) {
            // Sempre usa a URL - o ImageResponse vai fazer o fetch internamente
            // A verificação é apenas para logs/debug
            const isAccessible = await verifyImageUrl(logoUrl);
            logoSrc = logoUrl;
            
            if (isAccessible) {
                console.log(`[OG] Logo URL verified and ready: ${logoUrl}`);
            } else {
                console.warn(`[OG] Logo URL verification failed, but using anyway: ${logoUrl}`);
                console.warn(`[OG] ImageResponse will attempt to fetch the image internally`);
            }
        } else {
            console.warn(`[OG] No logo URL available from config`);
        }
        
        // Log final para debug
        console.log(`[OG] Final logoSrc value: ${logoSrc}`);

        return new ImageResponse(
            (
                <div
                    style={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f6ecde",
                        backgroundImage:
                            "linear-gradient(to bottom, #fdfbf8, #f6ecde)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "20px",
                        }}
                    >
                        {logoSrc ? (
                            <img
                                src={logoSrc}
                                alt={config.restaurantName || "Logo"}
                                width={200}
                                height={200}
                                style={{
                                    objectFit: "contain",
                                    borderRadius: "20px",
                                    backgroundColor: "white",
                                    padding: "20px",
                                }}
                            />
                        ) : null}
                        <div
                            style={{
                                fontSize: 60,
                                fontWeight: "bold",
                                color: "#4c3823",
                                textAlign: "center",
                            }}
                        >
                            {config.restaurantName}
                        </div>
                        <div
                            style={{
                                fontSize: 30,
                                color: "#7d6446",
                                textAlign: "center",
                            }}
                        >
                            Menú Digital
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            },
        );
    } catch (error) {
        console.error("Failed to generate OG image", error);
        return new Response("Failed to generate image", { status: 500 });
    }
}
