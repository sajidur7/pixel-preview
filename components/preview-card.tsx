import type { Placement } from "@/lib/platforms";
import { getAspectRatio } from "@/lib/platforms";

type PreviewCardProps = {
  placement: Placement;
  imageUrl: string | null;
};

export function PreviewCard({ placement, imageUrl }: PreviewCardProps) {
  const isProfile = placement.category === "profile";
  const isStory = placement.category === "story";

  return (
    <article className="flex min-w-0 flex-col gap-3">
      <div
        className={`preview-shadow relative flex w-full items-center justify-center overflow-hidden bg-[#e6e7e2] ${isProfile ? "mx-auto aspect-square max-w-52 rounded-full" : "rounded-[1.35rem]"}`}
        style={!isProfile ? { aspectRatio: `${placement.width} / ${placement.height}`, maxHeight: isStory ? 430 : 320 } : undefined}
      >
        {imageUrl ? (
          // A blob URL is required for a user-selected local file.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="Uploaded image crop preview" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[radial-gradient(circle_at_top_left,#f3f4ef,transparent_45%),linear-gradient(135deg,#dedfd9,#e9e9e4)] px-5 text-center text-[#788083]">
            <span className="grid size-10 place-items-center rounded-full border border-[#b9bfba] text-xl">+</span>
            <span className="text-xs font-semibold uppercase tracking-[0.12em]">Your image</span>
          </div>
        )}
      </div>
      <div className={isProfile ? "text-center" : ""}>
        <h3 className="font-display text-[0.98rem] font-bold tracking-[-0.02em]">{placement.label}</h3>
        <p className="mt-1 text-sm text-[#687174]">
          {placement.width} × {placement.height} px <span aria-hidden="true">·</span> {getAspectRatio(placement.width, placement.height)}
        </p>
      </div>
    </article>
  );
}
