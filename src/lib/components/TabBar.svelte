<script lang="ts">
    export type Tab = "cal" | "upcoming";

    /** Phone bottom bar: calendar ↔ upcoming list, plus the settings sheet. */
    let {
        tab = $bindable(),
        settingsOpen,
        onsettings,
    }: {
        tab: Tab;
        settingsOpen: boolean;
        onsettings: () => void;
    } = $props();
</script>

<nav class="tabbar" aria-label="Chế độ xem">
    <button
        class="item"
        class:active={tab === "cal" && !settingsOpen}
        aria-current={tab === "cal" ? "page" : undefined}
        onclick={() => (tab = "cal")}
    >
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="3" y="5" width="18" height="16" rx="3" />
            <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
        <span>Lịch</span>
    </button>

    <button
        class="item"
        class:active={tab === "upcoming" && !settingsOpen}
        aria-current={tab === "upcoming" ? "page" : undefined}
        onclick={() => (tab = "upcoming")}
    >
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 6h11M9 12h11M9 18h11" />
            <path d="M4 6h.01M4 12h.01M4 18h.01" />
        </svg>
        <span>Sắp tới</span>
    </button>

    <button
        class="item"
        class:active={settingsOpen}
        aria-haspopup="dialog"
        aria-expanded={settingsOpen}
        onclick={onsettings}
    >
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
            />
        </svg>
        <span>Cài đặt</span>
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
        grid-template-columns: repeat(3, 1fr);
        background: var(--surface);
        border-top: 1px solid var(--border);
        padding-bottom: var(--safe-b);
        padding-left: max(6px, var(--safe-l));
        padding-right: max(6px, var(--safe-r));
    }

    .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 3px;
        height: var(--tabbar-h);
        border: none;
        background: none;
        padding: 0;
        font-family: inherit;
        font-size: 0.7rem;
        font-weight: 500;
        letter-spacing: 0.01em;
        color: var(--text-muted);
        cursor: pointer;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
        transition: color 0.18s;
    }

    .item svg {
        width: 23px;
        height: 23px;
        fill: none;
        stroke: currentColor;
        stroke-width: 1.7;
        stroke-linecap: round;
        stroke-linejoin: round;
        transition: stroke-width 0.18s;
    }

    .item.active {
        color: var(--text);
        font-weight: 600;
    }

    .item.active svg {
        stroke-width: 2.1;
    }

    .item:active {
        color: var(--text);
    }
</style>
