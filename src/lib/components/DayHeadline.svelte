<script lang="ts">
    import type { Mark, MergedHoliday } from "$lib/holidays";

    /** The big line above the cards: what today (or the picked day) is. */
    let {
        marks,
        isOffWork,
        isToday,
        isWeekend,
        nextHoliday,
        countdown,
        allFlags,
        onholiday,
    }: {
        marks: Mark[];
        isOffWork: boolean;
        isToday: boolean;
        isWeekend: boolean;
        nextHoliday: MergedHoliday | null;
        countdown: string;
        allFlags: string;
        onholiday: (day: number, month: number, year: number) => void;
    } = $props();
</script>

<div class="next-holiday">
    {#if marks.length > 0}
        <span class="holiday-title">
            {#if isOffWork}<img
                    src="/duocnghi.png"
                    alt="Được nghỉ"
                    class="stamp"
                />{/if}
            <span class="special-day"
                >{#each marks as m, i}{i > 0 ? " · " : ""}<span
                        style:color={m.color}>{m.flag} {m.name}</span
                    >{/each}</span
            >
        </span>
    {:else if isToday && nextHoliday}
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
    {:else if isWeekend}
        <span class="special-day">{allFlags} Cuối tuần</span>
    {:else}
        <span class="normal-day">{allFlags} Ngày bình thường</span>
    {/if}
</div>

<style>
    .next-holiday {
        font-size: 1.5rem;
        font-weight: 700;
        text-align: center;
        margin-bottom: 16px;
        min-height: 2.4em;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 4px 12px;
    }

    .next-holiday strong {
        color: var(--accent-strong);
        font-weight: 700;
    }

    .holiday-link {
        background: none;
        border: none;
        font: inherit;
        color: var(--accent-strong);
        font-weight: 700;
        cursor: pointer;
        padding: 0;
        text-decoration: underline;
        text-decoration-thickness: 2px;
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
        font-weight: 700;
        color: var(--text);
    }

    .holiday-title {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .stamp {
        position: absolute;
        left: 50%;
        top: 120%;
        width: 4em;
        height: 2em;
        object-fit: contain;
        z-index: 1;
        transform: translateX(-50%) rotate(-25deg);
        opacity: 0.85;
        pointer-events: none;
    }

    @media (min-width: 768px) {
        .next-holiday {
            font-size: 2.2rem;
            margin-bottom: 0;
            min-height: auto;
        }

        .stamp {
            left: -2.4em;
            top: -120%;
            width: 6em;
            height: 3em;
        }
    }

    @media (min-width: 1280px) {
        .next-holiday {
            font-size: 1.5rem;
        }

        .stamp {
            left: 50%;
            top: 105%;
            width: 6em;
            height: 3em;
        }
    }
</style>
