const CACHE_NAME = 'resep-cabai-v1'
const DATA_CACHE = 'resep-cabai-data-v1'

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
]

const DATA_ASSETS = [
  '/data/resep_cabai_index.json',
  '/data/phases/vegetatif.json',
  '/data/phases/pra-pembungaan.json',
  '/data/phases/generatif.json',
  '/data/phases/panen-pertama.json',
  '/data/phases/pasca-panen-pertama.json',
  '/data/phases/akhir-musim.json',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(c => c.addAll(STATIC_ASSETS)),
      caches.open(DATA_CACHE).then(c => c.addAll(DATA_ASSETS)),
    ])
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== DATA_CACHE)
          .map(k => caches.delete(k))
      )
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Data files: cache first
  if (url.pathname.startsWith('/data/')) {
    event.respondWith(
      caches.open(DATA_CACHE).then(async cache => {
        const cached = await cache.match(event.request)
        if (cached) return cached
        const response = await fetch(event.request)
        cache.put(event.request, response.clone())
        return response
      })
    )
    return
  }

  // Everything else: network first, fall back to cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone()
        caches.open(CACHE_NAME).then(c => c.put(event.request, clone))
        return response
      })
      .catch(() => caches.match(event.request))
  )
})
