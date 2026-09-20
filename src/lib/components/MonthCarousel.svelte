<script lang="ts">
    import { tick } from "svelte";
    import MonthGrid from "./MonthGrid.svelte";
    import type { DayCell } from "$lib/holidays";

    /**
     * Phone month grid you can drag. Three months sit side by side and the
     * track follows the finger; on release it settles onto whichever month is
     * closest, then tells the parent to advance.
     */
    let {
        prevDays,
        days,
        nextDays,
        selectedDay,
        selectedMonth,
        selectedYear,
        onselect,
        onshift,
    }: {
        prevDays: DayCell[];
        days: DayCell[];
        nextDays: DayCell[];
        selectedDay: number;
        selectedMonth: number;
        selectedYear: number;
        onselect: (day: number, month: number, year: number) => void;
        onshift: (delta: number) => void;
    } = $props();

    const SLIDE_MS = 240;
    /** Movement needed before the gesture commits to an axis. */
    const AXIS_LOCK = 6;
    /** Below this the gesture was a tap with jitter, so the cell still opens. */
    const TAP_SLOP = 12;
    /** A flick this fast turns the page however short the drag was. */
    const FLICK_SPEED = 0.35;

    let viewport: HTMLDivElement | null = $state(null);
    let offset = $state(0);
    let sliding = $state(false);

    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let maxTravel = 0;
    /** "y" also stands for any gesture that is not ours to handle. */
    let axis: "x" | "y" | null = null;
    let unswallow: ReturnType<typeof setTimeout> | undefined;

    function onTouchStart(e: TouchEvent) {
        if (sliding || e.touches.length !== 1) {
            axis = "y";
            return;
        }
        axis = null;
        maxTravel = 0;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startTime = e.timeStamp;
    }

    function onTouchMove(e: TouchEvent) {
        if (axis === "y" || e.touches.length !== 1) return;
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
        if (axis === null) {
            if (Math.abs(dx) < AXIS_LOCK && Math.abs(dy) < AXIS_LOCK) return;
            axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        }
        if (axis !== "x") return;
        maxTravel = Math.max(maxTravel, Math.abs(dx));
        offset = dx;
    }

    function onTouchEnd(e: TouchEvent) {
        if (axis !== "x") return;
        axis = null;
        if (maxTravel > TAP_SLOP) swallowNextClick();
        const travelled = Math.abs(offset);
        const width = viewport?.clientWidth ?? 0;
        const speed = travelled / Math.max(e.timeStamp - startTime, 1);
        const turns =
            speed > FLICK_SPEED || travelled > Math.max(56, width * 0.2);
        settle(turns ? (offset < 0 ? 1 : -1) : 0);
    }

    function onTouchCancel() {
        if (axis === "x") settle(0);
        axis = null;
    }

    async function settle(dir: number) {
        if (dir === 0 && offset === 0) return;
        sliding = true;
        offset = -dir * (viewport?.clientWidth ?? 0);
        await new Promise((resolve) => setTimeout(resolve, SLIDE_MS));
        if (dir !== 0) {
            onshift(dir);
            await tick();
        }
        // Dropping `sliding` in the same update kills the transition, so the
        // track snaps back to the middle pane without animating.
        sliding = false;
        offset = 0;
    }

    /** A drag that ends on a day cell would otherwise open that day. */
    function swallowNextClick() {
        viewport?.addEventListener("click", stopClick, {
            capture: true,
            once: true,
        });
        clearTimeout(unswallow);
        unswallow = setTimeout(
            () =>
                viewport?.removeEventListener("click", stopClick, {
                    capture: true,
                }),
            400,
        );
    }

    function stopClick(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
    }

    export function slide(dir: number) {
        if (!sliding) settle(dir);
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="viewport"
    bind:this={viewport}
    ontouchstart={onTouchStart}
    ontouchmove={onTouchMove}
    ontouchend={onTouchEnd}
    ontouchcancel={onTouchCancel}
>
    <div
        class="track"
        class:sliding
        style:transform="translate3d(calc(-100% + {offset}px), 0, 0)"
    >
        <div class="pane" inert>
            <MonthGrid
                days={prevDays}
                {selectedDay}
                {selectedMonth}
                {selectedYear}
                large
                {onselect}
            />
        </div>
        <div class="pane">
            <MonthGrid
                {days}
                {selectedDay}
                {selectedMonth}
                {selectedYear}
                large
                {onselect}
            />
        </div>
        <div class="pane" inert>
            <MonthGrid
                days={nextDays}
                {selectedDay}
                {selectedMonth}
                {selectedYear}
                large
                {onselect}
            />
        </div>
    </div>
</div>

<style>
    /* Bleeds into the page gutter so a month slides in from the screen edge;
       pan-y hands vertical scrolling back to the browser and keeps the
       horizontal axis for the drag. */
    .viewport {
        overflow: hidden;
        touch-action: pan-y;
        margin: 0 calc(-1 * var(--gutter, 0px));
    }

    .track {
        display: flex;
        will-change: transform;
    }

    .track.sliding {
        transition: transform 240ms cubic-bezier(0.22, 0.61, 0.36, 1);
    }

    .pane {
        flex: 0 0 100%;
        box-sizing: border-box;
        padding: 0 var(--gutter, 0px);
    }
</style>
