/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

import { build, files, prerendered, version } from '$service-worker';

const sw = self as unknown as ServiceWorkerGlobalScope;

const CACHE = `amlich-${version}`;

// Static assets we don't want to spend cache quota on.
const EXCLUDE = new Set(['/og-image.png', '/sitemap.xml', '/robots.txt', '/_headers']);

// `build` = JS/CSS chunks, `files` = static/, `prerendered` = /, /hk, /tw
const PRECACHE = [
	...build,
	...files.filter((f) => !EXCLUDE.has(f)),
	...prerendered
];

sw.addEventListener('install', (event) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(CACHE);
			// Individual puts so one 404 can't abort the whole install.
			await Promise.all(
				PRECACHE.map(async (url) => {
					try {
						const res = await fetch(url, { cache: 'no-cache' });
						if (res.ok) await cache.put(url, res);
					} catch {
						// ignore – will be fetched lazily later
					}
				})
			);
			await sw.skipWaiting();
		})()
	);
});

sw.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			for (const key of await caches.keys()) {
				if (key !== CACHE) await caches.delete(key);
			}
			await sw.clients.claim();
		})()
	);
});

sw.addEventListener('message', (event) => {
	if (event.data === 'SKIP_WAITING') sw.skipWaiting();
});

const IMMUTABLE = new Set(build);

sw.addEventListener('fetch', (event) => {
	const req = event.request;
	if (req.method !== 'GET') return;

	const url = new URL(req.url);
	if (url.origin !== location.origin) return;
	if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

	event.respondWith(
		(async () => {
			const cache = await caches.open(CACHE);

			// Hashed build assets never change: cache-first, no revalidation.
			if (IMMUTABLE.has(url.pathname)) {
				const hit = await cache.match(url.pathname);
				if (hit) return hit;
			}

			// Everything else: network-first so content stays fresh online,
			// falling back to cache (then to the app shell) when offline.
			try {
				const res = await fetch(req);
				if (res.ok && res.type === 'basic') cache.put(req, res.clone());
				return res;
			} catch {
				const hit = (await cache.match(req)) ?? (await cache.match(url.pathname));
				if (hit) return hit;

				if (req.mode === 'navigate') {
					const shell =
						(await cache.match(url.pathname)) ??
						(await cache.match(url.pathname + '.html')) ??
						(await cache.match('/'));
					if (shell) return shell;
				}

				return new Response('Offline', {
					status: 503,
					statusText: 'Offline',
					headers: { 'Content-Type': 'text/plain; charset=utf-8' }
				});
			}
		})()
	);
});
