// Small localStorage-backed preferences (country selection lives in
// countries.ts, next to the data it refers to).

const SHOW_BOTH_KEY = 'amlich-show-both';
const COUNTDOWN_TYPE_KEY = 'amlich-countdown-type';
const SIDEBAR_KEY = 'amlich-sidebar-w';

export const SIDEBAR_MIN = 240;
export const SIDEBAR_MAX = 640;
export const SIDEBAR_DEFAULT = 320;

const hasStorage = () => typeof localStorage !== 'undefined';

/** Show the solar card next to the lunar one. */
export function readShowBoth(): boolean {
	return hasStorage() ? localStorage.getItem(SHOW_BOTH_KEY) !== 'false' : true;
}

export function writeShowBoth(value: boolean): void {
	if (hasStorage()) localStorage.setItem(SHOW_BOTH_KEY, String(value));
}

/** Count down in "Mondays left" instead of days. */
export function readShowMondays(): boolean {
	return hasStorage() ? localStorage.getItem(COUNTDOWN_TYPE_KEY) === 'mondays' : false;
}

export function writeShowMondays(value: boolean): void {
	if (hasStorage()) localStorage.setItem(COUNTDOWN_TYPE_KEY, value ? 'mondays' : 'days');
}

/** Width of the left column on wide screens. */
export function readSidebarWidth(): number {
	if (!hasStorage()) return SIDEBAR_DEFAULT;
	return clampSidebarWidth(Number(localStorage.getItem(SIDEBAR_KEY)) || SIDEBAR_DEFAULT);
}

export function writeSidebarWidth(width: number): void {
	if (hasStorage()) localStorage.setItem(SIDEBAR_KEY, String(Math.round(width)));
}

export function clampSidebarWidth(width: number): number {
	return Math.max(SIDEBAR_MIN, Math.min(SIDEBAR_MAX, width));
}
