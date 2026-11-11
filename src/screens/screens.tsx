import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Atom, Search, Sigma, TestTubes } from "lucide-react";
import { type ComponentType, type ReactNode, Suspense, useEffect, useState } from "react";
import { type Section, sections } from "@/screens/sections";
import { Formula } from "@/components/formula";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MessageKey } from "@/i18n/messages";
import { isReady, type Lesson as LessonData, lessons, type ReadyLesson } from "@/lessons/lessons";
import { useProgress } from "@/lessons/progress";
import { cn } from "@/lib/utils";
import { useSettings } from "@/settings/settings";

const cardLink =
  "flex border-2 border-foreground bg-card text-start transition-shadow hover:shadow-hard focus-visible:shadow-hard focus-visible:outline-none";

function Page({ children }: { children: ReactNode }) {
  return (
    <main
      id="main"
      style={{ viewTransitionName: "page" }}
      tabIndex={-1}
      className="mx-auto flex w-full max-w-6xl flex-col gap-8 outline-none px-4 py-6 @3xl:px-8 @3xl:py-10"
    >
      {children}
    </main>
  );
}

export function Home() {
  const { t } = useSettings();
  const progress = useProgress();
  const ready = lessons.filter(isReady);
  const started = ready.filter((l) => {
    const done = progress[l.id]?.length ?? 0;
    return done > 0 && done < l.ready.quiz.length;
  });
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
              <span className="flex-1 font-semibold" style={{ viewTransitionName: `section-${slug}` }}>
                {t(key)}
              </span>
              <ArrowRight className="size-5 rtl:rotate-180" />
            </Link>
          ))}
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">{t(started.length ? "continue" : "lessons")}</h2>
        <div className="grid gap-4 @md:grid-cols-2 @5xl:grid-cols-3">
          {(started.length ? started : ready).map((l) => (
            <LessonCard key={l.id} lesson={l} />
          ))}
        </div>
      </section>
    </Page>
  );
}

function LessonCard({ lesson }: { lesson: LessonData }) {
  const { t } = useSettings();
  const done = useProgress()[lesson.id]?.length ?? 0;
  const info = (
    <>
      <div className="flex flex-wrap gap-1.5">
        <Badge className="rounded-none border-2 border-foreground bg-secondary text-secondary-foreground">
          {t(lesson.subject)}
        </Badge>
        {sections
          .filter((s) => lesson.sections.includes(s.slug))
          .map((s) => (
            <Badge key={s.slug} variant="outline" className="rounded-none">
              {t(s.short)}
            </Badge>
          ))}
      </div>
      <h3 className="font-semibold" style={{ viewTransitionName: `lesson-${lesson.id}` }}>
        {t(lesson.title)}
      </h3>
      <p className="text-sm text-muted-foreground">
        {t(lesson.chapter)} · {t(lesson.level)}
      </p>
    </>
  );

  if (!isReady(lesson)) {
    // Not a link: no simulation yet. The dashed border and label mark it without relying on colour.
    return (
      <article className="flex flex-col border-2 border-dashed border-foreground/50 bg-card text-start">
        <div className="grid h-28 place-items-center border-b-2 border-dashed border-foreground/50 bg-secondary">
          <span className="border-2 border-foreground bg-card px-2 py-0.5 text-sm font-semibold">{t("soon")}</span>
        </div>
        <div className="flex flex-col gap-2.5 p-4">{info}</div>
      </article>
    );
  }

  const total = lesson.ready.quiz.length;
  return (
    <Link to="/app/lessons/$lessonId" params={{ lessonId: lesson.id }} className={`${cardLink} flex-col`}>
      <svg
        viewBox="-10 -6 220 90"
        className="h-28 w-full border-b-2 border-foreground bg-sim-canvas"
        aria-hidden="true"
      >
        <path d={lesson.ready.thumb} fill="none" stroke="var(--sim-curve-1)" strokeWidth="3.5" />
      </svg>
      <div className="flex flex-col gap-2.5 p-4">
        {info}
        <div className="flex items-center gap-2">
          <div className="h-3 flex-1 border-2 border-foreground bg-background">
            <div className="h-full bg-success" style={{ width: `${(done / total) * 100}%` }} />
          </div>
          <span className="text-xs font-medium text-muted-foreground tabular-nums">
            {done}/{total} {t("quizProgress")}
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

const subjects = [
  { key: "physics", nav: "physics", icon: Atom },
  { key: "chemistry", nav: "chemistry", icon: TestTubes },
  { key: "math", nav: "secMathS", icon: Sigma },
] as const satisfies readonly {
  key: LessonData["subject"];
  /** Shorter label for the sticky subject nav, so three fit on a phone. */
  nav: MessageKey;
  icon: ComponentType<{ className?: string }>;
}[];

/** Lower-case and strip accents, so "equations" finds "Équations". */
const fold = (text: string) => text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

export function Chapters({ section }: { section: Section }) {
  const { t } = useSettings();
  const [query, setQuery] = useState("");
  const inSection = lessons.filter((l) => l.sections.includes(section.slug));
  const q = fold(query.trim());
  const matches = inSection.filter((l) => fold(`${t(l.title)} ${t(l.chapter)}`).includes(q));
  const groups = subjects
    .map((s) => ({ ...s, list: matches.filter((l) => l.subject === s.key) }))
    .filter((g) => g.list.length > 0);
  const groupKeys = groups.map((g) => g.key).join(" ");

  // Scroll-spy: the current group is the last one whose top has scrolled under the sticky nav.
  const [spied, setSpied] = useState<string>();
  useEffect(() => {
    const ids = groupKeys.split(" ").map((key) => `subject-${key}`);
    const update = () => {
      const passed = ids.filter((id) => (document.getElementById(id)?.getBoundingClientRect().top ?? 1e9) < 160);
      setSpied(passed.at(-1));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [groupKeys]);
  const current = groups.some((g) => `subject-${g.key}` === spied) ? spied : `subject-${groups[0]?.key}`;

  return (
    <Page>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <div className="flex items-center gap-3">
          <BackButton />
          <h1 className="text-2xl font-bold" style={{ viewTransitionName: `section-${section.slug}` }}>
            {t(section.key)}
          </h1>
        </div>
        {inSection.length > 0 && (
          <div className="relative w-full @3xl:ms-auto @3xl:w-80">
            <Search
              className="pointer-events-none absolute start-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search")}
              aria-label={t("search")}
              className="h-11 w-full border-2 border-foreground bg-card ps-10 pe-3 shadow-hard-sm placeholder:text-muted-foreground focus-visible:shadow-hard focus-visible:outline-none"
            />
          </div>
        )}
      </div>
      {inSection.length === 0 && <p className="text-muted-foreground">{t("noLessons")}</p>}
      {inSection.length > 0 && matches.length === 0 && (
        <p role="status" className="text-muted-foreground">
          {t("noResults")}
        </p>
      )}
      {groups.length > 1 && (
        <>
          {/* Narrow screens: tabs that stick under the app bar. */}
          <nav
            aria-label={t("subjectsNav")}
            className="sticky top-14 z-[5] -mx-4 -my-4 grid auto-cols-fr grid-flow-col gap-2 bg-background px-4 py-3 @3xl:-mx-8 @3xl:auto-cols-max @3xl:px-8 @7xl:hidden"
          >
            {groups.map(({ key, nav, icon: Icon, list }) => {
              const active = current === `subject-${key}`;
              return (
                <a
                  key={key}
                  href={`#subject-${key}`}
                  aria-current={active ? "location" : undefined}
                  className={cn(
                    "flex h-10 min-w-0 items-center justify-center gap-1.5 border-2 border-foreground px-1.5 text-sm font-semibold whitespace-nowrap focus-visible:shadow-hard focus-visible:outline-none",
                    active ? "bg-sim-highlight text-[#072841] shadow-hard-sm" : "bg-card hover:bg-secondary",
                  )}
                >
                  <Icon className="hidden size-4 shrink-0 @md:block" aria-hidden="true" />
                  <span className="truncate">{t(nav)}</span>
                  <span className="border-s-2 border-current ps-1.5 tabular-nums">{list.length}</span>
                </a>
              );
            })}
          </nav>
          {/* Wide screens: a dot rail in the free margin. Labels show for the current dot, on hover and on focus. */}
          <nav
            aria-label={t("subjectsNav")}
            className="fixed end-6 top-1/2 z-[5] hidden -translate-y-1/2 flex-col items-end gap-5 @7xl:flex"
          >
            {groups.map(({ key, list }) => {
              const active = current === `subject-${key}`;
              return (
                <a
                  key={key}
                  href={`#subject-${key}`}
                  aria-current={active ? "location" : undefined}
                  className="group flex items-center gap-3 focus-visible:outline-none"
                >
                  <span
                    className={cn(
                      "border-2 border-foreground bg-card px-2 py-0.5 text-sm font-semibold whitespace-nowrap shadow-hard-sm transition-opacity",
                      active ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
                    )}
                  >
                    {t(key)} · <span className="tabular-nums">{list.length}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "block border-2 border-foreground transition-[width,height]",
                      active ? "size-4 bg-sim-highlight shadow-hard-sm" : "size-3 bg-card group-hover:bg-secondary",
                    )}
                  />
                </a>
              );
            })}
          </nav>
        </>
      )}
      {groups.map(({ key, icon: Icon, list }) => (
        <section key={key} id={`subject-${key}`} className="flex scroll-mt-32 flex-col gap-4 @7xl:scroll-mt-20">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Icon className="size-5" aria-hidden="true" />
            {t(key)}
          </h2>
          <div className="grid gap-4 @md:grid-cols-2 @5xl:grid-cols-3">
            {list.map((l) => (
              <LessonCard key={l.id} lesson={l} />
            ))}
          </div>
        </section>
      ))}
    </Page>
  );
}

export function Lesson({ lesson }: { lesson: ReadyLesson }) {
  const { t } = useSettings();
  return (
    <Page>
      <div className="flex flex-wrap items-center gap-3">
        <BackButton />
        <div>
          <p className="text-sm text-muted-foreground">
            {t(lesson.chapter)} · {t(lesson.level)}
          </p>
          <h1 className="text-2xl font-bold" style={{ viewTransitionName: `lesson-${lesson.id}` }}>
            {t(lesson.title)}
          </h1>
        </div>
      </div>
      <Suspense fallback={<div aria-busy="true" className="min-h-96 border-2 border-dashed border-foreground/30" />}>
        <lesson.ready.Sim />
      </Suspense>
    </Page>
  );
}
