import { createFileRoute, notFound } from "@tanstack/react-router";
import { Chapters, findSection } from "@/screens/screens";

export const Route = createFileRoute("/app/sections/$section")({
  loader: ({ params }) => {
    const section = findSection(params.section);
    if (!section) throw notFound();
    return section;
  },
  component: function SectionPage() {
    return <Chapters section={Route.useLoaderData()} />;
  },
});
