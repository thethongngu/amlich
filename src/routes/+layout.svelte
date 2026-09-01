<script lang="ts">
	import '$lib/theme.css';
	import RedEnvelopes from '$lib/RedEnvelopes.svelte';
	let { children } = $props();
</script>

<RedEnvelopes />
{@render children()}

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		background: #f5f5f4; /* tailwind stone-100 */
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
		color: #1c1917; /* tailwind stone-900 */
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	:global(*) {
		box-sizing: border-box;
	}
</style>
