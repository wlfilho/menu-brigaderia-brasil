import type { BusinessHours } from "@/types/hours";

const DAY_NAMES_ES = [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
];

/**
 * Converte uma string de hora (ex: "10:00") para minutos desde meia-noite
 */
function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}

/**
 * Verifica se o restaurante está aberto agora
 */
export function isOpenNow(hours: BusinessHours[]): boolean {
    const now = new Date();
    const currentDay = DAY_NAMES_ES[now.getDay()];
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const todayHours = hours.find(
        (h) => h.day.toLowerCase() === currentDay && h.isOpen,
    );

    if (!todayHours || !todayHours.openTime || !todayHours.closeTime) {
        return false;
    }

    const openMinutes = timeToMinutes(todayHours.openTime);
    const closeMinutes = timeToMinutes(todayHours.closeTime);

    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

/**
 * Retorna o próximo horário de abertura
 */
export function getNextOpeningTime(
    hours: BusinessHours[],
): { day: string; time: string } | null {
    const now = new Date();
    const currentDayIndex = now.getDay();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Verificar se abre ainda hoje
    const todayName = DAY_NAMES_ES[currentDayIndex];
    const todayHours = hours.find(
        (h) => h.day.toLowerCase() === todayName && h.isOpen,
    );

    if (todayHours && todayHours.openTime) {
        const openMinutes = timeToMinutes(todayHours.openTime);
        if (currentMinutes < openMinutes) {
            return { day: "hoy", time: todayHours.openTime };
        }
    }

    // Procurar nos próximos 7 dias
    for (let i = 1; i <= 7; i++) {
        const nextDayIndex = (currentDayIndex + i) % 7;
        const nextDayName = DAY_NAMES_ES[nextDayIndex];
        const nextDayHours = hours.find(
            (h) => h.day.toLowerCase() === nextDayName && h.isOpen,
        );

        if (nextDayHours && nextDayHours.openTime) {
            const dayLabel = i === 1 ? "mañana" : nextDayHours.day;
            return { day: dayLabel, time: nextDayHours.openTime };
        }
    }

    return null;
}

/**
 * Retorna o dia da semana atual
 */
export function getCurrentDay(): string {
    const now = new Date();
    return DAY_NAMES_ES[now.getDay()];
}

/**
 * Retorna o próximo dia de abertura
 */
export function getNextOpeningDay(hours: BusinessHours[]): string | null {
    const nextOpening = getNextOpeningTime(hours);
    if (!nextOpening) return null;

    if (nextOpening.day === "hoy" || nextOpening.day === "mañana") {
        return nextOpening.day;
    }

    return nextOpening.day;
}
