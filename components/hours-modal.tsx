"use client";

import { Clock, X } from "lucide-react";
import { useEffect, useState } from "react";

import type { BusinessHours } from "@/types/hours";

interface HoursModalProps {
    hours: BusinessHours[];
    restaurantName: string;
}

export function HoursModal({ hours, restaurantName }: HoursModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const dayNames: Record<string, string> = {
        domingo: "Domingo",
        lunes: "Lunes",
        martes: "Martes",
        miércoles: "Miércoles",
        jueves: "Jueves",
        viernes: "Viernes",
        sábado: "Sábado",
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
                            {hours.map((hour) => (
                                <div
                                    key={hour.day}
                                    className="flex items-center justify-between rounded-lg border border-[#efe3d2] bg-[#fdfbf8] px-4 py-3 transition hover:border-[#d3a06f]"
                                >
                                    <span className="font-medium capitalize text-[#6d5334]">
                                        {dayNames[hour.day.toLowerCase()] || hour.day}
                                    </span>
                                    {hour.isOpen ? (
                                        <span className="text-sm text-[#7d6446]">
                                            {hour.openTime} - {hour.closeTime}
                                        </span>
                                    ) : (
                                        <span className="text-sm font-medium text-red-600">
                                            Cerrado
                                        </span>
                                    )}
                                </div>
                            ))}
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
