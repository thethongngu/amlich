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
        onSeeAll,
    }: {
        holidays: MergedHoliday[];
        multi: boolean;
        format: (daysUntil: number) => string;
        onselect: (day: number, month: number, year: number) => void;
        /** Hide the "SẮP TỚI" heading when the view is already the list. */
        showHeading?: boolean;
        /** Phone sizing. */
        large?: boolean;
        /** Renders the "Tất cả ›" link next to the heading. */
        onSeeAll?: () => void;
    } = $props();
</script>

<section class="upcoming" class:large>
    {#if showHeading}
        <div class="head">
            <h2>Sắp tới</h2>
            {#if onSeeAll}
                <span class="rule" aria-hidden="true"></span>
                <button class="see-all" onclick={onSeeAll}>Tất cả ›</button>
            {/if}
        </div>
    {/if}
    <div class="upcoming-list">
        {#each holidays as h}
            <button
                class="row"
                onclick={() => onselect(h.solarDay, h.solarMonth, h.solarYear)}
                title={`${h.flags.join(" ")} ${h.name}`}
            >
                <span class="dots" aria-hidden="true">
                    {#each multi ? h.colors : h.colors.slice(0, 1) as color}
                        <i style:background={color}></i>
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
        font-size: 0.62rem;
        font-weight: 600;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.16em;
        margin: 0;
        white-space: nowrap;
    }

    .rule {
        flex: 1;
        height: 1px;
        background: var(--border);
    }

    .see-all {
        border: none;
        background: none;
        padding: 2px 0;
        font-family: inherit;
        font-size: 0.8rem;
        font-weight: 500;
        color: var(--text-secondary);
        cursor: pointer;
        white-space: nowrap;
        touch-action: manipulation;
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
        border-radius: 10px;
        transition: background 0.15s;
        touch-action: manipulation;
    }

    .row:hover {
        background: var(--surface-sunken);
    }

    .row:last-child {
        border-bottom: none;
    }

    /* One dot per country celebrating the day. */
    .dots {
        display: inline-flex;
        gap: 3px;
        flex: none;
        line-height: 0;
    }

    .dots i {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        display: block;
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

    .upcoming.large {
        padding: 8px 0 0;
    }

    .large .head {
        padding: 0 2px;
        margin-bottom: 2px;
    }

    .large h2 {
        font-size: 0.64rem;
        letter-spacing: 0.18em;
    }

    .large .row {
        padding: 13px 2px;
        gap: 10px;
        border-radius: 12px;
    }

    .large .dots i {
        width: 7px;
        height: 7px;
    }

    .large .h-name {
        font-size: 0.92rem;
        font-weight: 600;
    }

    .large .h-count {
        font-size: 0.84rem;
    }

    .large .h-count.h-today {
        font-size: 0.75rem;
        padding: 5px 12px;
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
