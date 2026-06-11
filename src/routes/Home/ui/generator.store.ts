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