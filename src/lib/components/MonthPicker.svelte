<script lang="ts">
    /** Popover grid of the twelve months, anchored under a month title. */
    let {
        month,
        onpick,
    }: {
        month: number;
        onpick: (month: number) => void;
    } = $props();
</script>

<div class="month-picker" role="group" aria-label="Chọn tháng">
    {#each Array.from({ length: 12 }, (_, i) => i + 1) as m}
        <button
            class="month-btn"
            class:active={m === month}
            aria-current={m === month ? "true" : undefined}
            onclick={() => onpick(m)}
        >
            {m}
        </button>
    {/each}
</div>

<style>
    .month-picker {
        display: grid;
        position: absolute;
        top: 100%;
        left: 0;
        margin-top: 6px;
        background: var(--surface);
        border-radius: var(--r-card);
        box-shadow: var(--popover-shadow);
        padding: 8px;
        grid-template-columns: repeat(4, 1fr);
        gap: 4px;
        z-index: 30;
    }

    .month-btn {
        width: 44px;
        height: 40px;
        border: none;
        background: none;
        border-radius: var(--r-cell);
        font-family: inherit;
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--text-secondary);
        cursor: pointer;
        transition: background 0.1s;
        touch-action: manipulation;
    }

    @media (hover: hover) {
        .month-btn:hover {
            background: var(--surface-sunken);
        }
    }

    .month-btn.active {
        background: var(--today-bg);
        color: var(--today-fg);
        font-weight: 600;
    }
</style>
