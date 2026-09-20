<script lang="ts">
    import type { MergedHoliday } from "$lib/holidays";

    /** "Sắp tới": upcoming holidays of the selected countries. */
    let {
        holidays,
        multi,
        format,
        onselect,
        showHeading = true,
        large = false,
    }: {
        holidays: MergedHoliday[];
        multi: boolean;
        format: (daysUntil: number) => string;
        onselect: (day: number, month: number, year: number) => void;
        /** Hide the "SẮP TỚI" heading when the view is already the list. */
        showHeading?: boolean;
        /** Phone sizing. */
        large?: boolean;
    } = $props();
</script>

<section class="upcoming" class:large>
    {#if showHeading}
        <div class="head">
            <h2>Sắp tới</h2>
        </div>
    {/if}
    <div class="upcoming-list">
        {#each holidays as h}
            <button
                class="row"
                onclick={() => onselect(h.solarDay, h.solarMonth, h.solarYear)}
                title={`${h.flags.join(" ")} ${h.name}`}
                aria-label={`${h.name}, ${(multi ? h.labels : h.labels.slice(0, 1)).join(", ")}, ngày ${h.solarDay} tháng ${h.solarMonth}, ${format(h.daysUntil)}`}
            >
                <span class="date" aria-hidden="true">
                    <b>{h.solarDay}</b>
                    <em>Th{h.solarMonth}</em>
                </span>
                <span class="flags" aria-hidden="true">
                    {#each multi ? h.flags : h.flags.slice(0, 1) as flag}
                        <i>{flag}</i>
                    {/each}
                </span>
                <span class="h-name">{h.name}</span>
                <span
                    class="h-count"
                    class:h-today={h.daysUntil === 0}
                    style:color={h.daysUntil === 1 ? h.colors[0] : undefined}
                    style:background={h.daysUntil === 0
                        ? h.colors[0]
                        : undefined}
                >
                    {format(h.daysUntil)}
                </span>
            </button>
        {/each}
    </div>
</section>

<style>
    .upcoming {
        padding: 24px 0 0;
    }

    .head {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 0 10px;
        margin-bottom: 4px;
    }

    .upcoming h2 {
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--text);
        margin: 0;
        white-space: nowrap;
    }

    /* Airier rows with a hairline between them. */
    .row {
        display: flex;
        width: 100%;
        align-items: center;
        gap: 10px;
        padding: 13px 10px;
        border: none;
        border-bottom: 1px solid var(--border);
        background: none;
        cursor: pointer;
        font-family: inherit;
        color: var(--text);
        border-radius: var(--r-cell);
        transition: background 0.15s;
        touch-action: manipulation;
    }

    @media (hover: hover) {
        .row:hover {
            background: var(--surface-sunken);
        }
    }

    .row:last-child {
        border-bottom: none;
    }

    /* The date column is phone-only; the sidebar has no room for it. */
    .date {
        display: none;
        grid-area: date;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: none;
        width: 46px;
        padding: 5px 0;
        border-radius: var(--r-cell);
        background: var(--surface-sunken);
        border: 1px solid var(--border);
        line-height: 1.1;
    }

    .date b {
        font-family: var(--font-display);
        font-stretch: var(--display-stretch);
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--text);
    }

    .date em {
        font-style: normal;
        font-size: 0.6rem;
        font-weight: 500;
        color: var(--text-muted);
    }

    /* One flag per country celebrating the day. */
    .flags {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        flex: none;
        font-size: 0.82rem;
        line-height: 1;
    }

    .flags i {
        font-style: normal;
    }

    .h-name {
        font-size: 0.85rem;
        font-weight: 500;
        text-align: left;
        flex: 1 1 auto;
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .h-count {
        font-size: 0.78rem;
        font-weight: 500;
        color: var(--text-muted);
        text-align: right;
        flex: 0 0 auto;
        margin-left: 10px;
        white-space: nowrap;
    }

    .h-count.h-today {
        color: var(--surface);
        padding: 2px 10px;
        border-radius: 999px;
        font-weight: 600;
        font-size: 0.7rem;
    }

    /* ── Phone sizing ── */

    /* The phone page is one screen tall, so the list scrolls inside itself. */
    .upcoming.large {
        padding: 4px 0 0;
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
    }

    .large .upcoming-list {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        overscroll-behavior-y: contain;
    }

    .large .head {
        padding: 0 2px;
        margin-bottom: 2px;
    }

    .large h2 {
        font-size: 1rem;
    }

    /* Phone rows go two-line so long holiday names are never truncated. */
    .large .row {
        display: grid;
        grid-template-columns: auto auto 1fr;
        grid-template-areas:
            "date flags name"
            "date ..... count";
        align-items: center;
        column-gap: 8px;
        row-gap: 2px;
        padding: 10px 2px;
        border-radius: var(--r-card);
    }

    .large .date {
        display: flex;
        margin-right: 4px;
    }

    .large .flags {
        grid-area: flags;
        align-self: center;
        gap: 3px;
        font-size: 1.02rem;
    }

    .large .h-name {
        grid-area: name;
        font-size: 0.94rem;
        font-weight: 600;
        line-height: 1.3;
        white-space: normal;
        overflow: visible;
        text-overflow: clip;
    }

    .large .h-count {
        grid-area: count;
        justify-self: start;
        text-align: left;
        margin-left: 0;
        font-size: 0.8rem;
    }

    .large .h-count.h-today {
        font-size: 0.72rem;
        padding: 3px 10px;
    }

    @media (min-width: 768px) {
        .upcoming {
            padding: 0;
            min-height: 0;
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        .upcoming-list {
            overflow-y: auto;
            min-height: 0;
            flex: 1;
            padding: 0;
        }
    }
</style>
