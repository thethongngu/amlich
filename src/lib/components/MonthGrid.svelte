<script lang="ts">
    import { DAY_NAMES_SHORT } from "$lib/calendar";
    import { cellBg, marksTitle, type DayCell } from "$lib/holidays";

    /**
     * The 7×6 day grid shared by the single-month card and the year view.
     * `compact` switches to the denser, height-filling year-grid sizing.
     *
     * Visual language (see src/lib/theme.css):
     *   • solar number in ink, Sunday in muted red, out-of-month in sand
     *   • lunar number underneath in muted; mùng một in gold as "1/12"
     *   • holidays wear their country's paper tint + coloured number
     *   • today is ink-filled, the picked day gets an ink ring
     */
    let {
        days,
        selectedDay,
        selectedMonth,
        selectedYear,
        compact = false,
        large = false,
        onselect,
    }: {
        days: DayCell[];
        selectedDay: number;
        selectedMonth: number;
        selectedYear: number;
        compact?: boolean;
        /** Phone sizing: tall cells, ringed today, dash marks. */
        large?: boolean;
        onselect: (day: number, month: number, year: number) => void;
    } = $props();

    const isSelected = (d: DayCell) =>
        d.isCurrentMonth &&
        d.solarDay === selectedDay &&
        d.solarMonth === selectedMonth &&
        d.solarYear === selectedYear;
</script>

<div class="grid" class:mini={compact} class:big={large}>
    {#each DAY_NAMES_SHORT as name, i}
        <div class="hdr" class:sunday={i === 6}>{name}</div>
    {/each}

    {#each days as day, i}
        <button
            class="cell"
            class:is-today={day.isToday}
            class:is-selected={isSelected(day)}
            class:overflow={!day.isCurrentMonth}
            class:is-sunday={i % 7 === 6}
            class:has-mark={day.marks.length > 0}
            style:--bg={cellBg(day.marks)}
            title={marksTitle(day.marks)}
            aria-label={`Ngày ${day.solarDay} tháng ${day.solarMonth}, âm lịch ${day.lunarDay}/${day.lunarMonth}${day.holiday ? ", " + day.holiday : ""}`}
            onclick={() => onselect(day.solarDay, day.solarMonth, day.solarYear)}
        >
            <span class="sd" style:--mark={day.marks[0]?.color}
                >{day.solarDay}</span
            >
            <span class="ld" class:new-month={day.lunarDay === 1}>
                {day.lunarDay === 1 ? `1/${day.lunarMonth}` : day.lunarDay}
            </span>
            {#if day.marks.length > (large ? 0 : 1)}
                <span class="dots">
                    {#each day.marks as mk}
                        <i style:background={mk.color}></i>
                    {/each}
                </span>
            {/if}
        </button>
    {/each}
</div>

<style>
    .grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 2px;
    }

    .hdr {
        text-align: center;
        font-size: 0.66rem;
        font-weight: 600;
        color: var(--text-muted);
        letter-spacing: 0.06em;
        padding: 4px 0 8px;
    }

    .hdr.sunday {
        color: var(--sunday);
    }

    .cell {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 46px;
        border-radius: 10px;
        gap: 1px;
        border: none;
        padding: 0;
        cursor: pointer;
        font-family: inherit;
        color: var(--text);
        background: var(--bg, none);
        transition:
            background 0.12s,
            box-shadow 0.12s;
        touch-action: manipulation;
    }

    .cell:not(.is-today):hover {
        box-shadow: inset 0 0 0 999px rgba(43, 35, 24, 0.045);
    }

    .sd {
        font-size: 0.88rem;
        font-weight: 500;
        line-height: 1.2;
        letter-spacing: -0.01em;
    }

    .ld {
        font-size: 0.6rem;
        font-weight: 400;
        color: var(--text-muted);
        line-height: 1.15;
    }

    /* Mùng một: gold, the only place a lunar date shouts. */
    .ld.new-month {
        color: var(--accent);
        font-weight: 500;
        font-size: 0.55rem;
    }

    .dots {
        display: flex;
        gap: 2px;
        margin-top: 1px;
        line-height: 0;
    }

    .dots i {
        width: 3px;
        height: 3px;
        border-radius: 50%;
        display: block;
    }

    /* ── Day colouring ── */

    .cell.is-sunday .sd {
        color: var(--sunday);
    }

    /* A holiday's country colour wins over the Sunday red. */
    .cell.has-mark .sd {
        color: var(--mark, var(--text));
        font-weight: 600;
    }

    .cell.overflow .sd,
    .cell.overflow .ld,
    .cell.overflow.is-sunday .sd {
        color: var(--out-month);
    }

    .cell.overflow .ld.new-month {
        color: var(--out-month);
    }

    /* Today = ink fill, selection = ink ring: both keep the lunar date legible. */
    .cell.is-today {
        background: var(--today-bg);
    }

    .cell.is-today .sd,
    .cell.is-today .ld,
    .cell.is-today.is-sunday .sd,
    .cell.is-today.has-mark .sd {
        color: var(--today-fg);
        font-weight: 600;
    }

    .cell.is-today .ld {
        font-weight: 400;
        opacity: 0.75;
    }

    .cell.is-today:hover {
        background: #3a301f;
    }

    .cell.is-selected {
        box-shadow: inset 0 0 0 1.5px var(--text);
    }

    .cell.is-selected:hover {
        box-shadow:
            inset 0 0 0 1.5px var(--text),
            inset 0 0 0 999px rgba(43, 35, 24, 0.045);
    }

    .cell.is-selected.is-today {
        box-shadow: inset 0 0 0 1.5px var(--surface);
    }

    @media (min-width: 768px) {
        .hdr {
            font-size: 0.72rem;
            padding: 6px 0 10px;
        }

        .cell {
            min-height: 58px;
        }

        .sd {
            font-size: 1rem;
        }

        .ld {
            font-size: 0.68rem;
        }

        .ld.new-month {
            font-size: 0.6rem;
        }
    }

    /* ── Large (phone): roomy cells, ringed today, dashes instead of dots ── */

    .grid.big {
        gap: 4px 0;
    }

    .grid.big .hdr {
        font-size: 0.7rem;
        font-weight: 600;
        padding: 6px 0 10px;
    }

    .grid.big .cell {
        min-height: 50px;
        border-radius: 12px;
        gap: 1px;
    }

    .grid.big .sd {
        font-size: 1.08rem;
        font-weight: 600;
    }

    .grid.big .ld {
        font-size: 0.66rem;
    }

    .grid.big .ld.new-month {
        font-size: 0.6rem;
    }

    .grid.big .dots {
        margin-top: 2px;
        gap: 3px;
    }

    /* Dashes read better than dots at this size. */
    .grid.big .dots i {
        width: 7px;
        height: 2px;
        border-radius: 2px;
    }

    /* Phone: today is a ring, so the paper stays light. */
    .grid.big .cell.is-today {
        background: var(--bg, none);
        box-shadow: inset 0 0 0 1.6px var(--text);
    }

    .grid.big .cell.is-today .sd {
        color: var(--mark, var(--text));
    }

    .grid.big .cell.is-today.is-sunday .sd {
        color: var(--sunday);
    }

    .grid.big .cell.is-today .ld {
        color: var(--text-muted);
        opacity: 1;
    }

    .grid.big .cell.is-today.is-sunday .ld {
        color: var(--text-muted);
    }

    .grid.big .cell.is-selected:not(.is-today) {
        box-shadow: inset 0 0 0 1.5px var(--out-month);
    }

    /* ── Compact (year view): cells stretch to fill the month block ── */

    .grid.mini {
        gap: 2px;
        flex: 1;
        min-height: 0;
        grid-template-rows: auto repeat(6, minmax(0, 1fr));
    }

    .grid.mini .hdr {
        font-size: clamp(0.58rem, 0.58vw, 0.74rem);
        padding: 0 0 clamp(3px, 0.5vh, 8px);
    }

    .grid.mini .cell {
        min-height: 0;
        height: 100%;
        border-radius: 9px;
        gap: 0;
    }

    .grid.mini .sd {
        font-size: clamp(0.82rem, 0.9vw, 1.15rem);
        font-weight: 500;
        line-height: 1.15;
    }

    .grid.mini .cell.has-mark .sd {
        font-weight: 600;
    }

    .grid.mini .ld {
        font-size: clamp(0.56rem, 0.6vw, 0.78rem);
        line-height: 1.1;
    }

    .grid.mini .ld.new-month {
        font-size: clamp(0.52rem, 0.56vw, 0.72rem);
    }
</style>
