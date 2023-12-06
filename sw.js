// https://brandonrozek.com/blog/2015-11-30-limiting-cache-service-workers-revisited3/
// https://developer.mozilla.org/en-US/docs/Web/API/Cache/match#ignoresearch
// Use {'ignoreSearch': true} to make the cache not choke on URLs with query strings

var version = 'v2.0.29:';

var offlineFundamentals = [
  '.',
	'index21.html',
  'lexicon.xml',
  'simple.css'
];

//Add core website files to cache during serviceworker installation
var updateStaticCache = function() {
	return caches.open(version + 'fundamentals').then(function(cache) {
		return Promise.all(offlineFundamentals.map(function(value) {
			var request = new Request(value);
			var url = new URL(request.url);
			if (url.origin != location.origin) {
				request = new Request(value, {mode: 'no-cors'});
			}
			return fetch(request).then(function(response) { 
				var cachedCopy = response.clone();
				return cache.put(request, cachedCopy); 
				
			});
		}))
	})
};

//Clear caches with a different version number
var clearOldCaches = function() {
	return caches.keys().then(function(keys) {
			return Promise.all(
          			keys
            			.filter(function (key) {
              				return key.indexOf(version) != 0;
            			})
            			.map(function (key) {
              				return caches.delete(key);
            			})
        		);
		})
}

/*
	trims the cache
	If cache has more than maxItems then it removes the excess items starting from the beginning
*/
var trimCache = function (cacheName, maxItems) {
    caches.open(cacheName)
        .then(function (cache) {
            cache.keys()
                .then(function (keys) {
                    if (keys.length > maxItems) {
                        cache.delete(keys[0])
                            .then(trimCache(cacheName, maxItems));
                    }
                });
        });
};


//When the service worker is first added to a computer
self.addEventListener("install", function(event) {
	event.waitUntil(updateStaticCache()
				.then(function() { 
					return self.skipWaiting(); 
				})
			);
})

self.addEventListener("message", function(event) {
	var data = event.data;
	
	//Send this command whenever many files are downloaded (ex: a page load)
	if (data.command == "trimCache") {
		trimCache(version + "pages", 25);
		trimCache(version + "images", 10);
		trimCache(version + "assets", 30);
	}
});

//Service worker handles networking
self.addEventListener("fetch", function(event) {

	//Fetch from network and cache
	var fetchFromNetwork = function(response) {
		var cacheCopy = response.clone();
		if (event.request.headers.get('Accept').indexOf('text/html') != -1) {
			caches.open(version + 'pages').then(function(cache) {
				cache.put(event.request, cacheCopy);
			});
		} else if (event.request.headers.get('Accept').indexOf('image') != -1) {
			caches.open(version + 'images').then(function(cache) {
				cache.put(event.request, cacheCopy);
			});
		} else {
			caches.open(version + 'assets').then(function add(cache) {
				cache.put(event.request, cacheCopy);
			});
		}
	
		return response;
	}
	
	//Fetch from network failed
	var fallback = function() {
		if (event.request.headers.get('Accept').indexOf('text/html') != -1) {
			return caches.match(event.request, {'ignoreSearch': true}).then(function (response) { 
				return response || caches.match('/offline/');
			})
		} else if (event.request.headers.get('Accept').indexOf('image') != -1) {
			return new Response('Offlineoffline', { headers: { 'Content-Type': 'image/svg+xml' }});
		} 
	}
	
	//This service worker won't touch non-get requests
	if (event.request.method != 'GET') {
		return;
	}
	
	//For HTML requests, look for file in network, then cache if network fails.
	if (event.request.headers.get('Accept').indexOf('text/html') != -1) {
	    	event.respondWith(fetch(event.request).then(fetchFromNetwork, fallback));
		return;
		}
	
	//For non-HTML requests, look for file in cache, then network if no cache exists.
	event.respondWith(
		caches.match(event.request, {'ignoreSearch': true}).then(function(cached) {
			return cached || fetch(event.request).then(fetchFromNetwork, fallback);
		})
	)	
});

//After the install event
self.addEventListener("activate", function(event) {
	event.waitUntil(clearOldCaches()
				.then(function() { 
					return self.clients.claim(); 
				})
			);
});