// Japan Holiday Calendar
// Holiday data sourced from the Cabinet Office (内閣府「国民の祝日」)
// Only the data lives here — the calendar logic is shared in solar-holidays.ts

import { createSolarHolidayCalendar, type SolarHolidayDef } from '$lib/solar-holidays';

// Fixed solar holidays that apply every year
const JP_BASE: SolarHolidayDef[] = [
	{ month: 1,  day: 1,  name: 'Tết Dương lịch',        offWork: true },
	{ month: 2,  day: 11, name: 'Ngày Kiến quốc',        offWork: true },
	{ month: 2,  day: 23, name: 'Sinh nhật Thiên hoàng', offWork: true },
	{ month: 4,  day: 29, name: 'Ngày Chiêu Hòa',        offWork: true },
	{ month: 5,  day: 3,  name: 'Ngày Hiến pháp',        offWork: true },
	{ month: 5,  day: 4,  name: 'Ngày Cây xanh',         offWork: true },
	{ month: 5,  day: 5,  name: 'Ngày Thiếu nhi',        offWork: true },
	{ month: 8,  day: 11, name: 'Ngày của Núi',          offWork: true },
	{ month: 11, day: 3,  name: 'Ngày Văn hóa',          offWork: true },
	{ month: 11, day: 23, name: 'Ngày Cảm tạ Lao động',  offWork: true },
];

// Year-specific holidays: Happy Monday days, equinoxes, substitute days,
// and citizen's holidays (a weekday between two holidays)
// TODO: Add data for 2028+
const JP_YEAR: Record<number, SolarHolidayDef[]> = {
	2025: [
		{ month: 1,  day: 13, name: 'Ngày Thành nhân',                offWork: true },
		{ month: 2,  day: 24, name: 'Nghỉ bù Sinh nhật Thiên hoàng',  offWork: true },
		{ month: 3,  day: 20, name: 'Ngày Xuân phân',                 offWork: true },
		{ month: 5,  day: 6,  name: 'Nghỉ bù Ngày Cây xanh',          offWork: true },
		{ month: 7,  day: 21, name: 'Ngày của Biển',                  offWork: true },
		{ month: 9,  day: 15, name: 'Ngày Kính lão',                  offWork: true },
		{ month: 9,  day: 23, name: 'Ngày Thu phân',                  offWork: true },
		{ month: 10, day: 13, name: 'Ngày Thể thao',                  offWork: true },
		{ month: 11, day: 24, name: 'Nghỉ bù Ngày Cảm tạ Lao động',   offWork: true },
	],
	2026: [
		{ month: 1,  day: 12, name: 'Ngày Thành nhân',                offWork: true },
		{ month: 3,  day: 20, name: 'Ngày Xuân phân',                 offWork: true },
		{ month: 5,  day: 6,  name: 'Nghỉ bù Ngày Hiến pháp',         offWork: true },
		{ month: 7,  day: 20, name: 'Ngày của Biển',                  offWork: true },
		{ month: 9,  day: 21, name: 'Ngày Kính lão',                  offWork: true },
		{ month: 9,  day: 22, name: 'Ngày nghỉ Quốc dân',             offWork: true },
		{ month: 9,  day: 23, name: 'Ngày Thu phân',                  offWork: true },
		{ month: 10, day: 12, name: 'Ngày Thể thao',                  offWork: true },
	],
	2027: [
		{ month: 1,  day: 11, name: 'Ngày Thành nhân',                offWork: true },
		{ month: 3,  day: 21, name: 'Ngày Xuân phân',                 offWork: true },
		{ month: 3,  day: 22, name: 'Nghỉ bù Ngày Xuân phân',         offWork: true },
		{ month: 7,  day: 19, name: 'Ngày của Biển',                  offWork: true },
		{ month: 9,  day: 20, name: 'Ngày Kính lão',                  offWork: true },
		{ month: 9,  day: 23, name: 'Ngày Thu phân',                  offWork: true },
		{ month: 10, day: 11, name: 'Ngày Thể thao',                  offWork: true },
	],
};

export const jpCalendar = createSolarHolidayCalendar(JP_BASE, JP_YEAR);
