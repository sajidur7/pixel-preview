import type { Metadata } from "next";
import { SocialImagePreview } from "@/components/social-image-preview";

export const metadata: Metadata = {
  title: "Pixel-Preview",
  description:
    "Preview how one image crops across profiles, banners, posts, and stories.",
};

export default function Home() {
  return <SocialImagePreview />;
}
