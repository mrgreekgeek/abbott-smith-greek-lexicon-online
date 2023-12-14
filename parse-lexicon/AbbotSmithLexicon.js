function AbbotSmithLexicon() {
  this._data = undefined;

  this.attach = function (lexiconData) {
    this._data = lexiconData;
  }

  //
  this.search = function (term) {
    let index = this._data.searchTerms[term.toLowerCase()];
    if (index !== null) {
      return this._data.entries[index];
    }

    return null;
  }
}