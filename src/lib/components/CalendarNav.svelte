<script lang="ts">
    /** "Hôm nay" + prev/next buttons shared by the month and year cards. */
    let {
        todayActive,
        onprev,
        onnext,
        onToday,
        prevLabel,
        nextLabel,
    }: {
        todayActive: boolean;
        onprev: () => void;
        onnext: () => void;
        onToday: () => void;
        prevLabel: string;
        nextLabel: string;
    } = $props();
</script>

<div class="cal-controls">
    <button
        class="go-today-btn"
        class:active={todayActive}
        onclick={onToday}
        aria-label="Quay về hôm nay">Hôm nay</button
    >
    <button class="nav-btn" onclick={onprev} aria-label={prevLabel}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 8 12l7 7" /></svg>
    </button>
    <button class="nav-btn" onclick={onnext} aria-label={nextLabel}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
    </button>
</div>

<style>
    .cal-controls {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .go-today-btn {
        border: 1px solid var(--border);
        border-radius: 999px;
        background: var(--surface-sunken);
        cursor: default;
        color: var(--out-month);
        padding: 0.5em 1.15em;
        font-family: inherit;
        font-size: var(--control-font, 0.75rem);
        font-weight: 500;
        line-height: 1.3;
        transition:
            color 0.15s,
            background 0.15s;
        touch-action: manipulation;
        white-space: nowrap;
    }

    .go-today-btn.active {
        color: var(--text-secondary);
        cursor: pointer;
    }

    .go-today-btn.active:hover {
        background: var(--today-bg);
        border-color: var(--today-bg);
        color: var(--today-fg);
    }

    .nav-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: var(--nav-size, 30px);
        height: var(--nav-size, 30px);
        border-radius: 999px;
        border: 1px solid var(--border);
        background: var(--surface-sunken);
        cursor: pointer;
        padding: 0;
        color: var(--text-secondary);
        transition:
            background 0.15s,
            color 0.15s;
        touch-action: manipulation;
    }

    .nav-btn svg {
        width: 53%;
        height: 53%;
        fill: none;
        stroke: currentColor;
        stroke-width: 2.2;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    .nav-btn:hover {
        background: var(--today-bg);
        border-color: var(--today-bg);
        color: var(--today-fg);
    }

    @media (min-width: 768px) {
        .nav-btn {
            width: var(--nav-size, 32px);
            height: var(--nav-size, 32px);
        }
    }
</style>
