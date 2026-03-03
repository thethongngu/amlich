// Taiwan Holiday Calendar
// Holiday data sourced from officeholidays.com and DGPA (Taiwan)
// Reuses lunar date display logic from calendar.ts

import {
	getDateInfo,
	getCalendarDays,
	type TodayInfo,
	type CalendarDay,
	type UpcomingHoliday,
} from '$lib/calendar';

interface TWHolidayDef {
	day: number;
	month: number;
	name: string;
	offWork: boolean;
}

// Fixed solar holidays that apply every year
const TW_BASE: TWHolidayDef[] = [
	{ month: 1, day: 1, name: 'Quốc Khánh ROC', offWork: true },
	{ month: 2, day: 28, name: 'Ngày Tưởng niệm Hòa bình', offWork: true },
	{ month: 4, day: 4, name: 'Ngày Thiếu nhi', offWork: true },
	{ month: 5, day: 1, name: 'Quốc tế Lao động', offWork: true },
	{ month: 9, day: 28, name: 'Ngày Nhà giáo', offWork: true },
	{ month: 10, day: 10, name: 'Quốc Khánh Đài Loan', offWork: true },
	{ month: 10, day: 25, name: 'Ngày Quang phục', offWork: true },
	{ month: 12, day: 25, name: 'Ngày Hiến pháp', offWork: true },
];

// Year-specific holidays: CNY period, Qingming, Dragon Boat, Mid-Autumn, compensatory days
// Source: officeholidays.com/countries/taiwan
const TW_YEAR: Record<number, TWHolidayDef[]> = {
	2025: [
		{ month: 1, day: 27, name: 'Nghỉ bù Tết Nguyên Đán', offWork: true },
		{ month: 1, day: 28, name: 'Đêm Giao thừa', offWork: true },
		{ month: 1, day: 29, name: 'Tết Nguyên Đán', offWork: true },
		{ month: 1, day: 30, name: 'Mùng 2 Tết', offWork: true },
		{ month: 1, day: 31, name: 'Mùng 3 Tết', offWork: true },
		{ month: 4, day: 3, name: 'Nghỉ bù Thiếu nhi + Thanh Minh', offWork: true },
		{ month: 5, day: 30, name: 'Tết Đoan Ngọ', offWork: true },
		{ month: 9, day: 29, name: 'Nghỉ bù Ngày Nhà giáo', offWork: true },
		{ month: 10, day: 6, name: 'Tết Trung Thu', offWork: true },
		{ month: 10, day: 24, name: 'Nghỉ bù Ngày Quang phục', offWork: true },
	],
	2026: [
		{ month: 2, day: 15, name: 'Nghỉ bù Tết Nguyên Đán', offWork: true },
		{ month: 2, day: 16, name: 'Đêm Giao thừa', offWork: true },
		{ month: 2, day: 17, name: 'Tết Nguyên Đán', offWork: true },
		{ month: 2, day: 18, name: 'Mùng 2 Tết', offWork: true },
		{ month: 2, day: 19, name: 'Mùng 3 Tết', offWork: true },
		{ month: 2, day: 20, name: 'Nghỉ bù Tết Nguyên Đán', offWork: true },
		{ month: 2, day: 27, name: 'Nghỉ bù Tưởng niệm Hòa bình', offWork: true },
		{ month: 4, day: 3, name: 'Nghỉ bù Ngày Thiếu nhi', offWork: true },
		{ month: 4, day: 5, name: 'Thanh Minh', offWork: true },
		{ month: 4, day: 6, name: 'Nghỉ bù Thanh Minh', offWork: true },
		{ month: 6, day: 19, name: 'Tết Đoan Ngọ', offWork: true },
		{ month: 9, day: 25, name: 'Tết Trung Thu', offWork: true },
		{ month: 10, day: 9, name: 'Nghỉ bù Quốc Khánh Đài Loan', offWork: true },
		{ month: 10, day: 26, name: 'Nghỉ bù Ngày Quang phục', offWork: true },
	],
};

function findTWHoliday(day: number, month: number, year: number): TWHolidayDef | undefined {
	const yearSpecific = TW_YEAR[year]?.find((h) => h.day === day && h.month === month);
	if (yearSpecific) return yearSpecific;
	return TW_BASE.find((h) => h.day === day && h.month === month);
}

export function getDateInfoTW(d: number, m: number, y: number): TodayInfo {
	const base = getDateInfo(d, m, y);
	const holiday = findTWHoliday(d, m, y);
	return {
		...base,
		holiday: holiday?.name,
		holidayType: holiday ? 'solar' : undefined,
		isOffWork: holiday?.offWork ?? false,
	};
}

export function getTodayInfoTW(): TodayInfo {
	const now = new Date();
	return getDateInfoTW(now.getDate(), now.getMonth() + 1, now.getFullYear());
}

export function getCalendarDaysTW(solarMonth: number, solarYear: number): CalendarDay[] {
	return getCalendarDays(solarMonth, solarYear).map((day) => {
		if (!day.isCurrentMonth) return day;
		const holiday = findTWHoliday(day.solarDay, solarMonth, solarYear);
		return {
			...day,
			holiday: holiday?.name,
			isOffWork: holiday?.offWork ?? false,
		};
	});
}

export function getUpcomingHolidaysTW(): UpcomingHoliday[] {
	const now = new Date();
	now.setHours(0, 0, 0, 0);
	const currentYear = now.getFullYear();
	const pad = (n: number) => String(n).padStart(2, '0');
	const results: UpcomingHoliday[] = [];

	for (const yr of [currentYear, currentYear + 1]) {
		// Merge base + year-specific; year-specific takes precedence for same day
		const holidayMap = new Map<string, TWHolidayDef>();
		for (const h of TW_BASE) holidayMap.set(`${h.month}-${h.day}`, h);
		for (const h of TW_YEAR[yr] ?? []) holidayMap.set(`${h.month}-${h.day}`, h);

		for (const h of holidayMap.values()) {
			const date = new Date(yr, h.month - 1, h.day);
			const daysUntil = Math.round((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
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

	results.sort((a, b) => a.daysUntil - b.daysUntil || a.solarMonth - b.solarMonth || a.solarDay - b.solarDay);
	return results;
}
