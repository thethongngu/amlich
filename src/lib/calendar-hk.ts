// Hong Kong Holiday Calendar
// Holiday data sourced from gov.hk
// Only the data lives here — the calendar logic is shared in solar-holidays.ts

import { createSolarHolidayCalendar, type SolarHolidayDef } from '$lib/solar-holidays';

// Fixed solar holidays that apply every year
const HK_BASE: SolarHolidayDef[] = [
	{ month: 1,  day: 1,  name: 'Tết Dương lịch',            offWork: true },
	{ month: 5,  day: 1,  name: 'Ngày Quốc tế Lao động',    offWork: true },
	{ month: 7,  day: 1,  name: 'Ngày thành lập HKSAR',     offWork: true },
	{ month: 10, day: 1,  name: 'Quốc Khánh Trung Quốc',    offWork: true },
	{ month: 12, day: 25, name: 'Giáng Sinh',                offWork: true },
];

// Year-specific holidays: CNY, Easter, Ching Ming, Dragon Boat, Mid-Autumn,
// Chung Yeung, Boxing Day, and compensatory days
// TODO: Add data for 2028+ (source: gov.hk, usually published ~May of prior year)
const HK_YEAR: Record<number, SolarHolidayDef[]> = {
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
		{ month: 2,  day: 8,  name: 'Mùng 3 Tết Âm lịch',                   offWork: true },
		{ month: 2,  day: 9,  name: 'Nghỉ bù Mùng 2 Tết Âm lịch',           offWork: true },
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

export const hkCalendar = createSolarHolidayCalendar(HK_BASE, HK_YEAR);
