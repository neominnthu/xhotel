import en from '@/i18n/en.json';
import my from '@/i18n/my.json';

type Dictionary = Record<string, string>;

type Locale = 'en' | 'my';

const dictionaries: Record<Locale, Dictionary> = {
    en,
    my,
};

const DEFAULT_LOCALE: Locale = 'my';

const getLocale = (): Locale => {
    if (typeof document === 'undefined') {
        return DEFAULT_LOCALE;
    }

    const lang = document.documentElement.lang.toLowerCase();

    if (lang.startsWith('en')) {
        return 'en';
    }

    return 'my';
};

export const t = (key: string, replacements?: Record<string, string | number>): string => {
    const locale = getLocale();
    const dictionary = dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
    const fallbackDictionary = dictionaries[DEFAULT_LOCALE];
    const template = dictionary[key] ?? fallbackDictionary[key] ?? key;

    if (!replacements) {
        return template;
    }

    return Object.entries(replacements).reduce(
        (value, [token, replacement]) =>
            value.replace(new RegExp(`\\{${token}\\}`, 'g'), String(replacement)),
        template,
    );
};
