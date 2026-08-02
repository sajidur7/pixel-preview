import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Pixel-Preview",
    template: "%s · Pixel-Preview",
  },
  description:
    "Preview every social image crop from one private, browser-based workspace.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
