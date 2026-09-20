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

    const flagList = $derived([...new Set(marks.map((m) => m.flag))]);

    // Countries spell one holiday several ways, so the headline names it once,
    // in the page country's own words, and the flags say who else observes it.
    const fullList = $derived(
        marks.map((m) => `${m.flag} ${m.name}`).join(" · "),
    );

    const nextFlags = $derived(
        nextHoliday ? [...new Set(nextHoliday.flags)] : [],
    );

    // Long names wrap into a ragged second line, so the type steps down first.
    const lineLength = $derived.by(() => {
        if (marks.length > 0) return marks[0].name.length + flagList.length * 3;
        if (isToday && nextHoliday) {
            return (
                nextHoliday.name.length +
                countdown.length +
                nextFlags.length * 3
            );
        }
        return 0;
    });
</script>

<div class="next-holiday" class:dense={lineLength > 30}>
    <i class="lead-dot" style:background={dotColor} aria-hidden="true"></i>
    {#if marks.length > 0}
        <span class="special-day" style:color={marks[0].color} title={fullList}>
            <span class="flag-group" aria-hidden="true"
                >{#each flagList as f}<i>{f}</i>{/each}</span
            >{marks[0].name}
        </span>
    {:else if isToday && nextHoliday}
        <span class="countdown-line">
            <span class="flag-group" aria-hidden="true"
                >{#each nextFlags as f}<i>{f}</i>{/each}</span
            ><button
                class="holiday-link"
                style:color={nextHoliday.colors[0]}
                onclick={() =>
                    onholiday(
                        nextHoliday.solarDay,
                        nextHoliday.solarMonth,
                        nextHoliday.solarYear,
                    )}>{nextHoliday.name}</button
            ><span class="until">{countdown}</span>
        </span>
    {:else if isWeekend}
        <span class="special-day">{allFlags} Cuối tuần</span>
    {:else}
        <span class="normal-day">{allFlags} Ngày bình thường</span>
    {/if}
</div>

<style>
    .next-holiday {
        --hl-size: 1.15rem;
        font-size: var(--hl-size);
        font-weight: 600;
        letter-spacing: -0.01em;
        line-height: 1.35;
        text-align: center;
        text-wrap: balance;
        min-height: 1.8em;
    }

    .next-holiday.dense {
        --hl-size: 1.05rem;
    }

    /* Inline so a wrapped headline never strands the dot on a line of its own. */
    .lead-dot {
        display: inline-block;
        vertical-align: 0.15em;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        margin-right: 8px;
    }

    .flag-group {
        display: inline-flex;
        gap: 2px;
        vertical-align: -0.08em;
        margin-right: 7px;
    }

    .flag-group i {
        font-style: normal;
    }

    /* The countdown trails the name as a quiet qualifier, not a headline. */
    .until {
        font-size: 0.78em;
        font-weight: 500;
        color: var(--text-muted);
        white-space: nowrap;
    }

    .until::before {
        content: "\00b7";
        margin: 0 6px;
        color: var(--text-faint);
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

    @media (min-width: 768px) {
        .next-holiday {
            --hl-size: 1.9rem;
            margin-bottom: 0;
            min-height: auto;
        }

        .next-holiday.dense {
            --hl-size: 1.75rem;
        }

        .lead-dot {
            width: 9px;
            height: 9px;
        }
    }

    /* Wide screens: the headline becomes the sidebar's small title line. */
    @media (min-width: 1280px) {
        .next-holiday {
            --hl-size: 1.05rem;
            font-weight: 600;
            text-align: left;
            padding: 0 10px;
        }

        .next-holiday.dense {
            --hl-size: 0.95rem;
        }

        .lead-dot {
            width: 7px;
            height: 7px;
        }
    }
</style>
