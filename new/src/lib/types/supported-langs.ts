const SUPPORTED_LANGS = ['pl', 'en'] as const;

export type Lang = (typeof SUPPORTED_LANGS)[number];

export function isSupportedLang(value: string | null | undefined): value is Lang {
    return SUPPORTED_LANGS.includes(value as Lang);
}