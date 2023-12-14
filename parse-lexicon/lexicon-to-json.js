"use strict";

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

        let lexiconIndex = makeLexiconIndex(lexiconEntries);
        let formattedEntries = formatLexiconEntries(lexiconEntries);
        
        return {/*"lexiconIndex": lexiconIndex,*/ "lexiconEntries": formattedEntries};
        });
  }


function formatLexiconEntries(lexiconEntries) {
  let fEntries = new Array();
  let callbacks = [
    //get occurences
    (e, o) => {
      o["occurences"] = "";
      let noteElement = e.querySelector('note[type="occurrencesNT"]');
      if (noteElement != null) {
        o["occurences"] = noteElement.textContent;
        }
      return o;
      },
    ];
  
  for (var i in lexiconEntries) {
    let entry = lexiconEntries[i];
      let obj = new Object();
    
    for (var cI in callbacks) {
      obj = callbacks[cI](entry, obj);
      }
    
    fEntries.push(obj);
    }
  
  return fEntries;
  }


/*
This searches all the entries and returns an object of
{search-key: index-in-entry-array}. Presently, it recognizes lowercase
greek terms and the strongs number as search-keys.
*/
function makeLexiconIndex(lexiconEntries) {
  let curEntry = null,
    entries = new Array(),
    searchTerms = new Object(),
    termsToIndex = null;
  
  //create callbacks
  let callbacks = [
    //index by greek spelling
    (entry) => {
      let greekWord = entry.getAttribute('lemma').split('|')[0];
      
      greekWord = normalizeGreek(greekWord);
      
      return [greekWord];
      },
    //index by strongs number
    (entry) => {
      let lemmaNumbers = null,
        numbers = [entry.getAttribute('strong')]; //main strong number
      
      lemmaNumbers = entry.getAttribute('lemma')
        .split('|')
        .splice(1);
      
      numbers = numbers.concat(lemmaNumbers);
      
      return numbers;
      },
    ];
  
  // save the valid search terms from each entry
  for (var i = 0; i < lexiconEntries.length; i++) {
    curEntry = lexiconEntries[i];
    entries.push(curEntry);
    
    for (var func in callbacks) {
      termsToIndex = callbacks[func](curEntry);
      
      for (var term in termsToIndex) {
        let cTerm = termsToIndex[term];
        searchTerms[cTerm] = i;
        }
      }
    }
  
  return searchTerms;
  }
