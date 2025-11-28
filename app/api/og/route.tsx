import { ImageResponse } from "next/og";
import { getSiteConfig } from "@/lib/config-service";

export const runtime = "edge";

function buildLogoUrl(configLogoUrl: string): string | null {
    if (!configLogoUrl || !configLogoUrl.trim()) {
        return null;
    }

    const trimmed = configLogoUrl.trim();
    
    // Se já é uma URL absoluta (http/https), retorna como está
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        return trimmed;
    }

    // Se é um caminho relativo, constrói a URL completa
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL 
        || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
    
    // Garante que o caminho começa com /
    const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    
    return `${baseUrl}${path}`;
}

async function fetchImageAsDataUrl(logoUrl: string): Promise<string | null> {
    try {
        const response = await fetch(logoUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; Next.js OG Image)",
            },
        });
        
        if (!response.ok) {
            console.warn(`Failed to fetch logo image: ${response.status} ${response.statusText}`);
            return null;
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const contentType = response.headers.get("content-type") || "image/png";
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Converter Uint8Array para base64 no Edge Runtime
        let binary = "";
        for (let i = 0; i < uint8Array.length; i++) {
            binary += String.fromCharCode(uint8Array[i]);
        }
        const base64 = btoa(binary);
        
        return `data:${contentType};base64,${base64}`;
    } catch (error) {
        console.warn("Error fetching logo image:", error);
        return null;
    }
}

export async function GET() {
    try {
        const config = await getSiteConfig();
        
        // Construir URL absoluta do logo
        const logoUrl = buildLogoUrl(config.logoUrl);
        
        // Buscar a imagem e converter para data URL
        // Isso garante que a imagem seja carregada corretamente no Edge Runtime
        let logoSrc: string | null = null;
        if (logoUrl) {
            const dataUrl = await fetchImageAsDataUrl(logoUrl);
            if (dataUrl) {
                logoSrc = dataUrl;
            } else {
                // Se falhar ao buscar, tenta usar a URL diretamente como fallback
                logoSrc = logoUrl;
            }
        }

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
                        {logoSrc && (
                            <img
                                src={logoSrc}
                                alt={config.restaurantName}
                                width={200}
                                height={200}
                                style={{
                                    objectFit: "contain",
                                    borderRadius: "20px",
                                    backgroundColor: "white",
                                    padding: "20px",
                                }}
                            />
                        )}
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
