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
    <button class="nav-btn" onclick={onprev} aria-label={prevLabel}
        >&lsaquo;</button
    >
    <button class="nav-btn" onclick={onnext} aria-label={nextLabel}
        >&rsaquo;</button
    >
</div>

<style>
    .cal-controls {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .go-today-btn {
        border: none;
        border-radius: 999px;
        background: var(--surface-sunken);
        cursor: default;
        color: var(--out-month);
        padding: 6px 14px;
        font-family: inherit;
        font-size: 0.75rem;
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
        color: var(--today-fg);
    }

    .nav-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border-radius: 999px;
        border: none;
        background: var(--surface-sunken);
        cursor: pointer;
        font-size: 1.05rem;
        line-height: 1;
        padding: 0;
        color: var(--text-secondary);
        font-family: inherit;
        transition:
            background 0.15s,
            color 0.15s;
        touch-action: manipulation;
    }

    .nav-btn:hover {
        background: var(--today-bg);
        color: var(--today-fg);
    }

    @media (min-width: 768px) {
        .nav-btn {
            width: 32px;
            height: 32px;
            font-size: 1.1rem;
        }
    }
</style>
