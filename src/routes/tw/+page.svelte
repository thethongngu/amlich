<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import {
        getTodayInfoTW,
        getDateInfoTW,
        getCalendarDaysTW,
        getUpcomingHolidaysTW,
    } from "$lib/calendar-tw";
    import { DAY_NAMES_SHORT, LUNAR_MONTH_NAMES } from "$lib/calendar";

    const COUNTRY_KEY = "amlich-country";

    onMount(() => {
        localStorage.setItem(COUNTRY_KEY, "tw");
    });

    function switchToVN() {
        localStorage.setItem(COUNTRY_KEY, "vn");
        goto("/");
    }

    const today = getTodayInfoTW();
    const holidays = getUpcomingHolidaysTW();
    const nextHoliday = holidays[0] ?? null;

    let calMonth = $state(today.solarMonth);
    let calYear = $state(today.solarYear);
    let days = $derived(getCalendarDaysTW(calMonth, calYear));

    let selectedDay = $state(today.solarDay);
    let selectedMonth = $state(today.solarMonth);
    let selectedYear = $state(today.solarYear);
    let selected = $derived(
        getDateInfoTW(selectedDay, selectedMonth, selectedYear),
    );

    const SHOW_BOTH_KEY = "amlich-show-both";
    let showBoth = $state(
        typeof localStorage !== "undefined"
            ? localStorage.getItem(SHOW_BOTH_KEY) !== "false"
            : true,
    );
    $effect(() => {
        localStorage.setItem(SHOW_BOTH_KEY, String(showBoth));
    });

    function prevMonth() {
        if (calMonth === 1) {
            calMonth = 12;
            calYear--;
        } else {
            calMonth--;
        }
    }

    function nextMonth() {
        if (calMonth === 12) {
            calMonth = 1;
            calYear++;
        } else {
            calMonth++;
        }
    }

    function goToday() {
        calMonth = today.solarMonth;
        calYear = today.solarYear;
        selectDate(today.solarDay, today.solarMonth, today.solarYear);
    }

    function selectDate(day: number, month: number, year: number) {
        selectedDay = day;
        selectedMonth = month;
        selectedYear = year;
    }

    function goToHoliday(day: number, month: number, year: number) {
        calMonth = month;
        calYear = year;
        selectDate(day, month, year);
    }

    let showMonthPicker = $state(false);
    let showSettings = $state(false);

    function goToMonth(month: number) {
        calMonth = month;
        selectDate(1, month, calYear);
        showMonthPicker = false;
    }

    function toggleMonthPicker() {
        showMonthPicker = !showMonthPicker;
    }

    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (showMonthPicker && !target.closest(".cal-title-wrap")) {
            showMonthPicker = false;
        }
        if (showSettings && !target.closest(".settings-wrap")) {
            showSettings = false;
        }
    }

    const isCurrentMonth = $derived(
        calMonth === today.solarMonth && calYear === today.solarYear,
    );
    const isSelectedToday = $derived(
        selectedDay === today.solarDay &&
            selectedMonth === today.solarMonth &&
            selectedYear === today.solarYear,
    );
    const isSelectedWeekend = $derived(
        selected.dayOfWeek === "Thứ Bảy" || selected.dayOfWeek === "Chủ Nhật",
    );

    const isThanTai = today.lunarMonth === 1 && today.lunarDay === 10;
</script>

<svelte:window onclick={handleClickOutside} />

<div class="settings-wrap">
    <button
        class="settings-btn"
        onclick={() => (showSettings = !showSettings)}
        aria-label="Cài đặt"
    >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
    </button>
    {#if showSettings}
        <div class="settings-panel">
            <div class="setting-row">
                <span class="setting-label">Quốc gia</span>
                <div class="country-options">
                    <button class="country-btn" onclick={switchToVN} aria-label="Việt Nam">🇻🇳</button>
                    <button class="country-btn active" aria-label="Đài Loan">🇹🇼</button>
                </div>
            </div>
            <div class="settings-divider"></div>
            <label class="toggle-row">
                <input type="checkbox" bind:checked={showBoth} />
                <span>Dương lịch + Âm lịch</span>
            </label>
        </div>
    {/if}
</div>

<h1 class="sr-only">Âm lịch Đài Loan - Ngày lễ</h1>
<main class="page" class:gold-theme={isThanTai}>
    <div class="next-holiday">
        {#if isSelectedToday && nextHoliday && nextHoliday.daysUntil === 0}
            <span class="holiday-title">
                {#if selected.isOffWork}<img
                        src="/duocnghi.png"
                        alt="Được nghỉ"
                        class="stamp"
                    />{/if}
                <span class="special-day">🇹🇼 {nextHoliday.name}</span>
            </span>
        {:else if isSelectedToday && nextHoliday}
            🇹🇼 Còn <strong>{nextHoliday.daysUntil} ngày</strong> nữa đến
            <button
                class="holiday-link"
                onclick={() =>
                    goToHoliday(
                        nextHoliday.solarDay,
                        nextHoliday.solarMonth,
                        nextHoliday.solarYear,
                    )}>{nextHoliday.name}</button
            >
        {:else if selected.holiday}
            <span class="holiday-title">
                {#if selected.isOffWork}<img
                        src="/duocnghi.png"
                        alt="Được nghỉ"
                        class="stamp"
                    />{/if}
                <span class="special-day">🇹🇼 {selected.holiday}</span>
            </span>
        {:else if isSelectedWeekend}
            <span class="special-day">🇹🇼 Cuối tuần</span>
        {:else}
            <span class="normal-day">🇹🇼 Ngày bình thường</span>
        {/if}
    </div>
    <div class="today-col">
        <div class="hero-cards">
            <section
                class="hero solar-card"
                class:hidden={!showBoth}
                class:gold-shine={isThanTai}
            >
                <div class="card-title">Dương lịch</div>
                <div class="big-day solar-big-day">{selected.solarDay}</div>
                <div class="card-info">Tháng {selected.solarMonth}</div>
                <div class="card-sub">{selected.solarYear}</div>
            </section>

            <section class="hero lunar-card" class:gold-shine={isThanTai}>
                <div class="card-title">Âm lịch</div>
                <div class="big-day lunar-big-day">{selected.lunarDay}</div>
                <div class="card-info">
                    Tháng {LUNAR_MONTH_NAMES[
                        selected.lunarMonth
                    ]}{selected.lunarLeap ? " (Nhuận)" : ""}
                </div>
                <div class="card-sub">Năm {selected.lunarYearName}</div>
            </section>
        </div>

    </div>

    <section class="cal" class:gold-shine={isThanTai}>
        <div class="cal-header">
            <div class="cal-title-wrap">
                <button class="cal-title" onclick={toggleMonthPicker}>
                    Tháng {calMonth}, {calYear}
                </button>
                {#if showMonthPicker}
                    <div class="month-picker">
                        {#each Array.from({ length: 12 }, (_, i) => i + 1) as m}
                            <button
                                class="month-btn"
                                class:active={m === calMonth}
                                onclick={() => goToMonth(m)}
                            >
                                {m}
                            </button>
                        {/each}
                    </div>
                {/if}
            </div>
            <div class="cal-controls">
                <button
                    class="go-today-btn"
                    class:active={!isCurrentMonth || !isSelectedToday}
                    onclick={goToday}
                    aria-label="Quay về hôm nay">Hôm nay</button
                >
                <button
                    class="nav-btn"
                    onclick={prevMonth}
                    aria-label="Tháng trước">&lsaquo;</button
                >
                <button
                    class="nav-btn"
                    onclick={nextMonth}
                    aria-label="Tháng sau">&rsaquo;</button
                >
            </div>
        </div>
        <div class="grid">
            {#each DAY_NAMES_SHORT as name, i}
                <div class="hdr" class:weekend={i >= 5}>{name}</div>
            {/each}

            {#each days as day}
                <button
                    class="cell"
                    class:is-today={day.isToday}
                    class:is-selected={day.isCurrentMonth &&
                        day.solarDay === selectedDay &&
                        calMonth === selectedMonth &&
                        calYear === selectedYear}
                    class:empty={!day.isCurrentMonth}
                    class:is-holiday={day.isOffWork && !day.isToday}
                    class:is-weekend={day.isWeekend && !day.isToday}
                    disabled={!day.isCurrentMonth}
                    aria-label={day.isCurrentMonth
                        ? `Ngày ${day.solarDay} tháng ${calMonth}, âm lịch ${day.lunarDay}/${day.lunarMonth}${day.holiday ? ", " + day.holiday : ""}`
                        : undefined}
                    onclick={() => selectDate(day.solarDay, calMonth, calYear)}
                >
                    {#if day.isCurrentMonth}
                        <span class="sd">{day.solarDay}</span>
                        <span class="ld" class:new-month={day.lunarDay === 1}>
                            {day.lunarDay === 1
                                ? `1/${day.lunarMonth}`
                                : day.lunarDay}
                        </span>
                    {/if}
                </button>
            {/each}
        </div>
    </section>

    {#if holidays.length > 0}
        <section class="upcoming">
            <h2>Sắp tới</h2>
            <div class="upcoming-list">
                {#each holidays as h}
                    <button
                        class="row"
                        onclick={() =>
                            goToHoliday(h.solarDay, h.solarMonth, h.solarYear)}
                    >
                        <span class="h-name">{h.name}</span>
                        <span class="h-count" class:h-today={h.daysUntil === 0}>
                            {h.daysUntil === 0
                                ? "Hôm nay"
                                : `còn ${h.daysUntil} ngày`}
                        </span>
                    </button>
                {/each}
            </div>
        </section>
    {/if}
</main>

<footer class="footer" class:gold-theme={isThanTai}>
    <span
        >by <a href="https://thethongngu.com" target="_blank" rel="noopener"
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
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }

    /* ── Mobile-first base ── */

    .page {
        max-width: 420px;
        margin: 0 auto;
        padding: 32px 20px 24px;
    }

    /* ── Hero Cards ── */

    .hero-cards {
        display: flex;
        gap: 10px;
    }

    .hero {
        flex: 1;
        text-align: center;
        padding: 20px 12px 16px;
        background: #fff;
        border-radius: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
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
        color: #78716c;
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
        color: #2563eb;
    }

    .lunar-big-day {
        color: #c41e3a;
    }

    .card-info {
        font-size: 1rem;
        font-weight: 600;
        color: #1c1917;
    }

    .card-sub {
        font-size: 0.85rem;
        color: #78716c;
        margin-top: 2px;
    }

    /* ── Settings ── */

    .settings-wrap {
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 200;
    }

    .settings-btn {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: none;
        background: #fff;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #78716c;
        transition: background 0.15s, color 0.15s;
    }

    .settings-btn:hover {
        background: #f5f5f4;
        color: #1c1917;
    }

    .settings-panel {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        padding: 12px 16px;
        min-width: 200px;
    }

    .setting-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }

    .setting-label {
        font-size: 0.8rem;
        color: #78716c;
        white-space: nowrap;
    }

    .country-options {
        display: flex;
        gap: 4px;
    }

    .country-btn {
        width: 34px;
        height: 28px;
        border-radius: 6px;
        border: 1.5px solid transparent;
        background: #f5f5f4;
        cursor: pointer;
        font-size: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: border-color 0.15s, background 0.15s;
    }

    .country-btn.active {
        border-color: #c41e3a;
        background: #fef2f2;
        cursor: default;
    }

    .settings-divider {
        height: 1px;
        background: #f0ede8;
        margin: 8px 0;
    }

    .toggle-row {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.85rem;
        color: #78716c;
        cursor: pointer;
        white-space: nowrap;
    }

    .toggle-row input[type="checkbox"] {
        accent-color: #c41e3a;
    }

    .today-col {
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }

    .next-holiday {
        font-size: 1.5rem;
        font-weight: 700;
        text-align: center;
        margin-bottom: 16px;
        min-height: 2.4em;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 4px 12px;
    }

    .next-holiday strong {
        color: #c41e3a;
        font-weight: 700;
    }

    .holiday-link {
        background: none;
        border: none;
        font: inherit;
        color: #c41e3a;
        font-weight: 700;
        cursor: pointer;
        padding: 0;
        text-decoration: underline;
        text-decoration-thickness: 2px;
        text-underline-offset: 3px;
        text-decoration-color: rgba(196, 30, 58, 0.3);
        transition: text-decoration-color 0.15s;
    }

    .holiday-link:hover {
        text-decoration-color: #c41e3a;
    }

    /* ── Calendar ── */

    .cal {
        background: #fff;
        border-radius: 16px;
        padding: 18px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        margin-top: 16px;
    }

    .cal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 14px;
    }

    .cal-title-wrap {
        position: relative;
    }

    .cal-title {
        font-size: 0.95rem;
        font-weight: 600;
        background: none;
        border: none;
        cursor: pointer;
        color: #1c1917;
        padding: 4px 8px;
        margin-left: -8px;
        border-radius: 8px;
        font-family: inherit;
    }

    .cal-title:hover {
        background: #f5f5f4;
    }

    .cal-controls {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .month-picker {
        display: grid;
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 4px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        padding: 8px;
        grid-template-columns: repeat(4, 1fr);
        gap: 4px;
        z-index: 10;
    }

    .month-btn {
        width: 40px;
        height: 36px;
        border: none;
        background: none;
        border-radius: 8px;
        font-family: inherit;
        font-size: 0.85rem;
        font-weight: 500;
        color: #57534e;
        cursor: pointer;
        transition: background 0.1s;
        touch-action: manipulation;
    }

    .month-btn:hover {
        background: #f5f5f4;
    }

    .month-btn.active {
        background: #c41e3a;
        color: #fff;
        font-weight: 600;
    }

    .go-today-btn {
        border: 1px solid #e7e5e4;
        border-radius: 6px;
        background: none;
        cursor: default;
        color: #d6d3d1;
        padding: 2px 8px;
        font-family: inherit;
        font-size: 0.7rem;
        font-weight: 500;
        line-height: 1.4;
        transition:
            color 0.15s,
            border-color 0.15s,
            background 0.15s;
        touch-action: manipulation;
        white-space: nowrap;
    }

    .go-today-btn.active {
        color: #c41e3a;
        border-color: #c41e3a;
        cursor: pointer;
    }

    .go-today-btn.active:hover {
        background: #c41e3a;
        color: #fff;
    }

    .nav-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border-radius: 8px;
        border: none;
        background: none;
        cursor: pointer;
        font-size: 1.2rem;
        line-height: 1;
        padding: 0;
        color: #78716c;
        font-family: inherit;
        transition: background 0.15s;
        touch-action: manipulation;
    }

    .nav-btn:hover {
        background: #f5f5f4;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 3px;
    }

    .hdr {
        text-align: center;
        font-size: 0.72rem;
        font-weight: 600;
        color: #a8a29e;
        padding: 4px 0 8px;
    }

    .hdr.weekend {
        color: #e57373;
    }

    .cell {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 46px;
        border-radius: 10px;
        gap: 2px;
        border: none;
        background: none;
        padding: 0;
        cursor: pointer;
        font-family: inherit;
        color: #1c1917;
        transition: background 0.1s;
        touch-action: manipulation;
    }

    .cell:not(.empty):not(.is-today):hover {
        background: #f5f5f4;
    }

    .cell.is-today:hover {
        background: #a8162e;
    }

    .cell.empty {
        cursor: default;
    }

    .sd {
        font-size: 0.88rem;
        font-weight: 500;
        line-height: 1.2;
    }

    .ld {
        font-size: 0.6rem;
        color: #c4c0bb;
        line-height: 1.1;
    }

    .ld.new-month {
        color: #c41e3a;
        font-weight: 600;
        font-size: 0.55rem;
    }

    .cell.is-weekend .sd {
        color: #e57373;
    }

    .cell.is-holiday {
        background: #fef2f2;
    }

    .cell.is-today {
        background: #c41e3a;
    }

    .cell.is-today .sd {
        color: #fff;
        font-weight: 700;
    }

    .cell.is-today .ld {
        color: rgba(255, 255, 255, 0.6);
    }

    .cell.is-selected:not(.is-today) {
        outline: 2px solid #c41e3a;
        outline-offset: -2px;
    }

    .normal-day {
        font-size: inherit;
        font-weight: 700;
        color: #1c1917;
    }

    .holiday-title {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .stamp {
        position: absolute;
        left: 50%;
        top: 120%;
        width: 4em;
        height: 2em;
        object-fit: contain;
        z-index: 1;
        transform: translateX(-50%) rotate(-25deg);
        opacity: 0.85;
        pointer-events: none;
    }

    .special-day {
        font-size: inherit;
        font-weight: 700;
        color: #c41e3a;
    }

    /* ── Upcoming ── */

    .upcoming {
        padding: 24px 20px 0;
    }

    .upcoming h2 {
        font-size: 0.75rem;
        font-weight: 600;
        color: #a8a29e;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin: 0 0 12px;
    }

    .row {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: baseline;
        padding: 10px 8px;
        margin: 0 -8px;
        border-bottom: 1px solid #f0ede8;
        background: none;
        border-left: none;
        border-right: none;
        border-top: none;
        cursor: pointer;
        font-family: inherit;
        color: #1c1917;
        border-radius: 8px;
        transition: background 0.15s;
        touch-action: manipulation;
    }

    .row:hover {
        background: #f5f5f4;
    }

    .row:last-child {
        border-bottom: none;
    }

    .h-name {
        font-size: 0.8rem;
        font-weight: 500;
    }

    .h-count {
        font-size: 0.8rem;
        font-weight: 600;
        color: #c41e3a;
    }

    .h-count.h-today {
        background: #c41e3a;
        color: #fff;
        padding: 2px 12px;
        border-radius: 12px;
    }

    /* ── Gold Shine (Vía Thần Tài) ── */

    .gold-shine {
        position: relative;
        background: linear-gradient(
            135deg,
            #fffdf5 0%,
            #fff9e6 50%,
            #fffdf5 100%
        );
        border: 1.5px solid #e8d48b;
    }

    .gold-shine::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
            105deg,
            transparent 20%,
            rgba(255, 215, 0, 0.12) 35%,
            rgba(255, 223, 100, 0.28) 45%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 223, 100, 0.28) 55%,
            rgba(255, 215, 0, 0.12) 65%,
            transparent 80%
        );
        background-size: 300% 100%;
        animation: gold-sweep 3s ease-in-out infinite;
        pointer-events: none;
        z-index: 1;
        border-radius: inherit;
    }

    @keyframes gold-sweep {
        0% {
            background-position: 100% 0;
        }
        100% {
            background-position: -50% 0;
        }
    }

    .gold-shine.solar-card {
        box-shadow: 0 2px 12px rgba(218, 165, 32, 0.15);
    }

    .gold-shine.lunar-card {
        box-shadow: 0 2px 12px rgba(218, 165, 32, 0.15);
    }

    .gold-shine.cal {
        box-shadow: 0 2px 12px rgba(218, 165, 32, 0.15);
    }

    /* ── Gold Theme overrides (Vía Thần Tài) ── */

    .gold-theme .special-day {
        color: #b8860b;
    }

    .gold-theme .next-holiday strong {
        color: #b8860b;
    }

    .gold-theme .holiday-link {
        color: #b8860b;
        text-decoration-color: rgba(184, 134, 11, 0.3);
    }

    .gold-theme .holiday-link:hover {
        text-decoration-color: #b8860b;
    }

    .gold-theme .cell.is-today {
        background: linear-gradient(135deg, #daa520, #f0c040);
    }

    .gold-theme .cell.is-today:hover {
        background: linear-gradient(135deg, #c49520, #daa520);
    }

    .gold-theme .cell.is-selected:not(.is-today) {
        outline-color: #daa520;
    }

    .gold-theme .cell.is-holiday {
        background: #fff0c2;
    }

    .gold-theme .ld.new-month {
        color: #b8860b;
    }

    .gold-theme .toggle-row input[type="checkbox"] {
        accent-color: #daa520;
    }

    .gold-theme .go-today-btn.active {
        color: #b8860b;
        border-color: #b8860b;
    }

    .gold-theme .go-today-btn.active:hover {
        background: #daa520;
        color: #fff;
    }

    .gold-theme .month-btn.active {
        background: #daa520;
    }

    .gold-theme .h-count {
        color: #b8860b;
    }

    .gold-theme .h-count.h-today {
        background: linear-gradient(135deg, #daa520, #f0c040);
        color: #fff;
    }

    :global(body:has(.gold-theme)) {
        background: #fdf8ec;
    }

    .footer.gold-theme .kofi-link {
        color: #daa520 !important;
    }

    .footer.gold-theme .kofi-link:hover {
        color: #b8860b !important;
    }

    /* ── Desktop ── */

    @media (min-width: 768px) {
        .settings-wrap {
            top: 14px;
            right: 14px;
        }

        .settings-btn {
            width: 36px;
            height: 36px;
        }

        .page {
            max-width: 960px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto auto 1fr;
            gap: 32px 56px;
            padding: 48px;
            padding-bottom: 64px;
            height: 100dvh;
            box-sizing: border-box;
            align-content: start;
        }

        .stamp {
            left: -2.4em;
            top: -120%;
            width: 6em;
            height: 3em;
        }

        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
        }

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

        .next-holiday {
            grid-column: 1 / -1;
            grid-row: 1;
            font-size: 2.2rem;
            margin-bottom: 0;
            min-height: auto;
        }

        .today-col {
            grid-column: 1;
            grid-row: 2;
            align-self: start;
        }

        .cal {
            grid-column: 2;
            grid-row: 2 / -1;
            padding: 28px;
            margin-top: 0;
            align-self: start;
        }

        .upcoming {
            grid-column: 1;
            grid-row: 3;
            padding: 0;
            min-height: 0;
            display: flex;
            flex-direction: column;
        }

        .upcoming-list {
            overflow-y: auto;
            min-height: 0;
            flex: 1;
            padding: 0 16px;
        }

        .cal-title {
            font-size: 1.05rem;
        }

        .nav-btn {
            width: 34px;
            height: 34px;
            font-size: 1.3rem;
        }

        .cell {
            min-height: 58px;
        }

        .sd {
            font-size: 1rem;
        }

        .ld {
            font-size: 0.7rem;
        }

        .ld.new-month {
            font-size: 0.6rem;
        }

        .hdr {
            font-size: 0.8rem;
            padding: 6px 0 10px;
        }

        .h-name {
            font-size: 0.85rem;
        }

        .h-count {
            font-size: 0.85rem;
        }

        .row {
            padding: 12px 0;
        }
    }

    /* ── Footer ── */

    .footer {
        text-align: center;
        padding: 16px;
        font-size: 0.8rem;
        color: #a8a29e;
    }

    .footer a {
        color: #78716c;
        text-decoration: none;
        font-weight: 500;
    }

    .footer a:hover {
        color: #1c1917;
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
</style>
