<script lang="ts">
    import MonthGrid from "./MonthGrid.svelte";
    import CalendarNav from "./CalendarNav.svelte";
    import CountryPicker from "./CountryPicker.svelte";
    import type { DayCell } from "$lib/holidays";
    import type { Country, CountryCode } from "$lib/countries";

    /** Single-month card used on phones / narrow desktops. */
    let {
        month,
        year,
        days,
        selectedCodes,
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
        ontoggleCountry,
    }: {
        month: number;
        year: number;
        days: DayCell[];
        selectedCodes: CountryCode[];
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
        ontoggleCountry: (country: Country) => void;
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
                <span class="t-month">Tháng {month}</span>
                <span class="t-year">{year}</span>
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

    <div class="cal-footer">
        <CountryPicker {selectedCodes} ontoggle={ontoggleCountry} />
    </div>
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
        gap: 10px;
        margin-bottom: 14px;
    }

    .cal-title-wrap {
        position: relative;
    }

    .cal-title {
        display: inline-flex;
        align-items: baseline;
        gap: 8px;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--text);
        padding: 4px 8px;
        margin-left: -8px;
        border-radius: 10px;
        font-family: inherit;
        transition: background 0.15s;
    }

    .cal-title:hover {
        background: var(--surface-sunken);
    }

    .t-month {
        font-size: 0.72rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: var(--text-secondary);
    }

    .t-year {
        font-family: var(--font-display);
        font-size: 1.25rem;
        font-weight: 400;
        line-height: 1;
    }

    .cal-footer {
        display: flex;
        justify-content: center;
        padding-top: 14px;
    }

    .month-picker {
        display: grid;
        position: absolute;
        top: 100%;
        left: 0;
        margin-top: 4px;
        background: var(--surface);
        border-radius: 14px;
        box-shadow: var(--popover-shadow);
        padding: 8px;
        grid-template-columns: repeat(4, 1fr);
        gap: 4px;
        z-index: 30;
    }

    .month-btn {
        width: 40px;
        height: 36px;
        border: none;
        background: none;
        border-radius: 10px;
        font-family: inherit;
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--text-secondary);
        cursor: pointer;
        transition: background 0.1s;
        touch-action: manipulation;
    }

    .month-btn:hover {
        background: var(--surface-sunken);
    }

    .month-btn.active {
        background: var(--today-bg);
        color: var(--today-fg);
        font-weight: 600;
    }

    @media (min-width: 768px) {
        .cal {
            padding: 26px;
        }

        .t-year {
            font-size: 1.45rem;
        }
    }
</style>
