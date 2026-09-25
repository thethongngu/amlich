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

    const upcoming = $derived(marks.length === 0 && isToday && !!nextHoliday);

    const dotColor = $derived(marks[0]?.color ?? "var(--out-month)");

    const flagList = $derived([...new Set(marks.map((m) => m.flag))]);

    // Countries spell one holiday several ways, so the headline names it once,
    // in the page country's own words, and the flags say who else observes it.
    const fullList = $derived(
        marks.map((m) => `${m.flag} ${m.name}`).join(" · "),
    );

    const nextFlags = $derived(
        nextHoliday ? [...new Set(nextHoliday.flags)] : [],
    );

    // The row height is fixed, so long names step the type down instead.
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
    <span class="line">
        {#if !upcoming}
            <i class="lead-dot" style:background={dotColor} aria-hidden="true"
            ></i>
        {/if}
        {#if marks.length > 0}
            <span class="flag-group" aria-hidden="true"
                >{#each flagList as f}<i>{f}</i>{/each}</span
            >
            <span class="name" style:color={marks[0].color} title={fullList}
                >{marks[0].name}</span
            >
        {:else if isToday && nextHoliday}
            <span
                class="until"
                style:color={nextHoliday.colors[0]}
                style:border-color={nextHoliday.colors[0]}>{countdown}</span
            >
            <span class="flag-group" aria-hidden="true"
                >{#each nextFlags as f}<i>{f}</i>{/each}</span
            >
            <button
                class="name holiday-link upcoming"
                style:color={nextHoliday.colors[0]}
                onclick={() =>
                    onholiday(
                        nextHoliday.solarDay,
                        nextHoliday.solarMonth,
                        nextHoliday.solarYear,
                    )}>{nextHoliday.name}</button
            >
        {:else if isWeekend}
            <span class="flag-group" aria-hidden="true">{allFlags}</span>
            <span class="name">Cuối tuần</span>
        {:else}
            <span class="flag-group" aria-hidden="true">{allFlags}</span>
            <span class="name">Ngày bình thường</span>
        {/if}
    </span>
</div>

<style>
    /* A fixed row height: switching days must never nudge the page up or down,
       whatever the headline says. */
    .next-holiday {
        --hl-size: 1.15rem;
        --hl-height: 2.1rem;
        height: var(--hl-height);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--hl-size);
        font-weight: 600;
        letter-spacing: -0.01em;
        line-height: 1.2;
    }

    .next-holiday.dense {
        --hl-size: 1.05rem;
    }

    .line {
        display: inline-flex;
        align-items: center;
        max-width: 100%;
        min-width: 0;
        white-space: nowrap;
    }

    .lead-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        flex: none;
        margin-right: 8px;
    }

    .flag-group {
        display: inline-flex;
        gap: 2px;
        flex: none;
        margin-right: 7px;
    }

    .flag-group i {
        font-style: normal;
    }

    /* Truncation is the last resort that keeps the row one line tall. */
    .name {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: inherit;
        font-weight: 600;
        color: var(--text);
    }

    /* The badge comes first so nobody reads an upcoming holiday as today's. */
    .until {
        flex: none;
        margin-right: 8px;
        padding: 0.1em 0.6em;
        border: 1.5px solid;
        border-radius: 999px;
        font-size: 0.72em;
        font-weight: 600;
        line-height: 1.3;
    }

    .name.upcoming {
        font-weight: 500;
    }

    .holiday-link {
        background: none;
        border: none;
        font: inherit;
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

    @media (min-width: 768px) {
        .next-holiday {
            --hl-size: 1.9rem;
            --hl-height: 2.8rem;
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
            --hl-height: 2.1rem;
            justify-content: flex-start;
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
