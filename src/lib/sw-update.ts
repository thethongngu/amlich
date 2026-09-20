import { dev } from '$app/environment';

/**
 * iOS keeps a home-screen app suspended instead of reloading it, so the service
 * worker never gets asked for a newer version. Asking on every resume is what
 * makes a deploy reach the phone.
 */
export function keepAppFresh(): () => void {
	if (dev || typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
		return () => {};
	}

	const sw = navigator.serviceWorker;
	const hadController = !!sw.controller;
	let reloading = false;

	function onControllerChange() {
		if (!hadController || reloading) return;
		reloading = true;
		location.reload();
	}

	async function checkForUpdate() {
		if (document.visibilityState !== 'visible') return;
		try {
			const registration = await sw.getRegistration();
			await registration?.update();
		} catch {
			// Offline or blocked: the next resume tries again.
		}
	}

	sw.addEventListener('controllerchange', onControllerChange);
	document.addEventListener('visibilitychange', checkForUpdate);
	checkForUpdate();

	return () => {
		sw.removeEventListener('controllerchange', onControllerChange);
		document.removeEventListener('visibilitychange', checkForUpdate);
	};
}
