import { renderToString } from "katex";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

/**
 * Renders TeX with KaTeX. Mark slider-bound terms with \htmlClass{live}{...}
 * to give them the --sim-highlight background. Input is trusted, authored TeX only.
 */
export function Formula({ tex, display = false, className }: { tex: string; display?: boolean; className?: string }) {
  const html = useMemo(
    () =>
      renderToString(tex, {
        displayMode: display,
        throwOnError: false,
        trust: (ctx) => ctx.command === "\\htmlClass",
        strict: false,
      }),
    [tex, display],
  );
  return (
    <span
      className={cn("[&_.live]:bg-sim-highlight [&_.live]:px-0.5 [&_.live]:text-[#072841]", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
