<script lang="ts">
    import CountryRows from "./CountryRows.svelte";
    import { COUNTRIES, type Country, type CountryCode } from "$lib/countries";

    /** Chip that opens the country multi-select. Desktop and tablet only. */
    let {
        selectedCodes,
        ontoggle,
    }: {
        selectedCodes: CountryCode[];
        ontoggle: (country: Country) => void;
    } = $props();

    let open = $state(false);

    const active = $derived(
        COUNTRIES.filter((c) => selectedCodes.includes(c.code)),
    );
    const label = $derived(
        active.length === 1 ? active[0].label : `${active.length} quốc gia`,
    );

    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (open && !target.closest(".picker-wrap")) open = false;
    }
</script>

<svelte:window onclick={handleClickOutside} />

<div class="picker-wrap">
    <button
        class="chip"
        class:open
        onclick={() => (open = !open)}
        aria-expanded={open}
        aria-label="Chọn quốc gia"
    >
        <span class="flags">
            {#each active as c}<span>{c.flag}</span>{/each}
        </span>
        <span class="chip-label">{label}</span>
        <span class="caret" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></svg>
        </span>
    </button>

    {#if open}
        <div class="panel" role="group" aria-label="Chọn nhiều quốc gia">
            <div class="panel-title">Chọn nhiều quốc gia</div>
            <CountryRows {selectedCodes} {ontoggle} />
        </div>
    {/if}
</div>

<style>
    .picker-wrap {
        position: relative;
        display: inline-flex;
        z-index: 40;
    }

    .chip {
        display: inline-flex;
        align-items: center;
        gap: 0.65em;
        padding: 0.5em 1em;
        border: 1px solid var(--border);
        border-radius: 999px;
        background: var(--surface-sunken);
        color: var(--text-secondary);
        font-family: inherit;
        font-size: var(--control-font, 0.78rem);
        font-weight: 500;
        cursor: pointer;
        white-space: nowrap;
        transition:
            background 0.15s,
            color 0.15s;
        touch-action: manipulation;
    }

    .chip.open {
        background: var(--surface-hover);
        color: var(--text);
    }

    @media (hover: hover) {
        .chip:hover {
            background: var(--surface-hover);
            color: var(--text);
        }
    }

    /* Flags read as separate marks, so give them air. */
    .flags {
        display: inline-flex;
        gap: 0.3em;
        font-size: 1.1em;
        line-height: 1;
    }

    .caret {
        display: flex;
        align-items: center;
        color: var(--text-muted);
        margin-right: -2px;
        transition: transform 0.18s;
    }

    .caret svg {
        width: 1.1em;
        height: 1.1em;
        fill: none;
        stroke: currentColor;
        stroke-width: 2.6;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    .chip.open .caret {
        transform: rotate(180deg);
    }

    .panel {
        position: absolute;
        top: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
        min-width: 230px;
        padding: 12px 10px;
        background: var(--surface);
        border-radius: var(--r-panel);
        box-shadow: var(--popover-shadow);
        text-align: left;
    }

    .panel-title {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text);
        padding: 2px 12px 10px;
    }
</style>
