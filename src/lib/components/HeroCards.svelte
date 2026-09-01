<script lang="ts">
    import { LUNAR_MONTH_NAMES, type TodayInfo } from "$lib/calendar";

    /** Solar + lunar cards for the currently selected day. */
    let {
        selected,
        showBoth,
        offWork = false,
        gold = false,
        sheet = false,
    }: {
        selected: TodayInfo;
        showBoth: boolean;
        /** Stamps "Được nghỉ" across the seam between the two cards. */
        offWork?: boolean;
        gold?: boolean;
        /** Sheet variant: sunken chips, year inline, lunar year shown by parent. */
        sheet?: boolean;
    } = $props();
</script>

<div class="hero-cards" class:sheet>
    {#if offWork}
        <img src="/duocnghi.png" alt="Được nghỉ" class="stamp" />
    {/if}
    <section
        class="hero solar-card"
        class:hidden={!showBoth}
        class:gold-shine={gold && !sheet}
    >
        <div class="card-title">Dương lịch</div>
        <div class="big-day solar-big-day">{selected.solarDay}</div>
        {#if sheet}
            <div class="card-info">
                Tháng {selected.solarMonth}, {selected.solarYear}
            </div>
        {:else}
            <div class="card-info">Tháng {selected.solarMonth}</div>
            <div class="card-sub">{selected.solarYear}</div>
        {/if}
    </section>

    <section class="hero lunar-card" class:gold-shine={gold && !sheet}>
        <div class="card-title">Âm lịch</div>
        <div class="big-day lunar-big-day">{selected.lunarDay}</div>
        <div class="card-info">
            Tháng {LUNAR_MONTH_NAMES[selected.lunarMonth]}{selected.lunarLeap
                ? " (Nhuận)"
                : ""}
        </div>
        {#if !sheet}
            <div class="card-sub">Năm {selected.lunarYearName}</div>
        {/if}
    </section>
</div>

<style>
    .hero-cards {
        position: relative;
        display: flex;
        gap: 10px;
    }

    /* Sits across the seam between the two cards. */
    .stamp {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 7.5em;
        height: 3.4em;
        object-fit: contain;
        transform: translate(-50%, -50%) rotate(-18deg);
        opacity: 0.85;
        pointer-events: none;
        z-index: 2;
    }

    .hero {
        flex: 1;
        text-align: center;
        padding: 14px 10px 12px;
        background: var(--surface);
        border-radius: 18px;
        box-shadow: var(--card-shadow);
        min-width: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .hero.hidden {
        display: none;
    }

    /* Small caps label — the quiet counterpart to the display numeral. */
    .card-title {
        font-size: 0.62rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.16em;
        color: var(--text-muted);
        margin-bottom: 2px;
    }

    .big-day {
        font-family: var(--font-display);
        font-size: 4.2rem;
        font-weight: 600;
        line-height: 1;
        margin: 4px 0 6px;
        letter-spacing: -0.02em;
        font-variant-numeric: lining-nums;
    }

    .lunar-card .card-title {
        color: var(--accent);
        opacity: 0.75;
    }

    .solar-big-day {
        color: var(--text);
    }

    .lunar-big-day {
        color: var(--accent);
    }

    .card-info {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text);
    }

    .card-sub {
        font-size: 0.7rem;
        color: var(--text-muted);
        margin-top: 1px;
    }

    /* ── Sheet variant (phone day detail) ── */

    .hero-cards.sheet {
        gap: 12px;
    }

    .sheet .hero {
        background: var(--surface-sunken);
        box-shadow: none;
        border-radius: 18px;
        padding: 14px 10px 15px;
    }

    .sheet .big-day {
        font-size: 3.6rem;
        margin: 4px 0 8px;
    }

    .sheet .card-info {
        font-size: 0.88rem;
    }

    @media (min-width: 768px) {
        .hero {
            padding: 18px 16px 16px;
        }

        .big-day {
            font-size: 5rem;
            margin: 6px 0 8px;
        }

        .card-info {
            font-size: 0.95rem;
        }

        .card-sub {
            font-size: 0.76rem;
            margin-top: 2px;
        }
    }

    @media (min-width: 1280px) {
        .big-day {
            font-size: 4.2rem;
        }

        .card-info {
            font-size: 0.88rem;
        }
    }
</style>
