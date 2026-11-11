import { createFileRoute, notFound } from "@tanstack/react-router";
import { loadDoc } from "@/lessons/docs";
import { findLesson } from "@/lessons/lessons";
import { Lesson } from "@/screens/screens";

export const Route = createFileRoute("/app/lessons/$lessonId")({
  loader: async ({ params }) => {
    const lesson = findLesson(params.lessonId);
    if (!lesson) throw notFound();
    return { lesson, doc: await loadDoc(lesson.id) };
  },
  component: function LessonPage() {
    const { lesson, doc } = Route.useLoaderData();
    return <Lesson lesson={lesson} doc={doc} />;
  },
});
