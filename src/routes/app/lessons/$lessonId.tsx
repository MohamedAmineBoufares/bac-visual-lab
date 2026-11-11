import { createFileRoute, notFound } from "@tanstack/react-router";
import { findLesson } from "@/lessons/lessons";
import { Lesson } from "@/screens/screens";

export const Route = createFileRoute("/app/lessons/$lessonId")({
  loader: ({ params }) => {
    const lesson = findLesson(params.lessonId);
    if (!lesson) throw notFound();
    return lesson;
  },
  component: function LessonPage() {
    return <Lesson lesson={Route.useLoaderData()} />;
  },
});
