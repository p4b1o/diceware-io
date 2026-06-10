import { writable } from "svelte/store";
import { TRANSLATIONS, type Translation } from "../translations";
import { currentLang } from "./current-lang.store";

export const translationsStore = writable<Translation>(TRANSLATIONS.pl);

currentLang.subscribe((lang) => {
    translationsStore.set(TRANSLATIONS[lang]);
});