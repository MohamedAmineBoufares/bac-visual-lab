import { Binary, Cog, FlaskConical, Sigma } from "lucide-react";
import type { ComponentType } from "react";
import type { MessageKey } from "@/i18n/messages";

// Kept apart from screens.tsx: route loaders import this, and they ship in the entry chunk.

export const sections = [
  { slug: "sciences-experimentales", key: "secExp", short: "secExpS", icon: FlaskConical },
  { slug: "mathematiques", key: "secMath", short: "secMathS", icon: Sigma },
  { slug: "sciences-techniques", key: "secTech", short: "secTechS", icon: Cog },
  { slug: "informatique", key: "secInfo", short: "secInfoS", icon: Binary },
] as const satisfies readonly {
  slug: string;
  key: MessageKey;
  short: MessageKey;
  icon: ComponentType<{ className?: string }>;
}[];

export type Section = (typeof sections)[number];
export const findSection = (slug: string): Section | undefined => sections.find((s) => s.slug === slug);
