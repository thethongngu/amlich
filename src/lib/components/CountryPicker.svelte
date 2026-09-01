<script lang="ts">
    import BottomSheet from "./BottomSheet.svelte";
    import { COUNTRIES, type Country, type CountryCode } from "$lib/countries";

    /**
     * Chip that opens the country multi-select: a dropdown on desktop,
     * a bottom sheet on phones (`sheet`).
     */
    let {
        selectedCodes,
        ontoggle,
        sheet = false,
        flagsOnly = false,
    }: {
        selectedCodes: CountryCode[];
        ontoggle: (country: Country) => void;
        sheet?: boolean;
        flagsOnly?: boolean;
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
        if (open && !sheet && !target.closest(".picker-wrap")) open = false;
    }
</script>

<svelte:window onclick={handleClickOutside} />

{#snippet rows()}
    {#each COUNTRIES as c}
        {@const on = selectedCodes.includes(c.code)}
        <button
            class="row"
            class:on
            style:--c={c.color}
            style:--tint={c.tint}
            aria-pressed={on}
            onclick={() => ontoggle(c)}
        >
            <i class="dot"></i>
            <span class="row-flag">{c.flag}</span>
            <span class="row-label">{c.label}</span>
            <span class="check" aria-hidden="true">{on ? "✓" : ""}</span>
        </button>
    {/each}
{/snippet}

<div class="picker-wrap" class:is-sheet={sheet}>
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
        {#if !flagsOnly}<span class="chip-label">{label}</span>{/if}
        <span class="caret" aria-hidden="true">▾</span>
    </button>

    {#if open && !sheet}
        <div class="panel" role="group" aria-label="Chọn nhiều quốc gia">
            <div class="panel-title">Chọn nhiều quốc gia</div>
            {@render rows()}
        </div>
    {/if}
</div>

{#if sheet}
    <BottomSheet
        {open}
        label="Chọn nhiều quốc gia"
        onclose={() => (open = false)}
    >
        <div class="sheet-body">
            <div class="panel-title">Chọn nhiều quốc gia</div>
            {@render rows()}
        </div>
    </BottomSheet>
{/if}

<style>
    .picker-wrap {
        position: relative;
        display: inline-flex;
        z-index: 40;
    }

    .chip {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        border: none;
        border-radius: 999px;
        background: var(--surface-sunken);
        color: var(--text-secondary);
        font-family: inherit;
        font-size: 0.78rem;
        font-weight: 500;
        cursor: pointer;
        white-space: nowrap;
        transition:
            background 0.15s,
            color 0.15s;
        touch-action: manipulation;
    }

    .chip:hover,
    .chip.open {
        background: var(--surface-hover);
        color: var(--text);
    }

    /* Phone chip: comfy tap target, flags only. */
    .is-sheet .chip {
        padding: 8px 11px;
        border-radius: 12px;
    }

    /* Flags read as separate marks, so give them air. */
    .flags {
        display: inline-flex;
        gap: 4px;
        font-size: 0.85rem;
        line-height: 1;
    }

    .is-sheet .flags {
        font-size: 0.9rem;
    }

    .caret {
        font-size: 0.6rem;
        color: var(--text-muted);
        line-height: 1;
    }

    .panel {
        position: absolute;
        top: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
        min-width: 230px;
        padding: 12px 10px;
        background: var(--surface);
        border-radius: 16px;
        box-shadow: var(--popover-shadow);
        text-align: left;
    }

    .panel-title {
        font-size: 0.62rem;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--text-muted);
        padding: 2px 12px 10px;
    }

    .row {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        padding: 9px 12px;
        border: none;
        border-radius: 10px;
        background: none;
        font-family: inherit;
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--text-secondary);
        cursor: pointer;
        transition: background 0.12s;
        touch-action: manipulation;
    }

    .row + .row {
        margin-top: 3px;
    }

    .row:hover {
        background: var(--surface-sunken);
    }

    .row.on {
        background: var(--tint);
        color: var(--c);
    }

    .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        flex: none;
        background: var(--out-month);
    }

    .row.on .dot {
        background: var(--c);
    }

    .row-flag {
        font-size: 0.95rem;
        line-height: 1;
    }

    .row-label {
        flex: 1;
        white-space: nowrap;
    }

    .check {
        width: 0.8em;
        font-size: 0.8rem;
        color: var(--c);
    }

    /* ── Sheet list: bigger rows for thumbs ── */

    .sheet-body .panel-title {
        padding: 2px 14px 12px;
        font-size: 0.68rem;
        letter-spacing: 0.14em;
    }

    .sheet-body .row {
        padding: 12px 14px;
        border-radius: 14px;
        font-size: 0.92rem;
        gap: 11px;
    }

    .sheet-body .row + .row {
        margin-top: 4px;
    }

    .sheet-body .dot {
        width: 8px;
        height: 8px;
    }

    .sheet-body .row-flag {
        font-size: 1rem;
    }

    .sheet-body .check {
        font-size: 0.9rem;
    }
</style>
