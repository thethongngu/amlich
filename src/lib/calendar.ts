export const DAY_NAMES_SHORT = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export const DAY_NAMES_FULL = [
	'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'
];

export const LUNAR_MONTH_NAMES: Record<number, string> = {
	1: 'Giêng', 2: 'Hai', 3: 'Ba', 4: 'Tư', 5: 'Năm', 6: 'Sáu',
	7: 'Bảy', 8: 'Tám', 9: 'Chín', 10: 'Mười', 11: 'M.Một', 12: 'Chạp'
};

interface LunarInfo {
	day: number;
	month: number;
	yearName: string;
}

interface HolidayDef {
	name: string;
	day: number;
	month: number;
}

const LUNAR_HOLIDAYS: HolidayDef[] = [
	{ name: 'Tết Nguyên Đán', day: 1, month: 1 },
	{ name: 'Mùng 2 Tết', day: 2, month: 1 },
	{ name: 'Mùng 3 Tết', day: 3, month: 1 },
	{ name: 'Rằm Tháng Giêng', day: 15, month: 1 },
	{ name: 'Giỗ Tổ Hùng Vương', day: 10, month: 3 },
	{ name: 'Tết Đoan Ngọ', day: 5, month: 5 },
	{ name: 'Vu Lan', day: 15, month: 7 },
	{ name: 'Tết Trung Thu', day: 15, month: 8 },
	{ name: 'Ông Táo', day: 23, month: 12 },
	{ name: 'Giao Thừa', day: 30, month: 12 },
];

function findHoliday(lunarDay: number, lunarMonth: number): string | undefined {
	return LUNAR_HOLIDAYS.find(h => h.day === lunarDay && h.month === lunarMonth)?.name;
}

// Hardcoded lunar conversion for February 2026
// Tết Nguyên Đán 2026 = Feb 17 (1/1 Âm Lịch, năm Bính Ngọ)
// Tháng Chạp (month 12) of Ất Tỵ has 30 days
// Feb 1 = 15/12, Feb 9 = 23/12 (Ông Táo), Feb 16 = 30/12, Feb 17 = 1/1
function toLunar(solarDay: number): LunarInfo {
	if (solarDay <= 16) {
		return { day: solarDay + 14, month: 12, yearName: 'Ất Tỵ' };
	}
	return { day: solarDay - 16, month: 1, yearName: 'Bính Ngọ' };
}

export interface TodayInfo {
	dayOfWeek: string;
	solarDay: number;
	solarMonth: number;
	solarYear: number;
	lunarDay: number;
	lunarMonth: number;
	lunarMonthName: string;
	lunarYearName: string;
	holiday?: string;
	daysUntilTet: number;
}

export function getTodayInfo(): TodayInfo {
	const now = new Date();
	const dow = (now.getDay() + 6) % 7; // Monday = 0
	const d = now.getDate();
	const m = now.getMonth() + 1;
	const y = now.getFullYear();
	const lunar = toLunar(d);

	return {
		dayOfWeek: DAY_NAMES_FULL[dow],
		solarDay: d,
		solarMonth: m,
		solarYear: y,
		lunarDay: lunar.day,
		lunarMonth: lunar.month,
		lunarMonthName: LUNAR_MONTH_NAMES[lunar.month],
		lunarYearName: lunar.yearName,
		holiday: findHoliday(lunar.day, lunar.month),
		daysUntilTet: 17 - d,
	};
}

export interface CalendarDay {
	solarDay: number;
	lunarDay: number;
	lunarMonth: number;
	isToday: boolean;
	isCurrentMonth: boolean;
	holiday?: string;
	isWeekend: boolean;
}

export function getCalendarDays(): CalendarDay[] {
	const today = new Date().getDate();
	const firstDay = new Date(2026, 1, 1); // Feb 1, 2026
	const daysInMonth = 28;
	const startOffset = (firstDay.getDay() + 6) % 7; // Monday-based

	const days: CalendarDay[] = [];

	for (let i = 0; i < startOffset; i++) {
		days.push({
			solarDay: 0, lunarDay: 0, lunarMonth: 0,
			isToday: false, isCurrentMonth: false, isWeekend: false,
		});
	}

	for (let d = 1; d <= daysInMonth; d++) {
		const lunar = toLunar(d);
		const dayOfWeek = (startOffset + d - 1) % 7; // 0=Mon, 6=Sun
		days.push({
			solarDay: d,
			lunarDay: lunar.day,
			lunarMonth: lunar.month,
			isToday: d === today,
			isCurrentMonth: true,
			holiday: findHoliday(lunar.day, lunar.month),
			isWeekend: dayOfWeek === 5 || dayOfWeek === 6,
		});
	}

	return days;
}

export interface UpcomingHoliday {
	name: string;
	solarDate: string;
	lunarDate: string;
	daysUntil: number;
}

export function getUpcomingHolidays(): UpcomingHoliday[] {
	const today = new Date().getDate();

	const allHolidays = [
		{ name: 'Ông Táo', solar: 9, lunarDate: '23 Tháng Chạp' },
		{ name: 'Giao Thừa', solar: 16, lunarDate: '30 Tháng Chạp' },
		{ name: 'Tết Nguyên Đán', solar: 17, lunarDate: '01 Tháng Giêng' },
		{ name: 'Mùng 2 Tết', solar: 18, lunarDate: '02 Tháng Giêng' },
		{ name: 'Mùng 3 Tết', solar: 19, lunarDate: '03 Tháng Giêng' },
	];

	return allHolidays
		.filter(h => h.solar >= today)
		.map(h => ({
			name: h.name,
			solarDate: `${String(h.solar).padStart(2, '0')}/02`,
			lunarDate: h.lunarDate,
			daysUntil: h.solar - today,
		}));
}
