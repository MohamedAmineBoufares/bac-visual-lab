import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: Outlet,
  notFoundComponent: NotFound,
});

function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-start justify-center gap-4 px-4">
      <p className="border-2 border-edge bg-sim-highlight px-2 font-semibold text-[#072841]">404</p>
      <h1 className="text-2xl font-bold">Page introuvable · Page not found · الصفحة غير موجودة</h1>
      <Link to="/" className="underline">
        Bac Visual Lab
      </Link>
    </main>
  );
}
