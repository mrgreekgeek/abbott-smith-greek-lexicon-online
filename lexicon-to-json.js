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

        return indexLexicon(lexiconEntries);
        });
  }


function indexLexicon(lexiconEntries) {
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
      
      return [greekWord];//, latinWord];
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
