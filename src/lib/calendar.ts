// Vietnamese Lunar Calendar Algorithm
// Based on Ho Ngoc Duc's algorithm (https://www.xemamlich.uhm.vn/)
// Using astronomical formulae from Jean Meeus, "Astronomical Algorithms", 1998

const PI = Math.PI;
const TIMEZONE = 7; // Vietnam GMT+7

function INT(x: number): number {
	return Math.floor(x);
}

// ── Julian Day Number conversions ──

function jdFromDate(dd: number, mm: number, yy: number): number {
	const a = INT((14 - mm) / 12);
	const y = yy + 4800 - a;
	const m = mm + 12 * a - 3;
	let jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
	if (jd < 2299161) {
		jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
	}
	return jd;
}

function jdToDate(jd: number): [number, number, number] {
	let a: number, b: number, c: number;
	if (jd > 2299160) {
		a = jd + 32044;
		b = INT((4 * a + 3) / 146097);
		c = a - INT((b * 146097) / 4);
	} else {
		b = 0;
		c = jd + 32082;
	}
	const d = INT((4 * c + 3) / 1461);
	const e = c - INT((1461 * d) / 4);
	const m = INT((5 * e + 2) / 153);
	const day = e - INT((153 * m + 2) / 5) + 1;
	const month = m + 3 - 12 * INT(m / 10);
	const year = b * 100 + d - 4800 + INT(m / 10);
	return [day, month, year];
}

// ── New Moon (Sóc) calculation ──
// Returns Julian day number of the k-th new moon after 1/1/1900

function getNewMoonDay(k: number, timeZone: number): number {
	const T = k / 1236.85;
	const T2 = T * T;
	const T3 = T2 * T;
	const dr = PI / 180;
	let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
	Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
	const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
	const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
	const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
	let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
	C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
	C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
	C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
	C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
	C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
	C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
	let deltat: number;
	if (T < -11) {
		deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
	} else {
		deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
	}
	const JdNew = Jd1 + C1 - deltat;
	return INT(JdNew + 0.5 + timeZone / 24);
}

// ── Sun longitude (Trung khí) ──
// Returns the ecliptic longitude sector (0-11) of the sun at a given Julian day

function getSunLongitude(jdn: number, timeZone: number): number {
	const T = (jdn - 2451545.5 - timeZone / 24) / 36525;
	const T2 = T * T;
	const dr = PI / 180;
	const M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
	const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
	let DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
	DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
	let L = L0 + DL;
	L = L * dr;
	L = L - PI * 2 * INT(L / (PI * 2));
	return INT(L / PI * 6);
}

// ── Find start of lunar month 11 (contains Đông chí) ──

function getLunarMonth11(yy: number, timeZone: number): number {
	const off = jdFromDate(31, 12, yy) - 2415021;
	const k = INT(off / 29.530588853);
	let nm = getNewMoonDay(k, timeZone);
	const sunLong = getSunLongitude(nm, timeZone);
	if (sunLong >= 9) {
		nm = getNewMoonDay(k - 1, timeZone);
	}
	return nm;
}

// ── Find leap month offset ──

function getLeapMonthOffset(a11: number, timeZone: number): number {
	const k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
	let last = 0;
	let i = 1;
	let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
	do {
		last = arc;
		i++;
		arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
	} while (arc !== last && i < 14);
	return i - 1;
}

// ── Solar to Lunar conversion ──
// Returns [lunarDay, lunarMonth, lunarYear, lunarLeap]

function convertSolar2Lunar(dd: number, mm: number, yy: number, timeZone: number): [number, number, number, number] {
	const dayNumber = jdFromDate(dd, mm, yy);
	const k = INT((dayNumber - 2415021.076998695) / 29.530588853);
	let monthStart = getNewMoonDay(k + 1, timeZone);
	if (monthStart > dayNumber) {
		monthStart = getNewMoonDay(k, timeZone);
	}
	let a11 = getLunarMonth11(yy, timeZone);
	let b11 = a11;
	let lunarYear: number;
	if (a11 >= monthStart) {
		lunarYear = yy;
		a11 = getLunarMonth11(yy - 1, timeZone);
	} else {
		lunarYear = yy + 1;
		b11 = getLunarMonth11(yy + 1, timeZone);
	}
	const lunarDay = dayNumber - monthStart + 1;
	const diff = INT((monthStart - a11) / 29);
	let lunarLeap = 0;
	let lunarMonth = diff + 11;
	if (b11 - a11 > 365) {
		const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
		if (diff >= leapMonthDiff) {
			lunarMonth = diff + 10;
			if (diff === leapMonthDiff) {
				lunarLeap = 1;
			}
		}
	}
	if (lunarMonth > 12) {
		lunarMonth = lunarMonth - 12;
	}
	if (lunarMonth >= 11 && diff < 4) {
		lunarYear -= 1;
	}
	return [lunarDay, lunarMonth, lunarYear, lunarLeap];
}

// ── Lunar to Solar conversion ──
// Returns [day, month, year]

function convertLunar2Solar(lunarDay: number, lunarMonth: number, lunarYear: number, lunarLeap: number, timeZone: number): [number, number, number] {
	let a11: number, b11: number;
	if (lunarMonth < 11) {
		a11 = getLunarMonth11(lunarYear - 1, timeZone);
		b11 = getLunarMonth11(lunarYear, timeZone);
	} else {
		a11 = getLunarMonth11(lunarYear, timeZone);
		b11 = getLunarMonth11(lunarYear + 1, timeZone);
	}
	let off = lunarMonth - 11;
	if (off < 0) {
		off += 12;
	}
	if (b11 - a11 > 365) {
		const leapOff = getLeapMonthOffset(a11, timeZone);
		let leapMonth = leapOff - 2;
		if (leapMonth < 0) {
			leapMonth += 12;
		}
		if (lunarLeap !== 0 && lunarMonth !== leapMonth) {
			return [0, 0, 0];
		} else if (lunarLeap !== 0 || off >= leapOff) {
			off += 1;
		}
	}
	const k = INT(0.5 + (a11 - 2415021.076998695) / 29.530588853);
	const monthStart = getNewMoonDay(k + off, timeZone);
	return jdToDate(monthStart + lunarDay - 1);
}

// ── Can Chi (Heavenly Stems & Earthly Branches) ──

const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

function getCanChiYear(lunarYear: number): string {
	return `${CAN[(lunarYear + 6) % 10]} ${CHI[(lunarYear + 8) % 12]}`;
}

// ── Holiday definitions ──

export const DAY_NAMES_SHORT = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export const DAY_NAMES_FULL = [
	'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'
];

export const LUNAR_MONTH_NAMES: Record<number, string> = {
	1: 'Giêng', 2: 'Hai', 3: 'Ba', 4: 'Tư', 5: 'Năm', 6: 'Sáu',
	7: 'Bảy', 8: 'Tám', 9: 'Chín', 10: 'Mười', 11: 'M.Một', 12: 'Chạp'
};

interface HolidayDef {
	name: string;
	day: number;
	month: number;
}

const LUNAR_HOLIDAYS: HolidayDef[] = [
	{ name: 'Tết Nguyên Đán', day: 1, month: 1 },
	{ name: 'Mùng 2 Tết', day: 2, month: 1 },
	{ name: 'Mùng 3 Tết', day: 3, month: 1 },
	{ name: 'Giỗ Tổ Hùng Vương', day: 10, month: 3 },
];

const SOLAR_HOLIDAYS: HolidayDef[] = [
	{ name: 'Ngày Văn hóa Việt Nam', day: 19, month: 4 },
	{ name: 'Giải Phóng Miền Nam', day: 30, month: 4 },
	{ name: 'Quốc Tế Lao Động', day: 1, month: 5 },
	{ name: 'Quốc Khánh', day: 2, month: 9 },
];

function findHoliday(lunarDay: number, lunarMonth: number, solarDay: number, solarMonth: number): string | undefined {
	const lunar = LUNAR_HOLIDAYS.find(h => h.day === lunarDay && h.month === lunarMonth);
	if (lunar) return lunar.name;
	const solar = SOLAR_HOLIDAYS.find(h => h.day === solarDay && h.month === solarMonth);
	return solar?.name;
}

// ── Public API ──

export interface TodayInfo {
	dayOfWeek: string;
	solarDay: number;
	solarMonth: number;
	solarYear: number;
	lunarDay: number;
	lunarMonth: number;
	lunarYear: number;
	lunarYearName: string;
	lunarLeap: boolean;
	holiday?: string;
	daysUntilTet: number;
}

export function getTodayInfo(): TodayInfo {
	const now = new Date();
	const dow = (now.getDay() + 6) % 7;
	const d = now.getDate();
	const m = now.getMonth() + 1;
	const y = now.getFullYear();

	const [lunarDay, lunarMonth, lunarYear, lunarLeap] = convertSolar2Lunar(d, m, y, TIMEZONE);
	const todayJd = jdFromDate(d, m, y);

	// Find next Tết
	let daysUntilTet = 0;
	for (const yr of [lunarYear, lunarYear + 1]) {
		const tetSolar = convertLunar2Solar(1, 1, yr, 0, TIMEZONE);
		const tetJd = jdFromDate(tetSolar[0], tetSolar[1], tetSolar[2]);
		if (tetJd >= todayJd) {
			daysUntilTet = tetJd - todayJd;
			break;
		}
	}

	return {
		dayOfWeek: DAY_NAMES_FULL[dow],
		solarDay: d,
		solarMonth: m,
		solarYear: y,
		lunarDay,
		lunarMonth,
		lunarYear,
		lunarYearName: getCanChiYear(lunarYear),
		lunarLeap: lunarLeap === 1,
		holiday: findHoliday(lunarDay, lunarMonth, d, m),
		daysUntilTet,
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

export function getCalendarDays(solarMonth: number, solarYear: number): CalendarDay[] {
	const now = new Date();
	const todayDay = now.getDate();
	const todayMonth = now.getMonth() + 1;
	const todayYear = now.getFullYear();

	const firstDay = new Date(solarYear, solarMonth - 1, 1);
	const daysInMonth = new Date(solarYear, solarMonth, 0).getDate();
	const startOffset = (firstDay.getDay() + 6) % 7;

	const days: CalendarDay[] = [];

	for (let i = 0; i < startOffset; i++) {
		days.push({
			solarDay: 0, lunarDay: 0, lunarMonth: 0,
			isToday: false, isCurrentMonth: false, isWeekend: false,
		});
	}

	for (let d = 1; d <= daysInMonth; d++) {
		const [lunarDay, lunarMonth] = convertSolar2Lunar(d, solarMonth, solarYear, TIMEZONE);
		const dayOfWeek = (startOffset + d - 1) % 7;
		days.push({
			solarDay: d,
			lunarDay,
			lunarMonth,
			isToday: d === todayDay && solarMonth === todayMonth && solarYear === todayYear,
			isCurrentMonth: true,
			holiday: findHoliday(lunarDay, lunarMonth, d, solarMonth),
			isWeekend: dayOfWeek === 5 || dayOfWeek === 6,
		});
	}

	return days;
}

export interface UpcomingHoliday {
	name: string;
	solarDate: string;
	solarDay: number;
	solarMonth: number;
	solarYear: number;
	daysUntil: number;
}

export function getUpcomingHolidays(): UpcomingHoliday[] {
	const now = new Date();
	now.setHours(0, 0, 0, 0);
	const todayJd = jdFromDate(now.getDate(), now.getMonth() + 1, now.getFullYear());
	const [, , currentLunarYear] = convertSolar2Lunar(now.getDate(), now.getMonth() + 1, now.getFullYear(), TIMEZONE);
	const currentSolarYear = now.getFullYear();

	const pad = (n: number) => String(n).padStart(2, '0');
	const results: UpcomingHoliday[] = [];

	// Lunar holidays
	for (const h of LUNAR_HOLIDAYS) {
		for (const yr of [currentLunarYear, currentLunarYear + 1]) {
			const solar = convertLunar2Solar(h.day, h.month, yr, 0, TIMEZONE);
			if (solar[0] === 0) continue;
			const jd = jdFromDate(solar[0], solar[1], solar[2]);
			if (jd >= todayJd) {
				results.push({
					name: h.name,
					solarDate: `${pad(solar[0])}/${pad(solar[1])}`,
					solarDay: solar[0],
					solarMonth: solar[1],
					solarYear: solar[2],
					daysUntil: jd - todayJd,
				});
				break;
			}
		}
	}

	// Solar holidays
	for (const h of SOLAR_HOLIDAYS) {
		for (const yr of [currentSolarYear, currentSolarYear + 1]) {
			const jd = jdFromDate(h.day, h.month, yr);
			if (jd >= todayJd) {
				results.push({
					name: h.name,
					solarDate: `${pad(h.day)}/${pad(h.month)}`,
					solarDay: h.day,
					solarMonth: h.month,
					solarYear: yr,
					daysUntil: jd - todayJd,
				});
				break;
			}
		}
	}

	results.sort((a, b) => a.daysUntil - b.daysUntil);
	return results;
}
