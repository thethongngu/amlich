<script lang="ts">
	import {
		getTodayInfo,
		getDateInfo,
		getCalendarDays,
		getUpcomingHolidays,
		DAY_NAMES_SHORT,
		LUNAR_MONTH_NAMES
	} from '$lib/calendar';

	const today = getTodayInfo();
	const holidays = getUpcomingHolidays();
	const nextHoliday = holidays[0] ?? null;

	let calMonth = $state(today.solarMonth);
	let calYear = $state(today.solarYear);
	let days = $derived(getCalendarDays(calMonth, calYear));

	let selectedDay = $state(today.solarDay);
	let selectedMonth = $state(today.solarMonth);
	let selectedYear = $state(today.solarYear);
	let selected = $derived(getDateInfo(selectedDay, selectedMonth, selectedYear));

	const SHOW_BOTH_KEY = 'amlich-show-both';
	let showBoth = $state(
		typeof localStorage !== 'undefined' ? localStorage.getItem(SHOW_BOTH_KEY) !== 'false' : true
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

	function goToMonth(month: number) {
		calMonth = month;
		selectDate(1, month, calYear);
		showMonthPicker = false;
	}

	function toggleMonthPicker() {
		showMonthPicker = !showMonthPicker;
	}

	const isCurrentMonth = $derived(calMonth === today.solarMonth && calYear === today.solarYear);
	const isSelectedToday = $derived(
		selectedDay === today.solarDay && selectedMonth === today.solarMonth && selectedYear === today.solarYear
	);
	const isSelectedWeekend = $derived(
		selected.dayOfWeek === 'Thứ Bảy' || selected.dayOfWeek === 'Chủ Nhật'
	);
</script>

<div class="page">
	<div class="next-holiday" class:is-today={nextHoliday?.daysUntil === 0 && isSelectedToday}>
		{#if !isSelectedToday}
			<button class="back-today" onclick={goToday}>&larr;</button>
		{/if}
		{#if !isSelectedToday && selected.holiday}
			<span class="special-day">{selected.holiday}</span>
		{:else if !isSelectedToday && isSelectedWeekend}
			<span class="special-day">Cuối tuần</span>
		{:else if !isSelectedToday}
			<span class="normal-day">Ngày bình thường</span>
		{:else if nextHoliday && nextHoliday.daysUntil === 0}
			<span class="today-label">Hôm nay là </span> <span class="special-day">{nextHoliday.name}</span>
		{:else if nextHoliday}
			Còn <strong>{nextHoliday.daysUntil} ngày</strong> nữa đến <button class="holiday-link" onclick={() => goToHoliday(nextHoliday.solarDay, nextHoliday.solarMonth, nextHoliday.solarYear)}>{nextHoliday.name}</button>
		{/if}
	</div>
	<div class="today-col">
		<div class="hero-cards">
			<section class="hero solar-card" class:hidden={!showBoth}>
				<div class="card-title">Dương lịch</div>
				<div class="big-day solar-big-day">{selected.solarDay}</div>
				<div class="card-info">Tháng {selected.solarMonth}</div>
				<div class="card-sub">{selected.solarYear}</div>
			</section>

			<section class="hero lunar-card">
				<div class="card-title">Âm lịch</div>
				<div class="big-day lunar-big-day">{selected.lunarDay}</div>
				<div class="card-info">
					Tháng {LUNAR_MONTH_NAMES[selected.lunarMonth]}{selected.lunarLeap ? ' (Nhuận)' : ''}
				</div>
				<div class="card-sub">Năm {selected.lunarYearName}</div>
			</section>
		</div>

		<label class="toggle-row">
			<input type="checkbox" bind:checked={showBoth} />
			<span>Hiển thị Dương lịch + Âm lịch</span>
		</label>
	</div>

	<section class="cal">
		<div class="cal-header">
			<button class="nav-btn" onclick={prevMonth} aria-label="Tháng trước">&lsaquo;</button>
			<div class="cal-title-wrap">
				<button class="cal-title" onclick={toggleMonthPicker}>
					Tháng {calMonth}, {calYear}
				</button>
				{#if showMonthPicker}
				<div class="month-picker">
					{#each Array.from({length: 12}, (_, i) => i + 1) as m}
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
			<button class="nav-btn" onclick={nextMonth} aria-label="Tháng sau">&rsaquo;</button>
		</div>
		<div class="grid">
			{#each DAY_NAMES_SHORT as name, i}
				<div class="hdr" class:weekend={i >= 5}>{name}</div>
			{/each}

			{#each days as day}
				<button
					class="cell"
					class:is-today={day.isToday}
					class:is-selected={day.isCurrentMonth && day.solarDay === selectedDay && calMonth === selectedMonth && calYear === selectedYear}
					class:empty={!day.isCurrentMonth}
					class:is-holiday={day.isOffWork && !day.isToday}
					class:is-weekend={day.isWeekend && !day.isToday}
					disabled={!day.isCurrentMonth}
					onclick={() => selectDate(day.solarDay, calMonth, calYear)}
				>
					{#if day.isCurrentMonth}
						<span class="sd">{day.solarDay}</span>
						<span class="ld" class:new-month={day.lunarDay === 1}>
							{day.lunarDay === 1 ? `${day.lunarMonth}/1` : day.lunarDay}
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
					<button class="row" onclick={() => goToHoliday(h.solarDay, h.solarMonth, h.solarYear)}>
						<span class="h-name">{h.name}</span>
						<span class="h-count" class:h-today={h.daysUntil === 0}>
							{h.daysUntil === 0 ? 'Hôm nay' : `còn ${h.daysUntil} ngày`}
						</span>
					</button>
				{/each}
			</div>
		</section>
	{/if}
</div>

<footer class="footer">
	<span>by <a href="https://github.com/thethongngu" target="_blank" rel="noopener">thethongngu</a></span>
	<span class="sep">·</span>
	<!-- Replace YOUR_USERNAME below with your Ko-fi username -->
	<a href="https://ko-fi.com/thethongngu" target="_blank" rel="noopener" class="kofi-link">Buy me a coffee</a>
</footer>

<style>
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
		color: #78716C;
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
		color: #2563EB;
	}

	.lunar-big-day {
		color: #C41E3A;
	}

	.card-info {
		font-size: 1rem;
		font-weight: 600;
		color: #1C1917;
	}

	.card-sub {
		font-size: 0.85rem;
		color: #78716C;
		margin-top: 2px;
	}


	.toggle-row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		margin-top: 12px;
		font-size: 0.85rem;
		color: #78716C;
		cursor: pointer;
	}

	.toggle-row input[type="checkbox"] {
		accent-color: #C41E3A;
	}

	.today-col {
		display: flex;
		flex-direction: column;
		align-items: stretch;
	}

	.next-holiday {
		font-size: 1.5rem;
		font-weight: 700;
		color: #57534E;
		text-align: center;
		margin-bottom: 16px;
		min-height: 2.4em;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
	}

	.next-holiday strong {
		color: #C41E3A;
	}

	.holiday-link {
		background: none;
		border: none;
		font: inherit;
		color: #C41E3A;
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
		text-decoration-color: #C41E3A;
	}

	.next-holiday.is-today {
		min-height: auto;
	}

	.today-label {
		color: #000;
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
		color: #1C1917;
		padding: 4px 12px;
		border-radius: 8px;
		font-family: inherit;
	}

	.cal-title:hover {
		background: #F5F5F4;
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
		color: #57534E;
		cursor: pointer;
		transition: background 0.1s;
	}

	.month-btn:hover {
		background: #F5F5F4;
	}

	.month-btn.active {
		background: #C41E3A;
		color: #fff;
		font-weight: 600;
	}

	.nav-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: 10px;
		border: 1px solid #E7E5E4;
		background: none;
		cursor: pointer;
		font-size: 1.2rem;
		line-height: 1;
		padding: 0;
		color: #57534E;
		font-family: inherit;
		transition: background 0.15s;
	}

	.nav-btn:hover {
		background: #F5F5F4;
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
		color: #A8A29E;
		padding: 4px 0 8px;
	}

	.hdr.weekend {
		color: #E57373;
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
		transition: background 0.1s;
	}

	.cell:not(.empty):not(.is-today):hover {
		background: #F5F5F4;
	}

	.cell.is-today:hover {
		background: #A8162E;
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
		color: #C4C0BB;
		line-height: 1.1;
	}

	.ld.new-month {
		color: #C41E3A;
		font-weight: 600;
		font-size: 0.55rem;
	}

	.cell.is-weekend .sd {
		color: #E57373;
	}

	.cell.is-holiday {
		background: #FEF2F2;
	}

	.cell.is-today {
		background: #C41E3A;
	}

	.cell.is-today .sd {
		color: #fff;
		font-weight: 700;
	}

	.cell.is-today .ld {
		color: rgba(255, 255, 255, 0.6);
	}

	.cell.is-selected:not(.is-today) {
		outline: 2px solid #C41E3A;
		outline-offset: -2px;
	}

	.back-today {
		background: none;
		border: none;
		font-family: inherit;
		font-size: inherit;
		font-weight: 300;
		color: #D6D3D1;
		cursor: pointer;
		padding: 0;
		transition: color 0.15s;
		white-space: nowrap;
	}

	.normal-day {
		font-size: inherit;
		font-weight: 700;
		color: #1C1917;
	}

	.special-day {
		font-size: inherit;
		font-weight: 700;
		color: #C41E3A;
	}

	.back-today:hover {
		color: #C41E3A;
	}

	/* ── Upcoming ── */

	.upcoming {
		padding: 24px 20px 0;
	}

	.upcoming h2 {
		font-size: 0.75rem;
		font-weight: 600;
		color: #A8A29E;
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
		border-bottom: 1px solid #F0EDE8;
		background: none;
		border-left: none;
		border-right: none;
		border-top: none;
		cursor: pointer;
		font-family: inherit;
		border-radius: 8px;
		transition: background 0.15s;
	}

	.row:hover {
		background: #F5F5F4;
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
		color: #C41E3A;
	}

	.h-count.h-today {
		background: #C41E3A;
		color: #fff;
		padding: 2px 12px;
		border-radius: 12px;
	}

	/* ── Desktop ── */

	@media (min-width: 768px) {
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
			width: 40px;
			height: 40px;
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
		color: #A8A29E;
	}

	.footer a {
		color: #78716C;
		text-decoration: none;
		font-weight: 500;
	}

	.footer a:hover {
		color: #1C1917;
	}

	.sep {
		margin: 0 6px;
	}

	.kofi-link {
		color: #FF5E5B !important;
	}

	.kofi-link:hover {
		color: #e04644 !important;
	}
</style>
