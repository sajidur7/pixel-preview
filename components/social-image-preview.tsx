"use client";

import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from "react";
import { placementCategories, placementLabels, platforms, type PlacementCategory } from "@/lib/platforms";
import { PreviewCard } from "./preview-card";

type UploadedImage = { url: string; name: string; width: number; height: number };

const acceptedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export function SocialImagePreview() {
  const [image, setImage] = useState<UploadedImage | null>(null);
  const [platformFilter, setPlatformFilter] = useState("all");
  const [placementFilter, setPlacementFilter] = useState<PlacementCategory | "all">("all");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (image) URL.revokeObjectURL(image.url); }, [image]);

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
    <main className="min-h-screen">
      <header className="border-b border-[#d9dbd6] bg-[#f5f4ef]/95">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <a href="#top" className="font-display text-lg font-extrabold tracking-[-0.04em]">Social Image Preview<span className="text-[#81a900]">.</span></a>
          <span className="hidden rounded-full border border-[#d1d4cf] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#677174] sm:block">Private by design</span>
        </div>
      </header>

      <section id="top" className="grid-noise border-b border-[#d9dbd6]">
        <div className="mx-auto grid max-w-[1480px] gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.72fr)] lg:items-center lg:px-12 lg:py-24">
          <div>
            <p className="mb-5 flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[#667074]"><span className="h-px w-9 bg-[#99bd1e]" /> One image, every crop</p>
            <h1 className="font-display max-w-4xl text-[clamp(3rem,7vw,7rem)] font-extrabold leading-[0.88] tracking-[-0.07em]">See it before<br /><span className="text-[#7f9f16]">you post it.</span></h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#5f696c] sm:text-xl">Upload once. Instantly compare how your image is cropped for profiles, banners, posts, and stories across nine platforms.</p>
          </div>

          <div className="rounded-[2rem] border border-[#d5d7d2] bg-white p-3 shadow-[0_24px_70px_rgba(32,38,39,0.10)] sm:p-4">
            <label
              className={`flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-[1.4rem] border-2 border-dashed px-6 text-center transition ${isDragging ? "border-[#85a81a] bg-[#f4ffd2]" : image ? "border-[#bfc5bd] bg-[#f6f7f2]" : "border-[#ced2cb] bg-[#fafaf7] hover:border-[#95b52d] hover:bg-[#fbfff0]"}`}
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
                  <img src={image.url} alt="Uploaded original" className="mb-5 h-32 max-w-full rounded-xl object-contain" />
                  <strong className="max-w-full truncate font-display text-lg">{image.name}</strong>
                  <span className="mt-1 text-sm text-[#677174]">Original: {image.width} × {image.height} px</span>
                  <span className="mt-4 rounded-full bg-[#e7e9e3] px-4 py-2 text-xs font-bold uppercase tracking-[0.1em]">Choose another</span>
                </>
              ) : (
                <>
                  <span className="mb-5 grid size-14 place-items-center rounded-full bg-[#d7ff46] text-2xl font-light">↑</span>
                  <strong className="font-display text-xl">Drop your image here</strong>
                  <span className="mt-1 text-sm text-[#687174]">or click to browse · JPG, PNG, WebP</span>
                  <span className="mt-6 text-xs font-bold uppercase tracking-[0.13em] text-[#788083]">It never leaves your browser</span>
                </>
              )}
            </label>
            {error && <p role="alert" className="px-3 pt-3 text-sm font-semibold text-red-600">{error}</p>}
            {image && <button type="button" onClick={resetImage} className="mt-3 w-full rounded-xl py-3 text-sm font-bold text-[#596366] transition hover:bg-[#f0f1ec]">Reset image</button>}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1480px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="sticky top-0 z-20 -mx-5 mb-12 border-y border-[#d9dbd6] bg-[#f5f4ef]/95 px-5 py-4 backdrop-blur-md sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
          <div className="mx-auto flex max-w-[1384px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#7a8385]">Preview library</p>
              <p className="mt-1 font-display text-lg font-bold">{visibleCount} placements</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="flex items-center gap-3 rounded-xl border border-[#d5d8d2] bg-white px-4 py-3 text-sm font-bold">
                <span className="text-[#7a8385]">Platform</span>
                <select aria-label="Filter by platform" value={platformFilter} onChange={(event) => setPlatformFilter(event.target.value)} className="min-w-32 bg-transparent outline-none">
                  <option value="all">All platforms</option>
                  {platforms.map((platform) => <option key={platform.id} value={platform.id}>{platform.name}</option>)}
                </select>
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-[#d5d8d2] bg-white px-4 py-3 text-sm font-bold">
                <span className="text-[#7a8385]">Placement</span>
                <select aria-label="Filter by placement category" value={placementFilter} onChange={(event) => setPlacementFilter(event.target.value as PlacementCategory | "all")} className="min-w-32 bg-transparent outline-none">
                  <option value="all">All placements</option>
                  {placementCategories.map((category) => <option key={category} value={category}>{placementLabels[category]}</option>)}
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-16">
          {visiblePlatforms.map((platform, index) => (
            <section key={platform.id} aria-labelledby={`${platform.id}-heading`} className="grid gap-7 lg:grid-cols-[220px_1fr] lg:gap-12">
              <div className="lg:sticky lg:top-32 lg:self-start">
                <span className="mb-5 grid size-12 place-items-center rounded-2xl text-sm font-black text-white" style={{ backgroundColor: platform.color }}>{platform.mark}</span>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#8a9294]">{String(index + 1).padStart(2, "0")}</p>
                <h2 id={`${platform.id}-heading`} className="font-display mt-1 text-3xl font-extrabold tracking-[-0.05em]">{platform.name}</h2>
                <p className="mt-2 text-sm text-[#687174]">{platform.placements.length} {platform.placements.length === 1 ? "preview" : "previews"}</p>
              </div>
              <div className={`grid items-start gap-x-6 gap-y-10 ${platform.placements.length === 1 ? "max-w-md grid-cols-1" : "sm:grid-cols-2 xl:grid-cols-3"}`}>
                {platform.placements.map((placement) => <PreviewCard key={placement.id} placement={placement} imageUrl={image?.url ?? null} />)}
              </div>
            </section>
          ))}
        </div>
      </section>

      <footer className="mt-10 border-t border-[#d9dbd6] px-5 py-8 text-sm text-[#687174] sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1384px] flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><strong className="font-display text-[#202628]">Social Image Preview</strong><span>Local, private, and made for quick crop checks.</span></div>
      </footer>
    </main>
  );
}
