<script lang="ts">
    export type Tab = "cal" | "upcoming";

    /** Bottom segmented control on phones: calendar ↔ upcoming list. */
    let {
        tab = $bindable(),
    }: {
        tab: Tab;
    } = $props();
</script>

<nav class="tabbar" aria-label="Chế độ xem">
    <button
        class="tab"
        class:active={tab === "cal"}
        aria-current={tab === "cal" ? "page" : undefined}
        onclick={() => (tab = "cal")}>Lịch</button
    >
    <button
        class="tab"
        class:active={tab === "upcoming"}
        aria-current={tab === "upcoming" ? "page" : undefined}
        onclick={() => (tab = "upcoming")}>Sắp tới</button
    >
</nav>

<style>
    .tabbar {
        position: fixed;
        left: 18px;
        right: 18px;
        bottom: calc(10px + env(safe-area-inset-bottom));
        z-index: 100;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4px;
        padding: 4px;
        border-radius: 18px;
        background: var(--surface-sunken);
        box-shadow: 0 6px 20px -10px rgba(43, 35, 24, 0.3);
    }

    .tab {
        border: none;
        background: none;
        border-radius: 15px;
        padding: 10px 0;
        font-family: inherit;
        font-size: 0.88rem;
        font-weight: 500;
        color: var(--out-month);
        cursor: pointer;
        touch-action: manipulation;
        transition:
            background 0.18s,
            color 0.18s;
    }

    .tab.active {
        background: var(--surface);
        color: var(--text);
        font-weight: 600;
        box-shadow: 0 1px 3px rgba(43, 35, 24, 0.08);
    }
</style>
