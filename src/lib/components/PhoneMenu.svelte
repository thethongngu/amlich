<script lang="ts">
    import BottomSheet from "./BottomSheet.svelte";
    import CountryRows from "./CountryRows.svelte";
    import type { Country, CountryCode } from "$lib/countries";

    /**
     * Everything a phone needs occasionally: which countries' holidays to
     * show, the display toggles, and the credits. Keeps the calendar screen
     * free for the calendar.
     */
    let {
        open,
        selectedCodes,
        ontoggleCountry,
        showBoth = $bindable(),
        showMondays = $bindable(),
        onclose,
    }: {
        open: boolean;
        selectedCodes: CountryCode[];
        ontoggleCountry: (country: Country) => void;
        showBoth: boolean;
        showMondays: boolean;
        onclose: () => void;
    } = $props();
</script>

<BottomSheet {open} label="Cài đặt" {onclose}>
    <h2 class="section">Ngày lễ của</h2>
    <CountryRows {selectedCodes} ontoggle={ontoggleCountry} large />

    <h2 class="section spaced">Hiển thị</h2>
    <label class="toggle">
        <input type="checkbox" bind:checked={showBoth} />
        <span>Hiện cả dương lịch và âm lịch</span>
    </label>
    <label class="toggle">
        <input type="checkbox" bind:checked={showMondays} />
        <span>Đếm theo số thứ Hai</span>
    </label>

    <div class="credits">
        <span
            >by <a
                href="https://thethongngu.github.io"
                target="_blank"
                rel="noopener">thethongngu</a
            ></span
        >
        <a
            class="kofi"
            href="https://me.momo.vn/dQIQTQtWfeCBCwTGIDIziz"
            target="_blank"
            rel="noopener">Ủng hộ ly cafe sữa (Momo)</a
        >
    </div>
</BottomSheet>

<style>
    .section {
        margin: 0;
        padding: 2px 2px 8px;
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--text);
    }

    .section.spaced {
        padding-top: 20px;
    }

    .toggle {
        display: flex;
        align-items: center;
        gap: 11px;
        padding: 12px 14px;
        font-size: 0.92rem;
        color: var(--text);
        cursor: pointer;
    }

    .toggle + .toggle {
        border-top: 1px solid var(--border);
    }

    .toggle input[type="checkbox"] {
        width: 19px;
        height: 19px;
        flex: none;
        accent-color: var(--accent);
    }

    .credits {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px 16px;
        padding: 16px 2px 4px;
        margin-top: 12px;
        border-top: 1px solid var(--border);
        font-size: 0.82rem;
        color: var(--text-muted);
    }

    .credits a {
        color: var(--text-secondary);
        font-weight: 500;
        text-decoration: none;
    }

    .credits .kofi {
        color: var(--c-vn);
    }
</style>
