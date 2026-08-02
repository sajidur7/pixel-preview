import {
  SiBehance,
  SiBluesky,
  SiDribbble,
  SiFacebook,
  SiInstagram,
  SiPinterest,
  SiThreads,
  SiTiktok,
  SiX,
  SiYoutube,
} from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa6";
import type { IconType } from "react-icons";
import type { PlatformId } from "@/lib/platforms";

const icons: Record<PlatformId, IconType> = {
  instagram: SiInstagram,
  facebook: SiFacebook,
  dribbble: SiDribbble,
  behance: SiBehance,
  linkedin: FaLinkedinIn,
  x: SiX,
  youtube: SiYoutube,
  tiktok: SiTiktok,
  pinterest: SiPinterest,
  threads: SiThreads,
  bluesky: SiBluesky,
};

type PlatformIconProps = {
  id: PlatformId;
  name: string;
  color: string;
};

export function PlatformIcon({ id, name, color }: PlatformIconProps) {
  const Icon = icons[id];

  return (
    <span
      role="img"
      aria-label={`${name} logo`}
      className="mb-6 grid size-11 place-items-center rounded-full text-white shadow-[0_2px_8px_rgba(10,13,20,0.08)]"
      style={{ backgroundColor: color }}
    >
      <Icon aria-hidden="true" className="size-5" />
    </span>
  );
}
