// Hong Kong Holiday Calendar
// Holiday data sourced from gov.hk
// Reuses lunar date display logic from calendar.ts

import {
	getDateInfo,
	getCalendarDays,
	type TodayInfo,
	type CalendarDay,
	type UpcomingHoliday,
} from '$lib/calendar';

interface HKHolidayDef {
	day: number;
	month: number;
	name: string;
	offWork: boolean;
}

// Fixed solar holidays that apply every year
const HK_BASE: HKHolidayDef[] = [
	{ month: 1,  day: 1,  name: 'Tết Dương lịch',            offWork: true },
	{ month: 5,  day: 1,  name: 'Ngày Quốc tế Lao động',    offWork: true },
	{ month: 7,  day: 1,  name: 'Ngày thành lập HKSAR',     offWork: true },
	{ month: 10, day: 1,  name: 'Quốc Khánh Trung Quốc',    offWork: true },
	{ month: 12, day: 25, name: 'Giáng Sinh',                offWork: true },
];

// Year-specific holidays: CNY, Easter, Ching Ming, Dragon Boat, Mid-Autumn,
// Chung Yeung, Boxing Day, and compensatory days
// TODO: Add data for 2028+ (source: gov.hk, usually published ~May of prior year)
const HK_YEAR: Record<number, HKHolidayDef[]> = {
	2025: [
		{ month: 1,  day: 29, name: 'Mùng 1 Tết Âm lịch',               offWork: true },
		{ month: 1,  day: 30, name: 'Mùng 2 Tết Âm lịch',               offWork: true },
		{ month: 1,  day: 31, name: 'Mùng 3 Tết Âm lịch',               offWork: true },
		{ month: 4,  day: 4,  name: 'Tiết Thanh Minh',                   offWork: true },
		{ month: 4,  day: 18, name: 'Thứ Sáu Tuần Thánh (Good Friday)',  offWork: true },
		{ month: 4,  day: 19, name: 'Ngày sau Good Friday',              offWork: true },
		{ month: 4,  day: 21, name: 'Thứ Hai Phục Sinh (Easter Monday)', offWork: true },
		{ month: 5,  day: 5,  name: 'Ngày sinh Đức Phật',               offWork: true },
		{ month: 5,  day: 31, name: 'Tết Đoan Ngọ',                      offWork: true },
		{ month: 10, day: 7,  name: 'Ngày sau Tết Trung Thu',            offWork: true },
		{ month: 10, day: 30, name: 'Ngày sau Tết Trùng Dương',          offWork: true },
		{ month: 12, day: 26, name: 'Ngày sau Giáng Sinh',               offWork: true },
	],
	2026: [
		{ month: 2,  day: 17, name: 'Mùng 1 Tết Âm lịch',               offWork: true },
		{ month: 2,  day: 18, name: 'Mùng 2 Tết Âm lịch',               offWork: true },
		{ month: 2,  day: 19, name: 'Mùng 3 Tết Âm lịch',               offWork: true },
		{ month: 4,  day: 3,  name: 'Thứ Sáu Tuần Thánh (Good Friday)',  offWork: true },
		{ month: 4,  day: 4,  name: 'Ngày sau Good Friday',              offWork: true },
		{ month: 4,  day: 6,  name: 'Nghỉ bù Tiết Thanh Minh',          offWork: true },
		{ month: 4,  day: 7,  name: 'Nghỉ bù Thứ Hai Phục Sinh',        offWork: true },
		{ month: 5,  day: 25, name: 'Nghỉ bù Ngày sinh Đức Phật',       offWork: true },
		{ month: 6,  day: 19, name: 'Tết Đoan Ngọ',                      offWork: true },
		{ month: 9,  day: 26, name: 'Ngày sau Tết Trung Thu',            offWork: true },
		{ month: 10, day: 19, name: 'Nghỉ bù Tết Trùng Dương',          offWork: true },
		{ month: 12, day: 26, name: 'Ngày sau Giáng Sinh',               offWork: true },
	],
	2027: [
		{ month: 2,  day: 6,  name: 'Mùng 1 Tết Âm lịch',                   offWork: true },
		{ month: 2,  day: 8,  name: 'Nghỉ bù Mùng 2 Tết Âm lịch',           offWork: true },
		{ month: 2,  day: 9,  name: 'Mùng 3 Tết Âm lịch',                   offWork: true },
		{ month: 3,  day: 26, name: 'Thứ Sáu Tuần Thánh (Good Friday)',      offWork: true },
		{ month: 3,  day: 27, name: 'Ngày sau Good Friday',                  offWork: true },
		{ month: 3,  day: 29, name: 'Thứ Hai Phục Sinh (Easter Monday)',     offWork: true },
		{ month: 4,  day: 5,  name: 'Tiết Thanh Minh',                       offWork: true },
		{ month: 5,  day: 13, name: 'Ngày sinh Đức Phật',                   offWork: true },
		{ month: 6,  day: 9,  name: 'Tết Đoan Ngọ',                          offWork: true },
		{ month: 9,  day: 16, name: 'Ngày sau Tết Trung Thu',               offWork: true },
		{ month: 10, day: 8,  name: 'Tết Trùng Dương',                       offWork: true },
		{ month: 12, day: 27, name: 'Nghỉ bù ngày sau Giáng Sinh',          offWork: true },
	],
};

function findHKHoliday(day: number, month: number, year: number): HKHolidayDef | undefined {
	const yearSpecific = HK_YEAR[year]?.find((h) => h.day === day && h.month === month);
	if (yearSpecific) return yearSpecific;
	return HK_BASE.find((h) => h.day === day && h.month === month);
}

export function getDateInfoHK(d: number, m: number, y: number): TodayInfo {
	const base = getDateInfo(d, m, y);
	const holiday = findHKHoliday(d, m, y);
	return {
		...base,
		holiday: holiday?.name,
		holidayType: holiday ? 'solar' : undefined,
		isOffWork: holiday?.offWork ?? false,
	};
}

export function getTodayInfoHK(): TodayInfo {
	const now = new Date();
	return getDateInfoHK(now.getDate(), now.getMonth() + 1, now.getFullYear());
}

export function getCalendarDaysHK(solarMonth: number, solarYear: number): CalendarDay[] {
	return getCalendarDays(solarMonth, solarYear).map((day) => {
		if (!day.isCurrentMonth) return day;
		const holiday = findHKHoliday(day.solarDay, solarMonth, solarYear);
		return {
			...day,
			holiday: holiday?.name,
			isOffWork: holiday?.offWork ?? false,
		};
	});
}

export function getUpcomingHolidaysHK(): UpcomingHoliday[] {
	const now = new Date();
	now.setHours(0, 0, 0, 0);
	const currentYear = now.getFullYear();
	const pad = (n: number) => String(n).padStart(2, '0');
	const results: UpcomingHoliday[] = [];

	for (const yr of [currentYear, currentYear + 1]) {
		// Merge base + year-specific; year-specific takes precedence for same day
		const holidayMap = new Map<string, HKHolidayDef>();
		for (const h of HK_BASE) holidayMap.set(`${h.month}-${h.day}`, h);
		for (const h of HK_YEAR[yr] ?? []) holidayMap.set(`${h.month}-${h.day}`, h);

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
