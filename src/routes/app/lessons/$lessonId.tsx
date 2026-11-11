import { createFileRoute, notFound } from "@tanstack/react-router";
import { Lesson } from "@/screens/screens";

// shortcut: one simulation exists; replace with a lesson registry once there are more.
const lessons = new Set(["rc-charging"]);

export const Route = createFileRoute("/app/lessons/$lessonId")({
  beforeLoad: ({ params }) => {
    if (!lessons.has(params.lessonId)) throw notFound();
  },
  component: Lesson,
});
