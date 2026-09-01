<script lang="ts">
    import { COUNTRIES, type Country, type CountryCode } from "$lib/countries";

    /** Footer settings popover: country picker + display toggles. */
    let {
        selectedCodes,
        showBoth = $bindable(),
        showMondays = $bindable(),
        ontoggleCountry,
    }: {
        selectedCodes: CountryCode[];
        showBoth: boolean;
        showMondays: boolean;
        ontoggleCountry: (country: Country) => void;
    } = $props();

    let open = $state(false);

    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (open && !target.closest(".settings-wrap")) open = false;
    }
</script>

<svelte:window onclick={handleClickOutside} />

<div class="settings-wrap">
    <button
        class="settings-btn"
        onclick={() => (open = !open)}
        aria-label="Cài đặt"
        aria-expanded={open}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <circle cx="12" cy="12" r="3" />
            <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
            />
        </svg>
        <span>Cài đặt</span>
    </button>

    {#if open}
        <div class="settings-panel">
            <div class="setting-block">
                <span class="setting-label">Ngày lễ của</span>
                <div class="country-checks">
                    {#each COUNTRIES as c}
                        <label class="country-check">
                            <input
                                type="checkbox"
                                checked={selectedCodes.includes(c.code)}
                                onchange={() => ontoggleCountry(c)}
                            />
                            <i class="swatch" style:background={c.color}></i>
                            <span>{c.flag} {c.label}</span>
                        </label>
                    {/each}
                </div>
            </div>
            <div class="settings-divider"></div>
            <label class="toggle-row">
                <input type="checkbox" bind:checked={showBoth} />
                <span>Dương lịch + Âm lịch</span>
            </label>
            <div class="settings-divider"></div>
            <label class="toggle-row">
                <input type="checkbox" bind:checked={showMondays} />
                <span>Đếm theo số thứ Hai</span>
            </label>
        </div>
    {/if}
</div>

<style>
    .settings-wrap {
        position: relative;
        display: inline-flex;
        vertical-align: middle;
        z-index: 200;
    }

    .settings-btn {
        border-radius: 8px;
        border: none;
        background: none;
        padding: 2px 6px;
        gap: 5px;
        font: inherit;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-muted);
        transition:
            background 0.15s,
            color 0.15s;
    }

    .settings-btn svg {
        width: 15px;
        height: 15px;
    }

    .settings-btn:hover {
        background: var(--surface-hover);
        color: var(--text);
    }

    .settings-panel {
        position: absolute;
        bottom: calc(100% + 10px);
        left: 50%;
        transform: translateX(-50%);
        text-align: left;
        background: var(--surface);
        border-radius: 12px;
        box-shadow: var(--popover-shadow);
        padding: 12px 16px;
        min-width: 200px;
    }

    .setting-label {
        font-size: 0.8rem;
        color: var(--text-muted);
        white-space: nowrap;
    }

    .settings-divider {
        height: 1px;
        background: var(--border);
        margin: 8px 0;
    }

    .setting-block,
    .country-checks {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .country-check,
    .toggle-row {
        display: flex;
        align-items: center;
        gap: 7px;
        font-size: 0.85rem;
        color: var(--text-muted);
        cursor: pointer;
        white-space: nowrap;
    }

    .country-check input[type="checkbox"],
    .toggle-row input[type="checkbox"] {
        accent-color: var(--accent);
    }

    .swatch {
        width: 10px;
        height: 10px;
        border-radius: 3px;
        flex: none;
    }
</style>
