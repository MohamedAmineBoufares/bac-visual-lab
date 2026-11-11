import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Atom, Binary, Cog, FlaskConical, Sigma } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { Formula } from "@/components/formula";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MessageKey } from "@/i18n/messages";
import { useSettings } from "@/settings/settings";
import { RcCharging } from "@/sims/rc-charging/rc-charging";

export const sections = [
  { slug: "sciences-experimentales", key: "secExp", icon: FlaskConical },
  { slug: "mathematiques", key: "secMath", icon: Sigma },
  { slug: "sciences-techniques", key: "secTech", icon: Cog },
  { slug: "informatique", key: "secInfo", icon: Binary },
] as const satisfies readonly { slug: string; key: MessageKey; icon: ComponentType<{ className?: string }> }[];

export type Section = (typeof sections)[number];
export const findSection = (slug: string): Section | undefined => sections.find((s) => s.slug === slug);

const cardLink =
  "flex border-2 border-foreground bg-card text-start transition-shadow hover:shadow-hard focus-visible:shadow-hard focus-visible:outline-none";

function Page({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 @3xl:px-8 @3xl:py-10">{children}</main>
  );
}

function SampleNote() {
  const { t } = useSettings();
  return <p className="text-xs text-muted-foreground">* {t("sample")}</p>;
}

export function Home() {
  const { t } = useSettings();
  return (
    <Page>
      <section className="flex flex-col gap-4 border-2 border-foreground bg-sim-highlight p-6 text-[#072841] shadow-hard @3xl:p-10">
        <h1 className="text-3xl font-bold @3xl:text-5xl">{t("homeTitle")}</h1>
        <p className="max-w-xl text-lg">{t("homeLead")}</p>
        <div className="text-2xl" dir="ltr">
          <Formula tex={String.raw`u_C(t) = E\left(1 - e^{-t/RC}\right)`} />
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">{t("sections")}</h2>
        <div className="grid grid-cols-1 gap-4 @md:grid-cols-2 @5xl:grid-cols-4">
          {sections.map(({ slug, key, icon: Icon }) => (
            <Link
              key={slug}
              to="/app/sections/$section"
              params={{ section: slug }}
              className={`${cardLink} items-center gap-4 p-5`}
            >
              <span className="grid size-12 shrink-0 place-items-center border-2 border-foreground bg-secondary">
                <Icon className="size-6" />
              </span>
              <span className="flex-1 font-semibold">{t(key)}</span>
              <ArrowRight className="size-5 rtl:rotate-180" />
            </Link>
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">{t("continue")}</h2>
        <div className="grid gap-4 @md:grid-cols-2 @5xl:grid-cols-3">
          <LessonCard />
        </div>
      </section>
      <SampleNote />
    </Page>
  );
}

function LessonCard({
  title,
  chapter,
  done = 2,
  mini = "rc",
}: {
  title?: string;
  chapter?: string;
  done?: number;
  mini?: "rc" | "exp" | "seq";
}) {
  const { t } = useSettings();
  const paths = {
    rc: "M0 70 C 40 20 90 8 200 4",
    exp: "M0 76 C 120 74 170 50 200 2",
    seq: "M0 70 L40 40 L80 58 L120 46 L160 52 L200 49",
  };
  // shortcut: every sample card opens the only built simulation; real cards come from lesson metadata.
  return (
    <Link to="/app/lessons/$lessonId" params={{ lessonId: "rc-charging" }} className={`${cardLink} flex-col`}>
      <svg
        viewBox="-10 -6 220 90"
        className="h-28 w-full border-b-2 border-foreground bg-sim-canvas"
        aria-hidden="true"
      >
        <path d={paths[mini]} fill="none" stroke="var(--sim-curve-1)" strokeWidth="3.5" />
      </svg>
      <div className="flex flex-col gap-2.5 p-4">
        <div className="flex flex-wrap gap-1.5">
          <Badge className="rounded-none border-2 border-foreground bg-secondary text-secondary-foreground">
            {t("physics")}
          </Badge>
          <Badge variant="outline" className="rounded-none">
            Sc. exp
          </Badge>
          <Badge variant="outline" className="rounded-none">
            Math
          </Badge>
          <Badge variant="outline" className="rounded-none">
            Tech
          </Badge>
        </div>
        <h3 className="font-semibold">{title ?? t("rcTitle")}</h3>
        <p className="text-sm text-muted-foreground">
          {chapter ?? t("rcChapter")} · {t("level4")}
        </p>
        <div className="flex items-center gap-2">
          <div className="h-3 flex-1 border-2 border-foreground bg-background">
            <div className="h-full bg-success" style={{ width: `${(done / 3) * 100}%` }} />
          </div>
          <span className="text-xs font-medium text-muted-foreground tabular-nums">
            {done}/3 {t("quizProgress")}
          </span>
        </div>
      </div>
    </Link>
  );
}

function BackButton() {
  const { t } = useSettings();
  return (
    <Button variant="outline" size="icon" asChild>
      <Link to="/app" aria-label={t("back")}>
        <ArrowLeft className="rtl:rotate-180" />
      </Link>
    </Button>
  );
}

export function Chapters({ section }: { section: Section }) {
  const { t } = useSettings();
  return (
    <Page>
      <div className="flex items-center gap-3">
        <BackButton />
        <h1 className="text-2xl font-bold">{t(section.key)}</h1>
      </div>
      <section className="flex flex-col gap-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Atom className="size-5" />
          {t("physics")}
        </h2>
        <div className="grid gap-4 @md:grid-cols-2 @5xl:grid-cols-3">
          <LessonCard />
          <LessonCard title="Dipôle RL" chapter="Établissement du courant" done={0} mini="exp" />
          <LessonCard title="Oscillations libres amorties" chapter="Circuit RLC série" done={1} />
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Sigma className="size-5" />
          {t("math")}
        </h2>
        <div className="grid gap-4 @md:grid-cols-2 @5xl:grid-cols-3">
          <LessonCard title="Suites réelles" chapter="Convergence" done={3} mini="seq" />
          <LessonCard title="Fonction exponentielle" chapter="Analyse" done={0} mini="exp" />
        </div>
      </section>
      <SampleNote />
    </Page>
  );
}

export function Lesson() {
  const { t } = useSettings();
  return (
    <Page>
      <div className="flex flex-wrap items-center gap-3">
        <BackButton />
        <div>
          <p className="text-sm text-muted-foreground">
            {t("rcChapter")} · {t("level4")}
          </p>
          <h1 className="text-2xl font-bold">{t("rcTitle")}</h1>
        </div>
      </div>
      <RcCharging />
    </Page>
  );
}
