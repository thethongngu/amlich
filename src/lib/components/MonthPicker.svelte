<script lang="ts">
    import { untrack } from "svelte";

    /** Popover period picker: step the year, then pick one of the twelve months. */
    let {
        month,
        year,
        onpick,
    }: {
        month: number;
        year: number;
        onpick: (month: number, year: number) => void;
    } = $props();

    const now = new Date();
    const thisMonth = now.getMonth() + 1;
    const thisYear = now.getFullYear();

    let viewYear = $state(untrack(() => year));
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
</script>

<div class="picker" role="group" aria-label="Chọn tháng và năm">
    <div class="year-row">
        <button
            class="year-nav"
            aria-label="Năm trước"
            onclick={() => viewYear--}
        >
            <svg viewBox="0 0 24 24" aria-hidden="true"
                ><path d="M15 5 8 12l7 7" /></svg
            >
        </button>
        <span class="year" aria-live="polite">{viewYear}</span>
        <button
            class="year-nav"
            aria-label="Năm sau"
            onclick={() => viewYear++}
        >
            <svg viewBox="0 0 24 24" aria-hidden="true"
                ><path d="m9 5 7 7-7 7" /></svg
            >
        </button>
    </div>

    <div class="months">
        {#each months as m}
            <button
                class="month"
                class:active={m === month && viewYear === year}
                class:now={m === thisMonth && viewYear === thisYear}
                aria-current={m === month && viewYear === year
                    ? "true"
                    : undefined}
                onclick={() => onpick(m, viewYear)}
            >
                Th{m}
            </button>
        {/each}
    </div>
</div>

<style>
    .picker {
        position: absolute;
        top: 100%;
        left: 0;
        margin-top: 8px;
        width: 232px;
        max-width: calc(100vw - 24px);
        background: var(--surface);
        border-radius: var(--r-panel);
        box-shadow: var(--popover-shadow);
        padding: 8px;
        z-index: 30;
    }

    .year-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 4px;
        padding: 2px 2px 8px;
        border-bottom: 1px solid var(--border);
        margin-bottom: 8px;
    }

    .year {
        font-family: var(--font-display);
        font-stretch: var(--display-stretch);
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--text);
        letter-spacing: 0.01em;
    }

    .year-nav {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: none;
        border: none;
        border-radius: 50%;
        background: none;
        color: var(--text-secondary);
        padding: 0;
        cursor: pointer;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
    }

    .year-nav svg {
        width: 18px;
        height: 18px;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    .year-nav:active {
        background: var(--today-bg);
        color: var(--today-fg);
    }

    .months {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 4px;
    }

    .month {
        position: relative;
        height: 44px;
        border: none;
        background: none;
        border-radius: var(--r-cell);
        font-family: inherit;
        font-size: 0.92rem;
        font-weight: 500;
        color: var(--text-secondary);
        cursor: pointer;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
        transition: background 0.1s;
    }

    /* A dot marks the real current month, wherever the picker is parked. */
    .month.now::after {
        content: "";
        position: absolute;
        bottom: 7px;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: var(--accent);
    }

    @media (hover: hover) {
        .month:hover {
            background: var(--surface-sunken);
        }
    }

    .month:active {
        background: var(--surface-hover);
    }

    .month.active {
        background: var(--today-bg);
        color: var(--today-fg);
        font-weight: 600;
    }

    .month.active.now::after {
        background: var(--today-fg);
    }
</style>
