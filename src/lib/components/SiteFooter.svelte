<script lang="ts">
    import type { Snippet } from "svelte";

    /** Fixed footer; `settings` renders the settings popover inline. */
    let { gold = false, settings }: { gold?: boolean; settings: Snippet } =
        $props();
</script>

<footer class="footer" class:gold-theme={gold}>
    {@render settings()}
    <span class="sep">·</span>
    <span
        >by <a href="https://thethongngu.github.io" target="_blank" rel="noopener"
            >thethongngu</a
        ></span
    >
    <span class="sep">·</span>
    <a
        href="https://me.momo.vn/dQIQTQtWfeCBCwTGIDIziz"
        target="_blank"
        rel="noopener"
        class="kofi-link">Ủng hộ ly cafe sữa (Momo)</a
    >
</footer>

<style>
    .footer {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        text-align: center;
        padding: 16px;
        font-size: 0.8rem;
        color: var(--text-faint);
    }

    .footer a {
        color: var(--text-muted);
        text-decoration: none;
        font-weight: 500;
    }

    .footer a:hover {
        color: var(--text);
    }

    .sep {
        margin: 0 6px;
    }

    .kofi-link {
        color: #ff5e5b !important;
    }

    .kofi-link:hover {
        color: #e04644 !important;
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
</style>
