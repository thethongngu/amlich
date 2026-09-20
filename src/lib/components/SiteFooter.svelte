<script lang="ts">
    import type { Snippet } from "svelte";

    /**
     * Fixed footer for tablet and desktop; `settings` renders the settings
     * popover inline. Phones reach the same settings from the tab bar.
     */
    let {
        gold = false,
        settings,
    }: {
        gold?: boolean;
        settings: Snippet;
    } = $props();
</script>

<footer class="footer" class:gold-theme={gold}>
    <!-- Settings sits on its own line, above the credits. -->
    <div class="settings-line">{@render settings()}</div>
    <span class="sep lead-sep" aria-hidden="true">·</span>
    <div class="credits">
        <span
            >by <a
                href="https://thethongngu.github.io"
                target="_blank"
                rel="noopener">thethongngu</a
            ></span
        >
        <span class="sep">·</span>
        <a
            href="https://me.momo.vn/dQIQTQtWfeCBCwTGIDIziz"
            target="_blank"
            rel="noopener"
            class="kofi-link">Ủng hộ ly cafe sữa (Momo)</a
        >
    </div>
</footer>

<style>
    .footer {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        text-align: center;
        padding: 14px 16px;
        font-size: 0.78rem;
        color: var(--text-faint);
    }

    .settings-line,
    .credits {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
    }

    .footer a {
        color: var(--text-secondary);
        text-decoration: none;
        font-weight: 500;
    }

    .footer a:hover {
        color: var(--text);
    }

    .sep {
        margin: 0 6px;
    }

    .lead-sep {
        display: none;
    }

    .kofi-link {
        color: var(--c-vn) !important;
    }

    .kofi-link:hover {
        color: var(--c-vn-strong) !important;
    }

    .footer.gold-theme .kofi-link {
        color: var(--accent) !important;
    }

    .footer.gold-theme .kofi-link:hover {
        color: var(--accent-strong) !important;
    }

    @media (min-width: 768px) {
        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            padding-bottom: calc(14px + var(--safe-b));
            padding-left: max(16px, var(--safe-l));
            padding-right: max(16px, var(--safe-r));
        }
    }

    /* Year view: one right-aligned line — settings next to the credits. */
    @media (min-width: 1280px) {
        .footer {
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;
            gap: 0;
            padding-right: 34px;
        }

        .lead-sep {
            display: inline;
        }
    }
</style>
