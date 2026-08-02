export const placementCategories = ["profile", "cover", "post", "story"] as const;

export type PlacementCategory = (typeof placementCategories)[number];

export type Placement = {
  id: string;
  category: PlacementCategory;
  label: string;
  width: number;
  height: number;
};

export type Platform = {
  id: string;
  name: string;
  mark: string;
  color: string;
  placements: readonly Placement[];
};

export const platforms = [
  {
    id: "instagram", name: "Instagram", mark: "Ig", color: "#e84d85",
    placements: [
      { id: "instagram-profile", category: "profile", label: "Profile picture", width: 320, height: 320 },
      { id: "instagram-post", category: "post", label: "Post image", width: 1080, height: 1080 },
      { id: "instagram-story", category: "story", label: "Story", width: 1080, height: 1920 },
    ],
  },
  {
    id: "facebook", name: "Facebook", mark: "f", color: "#2878ed",
    placements: [
      { id: "facebook-profile", category: "profile", label: "Profile picture", width: 320, height: 320 },
      { id: "facebook-cover", category: "cover", label: "Cover image", width: 851, height: 315 },
      { id: "facebook-post", category: "post", label: "Post image", width: 1200, height: 630 },
      { id: "facebook-story", category: "story", label: "Story", width: 1080, height: 1920 },
    ],
  },
  {
    id: "linkedin", name: "LinkedIn", mark: "in", color: "#0a66c2",
    placements: [
      { id: "linkedin-profile", category: "profile", label: "Profile picture", width: 400, height: 400 },
      { id: "linkedin-cover", category: "cover", label: "Cover image", width: 1584, height: 396 },
      { id: "linkedin-post", category: "post", label: "Post image", width: 1200, height: 627 },
    ],
  },
  {
    id: "x", name: "X", mark: "X", color: "#141719",
    placements: [
      { id: "x-profile", category: "profile", label: "Profile picture", width: 400, height: 400 },
      { id: "x-cover", category: "cover", label: "Header image", width: 1500, height: 500 },
      { id: "x-post", category: "post", label: "Post image", width: 1600, height: 900 },
    ],
  },
  {
    id: "youtube", name: "YouTube", mark: "YT", color: "#ff0033",
    placements: [
      { id: "youtube-profile", category: "profile", label: "Profile picture", width: 800, height: 800 },
      { id: "youtube-cover", category: "cover", label: "Channel banner", width: 2560, height: 1440 },
      { id: "youtube-post", category: "post", label: "Community post", width: 1280, height: 720 },
    ],
  },
  {
    id: "tiktok", name: "TikTok", mark: "Tk", color: "#18aeb4",
    placements: [
      { id: "tiktok-profile", category: "profile", label: "Profile picture", width: 200, height: 200 },
      { id: "tiktok-post", category: "post", label: "Photo post", width: 1080, height: 1350 },
      { id: "tiktok-story", category: "story", label: "Story", width: 1080, height: 1920 },
    ],
  },
  {
    id: "pinterest", name: "Pinterest", mark: "P", color: "#e60023",
    placements: [
      { id: "pinterest-profile", category: "profile", label: "Profile picture", width: 280, height: 280 },
      { id: "pinterest-cover", category: "cover", label: "Profile cover", width: 1600, height: 900 },
      { id: "pinterest-post", category: "post", label: "Standard Pin", width: 1000, height: 1500 },
    ],
  },
  {
    id: "threads", name: "Threads", mark: "@", color: "#262626",
    placements: [
      { id: "threads-profile", category: "profile", label: "Profile picture", width: 320, height: 320 },
      { id: "threads-post", category: "post", label: "Post image", width: 1080, height: 1350 },
    ],
  },
  {
    id: "bluesky", name: "Bluesky", mark: "B", color: "#1689f7",
    placements: [
      { id: "bluesky-profile", category: "profile", label: "Profile picture", width: 400, height: 400 },
      { id: "bluesky-cover", category: "cover", label: "Banner image", width: 1500, height: 500 },
      { id: "bluesky-post", category: "post", label: "Post image", width: 1200, height: 675 },
    ],
  },
] as const satisfies readonly Platform[];

export type PlatformId = (typeof platforms)[number]["id"];

export const placementLabels: Record<PlacementCategory, string> = {
  profile: "Profile picture",
  cover: "Cover / banner",
  post: "Post image",
  story: "Story",
};

function greatestCommonDivisor(a: number, b: number): number {
  return b === 0 ? a : greatestCommonDivisor(b, a % b);
}

export function getAspectRatio(width: number, height: number) {
  const divisor = greatestCommonDivisor(width, height);
  return `${width / divisor}:${height / divisor}`;
}
