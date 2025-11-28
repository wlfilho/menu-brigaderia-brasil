"use client";

import { useEffect, useState } from "react";

import type { BusinessHours } from "@/types/hours";
import { getNextOpeningTime, isOpenNow } from "@/lib/hours-utils";

interface OpenStatusBadgeProps {
    hours: BusinessHours[];
}

export function OpenStatusBadge({ hours }: OpenStatusBadgeProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [nextOpening, setNextOpening] = useState<{
        day: string;
        time: string;
    } | null>(null);

    useEffect(() => {
        const updateStatus = () => {
            setIsOpen(isOpenNow(hours));
            setNextOpening(getNextOpeningTime(hours));
        };

        updateStatus();
        // Atualizar a cada minuto
        const interval = setInterval(updateStatus, 60000);

        return () => clearInterval(interval);
    }, [hours]);

    if (hours.length === 0) {
        return null;
    }

    return (
        <div
            className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${isOpen
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
        >
            <span
                className={`h-2 w-2 rounded-full ${isOpen ? "bg-green-500" : "bg-red-500"
                    }`}
                aria-hidden
            />
            {isOpen ? (
                <span>Abierto ahora</span>
            ) : nextOpening ? (
                <span>
                    Abre {nextOpening.day} a las {nextOpening.time}
                </span>
            ) : (
                <span>Cerrado</span>
            )}
        </div>
    );
}
