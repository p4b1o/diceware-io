/*
  This file was generated from initial source code.
*/

export const casingOptions = ['lower', 'upper', 'title', 'random'] as const;
export type CasingMode = typeof casingOptions[number];

export const separators = ['', ' ', '-', '.', 'custom'] as const;

export interface PasswordOptions {
  wordCount: number;
  separator: typeof separators[number];
  customSeparator: string;
  casing: CasingMode;
  addDigit: boolean;
  addSpecial: boolean;
}

interface EntropyPart {
  key: string;
  label: string;
  bits: number;
}

export interface EntropyDetails {
  total: number;
  parts: EntropyPart[];
}

interface CrackAlgorithmInfo {
  name: string;
  guessesPerSecond: number;
}

export interface CrackEstimate {
  algorithm: CrackAlgorithmInfo;
  seconds: number;
}

const SPECIAL_CHARS = '!@#$%^&*-_=+';
const BUILTIN_SEPARATOR_CHOICES = 3;
const CUSTOM_SEPARATOR_CHARSET_SIZE = 94;

const CRACK_ALGORITHMS = {
  md5: { name: 'MD5', guessesPerSecond: 300_000_000_000 },
  ntlm: { name: 'NTLM', guessesPerSecond: 300_000_000_000 },
  sha1: { name: 'SHA-1', guessesPerSecond: 100_000_000_000 },
  sha256: { name: 'SHA-256', guessesPerSecond: 45_000_000_000 },
  bcrypt: { name: 'bcrypt cost 12', guessesPerSecond: 200_000 },
} as const;

export function parseWordlist(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'))
    .map((line) => {
      const match = line.match(/^\d+\s+(.+)$/);
      return match ? match[1].trim() : line;
    })
    .filter((word) => word.length > 0);
}

function secureRandomInt(max: number): number {
  if (max <= 0) return 0;
  const range = max;
  const bytesNeeded = Math.ceil(Math.log2(range) / 8) || 1;
  const maxValid = Math.floor(256 ** bytesNeeded / range) * range - 1;
  const arr = new Uint8Array(bytesNeeded);

  let value: number;
  do {
    globalThis.crypto.getRandomValues(arr);
    value = 0;
    for (let i = 0; i < bytesNeeded; i++) {
      value = value * 256 + arr[i];
    }
  } while (value > maxValid);

  return value % range;
}

function applyCasing(word: string, mode: CasingMode): string {
  switch (mode) {
    case 'lower':
      return word.toLowerCase();
    case 'upper':
      return word.toUpperCase();
    case 'title':
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    case 'random':
      return word
        .split('')
        .map((char) => {
          if (char.toLowerCase() === char.toUpperCase()) return char;
          return secureRandomInt(2) ? char.toUpperCase() : char.toLowerCase();
        })
        .join('');
    default:
      return word;
  }
}

function countCaseVariableCharacters(word: string): number {
  return word.split('').filter((char) => char.toLowerCase() !== char.toUpperCase()).length;
}

function getSeparator(options: PasswordOptions): string {
  if (options.separator === 'custom') {
    return options.customSeparator || '';
  }
  return options.separator;
}

export function generatePassword(words: string[], options: PasswordOptions): { phrase: string; entropy: number, words: string[] } {
  if (words.length === 0 || options.wordCount < 1) {
    return { phrase: '', entropy: 0, words: [] };
  }

  const selectedWords: string[] = [];
  const generated: string[] = [];

  for (let i = 0; i < options.wordCount; i += 1) {
    const idx = secureRandomInt(words.length);
    const word = words[idx];
    selectedWords.push(word);
    const cased = options.casing === 'random' ? applyCasing(word, 'random') : applyCasing(word, options.casing);
    generated.push(cased);
  }

  let phrase = generated.join(getSeparator(options));

  if (options.addDigit) {
    phrase += secureRandomInt(10).toString();
  }

  if (options.addSpecial) {
    phrase += SPECIAL_CHARS[secureRandomInt(SPECIAL_CHARS.length)];
  }

  const entropy = calculateEntropyDetails(words, options, selectedWords).total;
  return { phrase, entropy, words };
}

export function calculateEntropyDetails(
  words: string[],
  options: PasswordOptions,
  selectedWords: string[]
): EntropyDetails {
  if (words.length === 0 || options.wordCount < 1) {
    return { total: 0, parts: [] };
  }

  const parts: EntropyPart[] = [];
  const wordEntropy = options.wordCount * Math.log2(words.length);
  parts.push({ key: 'words', label: 'words', bits: wordEntropy });

  const separator = getSeparator(options);
  if (options.wordCount > 1 && separator.length > 0) {
    const separatorBits =
      options.separator === 'custom'
        ? separator.length * Math.log2(CUSTOM_SEPARATOR_CHARSET_SIZE)
        : Math.log2(BUILTIN_SEPARATOR_CHOICES);
    parts.push({ key: 'separator', label: 'separator', bits: separatorBits * (options.wordCount - 1) });
  }

  if (options.casing === 'random' && selectedWords.length > 0) {
    const caseChoices = selectedWords.reduce((sum, word) => sum + countCaseVariableCharacters(word), 0);
    if (caseChoices > 0) {
      parts.push({ key: 'case', label: 'random case', bits: caseChoices });
    }
  }

  if (options.addDigit) {
    parts.push({ key: 'digit', label: 'digit', bits: Math.log2(10) });
  }

  if (options.addSpecial) {
    parts.push({ key: 'special', label: 'special', bits: Math.log2(SPECIAL_CHARS.length) });
  }

  return { total: parts.reduce((sum, part) => sum + part.bits, 0), parts };
}

export function getQuality(entropy: number): { label: string; level: number } {
  if (entropy < 50) return { label: 'Weak', level: 1 };
  if (entropy < 70) return { label: 'Medium', level: 2 };
  if (entropy < 90) return { label: 'Good', level: 3 };
  return { label: 'Very strong', level: 5 };
}

function formatLargeNumber(value: number, locale = 'en-US'): string {
  if (value >= 1_000_000_000_000) return `${(value / 1_000_000_000_000).toFixed(0)} TH/s`;
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(0)} GH/s`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)} MH/s`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)} kH/s`;
  return `${value.toLocaleString(locale)} H/s`;
}

export function formatCrackDuration(seconds: number): string {
  if (!Number.isFinite(seconds)) return 'effectively infinite';
  if (seconds < 1) return 'less than a second';

  const units = [
    { seconds: 31557600000, label: 'billion years' },
    { seconds: 31557600, label: 'years' },
    { seconds: 2629800, label: 'months' },
    { seconds: 86400, label: 'days' },
    { seconds: 3600, label: 'hours' },
    { seconds: 60, label: 'min' },
    { seconds: 1, label: 's' },
  ];
  const unit = units.find((item) => seconds >= item.seconds) || units[units.length - 1];
  const value = seconds / unit.seconds;
  const maximumFractionDigits = value >= 100 ? 0 : value >= 10 ? 1 : 2;
  const formatted = value.toLocaleString('en-US', { maximumFractionDigits });
  return `${formatted} ${unit.label}`;
}

export type CrackAlghoritm = keyof typeof CRACK_ALGORITHMS;
export function calculateCrackEstimate(entropy: number, algorithmKey: CrackAlghoritm = 'md5'): CrackEstimate {
  const algorithm = CRACK_ALGORITHMS[algorithmKey];
  const averageGuesses = 2 ** Math.max(entropy - 1, 0);
  return {
    algorithm,
    seconds: averageGuesses / algorithm.guessesPerSecond,
  };
}
