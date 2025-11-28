import { ImageResponse } from "next/og";
import { getSiteConfig } from "@/lib/config-service";

export const runtime = "edge";

export async function GET() {
    try {
        const config = await getSiteConfig();

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
                        {config.logoUrl && (
                            <img
                                src={config.logoUrl.startsWith("http")
                                    ? config.logoUrl
                                    : `${process.env.NEXT_PUBLIC_SITE_URL || ""}${config.logoUrl}`}
                                alt={config.restaurantName}
                                style={{
                                    width: "200px",
                                    height: "200px",
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
