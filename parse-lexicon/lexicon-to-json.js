"use strict";


/*
This parses the lexicon entry xmlEntry into an object containing these
properties.

occurrences: The number of occurences.
  (If an entry does not have this data, this will be null.)
strongs: An array of Strongs numbers for this word. The first index is the
  primary. They are supplied in the format that the lexicon supplies them
  (currently "G27"). If no Strongs numbers exist for this word, the array
  will be empty.
word: The word in Greek.
*/
function LexiconEntry (xmlEntry) {
  //create callbacks
  let callbacks = {
    //word
    "word" : (entry) => {
      let greekWord = entry.getAttribute('lemma').split('|')[0];
      return normalizeGreek(greekWord);
      },
    //innerHTML
    "innerHTML" : (entry) => {
      return entry.innerHTML;
    },
    //occurrences
    "occurrences" : (entry) => {
      let occurrences = null;
      let noteElement = entry.querySelector('note[type="occurrencesNT"]');
      if (noteElement != null) {
        occurrences = noteElement.textContent;
        }
      
      return occurrences;
      },
    //senses
    /*"senses" : (entry) => {
      let nodes = entry.getElementsByTagName("sense");
      let senses = [];

      for (let s = 0; s < nodes.length; s++) {
        senses.push(nodes.innerHTML);
        }
      
      return senses;
    },*/
    //strongs number(s)
    "strongs" : (entry) => {
      let lemmaNumbers = null,
        numbers = [entry.getAttribute('strong')]; //main strong number
      
      if (numbers[0] == null) {
        numbers = [];
        }
      
      lemmaNumbers = entry.getAttribute('lemma')
        .split('|')
        .splice(1);
      
      numbers = numbers.concat(lemmaNumbers);
      
      return numbers;
      },
  };

  Object.keys(callbacks)
    .forEach((k) => {
      this[k] = callbacks[k](xmlEntry);
    });
}


/*
This fetches the lexicon found at lexiconURL, parses it, and returns
an easy to sort representation of it. On failure, we throw an exception
with the reason we failed.
*/
function encodeLexicon(lexiconURL) {
  let output = null;
  
  return fetch(lexiconURL)
    .then((response) => { //flag if network error
      if (!response.ok) {
        throw Error("Could not retrieve " + lexiconURL + ".");
        }
      return response;
      })
    .then(response => response.text())
    .then(data => {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(data, "text/xml");
        let lexiconEntries = xmlDoc.getElementsByTagName('entry');
        
        //many <entry>ies in the lexicon are not for words
        lexiconEntries = Array.from(lexiconEntries)
          .filter((entry) => {
            return entry.hasAttribute("lemma");
          });


        let formattedEntries = lexiconEntries.map((xmlElem) => {
          let entry = new LexiconEntry(xmlElem);
          //throw(JSON.stringify(entry));
          return entry;
          });
        let lexiconIndex = makeLexiconIndex(formattedEntries);
        
        return {"searchTerms": lexiconIndex, "entries": formattedEntries};
        });
  }


/*
This searches all the entries and returns an object of
{search-key: index-in-entry-array}. Presently, the lowercase greek word,
lowercase latin variants, and lowercase strongs numbers are saved as keys.
*/
function makeLexiconIndex(lexiconEntries) {
  let searchTerms = new Object();
  
  // save the valid search terms from each entry
  lexiconEntries.forEach((entry, index) => {
    let strongs = entry.strongs.map((number) => {
      return number.toLowerCase();
      }),
      termsToIndex = [],
      word = entry.word.toLowerCase();

    termsToIndex.push(word);
    termsToIndex = termsToIndex.concat(strongs);
    getLatinVariants(word, (value) => {
      termsToIndex.push(value)
    });

    termsToIndex.forEach((term) => {
      searchTerms[term] = index;
      });

    });
  
  return searchTerms;
  }