import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppBar } from "@/components/app-bar";
import { localeDir } from "@/i18n/messages";
import { useSettings } from "@/settings/settings";

export const Route = createFileRoute("/{-$locale}/app")({ component: AppLayout });

/** App shell. Layout responds to its own width (container queries). */
function AppLayout() {
  const { settings } = useSettings();
  return (
    <div dir={localeDir[settings.locale]} className="@container min-h-screen bg-background text-foreground">
      <AppBar />
      <Outlet />
    </div>
  );
}
