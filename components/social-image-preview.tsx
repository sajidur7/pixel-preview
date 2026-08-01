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
      placements: platform.placements.filter((placement) => placementFilter === "all" || placement.category === placementFilter),
    }))
    .filter((platform) => platform.placements.length > 0), [platformFilter, placementFilter]);

  const visibleCount = visiblePlatforms.reduce((count, platform) => count + platform.placements.length, 0);

  return (
    <main className="min-h-screen overflow-clip bg-[var(--pp-bg)]">
      <header className="border-b border-[var(--pp-line)] bg-[rgba(7,8,12,0.88)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1520px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <a href="#top" className="focus-ring flex items-center gap-3 rounded-sm font-display text-lg font-bold tracking-[-0.04em]">
            <span className="grid size-7 place-items-center rounded-[0.35rem] bg-[linear-gradient(135deg,var(--pp-blue),var(--pp-violet))] font-mono text-[0.65rem] font-black">P</span>
            Pixel-Preview
          </a>
          <span className="tech-label hidden items-center gap-2 text-[var(--pp-text-muted)] sm:flex"><span className="size-1.5 rounded-full bg-[var(--pp-blue)] shadow-[0_0_12px_var(--pp-blue)]" /> Local processing</span>
        </div>
      </header>

      <section id="top" className="grid-noise border-b border-[var(--pp-line)]">
        <div className="mx-auto grid min-h-[660px] max-w-[1520px] gap-14 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[minmax(0,1.25fr)_minmax(390px,0.7fr)] lg:items-center lg:px-12 lg:py-28">
          <div>
            <p className="tech-label mb-7 flex items-center gap-3 text-[var(--pp-blue-bright)]"><span className="h-px w-10 bg-[var(--pp-blue)]" /> Cross-platform imaging system / 01</p>
            <h1 className="font-display max-w-5xl text-[clamp(3.6rem,8vw,8.5rem)] font-bold leading-[0.84] tracking-[-0.075em] text-white">One image.<br /><span className="bg-[linear-gradient(90deg,var(--pp-blue-bright),#b09aff)] bg-clip-text text-transparent">Every frame.</span></h1>
            <p className="mt-9 max-w-2xl text-base leading-7 text-[var(--pp-text-muted)] sm:text-xl sm:leading-8">See exactly how your image lands across profiles, banners, posts, and stories—before the world does.</p>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-[var(--pp-line)] pt-5">
              <span className="tech-label text-[var(--pp-text-dim)]"><b className="mr-2 text-white">09</b>Platforms</span>
              <span className="tech-label text-[var(--pp-text-dim)]"><b className="mr-2 text-white">26</b>Placements</span>
              <span className="tech-label text-[var(--pp-text-dim)]"><b className="mr-2 text-white">100%</b>Private</span>
            </div>
          </div>

          <div className="relative border border-[var(--pp-line)] bg-[var(--pp-surface-glass)] p-3 shadow-[var(--pp-shadow-card)] backdrop-blur-xl sm:p-4">
            <span className="tech-label absolute -top-8 left-0 text-[var(--pp-text-dim)]">Universal source</span>
            <label
              className={`focus-within:ring-2 focus-within:ring-[var(--pp-focus)] flex min-h-80 cursor-pointer flex-col items-center justify-center border border-dashed px-6 text-center transition ${isDragging ? "border-[var(--pp-blue-bright)] bg-[rgba(76,125,255,0.13)]" : image ? "border-[var(--pp-line-strong)] bg-[var(--pp-surface)]" : "border-[var(--pp-line-strong)] bg-[rgba(255,255,255,0.015)] hover:border-[var(--pp-blue)] hover:bg-[rgba(76,125,255,0.06)]"}`}
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
                  <img src={image.url} alt="Uploaded original" className="mb-6 h-36 max-w-full rounded-[var(--pp-radius-sm)] object-contain" />
                  <strong className="max-w-full truncate font-display text-lg font-semibold">{image.name}</strong>
                  <span className="mt-1 font-mono text-xs text-[var(--pp-text-muted)]">SOURCE / {image.width} × {image.height} PX</span>
                  <span className="tech-label mt-5 border border-[var(--pp-line)] bg-white/[0.04] px-4 py-2 text-[var(--pp-blue-bright)]">Replace source</span>
                </>
              ) : (
                <>
                  <span className="mb-6 grid size-14 place-items-center rounded-full border border-[var(--pp-blue)] bg-[rgba(76,125,255,0.1)] text-2xl font-light text-[var(--pp-blue-bright)] shadow-[0_0_28px_rgba(76,125,255,0.18)]">↑</span>
                  <strong className="font-display text-xl font-semibold">Drop universal image</strong>
                  <span className="mt-2 text-sm text-[var(--pp-text-muted)]">or browse / JPG · PNG · WEBP</span>
                  <span className="tech-label mt-7 text-[var(--pp-text-dim)]">Never leaves this browser</span>
                </>
              )}
            </label>
            {error && <p role="alert" className="px-3 pt-3 text-sm font-semibold text-[var(--pp-error)]">{error}</p>}
            {(image || Object.keys(imageOverrides).length > 0) && <button type="button" onClick={resetImage} className="focus-ring tech-label mt-3 w-full py-3 text-[var(--pp-text-muted)] transition hover:bg-white/[0.04] hover:text-white">Reset all images</button>}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1520px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="sticky top-0 z-20 -mx-5 mb-16 border-y border-[var(--pp-line)] bg-[rgba(7,8,12,0.88)] px-5 py-4 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
          <div className="mx-auto flex max-w-[1424px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="tech-label text-[var(--pp-blue-bright)]">Output matrix / 02</p>
              <p className="mt-1 font-mono text-sm text-[var(--pp-text-muted)]">{String(visibleCount).padStart(2, "0")} ACTIVE PLACEMENTS</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="flex items-center gap-3 border border-[var(--pp-line)] bg-[var(--pp-surface)] px-4 py-3 text-sm">
                <span className="tech-label text-[var(--pp-text-dim)]">Platform</span>
                <select aria-label="Filter by platform" value={platformFilter} onChange={(event) => setPlatformFilter(event.target.value)} className="min-w-32 bg-transparent font-medium text-white outline-none">
                  <option value="all">All platforms</option>
                  {platforms.map((platform) => <option key={platform.id} value={platform.id}>{platform.name}</option>)}
                </select>
              </label>
              <label className="flex items-center gap-3 border border-[var(--pp-line)] bg-[var(--pp-surface)] px-4 py-3 text-sm">
                <span className="tech-label text-[var(--pp-text-dim)]">Placement</span>
                <select aria-label="Filter by placement category" value={placementFilter} onChange={(event) => setPlacementFilter(event.target.value as PlacementCategory | "all")} className="min-w-32 bg-transparent font-medium text-white outline-none">
                  <option value="all">All placements</option>
                  {placementCategories.map((category) => <option key={category} value={category}>{placementLabels[category]}</option>)}
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-24">
          {visiblePlatforms.map((platform, index) => (
            <section key={platform.id} aria-labelledby={`${platform.id}-heading`} className="grid gap-8 border-t border-[var(--pp-line)] pt-10 lg:grid-cols-[230px_1fr] lg:gap-16">
              <div className="lg:sticky lg:top-32 lg:self-start">
                <PlatformIcon id={platform.id} name={platform.name} color={platform.color} />
                <p className="tech-label text-[var(--pp-text-dim)]">Channel / {String(index + 1).padStart(2, "0")}</p>
                <h2 id={`${platform.id}-heading`} className="font-display mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">{platform.name}</h2>
                <p className="mt-2 font-mono text-xs text-[var(--pp-text-muted)]">{String(platform.placements.length).padStart(2, "0")} {platform.placements.length === 1 ? "PREVIEW" : "PREVIEWS"}</p>
              </div>
              <div className={`grid items-start gap-x-6 gap-y-10 ${platform.placements.length === 1 ? "max-w-md grid-cols-1" : "sm:grid-cols-2 xl:grid-cols-3"}`}>
                {platform.placements.map((placement) => {
                  const override = imageOverrides[placement.id];
                  return (
                    <PreviewCard
                      key={placement.id}
                      placement={placement}
                      imageUrl={override?.url ?? image?.url ?? null}
                      hasUniversalImage={Boolean(image)}
                      hasOverride={Boolean(override)}
                      onSelectImage={(file) => loadOverrideImage(placement.id, file)}
                      onUseUniversal={() => removeOverride(placement.id)}
                    />
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </section>

      <footer className="mt-16 border-t border-[var(--pp-line)] px-5 py-10 text-sm text-[var(--pp-text-muted)] sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1424px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><strong className="font-display text-white">Pixel-Preview</strong><span className="tech-label text-[var(--pp-text-dim)]">Local / Private / Fast</span></div>
      </footer>
    </main>
  );
}
