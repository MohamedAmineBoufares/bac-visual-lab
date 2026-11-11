import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Check, ExternalLink, SlidersHorizontal, Smartphone } from "lucide-react";
import { AppBar } from "@/components/app-bar";
import { Formula } from "@/components/formula";
import { Button } from "@/components/ui/button";
import { localeDir, type MessageKey } from "@/i18n/messages";
import { useSettings } from "@/settings/settings";
import { site } from "@/site";

export const Route = createFileRoute("/")({ component: Landing });

const steps: { title: MessageKey; body: MessageKey; icon: typeof BookOpen }[] = [
  { title: "how1Title", body: "how1Body", icon: BookOpen },
  { title: "how2Title", body: "how2Body", icon: SlidersHorizontal },
  { title: "how3Title", body: "how3Body", icon: Check },
];

// Read once at load: the copyright year follows the visitor's clock.
const year = new Date().getFullYear();

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
            <h1 className="text-4xl leading-tight font-bold @3xl:text-6xl">{t("landTitle")}</h1>
            <p className="max-w-xl text-lg text-muted-foreground">{t("landLead")}</p>
            <div className="flex flex-wrap gap-3">
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
          <h2 className="text-2xl font-bold @3xl:text-3xl">{t("howTitle")}</h2>
          <ol className="grid gap-4 @3xl:grid-cols-3">
            {steps.map(({ title, body, icon: Icon }, i) => (
              <li key={title} className="flex flex-col gap-3 border-2 border-foreground bg-card p-5 shadow-hard-sm">
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

        <section className="grid gap-6 border-2 border-foreground bg-secondary p-6 @3xl:grid-cols-[1fr_2fr] @3xl:p-10">
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
              <li key={key} className="border-2 border-foreground bg-card p-5">
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

/** Static preview of a lesson: curve + formula with the live term highlighted. */
function HeroVisual() {
  return (
    <figure className="border-2 border-foreground bg-sim-canvas shadow-hard" aria-hidden="true">
      <svg viewBox="0 0 400 220" className="block h-auto w-full">
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`v${i}`} x1={40 + i * 44} x2={40 + i * 44} y1={20} y2={190} className="stroke-sim-grid" />
        ))}
        {Array.from({ length: 5 }, (_, i) => (
          <line key={`h${i}`} x1={40} x2={392} y1={20 + i * 42.5} y2={20 + i * 42.5} className="stroke-sim-grid" />
        ))}
        <line x1={40} x2={392} y1={190} y2={190} className="stroke-sim-axis" strokeWidth={2} />
        <line x1={40} x2={40} y1={20} y2={190} className="stroke-sim-axis" strokeWidth={2} />
        <path d="M40 190 C 100 70 170 44 392 38" fill="none" stroke="var(--sim-curve-1)" strokeWidth={4} />
        <path
          d="M40 38 C 100 158 170 184 392 190"
          fill="none"
          stroke="var(--sim-curve-2)"
          strokeWidth={4}
          strokeDasharray="10 6"
        />
        <rect x={113} y={74} width={14} height={14} className="fill-sim-point stroke-foreground" strokeWidth={2} />
      </svg>
      <figcaption className="border-t-2 border-foreground bg-card px-4 py-3 text-xl" dir="ltr">
        <Formula tex={String.raw`u_C(t) = \htmlClass{live}{E}\left(1 - e^{-t/\htmlClass{live}{RC}}\right)`} />
      </figcaption>
    </figure>
  );
}
