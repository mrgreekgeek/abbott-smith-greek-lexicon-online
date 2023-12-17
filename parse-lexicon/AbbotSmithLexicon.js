function AbbotSmithLexicon() {
  this._data = undefined;
  this._validSearchTerms = undefined;

  /*
  This must be called before any other methods.
  */
  this.attach = function (lexiconData) {
    this._data = lexiconData;
    this._validSearchTerms = Object.keys(this._data.searchTerms);
  };

  /*
  Return an array of LexiconEntries where term is the first characters of
  one of their indexes.
  */
  this.getSimilar = function(term) {
    term = normalizeGreek(term);
    let alreadyEntered = new Map(),
      results = [];
    
    this._validSearchTerms.forEach((searchTerm) => {
      let entryIndex = this._data.searchTerms[searchTerm];
      if(searchTerm.startsWith(term) && alreadyEntered.has(entryIndex) == false) {
        results.push(this._data.entries[entryIndex]);
        alreadyEntered.set(entryIndex, true);
      }
    });
    
    return results;
  };

  this.search = function (term) {
    term = normalizeGreek(term);
    let index = this._data.searchTerms[term];
    if (index !== null) {
      return this._data.entries[index];
    }

    return null;
  };
}