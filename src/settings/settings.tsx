import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type Locale, type MessageKey, localeDir, messages } from "@/i18n/messages";

export type Settings = {
  locale: Locale;
  theme: "light" | "dark";
  colorBlind: boolean;
  font: "default" | "readable";
  size: "s" | "m" | "l" | "xl";
};

const defaults: Settings = { locale: "fr", theme: "light", colorBlind: false, font: "default", size: "m" };
const storageKey = "bvl.settings";

function load(): Settings {
  // Prerendering in Node: no saved settings (and Node 26+ warns on any touch of its global localStorage).
  if (typeof window === "undefined") return defaults;
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? { ...defaults, ...(JSON.parse(raw) as Partial<Settings>) } : defaults;
  } catch {
    return defaults;
  }
}

type Ctx = {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  t: (key: MessageKey) => string;
};

const SettingsContext = createContext<Ctx | null>(null);

/** `locale` overrides the saved one at start, so <html lang dir> matches the URL from the first frame. */
export function SettingsProvider({ locale, children }: { locale?: Locale; children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => (locale ? { ...load(), locale } : load()));

  // Keep tabs and design-board iframes in sync when settings change elsewhere.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => e.key === storageKey && setSettings(load());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.lang = settings.locale;
    html.dir = localeDir[settings.locale];
    html.dataset.theme = settings.theme;
    html.dataset.cb = settings.colorBlind ? "on" : "off";
    html.dataset.font = settings.font;
    html.dataset.size = settings.size;
    try {
      localStorage.setItem(storageKey, JSON.stringify(settings));
    } catch {
      // storage blocked (private mode): settings still apply for this session
    }
  }, [settings]);

  const value: Ctx = {
    settings,
    update: (patch) => setSettings((s) => ({ ...s, ...patch })),
    t: (key) => messages[settings.locale][key],
  };
  return <SettingsContext value={value}>{children}</SettingsContext>;
}

/**
 * Inside a localized route the URL decides the language: text follows `locale` at once, and choosing
 * another one calls `onChange` (which navigates) instead of only saving it.
 */
export function LocaleProvider({
  locale,
  onChange,
  children,
}: {
  locale: Locale;
  onChange: (locale: Locale) => void;
  children: ReactNode;
}) {
  const outer = useSettings();
  // Keep the saved preference and <html lang dir> in step with the page being read.
  useEffect(() => {
    if (outer.settings.locale !== locale) outer.update({ locale });
  }, [outer, locale]);
  const value: Ctx = {
    settings: { ...outer.settings, locale },
    update: ({ locale: next, ...rest }) => {
      outer.update(rest);
      if (next && next !== locale) onChange(next);
    },
    t: (key) => messages[locale][key],
  };
  return <SettingsContext value={value}>{children}</SettingsContext>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
