# Localization — first pass

English is the default. Dutch and Hindi are available from the top bar. Serve through HTTP (GitHub Pages or `python -m http.server 8000`), not file://, because dictionaries are loaded using fetch.

The shared script translates exact static text nodes and selected accessibility attributes, preserving nested icons and existing event handlers. `assets/locales/source-keys.json` maps original mixed-language strings to translation keys. The three locale files contain translations; missing keys fall back to English. To add a static string, add its source text and a new unique key to source-keys.json, then add that key to each language file. The untranslated-static.json file is a one-time inventory of remaining text, including technical values that may not need translation; it is not a workflow or validation action.

Dynamic validation messages, generated reports, help paragraphs, file export content and application-specific UI updates are not comprehensively localized in this first pass. For dynamic UI, use `window.DIYI18n.t(key, {count: 5})` and listen for `diy:languagechange` when re-rendering. Do not translate internal identifiers, data values, export schemas or cable codes. Options without explicit values are intentionally not translated because their labels may be used as data.

Fiber Knight and Lightbrowser link to separate pages.dev origins and require independent changes in their source repositories. No code in those apps was modified.
