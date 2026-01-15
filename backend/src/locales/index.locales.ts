import i18next from "i18next";
import Backend from "i18next-fs-backend";
import i18nextMiddleware from "i18next-http-middleware";
import path from "path";

export const i18n = i18next;

let initPromise: Promise<typeof i18n> | null = null;

export function initI18n() {
  if (i18n.isInitialized) return Promise.resolve(i18n);
  if (initPromise) return initPromise;

  initPromise = i18n
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
      fallbackLng: "en",
      load: "languageOnly",
      supportedLngs: ["en", "vi", "ja"],
      nonExplicitSupportedLngs: true,
      preload: ["en", "vi", "ja"],
      backend: {
        loadPath: path.join(__dirname, "{{lng}}.json"),
      },
      detection: {
        order: ["querystring", "cookie", "header"],
        lookupQuerystring: "lang",
        caches: ["cookie"],
        cookieOptions: {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.sameSite as any,
          cookieDomain: process.env.cookieDomain, // for production
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        },
      },
    })
    .then(() => i18n);

  return initPromise;
}