import { ChangeEvent, useRef } from "react";
import type { Placement } from "@/lib/platforms";
import { getAspectRatio } from "@/lib/platforms";

type PreviewCardProps = {
  placement: Placement;
  imageUrl: string | null;
  hasUniversalImage: boolean;
  hasOverride: boolean;
  onSelectImage: (file?: File) => void;
  onUseUniversal: () => void;
};

export function PreviewCard({
  placement,
  imageUrl,
  hasUniversalImage,
  hasOverride,
  onSelectImage,
  onUseUniversal,
}: PreviewCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isProfile = placement.category === "profile";
  const isStory = placement.category === "story";

  const openPicker = () => inputRef.current?.click();
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSelectImage(event.target.files?.[0]);
    event.target.value = "";
  };

  return (
    <article className="flex min-w-0 flex-col gap-3">
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept="image/jpeg,image/png,image/webp"
        aria-label={`Choose a custom image for ${placement.label}`}
        onChange={onChange}
      />
      <div
        className={`preview-shadow group relative flex w-full items-center justify-center overflow-hidden bg-[#e6e7e2] ${isProfile ? "mx-auto aspect-square max-w-52 rounded-full" : "rounded-[1.35rem]"}`}
        style={!isProfile ? { aspectRatio: `${placement.width} / ${placement.height}`, maxHeight: isStory ? 430 : 320 } : undefined}
      >
        {imageUrl ? (
          <>
            {/* A blob URL is required for a user-selected local file. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={`${placement.label} crop preview`} className="h-full w-full object-cover" />
            <span className="absolute left-3 top-3 rounded-full bg-black/65 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-white backdrop-blur-sm">
              {hasOverride ? "Custom" : "Universal"}
            </span>
          </>
        ) : (
          <button
            type="button"
            onClick={openPicker}
            className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 bg-[radial-gradient(circle_at_top_left,#f3f4ef,transparent_45%),linear-gradient(135deg,#dedfd9,#e9e9e4)] px-5 text-center text-[#788083] outline-none transition hover:text-[#4e585a] focus-visible:ring-4 focus-visible:ring-[#a8ca32]/60"
            aria-label={`Add an image for ${placement.label}`}
          >
            <span className="grid size-10 place-items-center rounded-full border border-[#b9bfba] text-xl">+</span>
            <span className="text-xs font-semibold uppercase tracking-[0.12em]">Add image</span>
          </button>
        )}
      </div>
      <div className={isProfile ? "text-center" : ""}>
        <h3 className="font-display text-[0.98rem] font-bold tracking-[-0.02em]">{placement.label}</h3>
        <p className="mt-1 text-sm text-[#687174]">
          {placement.width} × {placement.height} px <span aria-hidden="true">·</span> {getAspectRatio(placement.width, placement.height)}
        </p>
        <div className={`mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-bold ${isProfile ? "justify-center" : ""}`}>
          <button type="button" onClick={openPicker} className="rounded-md text-[#536064] underline decoration-[#aeb5ae] underline-offset-4 transition hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#87a923]">
            {hasOverride ? "Replace" : imageUrl ? "Use a different image" : "Choose image"}
          </button>
          {hasOverride && (
            <button type="button" onClick={onUseUniversal} className="rounded-md text-[#788184] transition hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#87a923]">
              {hasUniversalImage ? "Use universal image" : "Remove custom image"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
