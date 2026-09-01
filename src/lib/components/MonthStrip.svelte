<script lang="ts">
    /** Horizontally scrollable month pills; the active month is ink-filled. */
    let {
        month,
        onpick,
    }: {
        month: number;
        onpick: (month: number) => void;
    } = $props();

    let strip: HTMLDivElement | null = $state(null);

    // Keep the active pill in view whenever the month changes.
    $effect(() => {
        const active = strip?.querySelector<HTMLElement>(".pill.active");
        active?.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
        });
    });
</script>

<div class="strip" bind:this={strip}>
    {#each Array.from({ length: 12 }, (_, i) => i + 1) as m}
        <button
            class="pill"
            class:active={m === month}
            aria-current={m === month ? "true" : undefined}
            onclick={() => onpick(m)}
        >
            Tháng {m}
        </button>
    {/each}
</div>

<style>
    .strip {
        display: flex;
        gap: 4px;
        overflow-x: auto;
        scrollbar-width: none;
        margin: 0 -16px;
        padding: 2px 16px 16px;
        scroll-padding: 0 16px;
    }

    .strip::-webkit-scrollbar {
        display: none;
    }

    .pill {
        flex: none;
        border: none;
        background: none;
        border-radius: 999px;
        padding: 7px 13px;
        font-family: inherit;
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--text-secondary);
        cursor: pointer;
        white-space: nowrap;
        transition:
            background 0.15s,
            color 0.15s;
        touch-action: manipulation;
    }

    .pill.active {
        background: var(--today-bg);
        color: var(--today-fg);
        font-weight: 600;
    }
</style>
