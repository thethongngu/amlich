<script lang="ts">
    import type { Snippet } from "svelte";

    /** Fixed footer; `settings` renders the settings popover inline. */
    let {
        gold = false,
        phone = false,
        settings,
    }: {
        gold?: boolean;
        /** Leaves room for the phone tab bar. */
        phone?: boolean;
        settings: Snippet;
    } = $props();
</script>

<footer class="footer" class:gold-theme={gold} class:phone>
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

    /* Phone: parked just above the tab bar. */
    .footer.phone {
        position: fixed;
        left: 0;
        right: 0;
        bottom: calc(58px + env(safe-area-inset-bottom));
        gap: 2px;
        padding: 6px 16px 8px;
        background: var(--page-bg);
    }

    .kofi-link {
        color: var(--c-vn) !important;
    }

    .kofi-link:hover {
        color: #9c2f27 !important;
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
