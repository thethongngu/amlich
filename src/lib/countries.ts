// Country registry: the single place where per-country data is declared.
// All three pages (/, /tw, /hk) render the same <CalendarPage /> component
// and only differ by the entry they pass in.

import {
	getTodayInfo,
	getDateInfo,
	getCalendarDays,
	getUpcomingHolidays,
} from '$lib/calendar';
import { hkCalendar } from '$lib/calendar-hk';
import { twCalendar } from '$lib/calendar-tw';
import type { SolarHolidayCalendar } from '$lib/solar-holidays';

export type CountryCode = 'vn' | 'tw' | 'hk';

export interface Country {
	code: CountryCode;
	/** Route this country is rendered at. */
	path: string;
	/** Emoji flag shown next to holiday labels. */
	flag: string;
	/** Accessible name / settings label. */
	label: string;
	/** Suffix in the <h1> page title, e.g. "Âm lịch Đài Loan - Ngày lễ". */
	title: string;
	/** Accent colour used for this country's holidays (text, dots, legend). */
	color: string;
	/** Soft background tint of `color`, used to fill holiday cells. */
	tint: string;
	calendar: SolarHolidayCalendar;
}

/**
 * Country colour palette: one hue per country, matched in lightness/chroma so
 * no single country shouts louder than the others. `tint` is the soft paper
 * wash of the same hue used to fill holiday cells.
 *
 * Only the countries we ship are wired up below, but the rest of the palette is
 * kept here so adding a country is a one-line change.
 */
export const COUNTRY_PALETTE = {
	/** Việt Nam — red */
	red: { color: '#be3a31', tint: '#f7e7e2' },
	/** Trung Quốc — plum */
	plum: { color: '#a63d6e', tint: '#f6e8ee' },
	/** Nhật Bản — jade */
	jade: { color: '#1e6f5c', tint: '#e2eee9' },
	/** Hàn Quốc — indigo */
	indigo: { color: '#3d6ba8', tint: '#e6ecf5' },
	/** Đài Loan — violet */
	violet: { color: '#7a6bb5', tint: '#ebe8f4' },
	/** Hoa Kỳ — olive */
	olive: { color: '#4e7a2e', tint: '#e9efe0' }
} as const;

const vnCalendar: SolarHolidayCalendar = {
	getTodayInfo,
	getDateInfo,
	getCalendarDays,
	getUpcomingHolidays,
};

export const COUNTRIES: Country[] = [
	{
		code: 'vn',
		path: '/',
		flag: '🇻🇳',
		label: 'Việt Nam',
		title: 'Âm lịch - Ngày lễ',
		...COUNTRY_PALETTE.red,
		calendar: vnCalendar,
	},
	{
		code: 'tw',
		path: '/tw',
		flag: '🇹🇼',
		label: 'Đài Loan',
		title: 'Âm lịch Đài Loan - Ngày lễ',
		...COUNTRY_PALETTE.violet,
		calendar: twCalendar,
	},
	{
		code: 'hk',
		path: '/hk',
		flag: '🇭🇰',
		label: 'Hồng Kông',
		title: 'Âm lịch Hồng Kông - Ngày lễ',
		// Jade rather than plum: keeps it clearly apart from the Việt Nam red.
		...COUNTRY_PALETTE.jade,
		calendar: hkCalendar,
	},
];

/** Countries whose holidays are shown (multi-select). */
export const COUNTRIES_KEY = 'amlich-countries';

function isCountryCode(value: string): value is CountryCode {
	return COUNTRIES.some((c) => c.code === value);
}

/**
 * Reads the selected country list from storage, falling back to `fallback`
 * (the route's country) on first visit.
 */
export function readSelectedCodes(fallback: CountryCode): CountryCode[] {
	let stored: string[] = [];
	if (typeof localStorage !== 'undefined') {
		try {
			const raw = localStorage.getItem(COUNTRIES_KEY);
			const parsed = raw ? JSON.parse(raw) : null;
			if (Array.isArray(parsed)) stored = parsed.filter((v) => typeof v === 'string');
		} catch {
			stored = [];
		}
	}
	const codes = stored.filter(isCountryCode);
	return codes.length > 0 ? codes : [fallback];
}

export function writeSelectedCodes(codes: CountryCode[]): void {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem(COUNTRIES_KEY, JSON.stringify(codes));
}

export function getCountry(code: CountryCode): Country {
	const found = COUNTRIES.find((c) => c.code === code);
	if (!found) throw new Error(`Unknown country: ${code}`);
	return found;
}
