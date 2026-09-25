<script lang="ts">
    import { untrack } from "svelte";
    import { getTodayInfo, getDateInfo } from "$lib/calendar";
    import { mediaQuery } from "$lib/breakpoints.svelte";
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
        formatHeadlineCountdown,
    } from "$lib/holidays";
    import {
        readShowBoth,
        writeShowBoth,
        readShowMondays,
        writeShowMondays,
        readSidebarWidth,
    } from "$lib/prefs";
    import DayHeadline from "$lib/components/DayHeadline.svelte";
    import HeroCards from "$lib/components/HeroCards.svelte";
    import MobileHeader from "$lib/components/MobileHeader.svelte";
    import MonthCarousel from "$lib/components/MonthCarousel.svelte";
    import TabBar, { type Tab } from "$lib/components/TabBar.svelte";
    import PhoneMenu from "$lib/components/PhoneMenu.svelte";
    import MonthCalendar from "$lib/components/MonthCalendar.svelte";
    import YearCalendar from "$lib/components/YearCalendar.svelte";
    import UpcomingList from "$lib/components/UpcomingList.svelte";
    import SettingsMenu from "$lib/components/SettingsMenu.svelte";
    import SidebarResizer from "$lib/components/SidebarResizer.svelte";
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
    // The page's own country leads, so its name and colour speak first.
    const activeCountries = $derived.by(() => {
        const picked = COUNTRIES.filter((c) => selectedCodes.includes(c.code));
        return [
            ...picked.filter((c) => c.code === country.code),
            ...picked.filter((c) => c.code !== country.code),
        ];
    });
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

    const yearView = mediaQuery("(min-width: 1280px)");
    const phoneView = mediaQuery("(max-width: 767px)");
    const wide = $derived(yearView.current);
    const narrow = $derived(phoneView.current);

    // The phone carousel keeps the neighbouring months mounted so a drag can
    // reveal them straight away.
    const prevDays = $derived.by(() => {
        if (!narrow) return [];
        const p = addMonths(calMonth, calYear, -1);
        return buildDays(p.month, p.year, activeCountries);
    });
    const nextDays = $derived.by(() => {
        if (!narrow) return [];
        const n = addMonths(calMonth, calYear, 1);
        return buildDays(n.month, n.year, activeCountries);
    });

    // ── Phone-only state: bottom tabs + settings sheet ──

    let tab = $state<Tab>("cal");
    let menuOpen = $state(false);
    let carousel: MonthCarousel | null = $state(null);

    function goToHolidayMobile(day: number, month: number, year: number) {
        calMonth = month;
        calYear = year;
        selectDate(day, month, year);
        tab = "cal";
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

    function addMonths(month: number, year: number, delta: number) {
        const zeroBased = month - 1 + delta;
        return {
            month: (((zeroBased % 12) + 12) % 12) + 1,
            year: year + Math.floor(zeroBased / 12),
        };
    }

    function shiftMonth(delta: number) {
        ({ month: calMonth, year: calYear } = addMonths(
            calMonth,
            calYear,
            delta,
        ));
    }

    function prevMonth() {
        shiftMonth(-1);
    }

    function nextMonth() {
        shiftMonth(1);
    }

    function goToMonth(month: number, year: number) {
        calMonth = month;
        calYear = year;
        selectDate(1, month, year);
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
</script>

<h1 class="sr-only">{country.title}</h1>

{#if narrow}
    <!-- ── Phone: the picked day up top, then the month it came from ── -->
    <main class="m-page" class:gold-theme={isThanTai}>
        {#if tab === "cal"}
            <div class="m-summary">
                <DayHeadline
                    marks={selectedMarks}
                    isToday={isSelectedToday}
                    isWeekend={isSelectedWeekend}
                    {nextHoliday}
                    countdown={nextHoliday
                        ? formatHeadlineCountdown(nextHoliday.daysUntil, showMondays)
                        : ""}
                    {allFlags}
                    onholiday={goToHolidayMobile}
                />
                <HeroCards
                    {selected}
                    {showBoth}
                    offWork={selectedIsOffWork}
                    gold={isThanTai}
                    sheet
                />
            </div>

            <div class="m-month">
                <MobileHeader
                    month={calMonth}
                    year={calYear}
                    todayActive={!isCurrentMonth || !isSelectedToday}
                    onprev={() => carousel?.slide(-1)}
                    onnext={() => carousel?.slide(1)}
                    onPickMonth={goToMonth}
                    onToday={goToday}
                />

                <MonthCarousel
                    bind:this={carousel}
                    {prevDays}
                    {days}
                    {nextDays}
                    {selectedDay}
                    {selectedMonth}
                    {selectedYear}
                    onselect={selectCell}
                    onshift={shiftMonth}
                />
            </div>
        {:else}
            <UpcomingList
                {holidays}
                {multi}
                large
                format={(d) => formatCountdown(d, showMondays)}
                onselect={goToHolidayMobile}
            />
        {/if}

        <TabBar
            bind:tab
            settingsOpen={menuOpen}
            onsettings={() => (menuOpen = true)}
        />
    </main>

    <PhoneMenu
        open={menuOpen}
        {selectedCodes}
        ontoggleCountry={toggleCountry}
        bind:showBoth
        bind:showMondays
        onclose={() => (menuOpen = false)}
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
                ? formatHeadlineCountdown(nextHoliday.daysUntil, showMondays)
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
        <SidebarResizer bind:width={sidebarWidth} page={pageEl} />
    {/if}
</main>

<SiteFooter gold={isThanTai} settings={settingsMenu} />
{/if}

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

    /* The phone page is exactly one screen tall. The summary and the month
       bar take what they need; the grid absorbs whatever is left, so nothing
       can push the page into scrolling on a shorter phone. */
    .m-page {
        --gutter: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        height: 100vh;
        height: 100dvh;
        overflow: hidden;
        max-width: 520px;
        margin: 0 auto;
        padding: calc(12px + var(--safe-t)) var(--gutter) calc(var(--tabbar-space) + 12px);
    }

    /* The picked day, answered before anything asks you to navigate. */
    .m-summary {
        display: flex;
        flex-direction: column;
        gap: 10px;
        flex: none;
    }

    .m-month {
        display: flex;
        flex-direction: column;
        gap: 2px;
        flex: 1;
        min-height: 0;
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
            padding: calc(48px + var(--safe-t)) max(48px, var(--safe-r))
                calc(64px + var(--safe-b)) max(48px, var(--safe-l));
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

</style>
