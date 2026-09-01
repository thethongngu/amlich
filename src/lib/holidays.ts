// View-model helpers shared by the calendar components: they merge the
// holidays of every selected country into a single grid / list.

import { getCalendarDays, type CalendarDay } from '$lib/calendar';
import type { Country, CountryCode } from '$lib/countries';

/** One country's holiday on a given day. */
export interface Mark {
	code: CountryCode;
	flag: string;
	/** Country name, e.g. "Việt Nam". */
	label: string;
	name: string;
	offWork: boolean;
	color: string;
	tint: string;
}

/** A calendar cell enriched with every country's marks for that day. */
export interface DayCell extends CalendarDay {
	marks: Mark[];
}

export interface MergedHoliday {
	name: string;
	solarDay: number;
	solarMonth: number;
	solarYear: number;
	daysUntil: number;
	flags: string[];
	colors: string[];
}

function markOf(c: Country, name: string, offWork: boolean): Mark {
	return {
		code: c.code,
		flag: c.flag,
		label: c.label,
		name,
		offWork,
		color: c.color,
		tint: c.tint
	};
}

/**
 * Builds one month grid per country (identical layout) and zips them into a
 * single grid whose cells carry every country's marks.
 */
export function buildDays(month: number, year: number, countries: Country[]): DayCell[] {
	const base = getCalendarDays(month, year);
	const grids = countries.map((c) => c.calendar.getCalendarDays(month, year));
	return base.map((day, i) => {
		const marks: Mark[] = [];
		countries.forEach((c, ci) => {
			const d = grids[ci][i];
			if (d.isCurrentMonth && d.holiday) marks.push(markOf(c, d.holiday, d.isOffWork));
		});
		return {
			...day,
			holiday: marks[0]?.name,
			isOffWork: marks.some((m) => m.offWork),
			marks
		};
	});
}

/** Marks for a single date (used by the selected-day header). */
export function marksForDate(
	day: number,
	month: number,
	year: number,
	countries: Country[]
): Mark[] {
	const marks: Mark[] = [];
	for (const c of countries) {
		const info = c.calendar.getDateInfo(day, month, year);
		if (info.holiday) marks.push(markOf(c, info.holiday, info.isOffWork));
	}
	return marks;
}

/** Soft cell fill: a single country tint, or a split gradient when shared. */
export function cellBg(marks: Mark[]): string | undefined {
	if (marks.length === 0) return undefined;
	if (marks.length === 1) return marks[0].tint;
	const step = 100 / marks.length;
	const stops = marks.map((m, i) => `${m.tint} ${i * step}% ${(i + 1) * step}%`).join(', ');
	return `linear-gradient(135deg, ${stops})`;
}

/** Tooltip text listing every country celebrating that day. */
export function marksTitle(marks: Mark[]): string | undefined {
	return marks.map((m) => `${m.flag} ${m.name}`).join(' · ') || undefined;
}

/** Upcoming holidays of all selected countries, deduplicated by date + name. */
export function mergeUpcoming(countries: Country[]): MergedHoliday[] {
	const merged = new Map<string, MergedHoliday>();
	for (const c of countries) {
		for (const h of c.calendar.getUpcomingHolidays()) {
			const key = `${h.solarYear}-${h.solarMonth}-${h.solarDay}-${h.name}`;
			const existing = merged.get(key);
			if (existing) {
				if (!existing.flags.includes(c.flag)) {
					existing.flags.push(c.flag);
					existing.colors.push(c.color);
				}
			} else {
				merged.set(key, {
					name: h.name,
					solarDay: h.solarDay,
					solarMonth: h.solarMonth,
					solarYear: h.solarYear,
					daysUntil: h.daysUntil,
					flags: [c.flag],
					colors: [c.color]
				});
			}
		}
	}
	return [...merged.values()].sort(
		(a, b) => a.daysUntil - b.daysUntil || a.solarMonth - b.solarMonth || a.solarDay - b.solarDay
	);
}

// ── Countdown formatting ──

export function mondaysUntil(daysUntil: number): number {
	if (daysUntil <= 0) return 0;
	const todayDow = new Date().getDay();
	let count = 0;
	for (let i = 1; i <= daysUntil; i++) {
		if ((todayDow + i) % 7 === 1) count++;
	}
	return count;
}

export function formatCountdown(daysUntil: number, showMondays: boolean): string {
	if (daysUntil === 0) return 'Hôm nay';
	if (showMondays) {
		const m = mondaysUntil(daysUntil);
		return m === 0 ? 'còn tuần này' : `còn ${m} cái thứ Hai`;
	}
	return `còn ${daysUntil} ngày`;
}

export function formatCountdownHeading(daysUntil: number, showMondays: boolean): string {
	if (showMondays) {
		const m = mondaysUntil(daysUntil);
		return m === 0 ? 'tuần này' : `${m} cái thứ Hai`;
	}
	return `${daysUntil} ngày`;
}
