"use client";

import { Clock, X } from "lucide-react";
import { useEffect, useState } from "react";

import type { BusinessHours } from "@/types/hours";
import { getCurrentDay, getNextOpeningDay, isOpenNow } from "@/lib/hours-utils";

interface HoursModalProps {
    hours: BusinessHours[];
    restaurantName: string;
}

export function HoursModal({ hours, restaurantName }: HoursModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentDay, setCurrentDay] = useState("");
    const [nextOpenDay, setNextOpenDay] = useState<string | null>(null);
    const [isCurrentlyOpen, setIsCurrentlyOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            setCurrentDay(getCurrentDay());
            setNextOpenDay(getNextOpeningDay(hours));
            setIsCurrentlyOpen(isOpenNow(hours));
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen, hours]);

    const dayNames: Record<string, string> = {
        domingo: "Domingo",
        lunes: "Lunes",
        martes: "Martes",
        miércoles: "Miércoles",
        jueves: "Jueves",
        viernes: "Viernes",
        sábado: "Sábado",
    };

    const isHighlighted = (day: string) => {
        const normalizedDay = day.toLowerCase();
        const normalizedCurrent = currentDay.toLowerCase();
        const normalizedNext = nextOpenDay?.toLowerCase();

        // Destacar o dia atual se estiver aberto
        if (normalizedDay === normalizedCurrent && isCurrentlyOpen) {
            return "current";
        }

        // Destacar o próximo dia de abertura se estiver fechado
        if (!isCurrentlyOpen) {
            if (nextOpenDay === "hoy" && normalizedDay === normalizedCurrent) {
                return "next";
            }
            if (nextOpenDay === "mañana") {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                const tomorrowDay = [
                    "domingo",
                    "lunes",
                    "martes",
                    "miércoles",
                    "jueves",
                    "viernes",
                    "sábado",
                ][tomorrow.getDay()];
                if (normalizedDay === tomorrowDay) {
                    return "next";
                }
            }
            if (normalizedDay === normalizedNext) {
                return "next";
            }
        }

        return null;
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 text-[#7d6446] transition hover:text-[#b37944]"
            >
                <Clock className="h-4 w-4" />
                <span className="font-medium">Horarios</span>
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute right-4 top-4 rounded-full p-2 text-[#9a8263] transition hover:bg-[#f6ecde] hover:text-[#6d5334]"
                            aria-label="Cerrar"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="mb-6">
                            <div className="mb-2 flex items-center gap-3">
                                <div className="rounded-full bg-[#f6ecde] p-3">
                                    <Clock className="h-6 w-6 text-[#b37944]" />
                                </div>
                                <h2 className="text-2xl font-bold text-[#6d5334]">Horarios</h2>
                            </div>
                            <p className="text-sm text-[#9a8263]">{restaurantName}</p>
                        </div>

                        <div className="space-y-3">
                            {hours.map((hour) => {
                                const highlight = isHighlighted(hour.day);
                                const isCurrent = highlight === "current";
                                const isNext = highlight === "next";

                                return (
                                    <div
                                        key={hour.day}
                                        className={`flex items-center justify-between rounded-lg border px-4 py-3 transition ${isCurrent
                                                ? "border-green-300 bg-green-50"
                                                : isNext
                                                    ? "border-amber-300 bg-amber-50"
                                                    : "border-[#efe3d2] bg-[#fdfbf8] hover:border-[#d3a06f]"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {isCurrent && (
                                                <span className="h-2 w-2 rounded-full bg-green-500" />
                                            )}
                                            {isNext && (
                                                <span className="h-2 w-2 rounded-full bg-amber-500" />
                                            )}
                                            <span
                                                className={`font-medium capitalize ${isCurrent
                                                        ? "text-green-800"
                                                        : isNext
                                                            ? "text-amber-800"
                                                            : "text-[#6d5334]"
                                                    }`}
                                            >
                                                {dayNames[hour.day.toLowerCase()] || hour.day}
                                                {isCurrent && (
                                                    <span className="ml-2 text-xs">(Hoy)</span>
                                                )}
                                                {isNext && !isCurrent && (
                                                    <span className="ml-2 text-xs">(Próxima apertura)</span>
                                                )}
                                            </span>
                                        </div>
                                        {hour.isOpen ? (
                                            <span
                                                className={`text-sm ${isCurrent
                                                        ? "font-semibold text-green-700"
                                                        : isNext
                                                            ? "font-semibold text-amber-700"
                                                            : "text-[#7d6446]"
                                                    }`}
                                            >
                                                {hour.openTime} - {hour.closeTime}
                                            </span>
                                        ) : (
                                            <span className="text-sm font-medium text-red-600">
                                                Cerrado
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {hours.length === 0 && (
                            <p className="py-8 text-center text-[#9a8263]">
                                Horarios no disponibles
                            </p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
