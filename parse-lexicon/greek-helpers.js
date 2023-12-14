"use strict";

// Map Greek characters to Latin.
// IMPORTANT: The Greek characters were first normalized with
// <key>.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
const greekToLatinMap = {
  'α' : 'a',
  'β' : 'b',
  'γ' : 'g',
  'δ' : 'd',
  'ε' : 'e',
  'ζ' : 'z',
  'η': ['h', 'e'],
  'θ' : 'q',
  'ι' : 'i',
  'κ' : 'k',
  'λ' : 'l',
  'μ' : 'm',
  'ν' : 'n',
  'ξ' : 'c',
  'ο' : 'o',
  'π' : 'p',
  'ρ' : 'r',
  'σ' : 's',
  'ς' : 's',
  'τ' : 't',
  'υ' : 'u',
  'φ' : 'f',
  'χ' : 'x',
  'ψ' : 'y',
  'ω': ['w','o']
};


/*
This calculates each latin variant of greekTerm using the global
greekToLatinMap. It calls logResult(latinVariant) on each one.

Usage Notes:
1. Do not supply values for _variant and _position!
2. greekTerm does not need to be normalized by the caller.
3. Non-Greek characters in greekTerm will be included in the variants.

// prints "1. agaph" and "1. agape" to the console
getLatinVariants("1. ἀγάπη", console.log);
*/
function getLatinVariants(greekTerm, logResult, _variant, _position) {
  if (typeof _variant == 'undefined') {
    greekTerm = normalizeGreek(greekTerm);
    _variant = new Array();
    _position = 0;
  }
  
  if (_position == greekTerm.length) {
    if (_position > 0) {
      logResult (_variant.join(''));
      }
    return true;
    }
  
  let greekChar = greekTerm[_position];
  let latinChars = [].concat(greekToLatinMap[greekChar] || greekChar);
  
  latinChars.forEach((c) => {
    _variant[_position] = c;
    return getLatinVariants(greekTerm, logResult, _variant, _position + 1);
    }
  )};


/*
This standardizes the accent marks of a (possible) Greek word for proper
comparisons of user input... (MrGreekGeek was using this.)
*/
function normalizeGreek(greekWord) {
  return greekWord.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
}