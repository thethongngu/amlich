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
	calendar: SolarHolidayCalendar;
}

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
		calendar: vnCalendar,
	},
	{
		code: 'tw',
		path: '/tw',
		flag: '🇹🇼',
		label: 'Đài Loan',
		title: 'Âm lịch Đài Loan - Ngày lễ',
		calendar: twCalendar,
	},
	{
		code: 'hk',
		path: '/hk',
		flag: '🇭🇰',
		label: 'Hồng Kông',
		title: 'Âm lịch Hồng Kông - Ngày lễ',
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
