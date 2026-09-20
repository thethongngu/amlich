// Reactive media queries. Seeded from matchMedia so the first paint already
// uses the right layout instead of flashing the desktop one on a phone.

export function mediaQuery(query: string) {
	let matched = $state(typeof window !== 'undefined' && window.matchMedia(query).matches);

	$effect(() => {
		const mq = window.matchMedia(query);
		const update = () => (matched = mq.matches);
		update();
		mq.addEventListener('change', update);
		return () => mq.removeEventListener('change', update);
	});

	return {
		get current() {
			return matched;
		}
	};
}
