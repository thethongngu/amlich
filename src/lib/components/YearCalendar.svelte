<script lang="ts">
    import MonthGrid from "./MonthGrid.svelte";
    import CalendarNav from "./CalendarNav.svelte";
    import CountryPicker from "./CountryPicker.svelte";
    import type { DayCell } from "$lib/holidays";
    import type { Country, CountryCode } from "$lib/countries";

    /** Full 12-month grid shown on wide screens. */
    let {
        year,
        months,
        countries,
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
        ontoggleCountry,
    }: {
        year: number;
        months: { month: number; days: DayCell[] }[];
        countries: Country[];
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
        ontoggleCountry: (country: Country) => void;
    } = $props();
</script>

<section class="year-cal" class:gold-shine={gold}>
    <div class="cal-header">
        <div class="cal-title">{year}</div>
        <CountryPicker {selectedCodes} ontoggle={ontoggleCountry} />
        <CalendarNav
            {todayActive}
            {onprev}
            {onnext}
            {onToday}
            prevLabel="Năm trước"
            nextLabel="Năm sau"
        />
    </div>

    <div class="year-grid">
        {#each months as m}
            <div class="month-block">
                <div class="month-name">Tháng {m.month}</div>
                <MonthGrid
                    days={m.days}
                    {selectedDay}
                    {selectedMonth}
                    {selectedYear}
                    compact
                    {onselect}
                />
            </div>
        {/each}
    </div>

    <div class="legend">
        {#each countries as c}
            <span class="legend-item" style:color={c.color}>
                <i class="swatch" style:background={c.color}></i>
                {c.label}
            </span>
        {/each}
    </div>
</section>

<style>
    .year-cal {
        background: var(--surface);
        border-radius: var(--card-radius);
        padding: 26px 30px 16px;
        box-shadow: var(--card-shadow);
        display: flex;
        flex-direction: column;
        min-height: 0;
        height: 100%;
        overflow: hidden;
        box-sizing: border-box;
    }

    .cal-header {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        margin-bottom: 18px;
    }

    .cal-header :global(.picker-wrap) {
        justify-self: center;
    }

    .cal-header :global(.cal-controls) {
        justify-self: end;
    }

    .cal-title {
        font-family: var(--font-display);
        font-size: 2.3rem;
        font-weight: 400;
        letter-spacing: -0.01em;
        line-height: 1;
        color: var(--text);
    }

    .year-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        grid-template-rows: repeat(3, minmax(0, 1fr));
        gap: clamp(16px, 2.4vh, 36px) clamp(22px, 2.4vw, 52px);
        min-height: 0;
        flex: 1;
    }

    .month-block {
        min-width: 0;
        min-height: 0;
        display: flex;
        flex-direction: column;
    }

    .month-name {
        font-size: clamp(0.66rem, 0.68vw, 0.82rem);
        font-weight: 600;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.14em;
        margin-bottom: clamp(8px, 1.1vh, 16px);
        text-align: center;
    }

    /* ── Legend: quiet key strip at the bottom of the panel ── */

    .legend {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 6px 18px;
        padding-top: 16px;
        margin-top: 4px;
    }

    .legend-item {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.72rem;
        font-weight: 500;
        white-space: nowrap;
    }

    .swatch {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        flex: none;
    }

    /* Short viewports: keep cells readable by letting the year scroll. */
    @media (max-height: 720px) {
        .year-grid {
            grid-template-rows: repeat(3, minmax(150px, 1fr));
            overflow-y: auto;
        }
    }
</style>
