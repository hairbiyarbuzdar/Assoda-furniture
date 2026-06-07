"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/lib/types";

// Image input with two modes:
//  - Cloudinary configured -> signed, direct browser upload.
//  - Not configured (dev)  -> paste an image URL (use an allowed host:
//    picsum.photos, images.unsplash.com, res.cloudinary.com).
export default function ImageUploader({
  value,
  onChange,
  max,
}: {
  value: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  max?: number;
}) {
  const [cloudinary, setCloudinary] = useState<boolean | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [urlInput, setUrlInput] = useState("");

  useEffect(() => {
    fetch("/api/upload", { method: "POST" })
      .then((r) => (r.ok ? r.json() : { configured: false }))
      .then((d) => setCloudinary(Boolean(d.configured)))
      .catch(() => setCloudinary(false));
  }, []);

  const atMax = max !== undefined && value.length >= max;

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      const sigRes = await fetch("/api/upload", { method: "POST" });
      const sig = await sigRes.json();
      if (!sig.configured) throw new Error("Cloudinary not configured");
      const { signature, timestamp, apiKey, cloudName, folder } = sig;

      const uploaded: ProductImage[] = [];
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        form.append("api_key", apiKey);
        form.append("timestamp", String(timestamp));
        form.append("signature", signature);
        form.append("folder", folder);
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: form },
        );
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        uploaded.push({
          public_id: data.public_id,
          url: data.secure_url,
          width: data.width,
          height: data.height,
        });
      }
      onChange(applyMax([...value, ...uploaded]));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload error");
    } finally {
      setUploading(false);
    }
  }

  function addUrl() {
    const url = urlInput.trim();
    if (!url) return;
    try {
      new URL(url);
    } catch {
      setError("Enter a valid image URL");
      return;
    }
    setError("");
    onChange(
      applyMax([
        ...value,
        { public_id: `external:${crypto.randomUUID()}`, url },
      ]),
    );
    setUrlInput("");
  }

  function applyMax(list: ProductImage[]) {
    return max !== undefined ? list.slice(-max) : list;
  }

  function remove(publicId: string) {
    onChange(value.filter((img) => img.public_id !== publicId));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {value.map((img) => (
          <div
            key={img.public_id}
            className="relative h-24 w-24 overflow-hidden rounded border border-zinc-200"
          >
            <Image src={img.url} alt="" fill sizes="96px" className="object-cover" />
            <button
              type="button"
              onClick={() => remove(img.public_id)}
              className="absolute right-1 top-1 rounded bg-black/60 px-1.5 text-xs text-white"
            >
              ✕
            </button>
          </div>
        ))}

        {cloudinary && !atMax && (
          <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded border-2 border-dashed border-zinc-300 text-center text-xs text-zinc-500 hover:border-zinc-900">
            {uploading ? "Uploading…" : "+ Add"}
            <input
              type="file"
              accept="image/*"
              multiple={max === undefined}
              className="hidden"
              disabled={uploading}
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
        )}
      </div>

      {/* URL paste fallback when Cloudinary isn't configured */}
      {cloudinary === false && !atMax && (
        <div className="mt-3 flex gap-2">
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste image URL (picsum / unsplash / cloudinary)"
            className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
          />
          <button
            type="button"
            onClick={addUrl}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-50"
          >
            Add
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {max !== 1 && (
        <p className="mt-1 text-xs text-zinc-400">First image is used as the cover.</p>
      )}
    </div>
  );
}
