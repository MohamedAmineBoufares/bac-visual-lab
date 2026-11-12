/** What we use of `navigator.serviceWorker`. It is undefined outside secure contexts. */
type Container = EventTarget & { controller: unknown };

/**
 * A new deploy's service worker takes over open tabs at once (skipWaiting + clientsClaim), but each tab
 * still shows the old page. Reload straight into the new version if the visitor has not touched the
 * page yet. Otherwise wait for their next navigation, so a half-done quiz or a tuned slider is not lost.
 */
export const reloadOnUpdate = (
  onNavigate: (reload: () => void) => void,
  sw: Container | undefined = navigator.serviceWorker,
  reload = () => location.reload(),
) => {
  // First visit: clientsClaim fires controllerchange too, but there is no old version to replace.
  if (!sw?.controller) return;
  let touched = false;
  const touch = () => {
    touched = true;
  };
  addEventListener("pointerdown", touch, { capture: true, once: true });
  addEventListener("keydown", touch, { capture: true, once: true });
  sw.addEventListener(
    "controllerchange",
    () => {
      if (touched) onNavigate(reload);
      else reload();
    },
    { once: true },
  );
};
