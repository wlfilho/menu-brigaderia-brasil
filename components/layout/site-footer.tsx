import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

import { HoursModal } from "@/components/hours-modal";
import { getBusinessHours } from "@/lib/hours-service";
import type { SiteConfigWithComputed } from "@/types/config";

interface SiteFooterProps {
  config: SiteConfigWithComputed;
}

export async function SiteFooter({ config }: SiteFooterProps) {
  const year = new Date().getFullYear();
  const hours = await getBusinessHours();

  const socials = [
    {
      href: config.instagram,
      label: "Instagram",
      icon: Instagram,
    },
    {
      href: config.facebook,
      label: "Facebook",
      icon: Facebook,
    },
  ].filter((social) => Boolean(social.href));

  return (
    <footer className="border-t border-[#efe3d2] bg-gradient-to-b from-[#fdfbf8] to-[#f6ecde] py-12">
      <div className="container-responsive">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Información del restaurante */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#6d5334]">
              {config.restaurantName}
            </h3>
            <div className="space-y-3 text-sm text-[#7d6446]">
              {config.formattedAddress && (
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#b37944]" />
                  <span>{config.formattedAddress}</span>
                </div>
              )}
              {config.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0 text-[#b37944]" />
                  <a
                    href={`tel:${config.phone}`}
                    className="transition hover:text-[#b37944]"
                  >
                    {config.phone}
                  </a>
                </div>
              )}
              {config.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 flex-shrink-0 text-[#b37944]" />
                  <a
                    href={`mailto:${config.email}`}
                    className="transition hover:text-[#b37944]"
                  >
                    {config.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#6d5334]">Enlaces</h3>
            <div className="flex flex-col gap-3">
              <HoursModal hours={hours} restaurantName={config.restaurantName} />
              {config.whatsappLink && (
                <a
                  href={config.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#7d6446] transition hover:text-[#b37944]"
                >
                  <Phone className="h-4 w-4" />
                  <span className="font-medium">WhatsApp</span>
                </a>
              )}
            </div>
          </div>

          {/* Redes sociales */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#6d5334]">Síguenos</h3>
            <div className="flex gap-3">
              {socials.map(({ href, label, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-[#e7dccd] bg-white text-[#7d6446] shadow-sm transition hover:scale-110 hover:border-[#d3a06f] hover:text-[#b37944] hover:shadow-md"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-[#efe3d2] pt-6 text-center text-sm text-[#9a8263]">
          <p>
            &copy; {year} {config.restaurantName}. Hecho para saborear buenos
            momentos.
          </p>
        </div>
      </div>
    </footer>
  );
}
