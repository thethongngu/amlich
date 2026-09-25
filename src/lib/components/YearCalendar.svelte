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

    const holidayCounts = $derived(
        new Map(
            countries.map((c) => [
                c.code,
                months.reduce(
                    (n, m) =>
                        n +
                        m.days.filter(
                            (d) =>
                                !d.isWeekend &&
                                d.marks.some(
                                    (k) => k.code === c.code && k.offWork,
                                ),
                        ).length,
                    0,
                ),
            ]),
        ),
    );
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
                <span class="legend-count"
                    >({holidayCounts.get(c.code)} ngày lễ)</span
                >
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

    /* Header controls and legend grow with the viewport, like the year grid. */
    .year-cal {
        --control-font: clamp(0.8rem, 0.9vw, 1.1rem);
        --nav-size: clamp(32px, 2.3vw, 44px);
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
        font-stretch: var(--display-stretch);
        font-size: 2.3rem;
        font-weight: 700;
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
        font-size: clamp(0.76rem, 0.8vw, 0.94rem);
        font-weight: 600;
        color: var(--text);
        margin-bottom: clamp(8px, 1.1vh, 16px);
        text-align: center;
    }

    /* ── Legend: quiet key strip at the bottom of the panel ── */

    .legend {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 0.5em 1.6em;
        padding-top: 16px;
        margin-top: 4px;
        font-size: var(--control-font);
    }

    .legend-item {
        display: inline-flex;
        align-items: center;
        gap: 0.5em;
        font-weight: 500;
        white-space: nowrap;
    }

    .legend-count {
        font-size: 0.85em;
        font-weight: 400;
        color: var(--text-muted);
    }

    .swatch {
        width: 0.5em;
        height: 0.5em;
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
