// Generic solar-holiday calendar factory.
// Used by regions whose public holidays are published as fixed solar dates
// (e.g. Hong Kong, Taiwan). Lunar date display logic is reused from calendar.ts.

import {
	getDateInfo,
	getCalendarDays,
	type TodayInfo,
	type CalendarDay,
	type UpcomingHoliday,
} from '$lib/calendar';

export interface SolarHolidayDef {
	day: number;
	month: number;
	name: string;
	offWork: boolean;
}

export interface SolarHolidayCalendar {
	getDateInfo(d: number, m: number, y: number): TodayInfo;
	getTodayInfo(): TodayInfo;
	getCalendarDays(solarMonth: number, solarYear: number): CalendarDay[];
	getUpcomingHolidays(): UpcomingHoliday[];
}

/**
 * Builds a calendar API from a set of fixed yearly holidays (`base`) plus
 * year-specific holidays (`byYear`, which take precedence on the same date).
 */
export function createSolarHolidayCalendar(
	base: SolarHolidayDef[],
	byYear: Record<number, SolarHolidayDef[]>
): SolarHolidayCalendar {
	function find(day: number, month: number, year: number): SolarHolidayDef | undefined {
		const yearSpecific = byYear[year]?.find((h) => h.day === day && h.month === month);
		if (yearSpecific) return yearSpecific;
		return base.find((h) => h.day === day && h.month === month);
	}

	function dateInfo(d: number, m: number, y: number): TodayInfo {
		const info = getDateInfo(d, m, y);
		const holiday = find(d, m, y);
		return {
			...info,
			holiday: holiday?.name,
			holidayType: holiday ? 'solar' : undefined,
			isOffWork: holiday?.offWork ?? false,
		};
	}

	return {
		getDateInfo: dateInfo,

		getTodayInfo(): TodayInfo {
			const now = new Date();
			return dateInfo(now.getDate(), now.getMonth() + 1, now.getFullYear());
		},

		getCalendarDays(solarMonth: number, solarYear: number): CalendarDay[] {
			return getCalendarDays(solarMonth, solarYear).map((day) => {
				if (!day.isCurrentMonth) return day;
				const holiday = find(day.solarDay, solarMonth, solarYear);
				return {
					...day,
					holiday: holiday?.name,
					isOffWork: holiday?.offWork ?? false,
				};
			});
		},

		getUpcomingHolidays(): UpcomingHoliday[] {
			const now = new Date();
			now.setHours(0, 0, 0, 0);
			const currentYear = now.getFullYear();
			const pad = (n: number) => String(n).padStart(2, '0');
			const results: UpcomingHoliday[] = [];

			for (const yr of [currentYear, currentYear + 1]) {
				// Merge base + year-specific; year-specific wins for the same day
				const holidayMap = new Map<string, SolarHolidayDef>();
				for (const h of base) holidayMap.set(`${h.month}-${h.day}`, h);
				for (const h of byYear[yr] ?? []) holidayMap.set(`${h.month}-${h.day}`, h);

				for (const h of holidayMap.values()) {
					const date = new Date(yr, h.month - 1, h.day);
					const daysUntil = Math.round(
						(date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
					);
					if (daysUntil >= 0) {
						results.push({
							name: h.name,
							solarDate: `${pad(h.day)}/${pad(h.month)}`,
							solarDay: h.day,
							solarMonth: h.month,
							solarYear: yr,
							daysUntil,
						});
					}
				}
			}

			results.sort(
				(a, b) =>
					a.daysUntil - b.daysUntil ||
					a.solarMonth - b.solarMonth ||
					a.solarDay - b.solarDay
			);
			return results;
		},
	};
}
