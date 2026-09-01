<script lang="ts">
    import type { Snippet } from "svelte";
    import { fade, fly } from "svelte/transition";

    /** Phone-sized modal sheet: dim backdrop, grab handle, slides up. */
    let {
        open,
        label,
        onclose,
        children,
    }: {
        open: boolean;
        label: string;
        onclose: () => void;
        children: Snippet;
    } = $props();

    function onkeydown(e: KeyboardEvent) {
        if (open && e.key === "Escape") onclose();
    }
</script>

<svelte:window {onkeydown} />

{#if open}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="backdrop"
        onclick={onclose}
        transition:fade={{ duration: 150 }}
    ></div>
    <div
        class="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={label}
        transition:fly={{ y: 420, duration: 240, opacity: 1 }}
    >
        <div class="handle" aria-hidden="true"></div>
        {@render children()}
    </div>
{/if}

<style>
    .backdrop {
        position: fixed;
        inset: 0;
        background: rgba(43, 35, 24, 0.32);
        z-index: 300;
    }

    .sheet {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 301;
        background: var(--surface);
        border-radius: 26px 26px 0 0;
        padding: 10px 18px calc(24px + env(safe-area-inset-bottom));
        box-shadow: 0 -12px 40px -12px rgba(43, 35, 24, 0.32);
        max-height: 86vh;
        overflow-y: auto;
    }

    .handle {
        width: 44px;
        height: 4px;
        border-radius: 999px;
        background: var(--out-month);
        margin: 2px auto 14px;
    }
</style>
