import { writable } from "svelte/store";
import type { PasswordOptions } from "../app";

export const generatorStore = writable<PasswordOptions>({
    addDigit: false,
    addSpecial: false,
    crackAlgorithm: 'md5', 
    casing: 'title',
    wordCount: 7,
    separator: ' ',
    customSeparator: '',
})