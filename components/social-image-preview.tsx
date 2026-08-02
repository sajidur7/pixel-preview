"use client";

import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from "react";
import { placementCategories, placementLabels, platforms, type PlacementCategory } from "@/lib/platforms";
import { PreviewCard } from "./preview-card";
import { PlatformIcon } from "./platform-icon";

type UploadedImage = { url: string; name: string; width: number; height: number };

const acceptedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export function SocialImagePreview() {
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [imageOverrides, setImageOverrides] = useState<Record<string, UploadedImage>>({});
  const [platformFilter, setPlatformFilter] = useState("all");
  const [placementFilter, setPlacementFilter] = useState<PlacementCategory | "all">("all");
  const [universalScope, setUniversalScope] = useState<PlacementCategory | "all">("all");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<UploadedImage | null>(null);
  const overridesRef = useRef<Record<string, UploadedImage>>({});

  useEffect(() => { imageRef.current = image; }, [image]);
  useEffect(() => { overridesRef.current = imageOverrides; }, [imageOverrides]);
  useEffect(() => () => {
    if (imageRef.current) URL.revokeObjectURL(imageRef.current.url);
    Object.values(overridesRef.current).forEach((item) => URL.revokeObjectURL(item.url));
  }, []);

  const loadImage = (file?: File) => {
    if (!file) return;
    if (!acceptedTypes.has(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      return;
    }
    const url = URL.createObjectURL(file);
    const probe = new Image();
    probe.onload = () => {
      setImage((current) => {
        if (current) URL.revokeObjectURL(current.url);
        return { url, name: file.name, width: probe.naturalWidth, height: probe.naturalHeight };
      });
      setError("");
    };
    probe.onerror = () => {
      URL.revokeObjectURL(url);
      setError("That image could not be read. Try another file.");
    };
    probe.src = url;
  };

  const loadOverrideImage = (placementId: string, file?: File) => {
    if (!file) return;
    if (!acceptedTypes.has(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      return;
    }
    const url = URL.createObjectURL(file);
    const probe = new Image();
    probe.onload = () => {
      setImageOverrides((current) => {
        const existing = current[placementId];
        if (existing) URL.revokeObjectURL(existing.url);
        return { ...current, [placementId]: { url, name: file.name, width: probe.naturalWidth, height: probe.naturalHeight } };
      });
      setError("");
    };
    probe.onerror = () => {
      URL.revokeObjectURL(url);
      setError("That image could not be read. Try another file.");
    };
    probe.src = url;
  };

  const removeOverride = (placementId: string) => {
    setImageOverrides((current) => {
      const existing = current[placementId];
      if (!existing) return current;
      URL.revokeObjectURL(existing.url);
      const next = { ...current };
      delete next[placementId];
      return next;
    });
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    loadImage(event.target.files?.[0]);
    event.target.value = "";
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    loadImage(event.dataTransfer.files?.[0]);
  };

  const resetImage = () => {
    setImage((current) => {
      if (current) URL.revokeObjectURL(current.url);
      return null;
    });
    setImageOverrides((current) => {
      Object.values(current).forEach((item) => URL.revokeObjectURL(item.url));
      return {};
    });
    setError("");
  };

  const visiblePlatforms = useMemo(() => platforms
    .filter((platform) => platformFilter === "all" || platform.id === platformFilter)
    .map((platform) => ({
      ...platform,
      placements: platform.placements
        .map((placement, index) => ({ placement, slot: index + 1 }))
        .filter(({ placement }) => placementFilter === "all" || placement.category === placementFilter),
    }))
    .filter((platform) => platform.placements.length > 0), [platformFilter, placementFilter]);

  const visibleCount = visiblePlatforms.reduce((count, platform) => count + platform.placements.length, 0);

  return (
    <main className="min-h-screen overflow-clip bg-[var(--pp-bg)] text-[var(--pp-text)]">
      <header className="site-header">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-4 sm:px-8">
          <a href="#top" className="focus-ring font-display text-xl font-semibold tracking-[-0.02em] text-white">Pixel-Preview</a>
          <nav aria-label="Page sections" className="hidden items-center gap-7 text-xs text-[var(--pp-dark-muted)] sm:flex">
            <a href="#workspace" className="transition hover:text-white">Workspace</a>
            <a href="#previews" className="transition hover:text-white">Previews</a>
          </nav>
          <span className="tech-label text-[var(--pp-dark-muted)]">Created by Shimul</span>
        </div>
      </header>

      <section id="top" className="hero-grid border-b border-[var(--pp-dark-line)] bg-[var(--pp-ink)] text-white">
        <div className="mx-auto grid max-w-[1240px] lg:grid-cols-[0.92fr_1.08fr]">
          <div className="flex min-h-[560px] flex-col justify-between border-[var(--pp-dark-line)] px-5 py-14 sm:px-8 sm:py-20 lg:border-r lg:px-12">
            <div>
              <p className="tech-label text-[var(--pp-accent)]">Cross-platform image intelligence</p>
              <h1 className="mt-10 max-w-2xl font-display text-[clamp(3.6rem,7vw,6.8rem)] font-medium leading-[0.88] tracking-[-0.045em]">See every crop<br />before you post.</h1>
            </div>
            <div className="mt-14 grid gap-8 border-t border-[var(--pp-dark-line)] pt-8 sm:grid-cols-[1fr_auto] sm:items-end">
              <p className="max-w-md text-base leading-7 text-[var(--pp-dark-muted)]">One private workspace for profiles, banners, posts, and stories across nine social platforms.</p>
              <div className="flex gap-5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--pp-dark-muted)]"><span>09 platforms</span><span>27 formats</span></div>
            </div>
          </div>

          <div id="workspace" className="flex items-center px-5 py-14 sm:px-8 lg:px-12">
            <div className="w-full border border-[var(--pp-dark-line)] bg-white text-[var(--pp-text)] shadow-[0_28px_70px_rgba(0,0,0,0.28)]">
              <div className="flex flex-col gap-4 border-b border-[var(--pp-line)] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div><p className="tech-label text-[var(--pp-blue-bright)]">Universal source</p><p className="mt-1 text-sm text-[var(--pp-text-muted)]">Choose where this image should appear.</p></div>
                <div className="scope-control" role="group" aria-label="Universal image placement scope">
                  <button type="button" aria-pressed={universalScope === "all"} onClick={() => setUniversalScope("all")}>All</button>
                  {placementCategories.map((category) => (
                    <button key={category} type="button" aria-pressed={universalScope === category} onClick={() => setUniversalScope(category)}>{placementLabels[category].replace(" picture", "").replace(" / banner", "")}</button>
                  ))}
                </div>
              </div>
              <label
                className={`source-dropzone ${isDragging ? "is-dragging" : ""}`}
                onDragEnter={() => setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={onDrop}
              >
                <input ref={inputRef} type="file" className="sr-only" accept="image/jpeg,image/png,image/webp" onChange={onInputChange} />
                {image ? (
                  <>
                    {/* Blob URLs cannot use the optimized image component. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.url} alt="Uploaded original" className="h-40 w-full max-w-64 border border-[var(--pp-line)] object-contain" />
                    <div className="min-w-0 text-center sm:text-left"><strong className="block truncate font-medium">{image.name}</strong><span className="mt-1 block font-mono text-xs text-[var(--pp-text-muted)]">{image.width} × {image.height} PX · {universalScope === "all" ? "ALL PLACEMENTS" : placementLabels[universalScope].toUpperCase()}</span><span className="mt-4 inline-block text-xs font-semibold text-[var(--pp-blue-bright)]">Replace image →</span></div>
                  </>
                ) : (
                  <>
                    <span className="grid size-10 place-items-center border border-[var(--pp-line-strong)] text-xl text-[var(--pp-blue-bright)]">+</span>
                    <div className="text-center sm:text-left"><strong className="block font-medium">Choose a universal image</strong><span className="mt-1 block text-sm text-[var(--pp-text-muted)]">Drop or browse · JPG, PNG, WebP</span></div>
                    <span className="tech-label sm:ml-auto text-[var(--pp-text-dim)]">Local only</span>
                  </>
                )}
              </label>
              {error ? <p role="alert" className="border-t border-[var(--pp-line)] px-5 py-3 text-sm font-semibold text-[var(--pp-error)]">{error}</p> : null}
              {(image || Object.keys(imageOverrides).length > 0) ? <button type="button" onClick={resetImage} className="focus-ring tech-label w-full border-t border-[var(--pp-line)] py-4 text-[var(--pp-text-muted)] transition hover:bg-[var(--pp-surface)] hover:text-[var(--pp-text)]">Reset all images</button> : null}
            </div>
          </div>
        </div>
      </section>

      <section id="previews" className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 lg:py-24">
        <div className="mb-10 grid gap-8 lg:grid-cols-[230px_1fr] lg:gap-0">
          <div className="border-b border-[var(--pp-line-strong)] pb-6 lg:border-r lg:pr-8"><p className="tech-label text-[var(--pp-blue-bright)]">Preview matrix / 02</p><p className="mt-2 font-mono text-xs text-[var(--pp-text-muted)]">{String(visibleCount).padStart(2, "0")} ACTIVE PLACEMENTS</p></div>
          <div className="filter-console lg:pl-8">
            <fieldset><legend>Platform</legend><div className="filter-options"><button type="button" aria-pressed={platformFilter === "all"} onClick={() => setPlatformFilter("all")}>All</button>{platforms.map((platform) => <button type="button" key={platform.id} aria-pressed={platformFilter === platform.id} onClick={() => setPlatformFilter(platform.id)}>{platform.name}</button>)}</div></fieldset>
            <fieldset><legend>Placement</legend><div className="filter-options"><button type="button" aria-pressed={placementFilter === "all"} onClick={() => setPlacementFilter("all")}>All</button>{placementCategories.map((category) => <button type="button" key={category} aria-pressed={placementFilter === category} onClick={() => setPlacementFilter(category)}>{placementLabels[category]}</button>)}</div></fieldset>
          </div>
        </div>

        <div className="platform-matrix">
          {visiblePlatforms.map((platform) => {
            const platformNumber = platforms.findIndex((item) => item.id === platform.id) + 1;
            return (
              <section key={platform.id} aria-labelledby={`${platform.id}-heading`} className="platform-row">
                <div className="platform-meta">
                  <PlatformIcon id={platform.id} name={platform.name} color={platform.color} />
                  <p className="tech-label text-[var(--pp-text-dim)]">Channel / {String(platformNumber).padStart(2, "0")}</p>
                  <h2 id={`${platform.id}-heading`} className="mt-2 font-display text-4xl font-medium tracking-[-0.035em] text-[var(--pp-text)]">{platform.name}</h2>
                  <p className="mt-2 font-mono text-xs text-[var(--pp-text-muted)]">{String(platform.placements.length).padStart(2, "0")} {platform.placements.length === 1 ? "PREVIEW" : "PREVIEWS"}</p>
                </div>
                <div className="placement-grid grid items-stretch sm:grid-cols-2 xl:grid-cols-3">
                  {platform.placements.map(({ placement, slot }) => {
                    const override = imageOverrides[placement.id];
                    const universalApplies = universalScope === "all" || universalScope === placement.category;
                    const hasUniversalImage = Boolean(image && universalApplies);
                    return (
                      <PreviewCard
                        key={placement.id}
                        placement={placement}
                        gridSlot={slot}
                        imageUrl={override?.url ?? (universalApplies ? image?.url ?? null : null)}
                        hasUniversalImage={hasUniversalImage}
                        hasOverride={Boolean(override)}
                        onSelectImage={(file) => loadOverrideImage(placement.id, file)}
                        onUseUniversal={() => removeOverride(placement.id)}
                      />
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-[var(--pp-dark-line)] bg-[var(--pp-ink)] px-5 py-12 text-sm text-[var(--pp-dark-muted)] sm:px-8">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><strong className="font-display text-xl font-medium text-white">Pixel-Preview</strong><span className="tech-label">Created by Shimul</span></div>
      </footer>
    </main>
  );
}
