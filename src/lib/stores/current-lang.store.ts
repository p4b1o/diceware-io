import type { Lang } from "$lib/types/supported-langs";
import { writable } from "svelte/store";

export const currentLang = writable<Lang>('pl');