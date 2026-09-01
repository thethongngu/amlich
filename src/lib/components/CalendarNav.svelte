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
        border: 1px solid var(--border);
        border-radius: 6px;
        background: none;
        cursor: default;
        color: var(--border);
        padding: 2px 8px;
        font-family: inherit;
        font-size: 0.7rem;
        font-weight: 500;
        line-height: 1.4;
        transition:
            color 0.15s,
            border-color 0.15s,
            background 0.15s;
        touch-action: manipulation;
        white-space: nowrap;
    }

    .go-today-btn.active {
        color: var(--accent-strong);
        border-color: var(--accent-soft-border);
        cursor: pointer;
    }

    .go-today-btn.active:hover {
        background: var(--accent-strong);
        color: #fff;
    }

    .nav-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border-radius: 8px;
        border: none;
        background: none;
        cursor: pointer;
        font-size: 1.2rem;
        line-height: 1;
        padding: 0;
        color: var(--text-muted);
        font-family: inherit;
        transition: background 0.15s;
        touch-action: manipulation;
    }

    .nav-btn:hover {
        background: var(--surface-hover);
    }

    @media (min-width: 768px) {
        .nav-btn {
            width: 34px;
            height: 34px;
            font-size: 1.3rem;
        }
    }
</style>
