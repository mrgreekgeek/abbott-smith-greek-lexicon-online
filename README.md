# Abbott-Smith's "Manual Lexicon of the Greek New Testament" Online
A little JS app to make Abbott-Smith searchable and usable with a focus on good UI and UX.  

The underlying data for this app comes from the marvelous [translatable-exegetical-tools/Abbott-Smith](https://github.com/translatable-exegetical-tools/Abbott-Smith). Needless to say, this app wouldn't exist without all the hard work that went into that repository! 

# To Do List
- [x] Refactor the code to search via JS data structure rather than raw XML
- [x] Implement searching by Strongs #
- [ ] Fix the ref tagger to tag _all_ references (using 'osisref' element in XML)
- [ ] Have a "reverse search" function to search for English glosses that correspond to a Greek word
- [ ] Replace BLB ref tagger with a simpler/cleaner approach, using the [Byzantine Text](https://github.com/byztxt/byzantine-majority-text) instead. 
- [ ] Make the "NT Usage #" link to a search for the lemma in STEPBible
- [ ] Expand all abbreviations or at least make tooltips (with HTML abbr tag) 
- [ ] Full offline functionality with service workers
- [ ] Show recently searched words so user can easily go back to them
- [ ] Add some relevant info to the page for SEO purposes and check how it shows up in search engines
- [ ] Surface the front-matter/introductory material for the lexicon
- [ ] Add a keyboard legend for converting Greek to Latin letters
- [x] Make final sigma and e/η more compatible for latinized searches
- [x] Use an HTML element other than 'title' for storing the Strongs #
- [ ] Clean up and consolidate CSS

