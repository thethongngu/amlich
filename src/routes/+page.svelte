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
	const holidays = getUpcomingHolidays().slice(0, 4);
	const nextHoliday = holidays[0] ?? null;

	let calMonth = $state(today.solarMonth);
	let calYear = $state(today.solarYear);
	let days = $derived(getCalendarDays(calMonth, calYear));

	let selectedDay = $state(today.solarDay);
	let selectedMonth = $state(today.solarMonth);
	let selectedYear = $state(today.solarYear);
	let selected = $derived(getDateInfo(selectedDay, selectedMonth, selectedYear));

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

	const pad = (n: number) => String(n).padStart(2, '0');
	const isCurrentMonth = $derived(calMonth === today.solarMonth && calYear === today.solarYear);
	const isSelectedToday = $derived(
		selectedDay === today.solarDay && selectedMonth === today.solarMonth && selectedYear === today.solarYear
	);
</script>

<div class="page">
	<div class="today-col">
		{#if nextHoliday}
			<div class="next-holiday" class:is-today={nextHoliday.daysUntil === 0}>
				{#if !isSelectedToday}
					<button class="back-today" onclick={goToday}>&larr; Quay về hôm nay</button>
				{:else if nextHoliday.daysUntil === 0}
					Hôm nay là <button class="holiday-link" onclick={() => goToHoliday(nextHoliday.solarDay, nextHoliday.solarMonth, nextHoliday.solarYear)}>{nextHoliday.name}</button>
				{:else}
					Còn <strong>{nextHoliday.daysUntil} ngày</strong> nữa đến <button class="holiday-link" onclick={() => goToHoliday(nextHoliday.solarDay, nextHoliday.solarMonth, nextHoliday.solarYear)}>{nextHoliday.name}</button>
				{/if}
			</div>
		{/if}
		<section class="hero">
			<div class="hero-top">
				<span class="dow">{selected.dayOfWeek}</span>
				<span class="solar-date"> Dương lịch: {pad(selected.solarDay)}/{pad(selected.solarMonth)}/{selected.solarYear}</span>
			</div>

			<div class="lunar-day">{selected.lunarDay}</div>

			<div class="lunar-info">
				Tháng {LUNAR_MONTH_NAMES[selected.lunarMonth]}{selected.lunarLeap ? ' (Nhuận)' : ''}
			</div>
			<div class="lunar-year">Năm {selected.lunarYearName} — {selected.lunarYear}</div>

			{#if selected.holiday}
				<div class="holiday">{selected.holiday}</div>
			{/if}
		</section>
	</div>

	<section class="cal">
		<div class="cal-header">
			<button class="nav-btn" onclick={prevMonth} aria-label="Tháng trước">&lsaquo;</button>
			<button class="cal-title" class:muted={isCurrentMonth} onclick={goToday}>
				Tháng {calMonth}, {calYear}
			</button>
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
			{#each holidays as h}
				<button class="row" onclick={() => goToHoliday(h.solarDay, h.solarMonth, h.solarYear)}>
					<span class="h-name">{h.name}</span>
					<span class="h-count" class:h-today={h.daysUntil === 0}>
						{h.daysUntil === 0 ? 'Hôm nay' : `còn ${h.daysUntil} ngày`}
					</span>
				</button>
			{/each}
		</section>
	{/if}
</div>

<style>
	/* ── Mobile-first base ── */

	.page {
		max-width: 420px;
		margin: 0 auto;
		padding: 16px 20px 48px;
	}

	/* ── Hero (Today card) ── */

	.hero {
		text-align: center;
		padding: 28px 16px 32px;
		background: #fff;
		border-radius: 20px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
	}

	.hero-top {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 8px;
	}

	.dow {
		font-size: 1.1rem;
		font-weight: 600;
		color: #1C1917;
	}

	.solar-date {
		font-size: 1rem;
		color: #78716C;
		font-weight: 500;
	}

	.lunar-day {
		font-size: 5.5rem;
		font-weight: 800;
		color: #C41E3A;
		line-height: 1;
		margin: 4px 0 8px;
		letter-spacing: -0.03em;
	}

	.lunar-info {
		font-size: 1.3rem;
		font-weight: 600;
		color: #1C1917;
	}

	.lunar-year {
		font-size: 1rem;
		color: #78716C;
		margin-top: 4px;
	}

	.holiday {
		display: inline-block;
		font-size: 1.05rem;
		color: #C41E3A;
		font-weight: 600;
		margin-top: 16px;
		padding: 6px 16px;
		background: #FEF2F2;
		border-radius: 20px;
	}

	.today-col {
		display: flex;
		flex-direction: column;
		align-items: stretch;
	}

	.next-holiday {
		font-size: 1.3rem;
		color: #57534E;
		text-align: center;
		margin-bottom: 16px;
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
		color: #C41E3A;
		font-weight: 700;
		font-size: 1.5rem;
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

	.cal-title.muted {
		cursor: default;
	}

	.cal-title.muted:hover {
		background: none;
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
		min-height: 0;
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
		font-size: 0.9rem;
		font-weight: 500;
		color: #78716C;
		cursor: pointer;
		padding: 0;
		transition: color 0.15s;
	}

	.back-today:hover {
		color: #C41E3A;
	}

	/* ── Upcoming ── */

	.upcoming {
		padding: 24px 4px 0;
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
		font-size: 0.9rem;
		font-weight: 500;
	}

	.h-count {
		font-size: 0.95rem;
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
			grid-template-rows: auto auto;
			gap: 32px;
			padding: 48px;
			min-height: 100dvh;
			align-content: center;
		}

		.today-col {
			grid-column: 1;
			grid-row: 1 / -1;
			align-self: center;
		}

		.hero {
			padding: 36px 32px;
		}

		.dow {
			font-size: 1.1rem;
		}

		.solar-date {
			font-size: 0.95rem;
		}

		.lunar-day {
			font-size: 7rem;
			margin: 8px 0 12px;
		}

		.lunar-info {
			font-size: 1.6rem;
		}

		.lunar-year {
			font-size: 1.15rem;
			margin-top: 6px;
		}

		.holiday {
			font-size: 1.15rem;
			margin-top: 20px;
			padding: 8px 20px;
		}

		.next-holiday {
			font-size: 1.8rem;
			font-weight: 500;
			margin-bottom: 20px;
		}

		.next-holiday.is-today {
			font-size: 2.2rem;
		}

		.cal {
			grid-column: 2;
			grid-row: 1;
			padding: 28px;
			margin-top: 0;
		}

		.upcoming {
			grid-column: 2;
			grid-row: 2;
			padding: 0 4px;
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
			font-size: 1rem;
		}

		.h-count {
			font-size: 1.1rem;
		}

		.row {
			padding: 12px 0;
		}
	}
</style>
