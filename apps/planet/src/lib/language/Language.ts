import {
  consonantOrthoSets,
  consonantSets,
  defaultOrtho,
  fricativeSets,
  liquidSets,
  restrictionSets,
  sibilantSets,
  vowelOrthoSets,
  vowelSets,
} from "./Language.sets";
import { syllableStructures } from "./Language.syllables";
import { capitalize, choose, join, randomRange, shuffle } from "./utils";

/*
 * code from https://github.com/mewo2/naming-language
 */

export interface Orthography {
  name: string;
  orth: {
    [key: string]: string | undefined;
  };
}

export default class Language {
  phonemes: {
    [index: string]: string;
    C: string;
    V: string;
    S: string;
    F: string;
    L: string;
  };
  exponent: number = 2;
  structure: string;
  restrictions: RegExp[];
  consonantOrthography: Orthography["orth"];
  vowelOrthography: Orthography["orth"];
  noOrthography: boolean;
  noMorphemes: boolean;
  minSyllables: number;
  maxSyllables: number;
  morphemes: Record<string, string[]> = {};
  words: Record<string, string> = {};
  names: string[] = [];
  joiner: string;
  maxChar: number = 15;
  minChar: number = 3;
  constructor() {
    this.phonemes = {
      C: shuffle(choose<{ C: string; name: string }[]>(consonantSets, 2).C),
      V: shuffle(choose<{ V: string; name: string }[]>(vowelSets, 2).V),
      L: shuffle(choose<{ L: string; name: string }[]>(liquidSets, 2).L),
      S: shuffle(choose<{ S: string; name: string }[]>(sibilantSets, 2).S),
      F: shuffle(choose<{ F: string; name: string }[]>(fricativeSets, 2).F),
    };
    this.structure = choose<string[]>(syllableStructures);
    console.log(this.structure);
    this.joiner = choose("   -");
    this.noOrthography = false;
    this.consonantOrthography = choose<Orthography[]>(
      consonantOrthoSets,
      2
    ).orth;
    this.vowelOrthography = choose<Orthography[]>(vowelOrthoSets, 2).orth;
    this.restrictions = restrictionSets[2].res;
    this.noMorphemes = false;
    this.minSyllables = randomRange(1, 3);
    if (this.structure.length < 3) this.minSyllables++;
    this.maxSyllables = randomRange(this.minSyllables + 1, 5);
  }

  makeSyllable() {
    while (true) {
      let syllable = "";
      for (let i = 0; i < this.structure.length; i++) {
        let ptype = this.structure[i];
        if (this.structure[i + 1] == "?") {
          i++;
          if (Math.random() < 0.5) {
            continue;
          }
        }
        syllable += choose(this.phonemes[ptype], this.exponent);
      }
      let bad = false;
      for (let i = 0; i < this.restrictions.length; i++) {
        if (this.restrictions[i].test(syllable)) {
          bad = true;
          break;
        }
      }
      if (bad) continue;
      return this.spell(syllable);
    }
  }

  spell(syllable: string) {
    if (this.noOrthography) return syllable;
    let spelling = "";
    for (let i = 0; i < syllable.length; i++) {
      let char = syllable[i];
      spelling +=
        this.consonantOrthography[char] ||
        this.vowelOrthography[char] ||
        defaultOrtho[char] ||
        char;
    }
    return spelling;
  }

  makeMorpheme(key: string) {
    if (this.noMorphemes) {
      return this.makeSyllable();
    }
    key = key || "";
    const list = this.morphemes[key] || [];
    let extras = 10;
    if (key) extras = 1;
    while (true) {
      const n = randomRange(list.length + extras);
      if (list[n]) return list[n];
      const morph = this.makeSyllable();
      let bad = false;
      for (let k in this.morphemes) {
        if (this.morphemes[k].includes(morph)) {
          bad = true;
          break;
        }
      }
      if (bad) continue;
      list.push(morph);
      this.morphemes[key] = list;
      return morph;
    }
  }

  makeWord(key: string) {
    const numberSyllables = randomRange(
      this.minSyllables,
      this.maxSyllables + 1
    );
    let word = "";
    let keys = [];
    keys[randomRange(numberSyllables)] = key;
    for (let i = 0; i < numberSyllables; i++) {
      word += this.makeMorpheme(keys[i]);
    }
    return word;
  }

  makeName(key: string) {
    key = key || "";
    // TODO language may not have these features
    const genitive = this.morphemes["of"]
      ? choose<string[]>(this.morphemes["of"])
      : this.makeMorpheme("of");
    const definite = this.morphemes["the"]
      ? choose<string[]>(this.morphemes["the"])
      : this.makeMorpheme("the");

    while (true) {
      let name = null;
      if (Math.random() < 0.5) {
        name = capitalize(this.makeWord(key));
      } else {
        let w1 = capitalize(this.makeWord(Math.random() < 0.6 ? key : ""));
        let w2 = capitalize(this.makeWord(Math.random() < 0.6 ? key : ""));
        if (w1 == w2) continue;
        if (Math.random() > 0.5) {
          name = join([w1, w2], this.joiner);
        } else {
          name = join([w1, genitive, w2], this.joiner);
        }
      }
      if (Math.random() < 0.1) {
        name = join([definite, name], this.joiner);
      }

      if (name.length < this.minChar || name.length > this.maxChar) continue;
      let used = false;
      for (let i = 0; i < this.names.length; i++) {
        let name2 = this.names[i];
        if (name.indexOf(name2) != -1 || name2.indexOf(name) != -1) {
          used = true;
          break;
        }
      }
      if (used) continue;
      this.names.push(name);
      return name;
    }
  }
}
