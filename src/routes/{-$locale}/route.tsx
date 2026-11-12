import { createFileRoute, notFound, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { localizePath, toLocale } from "@/seo";
import { LocaleProvider } from "@/settings/settings";

/** Language from the URL: none is French, /en and /ar the others. Anything else (or /fr) is a 404. */
export const Route = createFileRoute("/{-$locale}")({
  beforeLoad: ({ params }) => {
    const locale = toLocale(params.locale);
    if (!locale) throw notFound();
    return { locale };
  },
  component: LocaleLayout,
});

function LocaleLayout() {
  const { locale } = Route.useRouteContext();
  const pathname = useLocation({ select: (l) => l.pathname });
  const navigate = useNavigate();
  return (
    <LocaleProvider locale={locale} onChange={(l) => navigate({ href: localizePath(pathname, l) })}>
      <Outlet />
    </LocaleProvider>
  );
}
