<script lang="ts">
	import RedEnvelopes from '$lib/RedEnvelopes.svelte';
	let { children } = $props();
</script>

<RedEnvelopes />
{@render children()}

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		background: #FBF8F3;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
		color: #1C1917;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	:global(*) {
		box-sizing: border-box;
	}
</style>
