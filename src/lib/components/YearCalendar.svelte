<script lang="ts">
    import MonthGrid from "./MonthGrid.svelte";
    import CalendarNav from "./CalendarNav.svelte";
    import type { DayCell } from "$lib/holidays";
    import type { Country } from "$lib/countries";

    /** Full 12-month grid shown on wide screens. */
    let {
        year,
        months,
        countries,
        selectedDay,
        selectedMonth,
        selectedYear,
        todayActive,
        gold = false,
        onselect,
        onprev,
        onnext,
        onToday,
    }: {
        year: number;
        months: { month: number; days: DayCell[] }[];
        countries: Country[];
        selectedDay: number;
        selectedMonth: number;
        selectedYear: number;
        todayActive: boolean;
        gold?: boolean;
        onselect: (day: number, month: number, year: number) => void;
        onprev: () => void;
        onnext: () => void;
        onToday: () => void;
    } = $props();
</script>

<section class="year-cal" class:gold-shine={gold}>
    <div class="cal-header">
        <div class="cal-title">{year}</div>
        <div class="legend">
            {#each countries as c}
                <span class="legend-item">
                    <i class="swatch" style:background={c.color}></i>
                    <span class="legend-flag">{c.flag}</span>
                    <span style:color={c.color}>{c.label}</span>
                </span>
            {/each}
        </div>
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
</section>

<style>
    .year-cal {
        background: var(--surface);
        border-radius: var(--card-radius);
        padding: 24px 26px;
        box-shadow: var(--card-shadow);
        display: flex;
        flex-direction: column;
        min-height: 0;
        height: 100%;
        overflow: hidden;
        box-sizing: border-box;
    }

    .cal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 14px;
    }

    .cal-title {
        font-size: 1.35rem;
        font-weight: 700;
        letter-spacing: -0.01em;
        color: var(--text);
    }

    .legend {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px 16px;
        margin: 0 auto;
        padding: 0 16px;
    }

    .legend-item {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.82rem;
        font-weight: 600;
        white-space: nowrap;
    }

    .swatch {
        width: 10px;
        height: 10px;
        border-radius: 3px;
        flex: none;
    }

    .legend-flag {
        font-size: 0.95rem;
        line-height: 1;
    }

    .year-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        grid-template-rows: repeat(3, minmax(0, 1fr));
        gap: clamp(18px, 2.6vh, 40px) clamp(22px, 2.4vw, 52px);
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
        font-size: clamp(0.8rem, 0.85vw, 1.05rem);
        font-weight: 700;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.06em;
        margin-bottom: clamp(8px, 1.2vh, 18px);
        text-align: center;
    }

    /* Short viewports: keep cells readable by letting the year scroll. */
    @media (max-height: 720px) {
        .year-grid {
            grid-template-rows: repeat(3, minmax(150px, 1fr));
            overflow-y: auto;
        }
    }
</style>
