import { writable } from "svelte/store";
import type { PasswordOptions } from "../app";

export const generatorStore = writable<PasswordOptions>({
    addDigit: false,
    addSpecial: false,
    casing: 'title',
    wordCount: 7,
    separator: ' ',
    customSeparator: '',
})

export const passwordStore = writable<{ phrase: string; entropy: number, words: string[] }>({
    words: [],
    phrase: '',
    entropy: 0
});