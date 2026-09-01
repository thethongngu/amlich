<script lang="ts">
    import BottomSheet from "./BottomSheet.svelte";
    import HeroCards from "./HeroCards.svelte";
    import type { TodayInfo } from "$lib/calendar";
    import type { Mark } from "$lib/holidays";

    /** Tapping a day on a phone opens this: both dates + that day's holidays. */
    let {
        open,
        selected,
        marks,
        offWork,
        gold = false,
        onclose,
    }: {
        open: boolean;
        selected: TodayInfo;
        marks: Mark[];
        offWork: boolean;
        gold?: boolean;
        onclose: () => void;
    } = $props();
</script>

<BottomSheet {open} label="Chi tiết ngày" {onclose}>
    <HeroCards {selected} showBoth {offWork} {gold} sheet />

    <div class="lunar-year">Năm {selected.lunarYearName}</div>

    {#if marks.length > 0}
        <div class="marks">
            {#each marks as m}
                <div class="mark-row">
                    <i class="dot" style:background={m.color}></i>
                    <span class="mark-name">{m.name}</span>
                    <span class="mark-country">{m.flag} {m.label}</span>
                </div>
            {/each}
        </div>
    {/if}
</BottomSheet>

<style>
    .lunar-year {
        text-align: center;
        font-size: 0.8rem;
        color: var(--text-secondary);
        padding: 12px 0 4px;
    }

    .marks {
        margin-top: 6px;
    }

    .mark-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 13px 2px;
        border-top: 1px solid var(--border);
    }

    .dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        flex: none;
    }

    .mark-name {
        flex: 1;
        min-width: 0;
        font-size: 0.92rem;
        font-weight: 600;
        color: var(--text);
    }

    .mark-country {
        font-size: 0.8rem;
        color: var(--text-muted);
        white-space: nowrap;
    }
</style>
