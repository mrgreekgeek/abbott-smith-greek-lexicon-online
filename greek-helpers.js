"use strict";

// Map Latin to Greek
// We still need to figure out how to map e to η so that searches for "agape" find αγαπη
// https://www.typegreek.com/alphabet.key/
const latinToGreekMap = {
    'a': 'α',
    'b': 'β',
    'g': 'γ',
    'd': 'δ',
    'e': 'ε',
    'z': 'ζ',
    'h': 'η',
    'q': 'θ',
    'i': 'ι',
    'k': 'κ',
    'l': 'λ',
    'm': 'μ',
    'n': 'ν',
    'c': 'ξ',
    'o': 'ο',
    'p': 'π',
    'r': 'ρ',
    's': 'σ',
    't': 'τ',
    'u': 'υ',
    'f': 'φ',
    'x': 'χ',
    'y': 'ψ',
    'w': 'ω'
};

function latinToGreek(latinString) {
  return latinString.split('').map(char => latinToGreekMap[char.toLowerCase()] || char).join('');
}


/*
This standardizes the accent marks of a (possible) Greek word for proper
comparisons of user input... (MrGreekGeek was using this.)
*/
function normalizeGreek(greekWord) {
  return greekWord.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
