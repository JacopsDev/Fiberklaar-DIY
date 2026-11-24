const I18N = {
    supported: ["en", "nl", "hi"],
    default: "en",
    language: "en",
    translations: {},
    fallback: {},
    directory: new URL(
        "./locales/",
        document.currentScript.src
    )
};

async function loadLocale(lang) {
    const response = await fetch(
        new URL(`${lang}.json`, I18N.directory)
    );

    if (!response.ok) {
        throw new Error(`Cannot load language: ${lang}`);
    }

    return response.json();
}

function t(key, params = {}) {
    let value =
        I18N.translations[key] ??
        I18N.fallback[key] ??
        key;

    for (const [name, replacement] of Object.entries(params)) {
        value = value.replaceAll(`{${name}}`, replacement);
    }

    return value;
}

async function setLanguage(lang) {
    if (!I18N.supported.includes(lang)) {
        lang = I18N.default;
    }

    const translations = await loadLocale(lang);

    I18N.translations = translations;
    I18N.language = lang;

    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;

    translatePage();

    document.dispatchEvent(
        new CustomEvent("languagechange", {
            detail: { language: lang }
        })
    );
}

function translatePage() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        el.textContent = t(el.dataset.i18n);
    });

    for (const attr of ["placeholder", "title", "aria-label"]) {
        document
            .querySelectorAll(`[data-i18n-${attr}]`)
            .forEach(el => {
                el.setAttribute(
                    attr,
                    t(el.getAttribute(`data-i18n-${attr}`))
                );
            });
    }

    document.querySelectorAll("[data-language-selector]")
        .forEach(el => {
            el.value = I18N.language;
        });
}

document.addEventListener("DOMContentLoaded", async () => {
    I18N.fallback = await loadLocale(I18N.default);

    await setLanguage(
        localStorage.getItem("language") || I18N.default
    );
});