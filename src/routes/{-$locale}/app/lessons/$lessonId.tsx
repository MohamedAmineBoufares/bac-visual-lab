import { createFileRoute, notFound } from "@tanstack/react-router";
import { loadDoc } from "@/lessons/docs";
import { findLesson } from "@/lessons/lessons";
import { Lesson } from "@/screens/screens";
import { pageMeta, textFor } from "@/seo";

export const Route = createFileRoute("/{-$locale}/app/lessons/$lessonId")({
  loader: async ({ params }) => {
    const lesson = findLesson(params.lessonId);
    if (!lesson) throw notFound();
    return { lesson, doc: await loadDoc(lesson.id) };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) return {};
    const t = textFor(params.locale);
    const { title, chapter } = loaderData.lesson;
    return pageMeta(t[title], t.metaLesson.replace("{lesson}", t[title]).replace("{chapter}", t[chapter]));
  },
  component: function LessonPage() {
    const { lesson, doc } = Route.useLoaderData();
    return <Lesson lesson={lesson} doc={doc} />;
  },
});
