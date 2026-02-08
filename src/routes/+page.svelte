<script lang="ts">
	import {
		getTodayInfo,
		getCalendarDays,
		getUpcomingHolidays,
		DAY_NAMES_SHORT,
		LUNAR_MONTH_NAMES
	} from '$lib/calendar';

	const today = getTodayInfo();
	const holidays = getUpcomingHolidays().slice(0, 4);

	let calMonth = $state(today.solarMonth);
	let calYear = $state(today.solarYear);
	let days = $derived(getCalendarDays(calMonth, calYear));

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
	}

	const pad = (n: number) => String(n).padStart(2, '0');
	const isCurrentMonth = $derived(calMonth === today.solarMonth && calYear === today.solarYear);
</script>

<div class="page">
	<section class="hero">
		<div class="dates">
			<span class="lbl">Âm lịch:</span>
			<span class="date-val lunar">{pad(today.lunarDay)}/{pad(today.lunarMonth)}/{today.lunarYear}</span>
			<span class="lbl">Dương lịch:</span>
			<span class="date-val">{pad(today.solarDay)}/{pad(today.solarMonth)}/{today.solarYear}</span>
		</div>

		{#if today.holiday}
			<p class="holiday">Hôm nay là {today.holiday}</p>
		{/if}

		{#if today.daysUntilTet > 0}
			<p class="tet-countdown">Còn <strong>{today.daysUntilTet} ngày</strong> đến Tết</p>
		{:else if today.daysUntilTet === 0}
			<p class="tet-countdown now">Chúc Mừng Năm Mới!</p>
		{/if}
	</section>

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
				<div
					class="cell"
					class:is-today={day.isToday}
					class:empty={!day.isCurrentMonth}
					class:is-holiday={!!day.holiday && !day.isToday}
					class:is-weekend={day.isWeekend && !day.isToday}
				>
					{#if day.isCurrentMonth}
						<span class="sd">{day.solarDay}</span>
						<span class="ld" class:new-month={day.lunarDay === 1}>
							{day.lunarDay === 1 ? LUNAR_MONTH_NAMES[day.lunarMonth] : day.lunarDay}
						</span>
					{/if}
				</div>
			{/each}
		</div>
	</section>

	{#if holidays.length > 0}
		<section class="upcoming">
			<h2>Sắp tới</h2>
			{#each holidays as h}
				<div class="row">
					<span class="h-name">{h.name}</span>
					<span class="h-count" class:h-today={h.daysUntil === 0}>
						{h.daysUntil === 0 ? 'Hôm nay' : `còn ${h.daysUntil} ngày`}
					</span>
				</div>
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

	/* ── Hero ── */

	.hero {
		text-align: center;
		padding: 32px 0 36px;
	}

	.dates {
		display: grid;
		grid-template-columns: auto auto;
		gap: 10px 14px;
		justify-content: center;
		align-items: baseline;
	}

	.lbl {
		font-size: 0.9rem;
		color: #78716C;
		text-align: right;
	}

	.date-val {
		font-size: 1.15rem;
		color: #1C1917;
		font-weight: 500;
		text-align: left;
	}

	.date-val.lunar {
		font-size: 1.4rem;
		font-weight: 700;
		color: #C41E3A;
	}

	.holiday {
		font-size: 1.05rem;
		color: #C41E3A;
		font-weight: 500;
		margin: 16px 0 0;
	}

	.tet-countdown {
		font-size: 1rem;
		color: #57534E;
		margin: 10px 0 0;
	}

	.tet-countdown strong {
		color: #C41E3A;
	}

	.tet-countdown.now {
		color: #C41E3A;
		font-weight: 700;
		font-size: 1.15rem;
	}

	/* ── Calendar ── */

	.cal {
		background: #fff;
		border-radius: 16px;
		padding: 18px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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
	}

	.cell.empty {
		min-height: 0;
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
		justify-content: space-between;
		align-items: baseline;
		padding: 10px 0;
		border-bottom: 1px solid #F0EDE8;
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
			max-width: 900px;
			display: grid;
			grid-template-columns: 5fr 6fr;
			grid-template-rows: auto auto;
			gap: 32px;
			padding: 48px;
			min-height: 100dvh;
			align-content: center;
		}

		.hero {
			grid-column: 1;
			grid-row: 1 / -1;
			align-self: center;
			padding: 0;
		}

		.cal {
			grid-column: 2;
			grid-row: 1;
			padding: 28px;
		}

		.upcoming {
			grid-column: 2;
			grid-row: 2;
			padding: 0 4px;
		}

		.dates {
			gap: 12px 18px;
		}

		.lbl {
			font-size: 1.05rem;
		}

		.date-val {
			font-size: 1.35rem;
		}

		.date-val.lunar {
			font-size: 1.7rem;
		}

		.holiday {
			font-size: 1.2rem;
			margin-top: 20px;
		}

		.tet-countdown {
			font-size: 1.15rem;
			margin-top: 12px;
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
