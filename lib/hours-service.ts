import { unstable_cache } from "next/cache";

import { parseCsvLine, splitCsvRows } from "@/lib/csv";
import type { BusinessHours } from "@/types/hours";

const DEFAULT_PUBLISHED_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTFeYAo7QKAGm947PC5VAFTxTCuVKPz0UGTcPLNaGzSv4P-vei6QanuNhm-nm2qBU5OaeJF8d3ttrpM/pub?output=csv";
const PUBLISHED_SHEET_URL =
    process.env.NEXT_PUBLIC_SHEET_URL ??
    process.env.SHEET_URL ??
    DEFAULT_PUBLISHED_URL;

const HOURS_GID = process.env.NEXT_PUBLIC_HOURS_GID ?? "1324229572";

function buildHoursUrl() {
    try {
        const url = new URL(PUBLISHED_SHEET_URL);
        url.searchParams.set("gid", HOURS_GID);
        url.searchParams.set("output", "csv");
        return url.toString();
    } catch (error) {
        console.warn("Failed to build hours URL", error);
        return `https://docs.google.com/spreadsheets/d/e/2PACX-1vTFeYAo7QKAGm947PC5VAFTxTCuVKPz0UGTcPLNaGzSv4P-vei6QanuNhm-nm2qBU5OaeJF8d3ttrpM/pub?output=csv&gid=${HOURS_GID}`;
    }
}

const HOURS_URL = buildHoursUrl();
const CACHE_TAG = "hours-data";

async function fetchHoursCsv(): Promise<string> {
    const response = await fetch(HOURS_URL, {
        next: {
            revalidate: 60 * 60 * 24, // 24 hours
            tags: [CACHE_TAG],
        },
    });

    if (!response.ok) {
        throw new Error(`Hours request failed with ${response.status}`);
    }

    return response.text();
}

function normalizeHeader(value: string) {
    return value
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();
}

function parseIsOpen(value: string): boolean {
    const normalized = value.trim().toLowerCase();
    return ["si", "sí", "yes", "true", "1"].includes(normalized);
}

function buildHours(csv: string): BusinessHours[] {
    const [headerLineRaw, ...rowLines] = splitCsvRows(csv).filter(
        (line) => line.trim().length > 0,
    );
    const headerLine = headerLineRaw?.replace(/^\ufeff/, "");

    if (!headerLine) {
        return [];
    }

    const headers = parseCsvLine(headerLine).map(normalizeHeader);

    const findIndex = (candidates: string[]) =>
        candidates.reduce<number>((found, candidate) => {
            if (found >= 0) {
                return found;
            }
            return headers.indexOf(candidate);
        }, -1);

    const indices = {
        day: findIndex(["dia", "day"]),
        openTime: findIndex(["apertura", "abre", "open", "opening"]),
        closeTime: findIndex(["cierre", "fecha", "close", "closing"]),
        isOpen: findIndex(["abierto", "open", "isopen"]),
    };

    return rowLines
        .map((line) => parseCsvLine(line))
        .map((columns) => {
            const day = indices.day >= 0 ? columns[indices.day]?.trim() : "";
            const openTime =
                indices.openTime >= 0 ? columns[indices.openTime]?.trim() ?? "" : "";
            const closeTime =
                indices.closeTime >= 0 ? columns[indices.closeTime]?.trim() ?? "" : "";
            const isOpenValue =
                indices.isOpen >= 0 ? columns[indices.isOpen]?.trim() ?? "" : "";

            return {
                day,
                openTime,
                closeTime,
                isOpen: parseIsOpen(isOpenValue),
            } satisfies BusinessHours;
        })
        .filter((hour) => Boolean(hour.day));
}

async function loadHours(): Promise<BusinessHours[]> {
    try {
        const csv = await fetchHoursCsv();
        return buildHours(csv);
    } catch (error) {
        console.error("Failed to fetch hours", error);
        return [];
    }
}

export const getBusinessHours = unstable_cache(loadHours, [CACHE_TAG], {
    revalidate: 60 * 60 * 24,
});
