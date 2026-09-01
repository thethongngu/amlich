<script lang="ts">
    /**
     * Footer settings popover: display toggles only — countries are picked
     * from the chip in the calendar header.
     */
    let {
        showBoth = $bindable(),
        showMondays = $bindable(),
    }: {
        showBoth: boolean;
        showMondays: boolean;
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
        border-radius: 999px;
        border: none;
        background: none;
        padding: 3px 8px;
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
        width: 14px;
        height: 14px;
    }

    .settings-btn:hover {
        background: var(--surface-sunken);
        color: var(--text);
    }

    .settings-panel {
        position: absolute;
        bottom: calc(100% + 10px);
        left: 50%;
        transform: translateX(-50%);
        text-align: left;
        background: var(--surface);
        border-radius: 14px;
        box-shadow: var(--popover-shadow);
        padding: 12px 16px;
        min-width: 200px;
    }

    .settings-divider {
        height: 1px;
        background: var(--border);
        margin: 8px 0;
    }

    .toggle-row {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.85rem;
        color: var(--text-secondary);
        cursor: pointer;
        white-space: nowrap;
    }

    .toggle-row input[type="checkbox"] {
        accent-color: var(--accent);
    }
</style>
