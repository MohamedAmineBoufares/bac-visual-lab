import { createFileRoute, notFound } from "@tanstack/react-router";
import { Chapters } from "@/screens/screens";
import { findSection } from "@/screens/sections";
import { pageMeta, textFor } from "@/seo";

export const Route = createFileRoute("/{-$locale}/app/sections/$section")({
  loader: ({ params }) => {
    const section = findSection(params.section);
    if (!section) throw notFound();
    return section;
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) return {};
    const t = textFor(params.locale);
    return pageMeta(t[loaderData.key], t.metaSection.replace("{section}", t[loaderData.key]));
  },
  component: function SectionPage() {
    return <Chapters section={Route.useLoaderData()} />;
  },
});
