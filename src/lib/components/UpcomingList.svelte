<script lang="ts">
    import type { MergedHoliday } from "$lib/holidays";

    /** "Sắp tới": every upcoming holiday of the selected countries. */
    let {
        holidays,
        multi,
        format,
        onselect,
    }: {
        holidays: MergedHoliday[];
        multi: boolean;
        format: (daysUntil: number) => string;
        onselect: (day: number, month: number, year: number) => void;
    } = $props();
</script>

<section class="upcoming">
    <h2>Sắp tới</h2>
    <div class="upcoming-list">
        {#each holidays as h}
            <button
                class="row"
                onclick={() => onselect(h.solarDay, h.solarMonth, h.solarYear)}
            >
                <span class="h-name" title={h.name}
                    >{#if multi}<span class="h-flags">{h.flags.join("")}</span
                        >{/if}{h.name}</span
                >
                <span
                    class="h-count"
                    class:h-today={h.daysUntil === 0}
                    style:color={h.daysUntil === 0 ? undefined : h.colors[0]}
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
        padding: 24px 20px 0;
    }

    .upcoming h2 {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--text-faint);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin: 0 0 12px;
    }

    .row {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: baseline;
        padding: 10px 8px;
        margin: 0 -8px;
        border: none;
        border-bottom: 1px solid var(--border);
        background: none;
        cursor: pointer;
        font-family: inherit;
        color: var(--text);
        border-radius: 8px;
        transition: background 0.15s;
        touch-action: manipulation;
    }

    .row:hover {
        background: var(--surface-hover);
    }

    .row:last-child {
        border-bottom: none;
    }

    .h-flags {
        display: inline-block;
        margin-right: 8px;
        font-size: 1.15rem;
        line-height: 1;
        vertical-align: -2px;
        letter-spacing: 1px;
    }

    .h-name {
        font-size: 0.8rem;
        font-weight: 500;
        text-align: left;
        flex: 1 1 auto;
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .h-count {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--accent-strong);
        text-align: right;
        flex: 0 0 auto;
        margin-left: 12px;
        white-space: nowrap;
    }

    .h-count.h-today {
        background: var(--accent-strong);
        color: #fff;
        padding: 2px 12px;
        border-radius: 12px;
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
            padding: 0 16px;
        }

        .h-name,
        .h-count {
            font-size: 0.85rem;
        }

        .row {
            padding: 12px 0;
        }
    }
</style>
