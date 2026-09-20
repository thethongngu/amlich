<script lang="ts">
    import MonthPicker from "./MonthPicker.svelte";

    /** Phone month bar: the period title doubles as the month picker. */
    let {
        month,
        year,
        todayActive,
        onprev,
        onnext,
        onPickMonth,
        onToday,
    }: {
        month: number;
        year: number;
        /** False while the calendar already sits on today. */
        todayActive: boolean;
        onprev: () => void;
        onnext: () => void;
        onPickMonth: (month: number, year: number) => void;
        onToday: () => void;
    } = $props();

    let pickerOpen = $state(false);

    function pick(m: number, y: number) {
        onPickMonth(m, y);
        pickerOpen = false;
    }

    function closeOnOutsideClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (pickerOpen && !target.closest(".title-wrap")) pickerOpen = false;
    }
</script>

<svelte:window onclick={closeOnOutsideClick} />

<div class="m-header">
    <div class="title-wrap">
        <button
            class="title-btn"
            aria-expanded={pickerOpen}
            aria-label={`Tháng ${month} năm ${year}, chọn tháng khác`}
            onclick={() => (pickerOpen = !pickerOpen)}
        >
            <span class="t-month">Tháng {month}</span>
            <span class="t-year">{year}</span>
            <span class="caret" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
            </span>
        </button>
        {#if pickerOpen}
            <MonthPicker {month} {year} onpick={pick} />
        {/if}
    </div>

    <div class="actions">
        {#if todayActive}
            <button class="today" onclick={onToday}>Hôm nay</button>
        {/if}
        <button class="nav" onclick={onprev} aria-label="Tháng trước"
            >&lsaquo;</button
        >
        <button class="nav" onclick={onnext} aria-label="Tháng sau"
            >&rsaquo;</button
        >
    </div>
</div>

<style>
    .m-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
    }

    .title-wrap {
        position: relative;
        min-width: 0;
    }

    .title-btn {
        display: inline-flex;
        align-items: baseline;
        gap: 7px;
        max-width: 100%;
        margin-left: -6px;
        padding: 4px 6px;
        border: none;
        border-radius: var(--r-cell);
        background: none;
        font-family: inherit;
        color: var(--text);
        cursor: pointer;
        touch-action: manipulation;
    }

    .title-btn:active {
        background: var(--surface-sunken);
    }

    .t-month {
        font-family: var(--font-display);
        font-stretch: var(--display-stretch);
        font-size: 1.45rem;
        font-weight: 700;
        line-height: 1.1;
        white-space: nowrap;
    }

    .t-year {
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--text-muted);
    }

    .caret {
        display: flex;
        align-items: center;
        align-self: center;
        color: var(--text-muted);
        transition: transform 0.18s;
    }

    .caret svg {
        width: 16px;
        height: 16px;
        fill: none;
        stroke: currentColor;
        stroke-width: 2.4;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    .title-btn[aria-expanded='true'] .caret {
        transform: rotate(180deg);
    }

    .actions {
        display: flex;
        align-items: center;
        gap: 6px;
        flex: none;
    }

    .today {
        height: 34px;
        padding: 0 12px;
        border: 1px solid var(--border);
        border-radius: 999px;
        background: var(--surface-sunken);
        color: var(--text-secondary);
        font-family: inherit;
        font-size: 0.8rem;
        font-weight: 500;
        white-space: nowrap;
        cursor: pointer;
        touch-action: manipulation;
    }

    .nav {
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--border);
        border-radius: 999px;
        background: var(--surface-sunken);
        color: var(--text-secondary);
        font-family: inherit;
        font-size: 1.05rem;
        line-height: 1;
        padding: 0;
        cursor: pointer;
        touch-action: manipulation;
    }

    .today:active,
    .nav:active {
        background: var(--today-bg);
        border-color: var(--today-bg);
        color: var(--today-fg);
    }
</style>
