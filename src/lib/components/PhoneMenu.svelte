<script lang="ts">
    import BottomSheet from "./BottomSheet.svelte";

    /** Phone settings: display toggles plus the site credits, off the page. */
    let {
        open,
        showBoth = $bindable(),
        showMondays = $bindable(),
        onclose,
    }: {
        open: boolean;
        showBoth: boolean;
        showMondays: boolean;
        onclose: () => void;
    } = $props();
</script>

<BottomSheet {open} label="Cài đặt" {onclose}>
    <h2 class="menu-title">Cài đặt</h2>

    <label class="toggle">
        <input type="checkbox" bind:checked={showBoth} />
        <span>Hiện cả dương lịch và âm lịch</span>
    </label>
    <label class="toggle">
        <input type="checkbox" bind:checked={showMondays} />
        <span>Đếm theo số thứ Hai</span>
    </label>

    <div class="credits">
        <span
            >by <a
                href="https://thethongngu.github.io"
                target="_blank"
                rel="noopener">thethongngu</a
            ></span
        >
        <a
            class="kofi"
            href="https://me.momo.vn/dQIQTQtWfeCBCwTGIDIziz"
            target="_blank"
            rel="noopener">Ủng hộ ly cafe sữa (Momo)</a
        >
    </div>
</BottomSheet>

<style>
    .menu-title {
        margin: 0 0 4px;
        padding: 2px 2px 10px;
        font-size: 1rem;
        font-weight: 600;
        color: var(--text);
    }

    .toggle {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 13px 2px;
        border-top: 1px solid var(--border);
        font-size: 0.94rem;
        color: var(--text);
        cursor: pointer;
    }

    .toggle input[type="checkbox"] {
        width: 20px;
        height: 20px;
        flex: none;
        accent-color: var(--accent);
    }

    .credits {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px 16px;
        padding: 16px 2px 4px;
        border-top: 1px solid var(--border);
        margin-top: 8px;
        font-size: 0.82rem;
        color: var(--text-muted);
    }

    .credits a {
        color: var(--text-secondary);
        font-weight: 500;
        text-decoration: none;
    }

    .credits .kofi {
        color: var(--c-vn);
    }
</style>
