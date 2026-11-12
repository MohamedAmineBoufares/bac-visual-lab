import { createFileRoute } from "@tanstack/react-router";
import { Home } from "@/screens/screens";
import { pageMeta, textFor } from "@/seo";

export const Route = createFileRoute("/{-$locale}/app/")({
  head: ({ params }) => {
    const t = textFor(params.locale);
    return pageMeta(t.homeTitle, t.homeLead);
  },
  component: Home,
});
