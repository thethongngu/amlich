<script lang="ts">
    import MonthGrid from "./MonthGrid.svelte";
    import CalendarNav from "./CalendarNav.svelte";
    import type { DayCell } from "$lib/holidays";

    /** Single-month card used on phones / narrow desktops. */
    let {
        month,
        year,
        days,
        selectedDay,
        selectedMonth,
        selectedYear,
        todayActive,
        gold = false,
        onselect,
        onprev,
        onnext,
        onToday,
        onPickMonth,
    }: {
        month: number;
        year: number;
        days: DayCell[];
        selectedDay: number;
        selectedMonth: number;
        selectedYear: number;
        todayActive: boolean;
        gold?: boolean;
        onselect: (day: number, month: number, year: number) => void;
        onprev: () => void;
        onnext: () => void;
        onToday: () => void;
        onPickMonth: (month: number) => void;
    } = $props();

    let showMonthPicker = $state(false);

    function pick(m: number) {
        onPickMonth(m);
        showMonthPicker = false;
    }

    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (showMonthPicker && !target.closest(".cal-title-wrap")) {
            showMonthPicker = false;
        }
    }
</script>

<svelte:window onclick={handleClickOutside} />

<section class="cal" class:gold-shine={gold}>
    <div class="cal-header">
        <div class="cal-title-wrap">
            <button
                class="cal-title"
                onclick={() => (showMonthPicker = !showMonthPicker)}
            >
                Tháng {month}, {year}
            </button>
            {#if showMonthPicker}
                <div class="month-picker">
                    {#each Array.from({ length: 12 }, (_, i) => i + 1) as m}
                        <button
                            class="month-btn"
                            class:active={m === month}
                            onclick={() => pick(m)}
                        >
                            {m}
                        </button>
                    {/each}
                </div>
            {/if}
        </div>
        <CalendarNav
            {todayActive}
            {onprev}
            {onnext}
            {onToday}
            prevLabel="Tháng trước"
            nextLabel="Tháng sau"
        />
    </div>

    <MonthGrid
        {days}
        {selectedDay}
        {selectedMonth}
        {selectedYear}
        {onselect}
    />
</section>

<style>
    .cal {
        background: var(--surface);
        border-radius: var(--card-radius);
        padding: 18px;
        box-shadow: var(--card-shadow);
        height: 100%;
        box-sizing: border-box;
    }

    .cal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 14px;
    }

    .cal-title-wrap {
        position: relative;
    }

    .cal-title {
        font-size: 0.95rem;
        font-weight: 600;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text);
        padding: 4px 8px;
        margin-left: -8px;
        border-radius: 8px;
        font-family: inherit;
    }

    .cal-title:hover {
        background: var(--surface-hover);
    }

    .month-picker {
        display: grid;
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 4px;
        background: var(--surface);
        border-radius: 12px;
        box-shadow: var(--popover-shadow);
        padding: 8px;
        grid-template-columns: repeat(4, 1fr);
        gap: 4px;
        z-index: 10;
    }

    .month-btn {
        width: 40px;
        height: 36px;
        border: none;
        background: none;
        border-radius: 8px;
        font-family: inherit;
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--text-muted);
        cursor: pointer;
        transition: background 0.1s;
        touch-action: manipulation;
    }

    .month-btn:hover {
        background: var(--surface-hover);
    }

    .month-btn.active {
        background: var(--accent-strong);
        color: #fff;
        font-weight: 600;
    }

    @media (min-width: 768px) {
        .cal {
            padding: 28px;
        }

        .cal-title {
            font-size: 1.05rem;
        }
    }
</style>
