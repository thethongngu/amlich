<script lang="ts">
    import {
        clampSidebarWidth,
        writeSidebarWidth,
        SIDEBAR_MIN,
        SIDEBAR_MAX,
    } from "$lib/prefs";

    /**
     * Drag handle on the year card's left edge. It sits on the page grid as a
     * sibling of the card, so `page` is the element the width is measured from.
     */
    let {
        width = $bindable(),
        page,
    }: {
        width: number;
        page: HTMLElement | null;
    } = $props();

    function startResize(e: PointerEvent) {
        if (!page) return;
        e.preventDefault();
        const rect = page.getBoundingClientRect();
        const padLeft = parseFloat(getComputedStyle(page).paddingLeft) || 0;
        const originX = rect.left + padLeft;
        const onMove = (ev: PointerEvent) => {
            width = clampSidebarWidth(ev.clientX - originX);
        };
        const onUp = () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            document.body.classList.remove("resizing");
            writeSidebarWidth(width);
        };
        document.body.classList.add("resizing");
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
    }

    function resizeKey(e: KeyboardEvent) {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        e.preventDefault();
        const step = (e.shiftKey ? 40 : 10) * (e.key === "ArrowLeft" ? -1 : 1);
        width = clampSidebarWidth(width + step);
        writeSidebarWidth(width);
    }
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
    class="resizer"
    role="separator"
    aria-orientation="vertical"
    aria-label="Kéo để đổi độ rộng cột trái"
    aria-valuenow={Math.round(width)}
    aria-valuemin={SIDEBAR_MIN}
    aria-valuemax={SIDEBAR_MAX}
    tabindex="0"
    onpointerdown={startResize}
    onkeydown={resizeKey}
></div>

<style>
    .resizer {
        grid-column: 2;
        grid-row: 1 / -1;
        justify-self: start;
        align-self: stretch;
        width: 12px;
        margin-left: -6px;
        cursor: col-resize;
        background: transparent;
        touch-action: none;
        z-index: 5;
    }

    .resizer::after {
        content: "";
        display: block;
        width: 4px;
        height: 100%;
        margin-left: 6px;
        border-radius: 0 4px 4px 0;
        background: transparent;
        transition: background 0.15s;
    }

    .resizer:hover::after,
    .resizer:focus-visible::after {
        background: var(--accent-soft-border);
    }

    .resizer:focus-visible {
        outline: none;
    }
</style>
