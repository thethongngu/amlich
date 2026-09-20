<script lang="ts">
    import { COUNTRIES, type Country, type CountryCode } from "$lib/countries";

    /** The country multi-select rows, shared by the desktop chip and the phone menu. */
    let {
        selectedCodes,
        ontoggle,
        large = false,
    }: {
        selectedCodes: CountryCode[];
        ontoggle: (country: Country) => void;
        /** Phone sizing: taller rows for thumbs. */
        large?: boolean;
    } = $props();
</script>

{#each COUNTRIES as c}
    {@const on = selectedCodes.includes(c.code)}
    <button
        class="row"
        class:on
        class:large
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

<style>
    .row {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        padding: 9px 12px;
        border: none;
        border-radius: var(--r-cell);
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

    @media (hover: hover) {
        .row:hover {
            background: var(--surface-sunken);
        }
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
        text-align: left;
    }

    .check {
        width: 0.8em;
        font-size: 0.8rem;
        color: var(--c);
    }

    /* ── Phone sizing ── */

    .row.large {
        padding: 12px 14px;
        border-radius: var(--r-card);
        font-size: 0.92rem;
        gap: 11px;
    }

    .row.large + .row.large {
        margin-top: 4px;
    }

    .row.large .dot {
        width: 8px;
        height: 8px;
    }

    .row.large .row-flag {
        font-size: 1rem;
    }

    .row.large .check {
        font-size: 0.9rem;
    }
</style>
