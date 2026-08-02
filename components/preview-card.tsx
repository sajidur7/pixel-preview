import { ChangeEvent, useRef } from "react";
import type { Placement } from "@/lib/platforms";
import { getAspectRatio } from "@/lib/platforms";

type PreviewCardProps = {
  placement: Placement;
  gridSlot: number;
  imageUrl: string | null;
  hasUniversalImage: boolean;
  hasOverride: boolean;
  onSelectImage: (file?: File) => void;
  onUseUniversal: () => void;
};

export function PreviewCard({ placement, gridSlot, imageUrl, hasUniversalImage, hasOverride, onSelectImage, onUseUniversal }: PreviewCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isProfile = placement.category === "profile";
  const isStory = placement.category === "story";
  const openPicker = () => inputRef.current?.click();
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSelectImage(event.target.files?.[0]);
    event.target.value = "";
  };

  return (
    <article data-grid-slot={gridSlot} className={`preview-card flex min-w-0 flex-col gap-4 ${isProfile ? "items-center text-center" : ""}`}>
      <input ref={inputRef} type="file" className="sr-only" accept="image/jpeg,image/png,image/webp" aria-label={`Choose a custom image for ${placement.label}`} onChange={onChange} />
      <div
        className={`preview-shadow group relative flex w-full items-center justify-center overflow-hidden bg-[var(--pp-surface)] ${isProfile ? "mx-auto aspect-square max-w-52 rounded-full" : ""}`}
        style={!isProfile ? { aspectRatio: `${placement.width} / ${placement.height}`, maxHeight: isStory ? 430 : 320 } : undefined}
      >
        {imageUrl ? (
          <>
            {/* Blob URLs cannot use the optimized image component. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={`${placement.label} crop preview`} className="h-full w-full object-cover" />
            <span className={`absolute top-3 z-10 grid size-7 place-items-center rounded-full border border-[var(--pp-line-strong)] bg-white text-[0.65rem] font-extrabold text-[var(--pp-blue-bright)] shadow-[0_2px_8px_rgba(10,13,20,0.12)] ${isProfile ? "left-1/2 -translate-x-1/2" : "left-3"}`} aria-label={hasOverride ? "Custom image" : "Universal image"} title={hasOverride ? "Custom image" : "Universal image"}>
              {hasOverride ? "C" : "U"}
            </span>
          </>
        ) : (
          <button type="button" onClick={openPicker} className="focus-ring flex h-full w-full cursor-pointer flex-col items-center justify-center gap-3 bg-[var(--pp-surface)] px-5 text-center text-[var(--pp-text-muted)] transition hover:bg-[#f2f8fc] hover:text-[var(--pp-text)]" aria-label={`Add an image for ${placement.label}`}>
            <span className="grid size-10 place-items-center rounded-full border border-[var(--pp-line-strong)] bg-white text-lg text-[var(--pp-blue-bright)]">+</span>
            <span className="tech-label">Add image</span>
          </button>
        )}
      </div>
      <div className={isProfile ? "flex w-52 flex-col items-center text-center" : ""}>
        <div className={isProfile ? "grid w-full justify-items-center gap-3 text-center" : "flex items-start justify-between gap-3"}>
          <div className={isProfile ? "w-full text-center" : ""}>
            <h3 className="font-display text-[0.95rem] font-semibold tracking-[-0.02em] text-[var(--pp-text)]">{placement.label}</h3>
            <p className="mt-1 font-mono text-[0.72rem] tracking-[0.02em] text-[var(--pp-text-muted)]">
              {placement.width} × {placement.height} PX / {getAspectRatio(placement.width, placement.height)}
            </p>
          </div>
          <button type="button" onClick={openPicker} className={`focus-ring tech-label shrink-0 text-[var(--pp-blue-bright)] transition hover:text-[var(--pp-text)] ${isProfile ? "mx-auto" : ""}`}>
            {hasOverride ? "Replace" : imageUrl ? "Customize" : "Choose"}
          </button>
        </div>
        {hasOverride && (
          <button type="button" onClick={onUseUniversal} className="focus-ring mt-2 text-xs font-medium text-[var(--pp-text-muted)] transition hover:text-[var(--pp-text)]">
            {hasUniversalImage ? "Use universal image" : "Remove custom image"}
          </button>
        )}
      </div>
    </article>
  );
}
