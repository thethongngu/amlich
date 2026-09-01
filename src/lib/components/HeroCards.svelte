<script lang="ts">
    import { LUNAR_MONTH_NAMES, type TodayInfo } from "$lib/calendar";

    /** Solar + lunar cards for the currently selected day. */
    let {
        selected,
        showBoth,
        gold = false,
    }: { selected: TodayInfo; showBoth: boolean; gold?: boolean } = $props();
</script>

<div class="hero-cards">
    <section
        class="hero solar-card"
        class:hidden={!showBoth}
        class:gold-shine={gold}
    >
        <div class="card-title">Dương lịch</div>
        <div class="big-day solar-big-day">{selected.solarDay}</div>
        <div class="card-info">Tháng {selected.solarMonth}</div>
        <div class="card-sub">{selected.solarYear}</div>
    </section>

    <section class="hero lunar-card" class:gold-shine={gold}>
        <div class="card-title">Âm lịch</div>
        <div class="big-day lunar-big-day">{selected.lunarDay}</div>
        <div class="card-info">
            Tháng {LUNAR_MONTH_NAMES[selected.lunarMonth]}{selected.lunarLeap
                ? " (Nhuận)"
                : ""}
        </div>
        <div class="card-sub">Năm {selected.lunarYearName}</div>
    </section>
</div>

<style>
    .hero-cards {
        display: flex;
        gap: 10px;
    }

    .hero {
        flex: 1;
        text-align: center;
        padding: 20px 12px 16px;
        background: var(--surface);
        border-radius: 20px;
        box-shadow: var(--card-shadow);
        min-width: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .hero.hidden {
        display: none;
    }

    .card-title {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text-muted);
        margin-bottom: 4px;
    }

    .big-day {
        font-size: 4.5rem;
        font-weight: 800;
        line-height: 1;
        margin: 4px 0 8px;
        letter-spacing: -0.03em;
    }

    .solar-big-day {
        color: var(--text);
    }

    .lunar-big-day {
        color: var(--accent);
    }

    .card-info {
        font-size: 1rem;
        font-weight: 600;
        color: var(--text);
    }

    .card-sub {
        font-size: 0.85rem;
        color: var(--text-muted);
        margin-top: 2px;
    }

    @media (min-width: 768px) {
        .hero {
            padding: 28px 20px 20px;
        }

        .big-day {
            font-size: 5.5rem;
            margin: 8px 0 12px;
        }

        .card-info {
            font-size: 1.15rem;
        }

        .card-sub {
            font-size: 0.95rem;
            margin-top: 4px;
        }
    }

    @media (min-width: 1280px) {
        .big-day {
            font-size: 4.4rem;
        }
    }
</style>
