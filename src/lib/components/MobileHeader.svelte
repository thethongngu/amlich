<script lang="ts">
    import CountryPicker from "./CountryPicker.svelte";
    import type { Country, CountryCode } from "$lib/countries";

    /** Phone header: month title, country chip, month arrows. */
    let {
        month,
        year,
        selectedCodes,
        onprev,
        onnext,
        onToday,
        ontoggleCountry,
    }: {
        month: number;
        year: number;
        selectedCodes: CountryCode[];
        onprev: () => void;
        onnext: () => void;
        onToday: () => void;
        ontoggleCountry: (country: Country) => void;
    } = $props();
</script>

<div class="m-header">
    <!-- Tapping the title jumps back to today. -->
    <button class="title" onclick={onToday} aria-label="Về hôm nay">
        <span class="t-month">Tháng {month}</span>
        <span class="t-year">{year}</span>
    </button>
    <CountryPicker {selectedCodes} ontoggle={ontoggleCountry} sheet flagsOnly />
    <div class="arrows">
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
        gap: 12px;
        padding: 6px 0 16px;
    }

    .title {
        display: flex;
        align-items: baseline;
        gap: 8px;
        margin: 0;
        padding: 0;
        flex: 1;
        min-width: 0;
        border: none;
        background: none;
        font-family: inherit;
        font-weight: 400;
        text-align: left;
        cursor: pointer;
        touch-action: manipulation;
    }

    .t-month {
        font-family: var(--font-display);
        font-size: 1.65rem;
        line-height: 1.05;
        letter-spacing: -0.01em;
        color: var(--text);
        white-space: nowrap;
    }

    .t-year {
        font-family: var(--font-display);
        font-size: 1rem;
        color: var(--out-month);
    }

    .arrows {
        display: flex;
        gap: 6px;
    }

    .nav {
        width: 36px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        border-radius: 11px;
        background: var(--surface-sunken);
        color: var(--text-secondary);
        font-family: inherit;
        font-size: 1.05rem;
        line-height: 1;
        padding: 0;
        cursor: pointer;
        touch-action: manipulation;
        transition:
            background 0.15s,
            color 0.15s;
    }

    .nav:active {
        background: var(--today-bg);
        color: var(--today-fg);
    }
</style>
