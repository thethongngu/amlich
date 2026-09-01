<script lang="ts">
    import { untrack } from "svelte";
    import { getTodayInfo, getDateInfo } from "$lib/calendar";
    import {
        COUNTRIES,
        getCountry,
        readSelectedCodes,
        writeSelectedCodes,
        type Country,
        type CountryCode,
    } from "$lib/countries";
    import {
        buildDays,
        marksForDate,
        mergeUpcoming,
        formatCountdown,
        formatCountdownHeading,
    } from "$lib/holidays";
    import {
        readShowBoth,
        writeShowBoth,
        readShowMondays,
        writeShowMondays,
        readSidebarWidth,
        writeSidebarWidth,
        clampSidebarWidth,
        SIDEBAR_MIN,
        SIDEBAR_MAX,
    } from "$lib/prefs";
    import DayHeadline from "$lib/components/DayHeadline.svelte";
    import HeroCards from "$lib/components/HeroCards.svelte";
    import MobileHeader from "$lib/components/MobileHeader.svelte";
    import MonthStrip from "$lib/components/MonthStrip.svelte";
    import MonthGrid from "$lib/components/MonthGrid.svelte";
    import DaySheet from "$lib/components/DaySheet.svelte";
    import TabBar, { type Tab } from "$lib/components/TabBar.svelte";
    import MonthCalendar from "$lib/components/MonthCalendar.svelte";
    import YearCalendar from "$lib/components/YearCalendar.svelte";
    import UpcomingList from "$lib/components/UpcomingList.svelte";
    import SettingsMenu from "$lib/components/SettingsMenu.svelte";
    import SiteFooter from "$lib/components/SiteFooter.svelte";

    /**
     * Shared calendar page. Routes only pass the country used as the default
     * selection on first visit; afterwards the user picks any set of countries
     * in settings and all of their holidays are shown together.
     */
    let { code }: { code: CountryCode } = $props();

    // `code` is a static per-route literal, so reading it once is intentional.
    const country: Country = untrack(() => getCountry(code));
    const today = getTodayInfo();
    const isThanTai = today.lunarMonth === 1 && today.lunarDay === 10;

    // ── Country selection (multi) ──

    let selectedCodes = $state<CountryCode[]>(readSelectedCodes(country.code));
    const activeCountries = $derived(
        COUNTRIES.filter((c) => selectedCodes.includes(c.code)),
    );
    const multi = $derived(activeCountries.length > 1);
    const allFlags = $derived(activeCountries.map((c) => c.flag).join(""));

    function toggleCountry(c: Country) {
        const has = selectedCodes.includes(c.code);
        // Keep at least one country selected.
        if (has && selectedCodes.length === 1) return;
        selectedCodes = has
            ? selectedCodes.filter((x) => x !== c.code)
            : [...selectedCodes, c.code];
        writeSelectedCodes(selectedCodes);
    }

    // ── Preferences ──

    let showBoth = $state(readShowBoth());
    let showMondays = $state(readShowMondays());
    $effect(() => writeShowBoth(showBoth));
    $effect(() => writeShowMondays(showMondays));

    // ── Displayed period + selection ──

    let calMonth = $state(today.solarMonth);
    let calYear = $state(today.solarYear);
    let selectedDay = $state(today.solarDay);
    let selectedMonth = $state(today.solarMonth);
    let selectedYear = $state(today.solarYear);

    const selected = $derived(
        getDateInfo(selectedDay, selectedMonth, selectedYear),
    );
    const selectedMarks = $derived(
        marksForDate(selectedDay, selectedMonth, selectedYear, activeCountries),
    );
    const selectedIsOffWork = $derived(selectedMarks.some((m) => m.offWork));
    const isSelectedToday = $derived(
        selectedDay === today.solarDay &&
            selectedMonth === today.solarMonth &&
            selectedYear === today.solarYear,
    );
    const isSelectedWeekend = $derived(
        selected.dayOfWeek === "Thứ Bảy" || selected.dayOfWeek === "Chủ Nhật",
    );
    const isCurrentMonth = $derived(
        calMonth === today.solarMonth && calYear === today.solarYear,
    );

    const allHolidays = $derived(mergeUpcoming(activeCountries));
    const nextHoliday = $derived(allHolidays[0] ?? null);

    // "Sắp tối" only lists the year on screen; if that year is already over
    // (or out of data range) fall back to everything we know about.
    const holidays = $derived.by(() => {
        const inYear = allHolidays.filter((h) => h.solarYear === calYear);
        return inYear.length > 0 ? inYear : allHolidays;
    });
    const days = $derived(buildDays(calMonth, calYear, activeCountries));

    // ── Breakpoints: phone layout below 768px, full-year grid from 1280px ──

    // Seeded from matchMedia so the phone layout is right on first paint.
    const matches = (q: string) =>
        typeof window !== "undefined" && window.matchMedia(q).matches;

    let wide = $state(matches("(min-width: 1280px)"));
    let narrow = $state(matches("(max-width: 767px)"));
    $effect(() => {
        const yearMq = window.matchMedia("(min-width: 1280px)");
        const phoneMq = window.matchMedia("(max-width: 767px)");
        const update = () => {
            wide = yearMq.matches;
            narrow = phoneMq.matches;
        };
        update();
        yearMq.addEventListener("change", update);
        phoneMq.addEventListener("change", update);
        return () => {
            yearMq.removeEventListener("change", update);
            phoneMq.removeEventListener("change", update);
        };
    });

    // ── Phone-only state: bottom tabs + day detail sheet ──

    let tab = $state<Tab>("cal");
    let sheetOpen = $state(false);

    function selectCellMobile(day: number, month: number, year: number) {
        selectCell(day, month, year);
        sheetOpen = true;
    }

    function goToHolidayMobile(day: number, month: number, year: number) {
        calMonth = month;
        calYear = year;
        selectDate(day, month, year);
        tab = "cal";
        sheetOpen = true;
    }

    const yearMonths = $derived(
        wide
            ? Array.from({ length: 12 }, (_, i) => ({
                  month: i + 1,
                  days: buildDays(i + 1, calYear, activeCountries),
              }))
            : [],
    );

    // ── Navigation ──

    function selectDate(day: number, month: number, year: number) {
        selectedDay = day;
        selectedMonth = month;
        selectedYear = year;
    }

    function selectCell(day: number, month: number, year: number) {
        calMonth = month;
        if (!wide) calYear = year;
        selectDate(day, month, year);
    }

    function prevMonth() {
        if (calMonth === 1) {
            calMonth = 12;
            calYear--;
        } else calMonth--;
    }

    function nextMonth() {
        if (calMonth === 12) {
            calMonth = 1;
            calYear++;
        } else calMonth++;
    }

    function goToMonth(month: number) {
        calMonth = month;
        selectDate(1, month, calYear);
    }

    function goToday() {
        calMonth = today.solarMonth;
        calYear = today.solarYear;
        selectDate(today.solarDay, today.solarMonth, today.solarYear);
    }

    let calEl: HTMLElement | null = $state(null);

    function goToHoliday(day: number, month: number, year: number) {
        calMonth = month;
        calYear = year;
        selectDate(day, month, year);
        if (!calEl) return;
        const rect = calEl.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) return;
        calEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // ── Resizable sidebar (wide screens) ──

    let sidebarWidth = $state(readSidebarWidth());
    let pageEl: HTMLElement | null = $state(null);

    function startResize(e: PointerEvent) {
        if (!pageEl) return;
        e.preventDefault();
        const rect = pageEl.getBoundingClientRect();
        const padLeft = parseFloat(getComputedStyle(pageEl).paddingLeft) || 0;
        const originX = rect.left + padLeft;
        const onMove = (ev: PointerEvent) => {
            sidebarWidth = clampSidebarWidth(ev.clientX - originX);
        };
        const onUp = () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
            document.body.classList.remove("resizing");
            writeSidebarWidth(sidebarWidth);
        };
        document.body.classList.add("resizing");
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
    }

    function resizeKey(e: KeyboardEvent) {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        e.preventDefault();
        const step = (e.shiftKey ? 40 : 10) * (e.key === "ArrowLeft" ? -1 : 1);
        sidebarWidth = clampSidebarWidth(sidebarWidth + step);
        writeSidebarWidth(sidebarWidth);
    }
</script>

<h1 class="sr-only">{country.title}</h1>

{#if narrow}
    <!-- ── Phone: header + month strip, calendar / upcoming tabs ── -->
    <main class="m-page" class:gold-theme={isThanTai}>
        <MobileHeader
            month={calMonth}
            year={calYear}
            {selectedCodes}
            onprev={prevMonth}
            onnext={nextMonth}
            onToday={goToday}
            ontoggleCountry={toggleCountry}
        />
        <MonthStrip month={calMonth} onpick={goToMonth} />
        <div class="m-divider"></div>

        {#if tab === "cal"}
            <MonthGrid
                {days}
                {selectedDay}
                {selectedMonth}
                {selectedYear}
                large
                onselect={selectCellMobile}
            />
            {#if holidays.length > 0}
                <UpcomingList
                    holidays={holidays.slice(0, 3)}
                    {multi}
                    large
                    format={(d) => formatCountdown(d, showMondays)}
                    onselect={goToHolidayMobile}
                    onSeeAll={() => (tab = "upcoming")}
                />
            {/if}
        {:else}
            <UpcomingList
                {holidays}
                {multi}
                large
                showHeading={false}
                format={(d) => formatCountdown(d, showMondays)}
                onselect={goToHolidayMobile}
            />
        {/if}

        <TabBar bind:tab />
    </main>

    <DaySheet
        open={sheetOpen}
        {selected}
        marks={selectedMarks}
        offWork={selectedIsOffWork}
        gold={isThanTai}
        onclose={() => (sheetOpen = false)}
    />
{:else}
<main
    class="page"
    class:gold-theme={isThanTai}
    style:--sidebar-w={sidebarWidth + "px"}
    bind:this={pageEl}
>
    <div class="area-headline">
        <DayHeadline
            marks={selectedMarks}
            isToday={isSelectedToday}
            isWeekend={isSelectedWeekend}
            {nextHoliday}
            countdown={nextHoliday
                ? formatCountdownHeading(nextHoliday.daysUntil, showMondays)
                : ""}
            {allFlags}
            onholiday={goToHoliday}
        />
    </div>

    <div class="area-cards">
        <HeroCards
            {selected}
            {showBoth}
            offWork={selectedIsOffWork}
            gold={isThanTai}
        />
    </div>

    <div class="area-cal" bind:this={calEl}>
        {#if wide}
            <YearCalendar
                year={calYear}
                months={yearMonths}
                countries={activeCountries}
                {selectedCodes}
                {selectedDay}
                {selectedMonth}
                {selectedYear}
                todayActive={calYear !== today.solarYear || !isSelectedToday}
                gold={isThanTai}
                onselect={selectCell}
                onprev={() => calYear--}
                onnext={() => calYear++}
                onToday={goToday}
                ontoggleCountry={toggleCountry}
            />
        {:else}
            <MonthCalendar
                month={calMonth}
                year={calYear}
                {days}
                {selectedCodes}
                {selectedDay}
                {selectedMonth}
                {selectedYear}
                todayActive={!isCurrentMonth || !isSelectedToday}
                gold={isThanTai}
                onselect={selectCell}
                onprev={prevMonth}
                onnext={nextMonth}
                onToday={goToday}
                onPickMonth={goToMonth}
                ontoggleCountry={toggleCountry}
            />
        {/if}
    </div>

    {#if holidays.length > 0}
        <div class="area-upcoming">
            <UpcomingList
                {holidays}
                {multi}
                format={(d) => formatCountdown(d, showMondays)}
                onselect={goToHoliday}
            />
        </div>
    {/if}

    {#if wide}
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <div
            class="resizer"
            role="separator"
            aria-orientation="vertical"
            aria-label="Kéo để đổi độ rộng cột trái"
            aria-valuenow={Math.round(sidebarWidth)}
            aria-valuemin={SIDEBAR_MIN}
            aria-valuemax={SIDEBAR_MAX}
            tabindex="0"
            onpointerdown={startResize}
            onkeydown={resizeKey}
        ></div>
    {/if}
</main>
{/if}

<SiteFooter gold={isThanTai} settings={settingsMenu} phone={narrow} />

{#snippet settingsMenu()}
    <SettingsMenu bind:showBoth bind:showMondays />
{/snippet}

<style>
    /* Page layout only — every visual detail lives in the child components,
       and colours come from the tokens in src/lib/theme.css. */

    .page {
        max-width: 420px;
        margin: 0 auto;
        padding: 32px 20px 24px;
    }

    /* ── Phone layout: flat on the page, no card chrome ── */

    /* Bottom padding clears the fixed footer + tab bar. */
    .m-page {
        max-width: 520px;
        margin: 0 auto;
        padding: 18px 16px calc(140px + env(safe-area-inset-bottom));
    }

    .m-divider {
        height: 1px;
        background: var(--border);
        margin-bottom: 8px;
    }

    .area-cal {
        margin-top: 16px;
    }

    /* ── Desktop: cards + list left, calendar right ── */

    @media (min-width: 768px) {
        .page {
            max-width: 960px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto auto 1fr;
            gap: 32px 56px;
            padding: 48px 48px 64px;
            height: 100dvh;
            box-sizing: border-box;
            align-content: start;
        }

        .area-headline {
            grid-column: 1 / -1;
            grid-row: 1;
        }

        .area-cards {
            grid-column: 1;
            grid-row: 2;
            align-self: start;
        }

        .area-cal {
            grid-column: 2;
            grid-row: 2 / -1;
            margin-top: 0;
            align-self: start;
        }

        .area-upcoming {
            grid-column: 1;
            grid-row: 3;
            min-height: 0;
        }
    }

    /* ── Wide: left sidebar + full-year grid ── */

    @media (min-width: 1280px) {
        .page {
            max-width: none;
            grid-template-columns: var(--sidebar-w, 320px) minmax(0, 1fr);
            gap: 20px 36px;
            padding: 28px 32px 48px;
        }

        .area-headline {
            grid-column: 1;
            grid-row: 1;
        }

        .area-cal {
            grid-column: 2;
            grid-row: 1 / -1;
            min-height: 0;
            height: 100%;
            align-self: stretch;
        }
    }

    /* ── Sidebar resizer: sits on the year card's left edge ── */

    .resizer {
        display: none;
    }

    @media (min-width: 1280px) {
        .resizer {
            display: block;
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
    }
</style>
