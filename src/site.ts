import { version } from "../package.json";

/** Site-wide facts. Edit here, not in components. */
export const site: {
  name: string;
  url: string;
  author: string;
  version: string;
  repoUrl?: string;
  linkedinUrl?: string;
} = {
  name: "Bac Visual Lab",
  // Canonical origin for <link rel=canonical>, hreflang, Open Graph and the sitemap. No trailing slash.
  url: "https://bac-visual-lab.pages.dev",
  version,
  author: "Mohamed Amine Boufares",
  repoUrl: "https://github.com/MohamedAmineBoufares/bac-visual-lab",
  linkedinUrl: "https://www.linkedin.com/in/mohamed-amine-boufares/",
};
