// South Korea Holiday Calendar
// Holiday data sourced from Korean government calendars (월력요항)
// Only the data lives here — the calendar logic is shared in solar-holidays.ts

import { createSolarHolidayCalendar, type SolarHolidayDef } from '$lib/solar-holidays';

// Fixed solar holidays that apply every year
const KR_BASE: SolarHolidayDef[] = [
	{ month: 1,  day: 1,  name: 'Tết Dương lịch',              offWork: true },
	{ month: 3,  day: 1,  name: 'Ngày Phong trào Độc lập 1/3', offWork: true },
	{ month: 5,  day: 5,  name: 'Ngày Thiếu nhi',              offWork: true },
	{ month: 6,  day: 6,  name: 'Ngày Tưởng niệm',             offWork: true },
	{ month: 8,  day: 15, name: 'Ngày Quang phục',             offWork: true },
	{ month: 10, day: 3,  name: 'Ngày Lập quốc',               offWork: true },
	{ month: 10, day: 9,  name: 'Ngày Chữ Hangul',             offWork: true },
	{ month: 12, day: 25, name: 'Giáng Sinh',                  offWork: true },
];

// Year-specific holidays: Seollal, Buddha's Birthday, Chuseok, elections,
// substitute days, and (from 2026) Labour Day and Constitution Day
// TODO: Add data for 2028+
const KR_YEAR: Record<number, SolarHolidayDef[]> = {
	2025: [
		{ month: 1,  day: 27, name: 'Nghỉ tạm thời Tết Seollal',        offWork: true },
		{ month: 1,  day: 28, name: 'Đêm Giao thừa',                     offWork: true },
		{ month: 1,  day: 29, name: 'Tết Seollal',                       offWork: true },
		{ month: 1,  day: 30, name: 'Mùng 2 Tết',                        offWork: true },
		{ month: 3,  day: 3,  name: 'Nghỉ bù Phong trào Độc lập 1/3',   offWork: true },
		{ month: 5,  day: 5,  name: 'Ngày Thiếu nhi + Lễ Phật Đản',     offWork: true },
		{ month: 5,  day: 6,  name: 'Nghỉ bù Lễ Phật Đản',              offWork: true },
		{ month: 6,  day: 3,  name: 'Bầu cử Tổng thống',                offWork: true },
		{ month: 10, day: 5,  name: 'Trước Tết Chuseok',                 offWork: true },
		{ month: 10, day: 6,  name: 'Tết Chuseok',                       offWork: true },
		{ month: 10, day: 7,  name: 'Sau Tết Chuseok',                   offWork: true },
		{ month: 10, day: 8,  name: 'Nghỉ bù Tết Chuseok',              offWork: true },
	],
	2026: [
		{ month: 2,  day: 16, name: 'Đêm Giao thừa',                     offWork: true },
		{ month: 2,  day: 17, name: 'Tết Seollal',                       offWork: true },
		{ month: 2,  day: 18, name: 'Mùng 2 Tết',                        offWork: true },
		{ month: 3,  day: 2,  name: 'Nghỉ bù Phong trào Độc lập 1/3',   offWork: true },
		{ month: 5,  day: 1,  name: 'Ngày Lao động',                     offWork: true },
		{ month: 5,  day: 24, name: 'Lễ Phật Đản',                       offWork: true },
		{ month: 5,  day: 25, name: 'Nghỉ bù Lễ Phật Đản',              offWork: true },
		{ month: 6,  day: 3,  name: 'Bầu cử địa phương',                offWork: true },
		{ month: 7,  day: 17, name: 'Ngày Hiến pháp',                    offWork: true },
		{ month: 8,  day: 17, name: 'Nghỉ bù Ngày Quang phục',          offWork: true },
		{ month: 9,  day: 24, name: 'Trước Tết Chuseok',                 offWork: true },
		{ month: 9,  day: 25, name: 'Tết Chuseok',                       offWork: true },
		{ month: 9,  day: 26, name: 'Sau Tết Chuseok',                   offWork: true },
		{ month: 10, day: 5,  name: 'Nghỉ bù Ngày Lập quốc',            offWork: true },
	],
	// Korea uses UTC+9, so Seollal 2027 falls one day after Vietnam / China
	2027: [
		{ month: 2,  day: 6,  name: 'Đêm Giao thừa',                     offWork: true },
		{ month: 2,  day: 7,  name: 'Tết Seollal',                       offWork: true },
		{ month: 2,  day: 8,  name: 'Mùng 2 Tết',                        offWork: true },
		{ month: 2,  day: 9,  name: 'Nghỉ bù Tết Seollal',              offWork: true },
		{ month: 5,  day: 1,  name: 'Ngày Lao động',                     offWork: true },
		{ month: 5,  day: 3,  name: 'Nghỉ bù Ngày Lao động',            offWork: true },
		{ month: 5,  day: 13, name: 'Lễ Phật Đản',                       offWork: true },
		{ month: 7,  day: 17, name: 'Ngày Hiến pháp',                    offWork: true },
		{ month: 7,  day: 19, name: 'Nghỉ bù Ngày Hiến pháp',           offWork: true },
		{ month: 8,  day: 16, name: 'Nghỉ bù Ngày Quang phục',          offWork: true },
		{ month: 9,  day: 14, name: 'Trước Tết Chuseok',                 offWork: true },
		{ month: 9,  day: 15, name: 'Tết Chuseok',                       offWork: true },
		{ month: 9,  day: 16, name: 'Sau Tết Chuseok',                   offWork: true },
		{ month: 10, day: 4,  name: 'Nghỉ bù Ngày Lập quốc',            offWork: true },
		{ month: 10, day: 11, name: 'Nghỉ bù Ngày Chữ Hangul',          offWork: true },
		{ month: 12, day: 27, name: 'Nghỉ bù Giáng Sinh',               offWork: true },
	],
};

export const krCalendar = createSolarHolidayCalendar(KR_BASE, KR_YEAR);
