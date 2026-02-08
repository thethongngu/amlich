<script lang="ts">
	import {
		getTodayInfo,
		getCalendarDays,
		getUpcomingHolidays,
		DAY_NAMES_SHORT,
		LUNAR_MONTH_NAMES
	} from '$lib/calendar';

	const today = getTodayInfo();
	const days = getCalendarDays();
	const holidays = getUpcomingHolidays();
</script>

<div class="page">
	<section class="hero">
		<p class="solar">{today.dayOfWeek}, {String(today.solarDay).padStart(2, '0')}/{String(today.solarMonth).padStart(2, '0')}/{today.solarYear}</p>
		<p class="lunar-day">{today.lunarDay}</p>
		<p class="lunar-ctx">tháng {today.lunarMonthName} · {today.lunarYearName}</p>
		{#if today.holiday}
			<p class="holiday">{today.holiday}</p>
		{/if}
		{#if today.daysUntilTet > 0}
			<p class="tet">Còn {today.daysUntilTet} ngày đến Tết</p>
		{:else if today.daysUntilTet === 0}
			<p class="tet highlight">Chúc Mừng Năm Mới!</p>
		{/if}
	</section>

	<section class="cal">
		<h2 class="cal-title">Tháng {today.solarMonth}, {today.solarYear}</h2>
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
					<span class="name">{h.name}</span>
					<span class="meta">
						{h.daysUntil === 0 ? 'Hôm nay' : `${h.solarDate} · ${h.daysUntil} ngày`}
					</span>
				</div>
			{/each}
		</section>
	{/if}
</div>

<style>
	.page {
		max-width: 400px;
		margin: 0 auto;
		padding: 20px 20px 48px;
	}

	/* ── Hero: today's lunar date ── */

	.hero {
		text-align: center;
		padding: 28px 0 32px;
	}

	.solar {
		font-size: 0.85rem;
		color: #78716C;
		margin: 0;
	}

	.lunar-day {
		font-size: 5.5rem;
		font-weight: 700;
		color: #C41E3A;
		line-height: 1;
		margin: 8px 0 6px;
		letter-spacing: -0.02em;
	}

	.lunar-ctx {
		font-size: 0.95rem;
		color: #57534E;
		margin: 0;
	}

	.holiday {
		display: inline-block;
		font-size: 0.8rem;
		color: #C41E3A;
		background: #FEF2F2;
		padding: 3px 14px;
		border-radius: 16px;
		margin: 14px 0 0;
	}

	.tet {
		font-size: 0.8rem;
		color: #A8A29E;
		margin: 10px 0 0;
	}

	.tet.highlight {
		color: #C41E3A;
		font-weight: 600;
		font-size: 0.95rem;
	}

	/* ── Calendar grid ── */

	.cal {
		background: #fff;
		border-radius: 14px;
		padding: 16px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}

	.cal-title {
		font-size: 0.9rem;
		font-weight: 600;
		margin: 0 0 12px 4px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 2px;
	}

	.hdr {
		text-align: center;
		font-size: 0.7rem;
		font-weight: 600;
		color: #A8A29E;
		padding: 4px 0 6px;
	}

	.hdr.weekend {
		color: #E57373;
	}

	.cell {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 44px;
		border-radius: 8px;
		gap: 1px;
	}

	.cell.empty {
		min-height: 0;
	}

	.sd {
		font-size: 0.85rem;
		font-weight: 500;
		line-height: 1.3;
	}

	.ld {
		font-size: 0.6rem;
		color: #BDBDBD;
		line-height: 1.2;
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
		padding: 20px 4px 0;
	}

	.upcoming h2 {
		font-size: 0.8rem;
		font-weight: 600;
		color: #A8A29E;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin: 0 0 10px;
	}

	.row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding: 8px 0;
		border-bottom: 1px solid #F0EDE8;
	}

	.row:last-child {
		border-bottom: none;
	}

	.name {
		font-size: 0.85rem;
		font-weight: 500;
	}

	.meta {
		font-size: 0.75rem;
		color: #A8A29E;
	}
</style>
