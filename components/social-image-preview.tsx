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
    <main className="app-shell min-h-screen text-[var(--pp-text)]">
      <aside className="app-sidebar" aria-label="Workspace navigation">
        <div className="sidebar-brand"><span className="brand-mark" aria-hidden="true">P</span><strong>Pixel-Preview</strong></div>
        <nav className="sidebar-nav">
          <a href="#top" className="is-active"><span aria-hidden="true">⌂</span>Overview</a>
          <a href="#workspace"><span aria-hidden="true">↑</span>Universal source</a>
          <a href="#previews"><span aria-hidden="true">▦</span>Preview matrix</a>
        </nav>
        <div className="sidebar-details">
          <p className="tech-label">Workspace</p>
          <dl><div><dt>Platforms</dt><dd>09</dd></div><div><dt>Formats</dt><dd>27</dd></div><div><dt>Processing</dt><dd>Local</dd></div></dl>
        </div>
        <p className="sidebar-credit">Created by Shimul</p>
      </aside>

      <div className="workspace-shell">
        <header className="workspace-header">
          <div><p className="workspace-kicker">Social image workspace</p><p className="workspace-path">Home <span>/</span> Preview dashboard</p></div>
          <div className="privacy-status"><span aria-hidden="true" />Private in your browser</div>
        </header>

        <section id="top" className="dashboard-hero">
          <div className="hero-copy">
            <span className="hero-badge"><i aria-hidden="true" />9 platforms · 27 formats</span>
            <h1>Perfect crops,<br /><span>before you post.</span></h1>
            <p>Upload once, inspect every social placement, and customize only the frames that need a different image.</p>
            <a href="#workspace" className="primary-action">Choose an image <span aria-hidden="true">→</span></a>
          </div>

          <div id="workspace" className="source-card">
            <div className="source-card-header">
              <div><p className="section-eyebrow">Universal source</p><h2>Choose one image</h2></div>
              <span className="source-step">01</span>
            </div>
            <div className="scope-row">
              <span>Apply to</span>
              <div className="scope-control" role="group" aria-label="Universal image placement scope">
                <button type="button" aria-pressed={universalScope === "all"} onClick={() => setUniversalScope("all")}>All</button>
                {placementCategories.map((category) => <button key={category} type="button" aria-pressed={universalScope === category} onClick={() => setUniversalScope(category)}>{placementLabels[category].replace(" picture", "").replace(" / banner", "")}</button>)}
              </div>
            </div>
            <label className={`source-dropzone ${isDragging ? "is-dragging" : ""}`} onDragEnter={() => setIsDragging(true)} onDragLeave={() => setIsDragging(false)} onDragOver={(event) => event.preventDefault()} onDrop={onDrop}>
              <input ref={inputRef} type="file" className="sr-only" accept="image/jpeg,image/png,image/webp" onChange={onInputChange} />
              {image ? (
                <>
                  {/* Blob URLs cannot use the optimized image component. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.url} alt="Uploaded original" className="source-thumbnail" />
                  <div className="source-file"><strong>{image.name}</strong><span>{image.width} × {image.height} PX</span><b>Replace image</b></div>
                </>
              ) : (
                <><span className="upload-icon" aria-hidden="true">↑</span><div><strong>Drop your image here</strong><span>or click to browse · JPG, PNG, WebP</span></div></>
              )}
            </label>
            {error ? <p role="alert" className="source-error">{error}</p> : null}
            {(image || Object.keys(imageOverrides).length > 0) ? <button type="button" onClick={resetImage} className="reset-action">Reset all images</button> : null}
          </div>
        </section>

        <section id="previews" className="preview-workspace">
          <div className="panel-heading">
            <div><p className="section-eyebrow">Output matrix</p><h2>Social previews</h2><p>{String(visibleCount).padStart(2, "0")} active placements</p></div>
            <span className="panel-step">02</span>
          </div>

          <div className="filter-console">
            <fieldset><legend>Platform</legend><div className="filter-options"><button type="button" aria-pressed={platformFilter === "all"} onClick={() => setPlatformFilter("all")}>All</button>{platforms.map((platform) => <button type="button" key={platform.id} aria-pressed={platformFilter === platform.id} onClick={() => setPlatformFilter(platform.id)}>{platform.name}</button>)}</div></fieldset>
            <fieldset><legend>Placement</legend><div className="filter-options"><button type="button" aria-pressed={placementFilter === "all"} onClick={() => setPlacementFilter("all")}>All</button>{placementCategories.map((category) => <button type="button" key={category} aria-pressed={placementFilter === category} onClick={() => setPlacementFilter(category)}>{placementLabels[category]}</button>)}</div></fieldset>
          </div>

          <div className="platform-matrix">
            {visiblePlatforms.map((platform) => {
              const platformNumber = platforms.findIndex((item) => item.id === platform.id) + 1;
              return (
                <section key={platform.id} aria-labelledby={`${platform.id}-heading`} className="platform-row">
                  <div className="platform-meta"><PlatformIcon id={platform.id} name={platform.name} color={platform.color} /><p className="tech-label text-[var(--pp-text-dim)]">Channel / {String(platformNumber).padStart(2, "0")}</p><h2 id={`${platform.id}-heading`}>{platform.name}</h2><p>{String(platform.placements.length).padStart(2, "0")} {platform.placements.length === 1 ? "PREVIEW" : "PREVIEWS"}</p></div>
                  <div className="placement-grid grid items-stretch sm:grid-cols-2 xl:grid-cols-3">
                    {platform.placements.map(({ placement, slot }) => {
                      const override = imageOverrides[placement.id];
                      const universalApplies = universalScope === "all" || universalScope === placement.category;
                      return <PreviewCard key={placement.id} placement={placement} gridSlot={slot} imageUrl={override?.url ?? (universalApplies ? image?.url ?? null : null)} hasUniversalImage={Boolean(image && universalApplies)} hasOverride={Boolean(override)} onSelectImage={(file) => loadOverrideImage(placement.id, file)} onUseUniversal={() => removeOverride(placement.id)} />;
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </section>

        <footer className="workspace-footer"><strong>Pixel-Preview</strong><span>Private · Local · Fast</span></footer>
      </div>
    </main>
  );
}
