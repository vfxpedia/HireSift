import type { BasicInfo, PortfolioLink } from "../types";

/**
 * Curated demo profile used to pre-fill the /verify flow when a visitor
 * starts a demo session. Keeps presentation deterministic so we can talk
 * over a complete-looking submission without typing every field live.
 */
export const DEMO_PROFILE = {
  name: "Jay OH",
  email: "jay@gmail.com",
  role: "AI Engineer",
  basicInfo: {
    fullName: "Jay OH",
    email: "jay@gmail.com",
    country: "South Korea",
    linkedin: "https://linkedin.com/jayoh",
  } satisfies BasicInfo,
  portfolio: [
    { platform: "GitHub", url: "https://github.com/vfxpedia1987" },
    { platform: "LinkedIn", url: "https://linkedin.com/jayoh" },
    { platform: "YouTube", url: "https://youtube.com/@VFXPEDIA" },
  ] satisfies PortfolioLink[],
};
