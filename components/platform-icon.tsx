import {
  SiBluesky,
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
      className="mb-5 grid size-12 place-items-center rounded-2xl text-white"
      style={{ backgroundColor: color }}
    >
      <Icon aria-hidden="true" className="size-5" />
    </span>
  );
}
