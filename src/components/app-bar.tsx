import { Link } from "@tanstack/react-router";
import { Type } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { type Locale, localeLabel, locales } from "@/i18n/messages";
import { type Settings, useSettings } from "@/settings/settings";

export function Logo() {
  return (
    <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden="true">
      <rect x="1" y="1" width="30" height="30" className="fill-primary stroke-foreground" strokeWidth="2" />
      <path d="M6 25 C 10 12, 16 8, 26 7" fill="none" className="stroke-primary-foreground" strokeWidth="3" />
      <rect x="13" y="10" width="5" height="5" className="fill-sim-highlight stroke-foreground" strokeWidth="1.5" />
    </svg>
  );
}

export function DisplaySettings() {
  const { settings, update, t } = useSettings();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Type />
          <span className="hidden @md:inline">{t("display")}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="flex w-72 flex-col gap-4 rounded-none border-2 border-foreground shadow-hard"
      >
        <Field label={t("theme")}>
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={settings.theme}
            onValueChange={(v) => v && update({ theme: v as Settings["theme"] })}
          >
            <ToggleGroupItem value="light">{t("light")}</ToggleGroupItem>
            <ToggleGroupItem value="dark">{t("dark")}</ToggleGroupItem>
          </ToggleGroup>
        </Field>
        <Field label={t("font")}>
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={settings.font}
            onValueChange={(v) => v && update({ font: v as Settings["font"] })}
          >
            <ToggleGroupItem value="default">{t("fontDefault")}</ToggleGroupItem>
            <ToggleGroupItem value="readable">{t("fontReadable")}</ToggleGroupItem>
          </ToggleGroup>
        </Field>
        <Field label={t("textSize")}>
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={settings.size}
            onValueChange={(v) => v && update({ size: v as Settings["size"] })}
          >
            {(["s", "m", "l", "xl"] as const).map((s) => (
              <ToggleGroupItem key={s} value={s} aria-label={`${t("textSize")} ${s.toUpperCase()}`}>
                {s.toUpperCase()}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </Field>
        <label className="flex items-center justify-between gap-3 text-sm font-medium">
          {t("colorBlind")}
          <Switch checked={settings.colorBlind} onCheckedChange={(v) => update({ colorBlind: v })} />
        </label>
      </PopoverContent>
    </Popover>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </div>
  );
}

/** Top bar shared by the landing page (home="/") and the app (home="/app"). Extra nav goes in children. */
export function AppBar({ home = "/app", children }: { home?: "/" | "/app"; children?: ReactNode }) {
  const { settings, update, t } = useSettings();
  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b-2 border-foreground bg-card px-4 py-2.5">
      <Link to={home} className="flex items-center gap-2 font-semibold">
        <Logo />
        <span className="hidden @sm:inline">{t("appName")}</span>
      </Link>
      <div className="ms-auto flex items-center gap-2">
        {children}
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          value={settings.locale}
          onValueChange={(v) => v && update({ locale: v as Locale })}
          aria-label="Language"
        >
          {locales.map((l) => (
            <ToggleGroupItem key={l} value={l} lang={l}>
              {localeLabel[l]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <DisplaySettings />
      </div>
    </header>
  );
}
