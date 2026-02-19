<script lang="ts">
	import { getTodayInfo } from '$lib/calendar';
	import { onMount } from 'svelte';

	const today = getTodayInfo();
	const isTetPeriod = today.lunarMonth === 1 && today.lunarDay >= 1 && today.lunarDay <= 3;

	let visible = $state(false);

	onMount(() => {
		if (isTetPeriod) {
			visible = true;
		}
	});

	const EMOJIS = ['🧧', '🌸', '🌼'];

	// Generate random falling items with staggered delays
	const items = Array.from({ length: 50 }, (_, i) => ({
		id: i,
		emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
		left: Math.random() * 100,
		delay: Math.random() * 12,
		duration: 8 + Math.random() * 8,
		size: 16 + Math.random() * 14,
		sway: -40 + Math.random() * 80,
		startRotation: -30 + Math.random() * 60,
		endRotation: -45 + Math.random() * 90,
	}));
</script>

{#if visible}
	<div class="tet-container" aria-hidden="true">
		{#each items as item}
			<div
				class="falling-item"
				style="
					left: {item.left}%;
					animation-delay: {item.delay}s;
					animation-duration: {item.duration}s;
					font-size: {item.size}px;
					--sway: {item.sway}px;
					--start-rotation: {item.startRotation}deg;
					--end-rotation: {item.endRotation}deg;
				"
			>
				{item.emoji}
			</div>
		{/each}
	</div>
{/if}

<style>
	.tet-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		overflow: hidden;
		z-index: -1;
	}

	.falling-item {
		position: absolute;
		top: -60px;
		animation: item-fall linear infinite;
		will-change: transform, opacity;
	}

	@keyframes item-fall {
		0% {
			transform: translateY(0) translateX(0) rotate(var(--start-rotation));
			opacity: 0.8;
		}
		60% {
			opacity: 0.5;
		}
		100% {
			transform: translateY(110vh) translateX(var(--sway)) rotate(var(--end-rotation));
			opacity: 0;
		}
	}
</style>
