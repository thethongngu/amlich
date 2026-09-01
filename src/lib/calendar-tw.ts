// Taiwan Holiday Calendar
// Holiday data sourced from officeholidays.com and DGPA (Taiwan)
// Only the data lives here — the calendar logic is shared in solar-holidays.ts

import { createSolarHolidayCalendar, type SolarHolidayDef } from '$lib/solar-holidays';

// Fixed solar holidays that apply every year
const TW_BASE: SolarHolidayDef[] = [
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
const TW_YEAR: Record<number, SolarHolidayDef[]> = {
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
	// Hành chính viện phê chuẩn lịch nghỉ năm 116 (2027) — tổng 121 ngày nghỉ
	// Nguồn: dgpa.gov.tw (人事行政總處)
	2027: [
		{ month: 2, day: 4, name: 'Đêm trước Giao thừa', offWork: true },
		{ month: 2, day: 5, name: 'Đêm Giao thừa', offWork: true },
		{ month: 2, day: 6, name: 'Tết Nguyên Đán', offWork: true },
		{ month: 2, day: 7, name: 'Mùng 2 Tết', offWork: true },
		{ month: 2, day: 8, name: 'Mùng 3 Tết', offWork: true },
		{ month: 2, day: 9, name: 'Nghỉ bù Tết Nguyên Đán', offWork: true },
		{ month: 2, day: 10, name: 'Nghỉ bù Tết Nguyên Đán', offWork: true },
		{ month: 3, day: 1, name: 'Nghỉ bù Tưởng niệm Hòa bình', offWork: true },
		{ month: 4, day: 5, name: 'Thanh Minh', offWork: true },
		{ month: 4, day: 6, name: 'Nghỉ bù Ngày Thiếu nhi', offWork: true },
		{ month: 4, day: 30, name: 'Nghỉ bù Quốc tế Lao động', offWork: true },
		{ month: 6, day: 9, name: 'Tết Đoan Ngọ', offWork: true },
		{ month: 9, day: 15, name: 'Tết Trung Thu', offWork: true },
		{ month: 10, day: 11, name: 'Nghỉ bù Quốc Khánh Đài Loan', offWork: true },
		{ month: 12, day: 24, name: 'Nghỉ bù Ngày Hiến pháp', offWork: true },
		{ month: 12, day: 31, name: 'Nghỉ bù Tết Dương lịch 2028', offWork: true },
	],
};

export const twCalendar = createSolarHolidayCalendar(TW_BASE, TW_YEAR);
