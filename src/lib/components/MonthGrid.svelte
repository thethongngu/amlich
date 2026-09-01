<script lang="ts">
    import { DAY_NAMES_SHORT } from "$lib/calendar";
    import { cellBg, marksTitle, type DayCell } from "$lib/holidays";

    /**
     * The 7×6 day grid shared by the single-month card and the year view.
     * `compact` switches to the denser, height-filling year-grid sizing.
     */
    let {
        days,
        selectedDay,
        selectedMonth,
        selectedYear,
        compact = false,
        onselect,
    }: {
        days: DayCell[];
        selectedDay: number;
        selectedMonth: number;
        selectedYear: number;
        compact?: boolean;
        onselect: (day: number, month: number, year: number) => void;
    } = $props();

    const isSelected = (d: DayCell) =>
        d.isCurrentMonth &&
        d.solarDay === selectedDay &&
        d.solarMonth === selectedMonth &&
        d.solarYear === selectedYear;
</script>

<div class="grid" class:mini={compact}>
    {#each DAY_NAMES_SHORT as name, i}
        <div class="hdr" class:weekend={i >= 5}>{name}</div>
    {/each}

    {#each days as day}
        <button
            class="cell"
            class:is-today={day.isToday}
            class:is-selected={isSelected(day)}
            class:overflow={!day.isCurrentMonth}
            class:is-weekend={day.isWeekend && !day.isToday}
            style:--bg={cellBg(day.marks)}
            title={marksTitle(day.marks)}
            aria-label={`Ngày ${day.solarDay} tháng ${day.solarMonth}, âm lịch ${day.lunarDay}/${day.lunarMonth}${day.holiday ? ", " + day.holiday : ""}`}
            onclick={() => onselect(day.solarDay, day.solarMonth, day.solarYear)}
        >
            <span class="sd" style:color={day.marks[0]?.color}
                >{day.solarDay}</span
            >
            <span class="ld" class:new-month={day.lunarDay === 1}>
                {day.lunarDay === 1 ? `1/${day.lunarMonth}` : day.lunarDay}
            </span>
            {#if day.marks.length > 1}
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
        gap: 3px;
    }

    .hdr {
        text-align: center;
        font-size: 0.72rem;
        font-weight: 600;
        color: var(--text-faint);
        padding: 4px 0 8px;
    }

    .cell {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 46px;
        border-radius: 10px;
        gap: 2px;
        border: none;
        padding: 0;
        cursor: pointer;
        font-family: inherit;
        color: var(--text);
        background: var(--bg, none);
        transition:
            background 0.1s,
            box-shadow 0.1s;
        touch-action: manipulation;
    }

    .cell:not(.is-today):hover {
        box-shadow: inset 0 0 0 999px rgba(28, 25, 23, 0.05);
    }

    .cell.overflow {
        opacity: 0.35;
    }

    .sd {
        font-size: 0.88rem;
        font-weight: 500;
        line-height: 1.2;
    }

    .ld {
        font-size: 0.6rem;
        color: var(--text-faint);
        line-height: 1.1;
    }

    .ld.new-month {
        color: var(--accent-strong);
        font-weight: 600;
        font-size: 0.55rem;
    }

    .dots {
        display: flex;
        gap: 2px;
        margin-top: 2px;
        line-height: 0;
    }

    .dots i {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        display: block;
    }

    .cell.is-weekend .sd {
        color: var(--text-muted);
    }

    /* Today = accent ring, selection = dark ring: both keep the day's
       country colour and tint visible. */
    .cell.is-today {
        box-shadow: inset 0 0 0 2px var(--accent);
    }

    .cell.is-today .sd {
        font-weight: 700;
    }

    .cell.is-today:hover {
        box-shadow:
            inset 0 0 0 2px var(--accent),
            inset 0 0 0 999px rgba(28, 25, 23, 0.05);
    }

    .cell.is-selected {
        box-shadow: inset 0 0 0 2px var(--text);
    }

    .cell.is-selected.is-today {
        box-shadow:
            inset 0 0 0 2px var(--text),
            inset 0 0 0 4px var(--accent);
    }

    @media (min-width: 768px) {
        .hdr {
            font-size: 0.8rem;
            padding: 6px 0 10px;
        }

        .cell {
            min-height: 58px;
        }

        .sd {
            font-size: 1rem;
        }

        .ld {
            font-size: 0.7rem;
        }

        .ld.new-month {
            font-size: 0.6rem;
        }
    }

    /* ── Compact (year view): cells stretch to fill the month block ── */

    .grid.mini {
        gap: 2px;
        flex: 1;
        min-height: 0;
        grid-template-rows: auto repeat(6, minmax(0, 1fr));
    }

    .grid.mini .hdr {
        font-size: clamp(0.6rem, 0.62vw, 0.8rem);
        padding: 0 0 clamp(3px, 0.5vh, 8px);
    }

    .grid.mini .cell {
        min-height: 0;
        height: 100%;
        border-radius: 8px;
        gap: 0;
    }

    .grid.mini .sd {
        font-size: clamp(0.85rem, 0.95vw, 1.25rem);
        font-weight: 600;
        line-height: 1.15;
    }

    .grid.mini .ld {
        font-size: clamp(0.6rem, 0.66vw, 0.85rem);
        line-height: 1.1;
    }

    .grid.mini .ld.new-month {
        font-size: clamp(0.55rem, 0.6vw, 0.8rem);
    }
</style>
