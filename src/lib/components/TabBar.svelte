<script lang="ts">
    export type Tab = "cal" | "upcoming";

    /** Phone bottom bar: calendar ↔ upcoming list, plus the settings sheet. */
    let {
        tab = $bindable(),
        onsettings,
    }: {
        tab: Tab;
        onsettings: () => void;
    } = $props();

    const tabs: { id: Tab; label: string }[] = [
        { id: "cal", label: "Lịch" },
        { id: "upcoming", label: "Sắp tới" },
    ];
</script>

<nav class="tabbar" aria-label="Chế độ xem">
    {#each tabs as t}
        <button
            class="tab"
            class:active={tab === t.id}
            aria-current={tab === t.id ? "page" : undefined}
            onclick={() => (tab = t.id)}
        >
            {t.label}
        </button>
    {/each}

    <button class="settings" onclick={onsettings} aria-label="Cài đặt">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="3" />
            <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
            />
        </svg>
    </button>
</nav>

<style>
    .tabbar {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 100;
        display: grid;
        grid-template-columns: 1fr 1fr 60px;
        background: var(--surface);
        border-top: 1px solid var(--border);
        padding-bottom: var(--safe-b);
        padding-left: max(10px, var(--safe-l));
        padding-right: max(10px, var(--safe-r));
    }

    .tab {
        position: relative;
        border: none;
        background: none;
        height: var(--tabbar-h);
        padding: 0;
        font-family: inherit;
        font-size: 0.88rem;
        font-weight: 500;
        color: var(--text-muted);
        cursor: pointer;
        touch-action: manipulation;
        transition: color 0.18s;
    }

    /* The active tab is marked by a rule on the bar's own top edge. */
    .tab::before {
        content: "";
        position: absolute;
        top: -1px;
        left: 50%;
        transform: translateX(-50%);
        width: 34px;
        height: 2px;
        border-radius: 0 0 2px 2px;
        background: transparent;
        transition: background 0.18s;
    }

    .tab.active {
        color: var(--text);
        font-weight: 600;
    }

    .tab.active::before {
        background: var(--text);
    }

    .settings {
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        border-left: 1px solid var(--border);
        background: none;
        color: var(--text-muted);
        padding: 0;
        cursor: pointer;
        touch-action: manipulation;
    }

    .settings svg {
        width: 19px;
        height: 19px;
    }

    .settings:active {
        color: var(--text);
    }
</style>
