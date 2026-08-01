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

export function PreviewCard({ placement, imageUrl, hasUniversalImage, hasOverride, onSelectImage, onUseUniversal }: PreviewCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isProfile = placement.category === "profile";
  const isStory = placement.category === "story";
  const openPicker = () => inputRef.current?.click();
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSelectImage(event.target.files?.[0]);
    event.target.value = "";
  };

  return (
    <article className="flex min-w-0 flex-col gap-4">
      <input ref={inputRef} type="file" className="sr-only" accept="image/jpeg,image/png,image/webp" aria-label={`Choose a custom image for ${placement.label}`} onChange={onChange} />
      <div
        className={`preview-shadow group relative flex w-full items-center justify-center overflow-hidden border border-[var(--pp-line)] bg-[var(--pp-surface)] ${isProfile ? "mx-auto aspect-square max-w-52 rounded-full" : "rounded-[var(--pp-radius-md)]"}`}
        style={!isProfile ? { aspectRatio: `${placement.width} / ${placement.height}`, maxHeight: isStory ? 430 : 320 } : undefined}
      >
        {imageUrl ? (
          <>
            {/* Blob URLs cannot use the optimized image component. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={`${placement.label} crop preview`} className="h-full w-full object-cover" />
            <span className="absolute left-3 top-3 grid size-7 place-items-center rounded-full border border-white/20 bg-black/75 text-[0.65rem] font-extrabold text-white backdrop-blur-md" aria-label={hasOverride ? "Custom image" : "Universal image"} title={hasOverride ? "Custom image" : "Universal image"}>
              {hasOverride ? "C" : "U"}
            </span>
          </>
        ) : (
          <button type="button" onClick={openPicker} className="focus-ring flex h-full w-full cursor-pointer flex-col items-center justify-center gap-3 bg-[linear-gradient(135deg,rgba(76,125,255,0.05),rgba(138,92,255,0.03))] px-5 text-center text-[var(--pp-text-muted)] transition hover:bg-[rgba(76,125,255,0.09)] hover:text-white" aria-label={`Add an image for ${placement.label}`}>
            <span className="grid size-10 place-items-center rounded-full border border-[var(--pp-line-strong)] bg-white/[0.03] text-lg text-[var(--pp-blue-bright)]">+</span>
            <span className="tech-label">Add image</span>
          </button>
        )}
      </div>
      <div className={isProfile ? "text-center" : ""}>
        <div className={`flex items-start justify-between gap-3 ${isProfile ? "flex-col items-center" : ""}`}>
          <div>
            <h3 className="font-display text-[0.95rem] font-semibold tracking-[-0.02em] text-[var(--pp-text)]">{placement.label}</h3>
            <p className="mt-1 font-mono text-[0.72rem] tracking-[0.02em] text-[var(--pp-text-dim)]">
              {placement.width} × {placement.height} PX / {getAspectRatio(placement.width, placement.height)}
            </p>
          </div>
          <button type="button" onClick={openPicker} className="focus-ring tech-label shrink-0 text-[var(--pp-blue-bright)] transition hover:text-white">
            {hasOverride ? "Replace" : imageUrl ? "Customize" : "Choose"}
          </button>
        </div>
        {hasOverride && (
          <button type="button" onClick={onUseUniversal} className="focus-ring mt-2 text-xs font-medium text-[var(--pp-text-muted)] transition hover:text-white">
            {hasUniversalImage ? "Use universal image" : "Remove custom image"}
          </button>
        )}
      </div>
    </article>
  );
}
