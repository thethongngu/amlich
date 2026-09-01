<script lang="ts">
    import type { Mark, MergedHoliday } from "$lib/holidays";

    /** The big line above the cards: what today (or the picked day) is. */
    let {
        marks,
        isToday,
        isWeekend,
        nextHoliday,
        countdown,
        allFlags,
        onholiday,
    }: {
        marks: Mark[];
        isToday: boolean;
        isWeekend: boolean;
        nextHoliday: MergedHoliday | null;
        countdown: string;
        allFlags: string;
        onholiday: (day: number, month: number, year: number) => void;
    } = $props();

    // Status dot: the day's own colour, the next holiday's, or a quiet sand.
    const dotColor = $derived(
        marks[0]?.color ??
            (isToday && nextHoliday ? nextHoliday.colors[0] : null) ??
            "var(--out-month)",
    );
</script>

<div class="next-holiday">
    <i class="lead-dot" style:background={dotColor} aria-hidden="true"></i>
    {#if marks.length > 0}
        <span class="holiday-title">
            <span class="special-day"
                >{#each marks as m, i}{i > 0 ? " · " : ""}<span
                        style:color={m.color}>{m.flag} {m.name}</span
                    >{/each}</span
            >
        </span>
    {:else if isToday && nextHoliday}
        <span class="countdown-line">
            {nextHoliday.flags.join("")} Còn <strong>{countdown}</strong>
            nữa đến
            <button
                class="holiday-link"
                style:color={nextHoliday.colors[0]}
                onclick={() =>
                    onholiday(
                        nextHoliday.solarDay,
                        nextHoliday.solarMonth,
                        nextHoliday.solarYear,
                    )}>{nextHoliday.name}</button
            >
        </span>
    {:else if isWeekend}
        <span class="special-day">{allFlags} Cuối tuần</span>
    {:else}
        <span class="normal-day">{allFlags} Ngày bình thường</span>
    {/if}
</div>

<style>
    .next-holiday {
        font-size: 1.25rem;
        font-weight: 600;
        letter-spacing: -0.01em;
        text-align: center;
        margin-bottom: 16px;
        min-height: 2.4em;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 4px 10px;
    }

    .lead-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        flex: none;
    }

    .next-holiday strong {
        color: var(--accent);
        font-weight: 600;
    }

    .holiday-link {
        background: none;
        border: none;
        font: inherit;
        color: var(--accent);
        font-weight: 600;
        cursor: pointer;
        padding: 0;
        text-decoration: underline;
        text-decoration-thickness: 1.5px;
        text-underline-offset: 3px;
        text-decoration-color: transparent;
        transition: text-decoration-color 0.15s;
    }

    .holiday-link:hover {
        text-decoration-color: currentColor;
    }

    .normal-day,
    .special-day {
        font-size: inherit;
        font-weight: 600;
        color: var(--text);
    }

    .holiday-title {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    @media (min-width: 768px) {
        .next-holiday {
            font-size: 1.9rem;
            margin-bottom: 0;
            min-height: auto;
        }

        .lead-dot {
            width: 9px;
            height: 9px;
        }
    }

    /* Wide screens: the headline becomes the sidebar's small title line. */
    @media (min-width: 1280px) {
        .next-holiday {
            font-size: 1.05rem;
            font-weight: 600;
            text-align: left;
            justify-content: flex-start;
            padding: 0 10px;
            gap: 4px 8px;
        }

        .lead-dot {
            width: 7px;
            height: 7px;
        }
    }
</style>
