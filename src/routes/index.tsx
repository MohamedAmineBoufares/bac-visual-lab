import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Check,
  ExternalLink,
  Languages,
  Layers,
  ListChecks,
  Play,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { AppBar } from "@/components/app-bar";
import { Formula } from "@/components/formula";
import { ParamSlider, SimStage } from "@/components/sim";
import { Button } from "@/components/ui/button";
import { localeDir, type MessageKey } from "@/i18n/messages";
import { useSettings } from "@/settings/settings";
import { uC, uR } from "@/sims/rc-charging/model";
import { site } from "@/site";

export const Route = createFileRoute("/")({ component: Landing });

const steps: { title: MessageKey; body: MessageKey; icon: typeof BookOpen }[] = [
  { title: "how1Title", body: "how1Body", icon: BookOpen },
  { title: "how2Title", body: "how2Body", icon: SlidersHorizontal },
  { title: "how3Title", body: "how3Body", icon: Check },
];

// Read once at load: the copyright year follows the visitor's clock.
const year = new Date().getFullYear();

const features: { title: MessageKey; body: MessageKey; icon: typeof BookOpen }[] = [
  { title: "f1t", body: "f1b", icon: Sparkles },
  { title: "f2t", body: "f2b", icon: Play },
  { title: "f3t", body: "f3b", icon: ListChecks },
  { title: "f4t", body: "f4b", icon: Layers },
  { title: "f5t", body: "f5b", icon: Languages },
  { title: "f6t", body: "f6b", icon: ShieldCheck },
];

const lift =
  "border-2 border-foreground bg-card shadow-hard-sm transition-[translate,box-shadow] motion-safe:hover:-translate-y-1 hover:shadow-hard";

const forAll: MessageKey[] = ["forAll1", "forAll2", "forAll3", "forAll4"];
const contribs: MessageKey[] = ["contribTeachers", "contribTranslators", "contribDevs"];

function Landing() {
  const { settings, t } = useSettings();
  return (
    <div dir={localeDir[settings.locale]} className="@container min-h-screen bg-background text-foreground">
      <AppBar home="/">
        <Button size="sm" asChild className="hidden @md:inline-flex">
          <Link to="/app">{t("openApp")}</Link>
        </Button>
      </AppBar>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-10 @3xl:gap-24 @3xl:px-8 @3xl:py-16">
        <section className="grid items-center gap-8 @4xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="flex flex-col items-start gap-6">
            <h1 className="enter text-4xl leading-tight font-bold @3xl:text-6xl">{t("landTitle")}</h1>
            <p className="enter max-w-xl text-lg text-muted-foreground [animation-delay:120ms]">{t("landLead")}</p>
            <div className="enter flex flex-wrap gap-3 [animation-delay:240ms]">
              <Button size="lg" asChild>
                <Link to="/app">
                  {t("openApp")}
                  <ArrowRight className="rtl:rotate-180" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#contribute">{t("contribute")}</a>
              </Button>
            </div>
          </div>
          <HeroVisual />
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="reveal text-2xl font-bold @3xl:text-3xl">{t("featTitle")}</h2>
          <ul className="grid gap-4 @xl:grid-cols-2 @4xl:grid-cols-3">
            {features.map(({ title, body, icon: Icon }) => (
              <li key={title} className={`reveal flex flex-col gap-3 p-5 ${lift}`}>
                <span className="grid size-11 place-items-center border-2 border-foreground bg-secondary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-semibold">{t(title)}</h3>
                <p className="text-muted-foreground">{t(body)}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold @3xl:text-3xl">{t("howTitle")}</h2>
          <ol className="grid gap-4 @3xl:grid-cols-3">
            {steps.map(({ title, body, icon: Icon }, i) => (
              <li key={title} className={`reveal flex flex-col gap-3 p-5 ${lift}`}>
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center border-2 border-foreground bg-sim-highlight font-bold text-[#072841]">
                    {i + 1}
                  </span>
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold">{t(title)}</h3>
                <p className="text-muted-foreground">{t(body)}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="reveal grid gap-6 border-2 border-foreground bg-secondary p-6 @3xl:grid-cols-[1fr_2fr] @3xl:p-10">
          <div className="flex items-start gap-3">
            <Smartphone className="mt-1 size-6 shrink-0" aria-hidden="true" />
            <h2 className="text-2xl font-bold">{t("forAllTitle")}</h2>
          </div>
          <ul className="grid gap-3 @xl:grid-cols-2">
            {forAll.map((key) => (
              <li key={key} className="flex items-start gap-2">
                <Check className="mt-1 size-4 shrink-0 text-success" aria-hidden="true" />
                {t(key)}
              </li>
            ))}
          </ul>
        </section>

        <section id="contribute" className="flex scroll-mt-20 flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold @3xl:text-3xl">{t("contribTitle")}</h2>
            <p className="max-w-2xl text-lg text-muted-foreground">{t("contribLead")}</p>
          </div>
          <ul className="grid gap-4 @3xl:grid-cols-3">
            {contribs.map((key) => (
              <li key={key} className={`reveal p-5 ${lift}`}>
                {t(key)}
              </li>
            ))}
          </ul>
          {site.repoUrl && (
            <Button variant="outline" asChild className="self-start">
              <a href={site.repoUrl} target="_blank" rel="noreferrer">
                <ExternalLink />
                GitHub
              </a>
            </Button>
          )}
        </section>
      </main>

      <footer className="border-t-2 border-foreground bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm @3xl:px-8">
          <p>
            © {year}{" "}
            {site.linkedinUrl ? (
              <a href={site.linkedinUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                {site.author}
              </a>
            ) : (
              site.author
            )}
            . {t("rights")}
          </p>
          <nav className="flex items-center gap-4 font-semibold">
            {site.repoUrl && (
              <a href={site.repoUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                GitHub
              </a>
            )}
            <Link to="/app" className="underline underline-offset-4">
              {t("openApp")}
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

/** A real mini simulation: moving a slider reshapes the curves and lights up its term. */
function HeroVisual() {
  const { t } = useSettings();
  const [E, setE] = useState(6);
  const [RC, setRC] = useState(2);
  const p = { E, R: RC, C: 1 };
  return (
    <div className="enter flex flex-col gap-4 [animation-delay:200ms]">
      <SimStage
        series={[
          { label: "uC", color: "var(--sim-curve-1)", fn: (x) => uC(p, x) },
          { label: "uR", color: "var(--sim-curve-2)", dash: "10 6", fn: (x) => uR(p, x) },
        ]}
        tMax={12}
        yMax={12}
        t={RC}
        markers={[{ t: RC, label: "τ" }]}
        xLabel="t (ms)"
        yLabel="u (V)"
        footer={
          <div className="px-4 py-3 text-xl" dir="ltr">
            <Formula tex={String.raw`u_C(t) = \htmlClass{live}{E}\left(1 - e^{-t/\htmlClass{live}{RC}}\right)`} />
          </div>
        }
      />
      <div className="flex flex-col gap-4 border-2 border-foreground bg-card p-4">
        <p className="text-sm font-semibold">{t("tryIt")}</p>
        <ParamSlider
          symbolTex="E"
          label={t("emf")}
          unit="V"
          value={E}
          min={1}
          max={12}
          step={0.5}
          digits={1}
          onChange={setE}
        />
        <ParamSlider
          symbolTex="RC"
          label="τ = RC"
          unit="ms"
          value={RC}
          min={0.5}
          max={5}
          step={0.1}
          digits={1}
          onChange={setRC}
        />
      </div>
    </div>
  );
}
