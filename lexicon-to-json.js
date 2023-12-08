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

        return Promise.resolve(indexLexicon(lexiconEntries));
        });
  }


function indexLexicon(lexiconEntries) {
  return "indexLexicon does nothing yet...";
  }
