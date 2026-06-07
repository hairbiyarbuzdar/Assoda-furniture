"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";
import type {
  Category,
  FrameFinish,
  Product,
  ProductDetails,
  ProductImage,
} from "@/lib/types";

type Props = { product?: Product };

const lines = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);
const paras = (s: string) => s.split(/\n\s*\n/).map((l) => l.trim()).filter(Boolean);
const csv = (s: string) => s.split(",").map((c) => c.trim()).filter(Boolean);

export default function ProductForm({ product }: Props) {
  const router = useRouter();
  const editing = Boolean(product);

  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // core fields
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(
    product?.price != null ? String(product.price) : "",
  );
  const [categoryId, setCategoryId] = useState(product?.category_id ?? "");
  const [dimensions, setDimensions] = useState(product?.dimensions ?? "");
  const [material, setMaterial] = useState(product?.material ?? "");
  const [colors, setColors] = useState((product?.colors ?? []).join(", "));
  const [inStock, setInStock] = useState(product?.in_stock ?? true);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [images, setImages] = useState<ProductImage[]>(product?.images ?? []);

  // rich detail fields
  const d = product?.details ?? {};
  const story = d.story ?? {};
  const [subtitle, setSubtitle] = useState(d.subtitle ?? "");
  const [collectionLabel, setCollectionLabel] = useState(d.collectionLabel ?? "");
  const [frameFinishes, setFrameFinishes] = useState<FrameFinish[]>(
    d.frameFinishes ?? [],
  );
  const [upholstery, setUpholstery] = useState((d.upholstery ?? []).join(", "));
  const [care, setCare] = useState((d.care ?? []).join("\n"));
  const [perks, setPerks] = useState((d.perks ?? []).join("\n"));
  const [storyEyebrow, setStoryEyebrow] = useState(story.eyebrow ?? "");
  const [storyTitle, setStoryTitle] = useState(story.title ?? "");
  const [storyBody, setStoryBody] = useState((story.body ?? []).join("\n\n"));
  const [storyQuote, setStoryQuote] = useState(story.quote ?? "");
  const [storyAuthor, setStoryAuthor] = useState(story.author ?? "");
  const [storyImages, setStoryImages] = useState<ProductImage[]>(
    story.image ? [story.image] : [],
  );

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories ?? []))
      .catch(() => {});
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const details: ProductDetails = {
      subtitle: subtitle || null,
      collectionLabel: collectionLabel || null,
      frameFinishes: frameFinishes.filter((f) => f.name.trim()),
      upholstery: csv(upholstery),
      care: lines(care),
      perks: lines(perks),
      story: {
        eyebrow: storyEyebrow || undefined,
        title: storyTitle || undefined,
        body: paras(storyBody),
        quote: storyQuote || undefined,
        author: storyAuthor || undefined,
        image: storyImages[0] ?? null,
      },
    };

    const payload = {
      name,
      description: description || null,
      price: price ? Number(price) : null,
      category_id: categoryId || null,
      dimensions: dimensions || null,
      material: material || null,
      colors: csv(colors),
      in_stock: inStock,
      featured,
      images,
      details,
    };

    const res = await fetch(
      editing ? `/api/products/${product!.id}` : "/api/products",
      {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    setSaving(false);
    if (res.ok) {
      router.push("/dashboard/products");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Save failed");
    }
  }

  function updateFinish(i: number, patch: Partial<FrameFinish>) {
    setFrameFinishes((prev) =>
      prev.map((f, idx) => (idx === i ? { ...f, ...patch } : f)),
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-6">
      <Field label="Name">
        <input required value={name} onChange={(e) => setName(e.target.value)} className="input" />
      </Field>

      <Field label="Description">
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="input" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Price">
          <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="input" placeholder="Leave blank for 'on request'" />
        </Field>
        <Field label="Category">
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input">
            <option value="">— None —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Dimensions">
          <input value={dimensions} onChange={(e) => setDimensions(e.target.value)} className="input" placeholder="200 x 90 x 75 cm" />
        </Field>
        <Field label="Material">
          <input value={material} onChange={(e) => setMaterial(e.target.value)} className="input" placeholder="Solid oak, linen" />
        </Field>
      </div>

      <Field label="Colors (comma separated)">
        <input value={colors} onChange={(e) => setColors(e.target.value)} className="input" placeholder="Natural, Walnut, Charcoal" />
      </Field>

      <Field label="Images">
        <ImageUploader value={images} onChange={setImages} />
      </Field>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
          In stock
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          Featured on homepage
        </label>
      </div>

      {/* ---- Rich product-page details ---- */}
      <fieldset className="space-y-5 rounded-lg border border-zinc-200 p-5">
        <legend className="px-2 text-sm font-semibold text-zinc-700">
          Product page details
        </legend>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Subtitle (italic line)">
            <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="input" placeholder="Hand-turned walnut and wool boucle" />
          </Field>
          <Field label="Collection label">
            <input value={collectionLabel} onChange={(e) => setCollectionLabel(e.target.value)} className="input" placeholder="Heritage Collection" />
          </Field>
        </div>

        {/* Frame finishes */}
        <div>
          <span className="mb-1 block text-sm font-medium text-zinc-700">Frame finishes</span>
          <div className="space-y-2">
            {frameFinishes.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={f.name} onChange={(e) => updateFinish(i, { name: e.target.value })} className="input flex-1" placeholder="Walnut" />
                <input type="color" value={f.hex || "#5A3A2E"} onChange={(e) => updateFinish(i, { hex: e.target.value })} className="h-9 w-12 rounded border border-zinc-300" />
                <button type="button" onClick={() => setFrameFinishes((p) => p.filter((_, idx) => idx !== i))} className="px-2 text-sm text-red-600">✕</button>
              </div>
            ))}
            <button type="button" onClick={() => setFrameFinishes((p) => [...p, { name: "", hex: "#5A3A2E" }])} className="text-sm text-zinc-700 underline">
              + Add finish
            </button>
          </div>
        </div>

        <Field label="Upholstery options (comma separated — defaults to Colors)">
          <input value={upholstery} onChange={(e) => setUpholstery(e.target.value)} className="input" placeholder="Ivory Boucle, Charcoal Felt" />
        </Field>

        <Field label="Perks (one per line)">
          <textarea value={perks} onChange={(e) => setPerks(e.target.value)} rows={2} className="input" placeholder={"White Glove Delivery (4–6 weeks)\nLifetime Frame Warranty"} />
        </Field>

        <Field label="Care guide (one paragraph per line)">
          <textarea value={care} onChange={(e) => setCare(e.target.value)} rows={3} className="input" />
        </Field>

        {/* Story */}
        <div className="space-y-4 rounded-md bg-zinc-50 p-4">
          <p className="text-sm font-medium text-zinc-700">Artisanal story</p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Eyebrow">
              <input value={storyEyebrow} onChange={(e) => setStoryEyebrow(e.target.value)} className="input" placeholder="The Artisanal Process" />
            </Field>
            <Field label="Title">
              <input value={storyTitle} onChange={(e) => setStoryTitle(e.target.value)} className="input" />
            </Field>
          </div>
          <Field label="Body (blank line between paragraphs)">
            <textarea value={storyBody} onChange={(e) => setStoryBody(e.target.value)} rows={4} className="input" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Quote">
              <input value={storyQuote} onChange={(e) => setStoryQuote(e.target.value)} className="input" />
            </Field>
            <Field label="Quote author">
              <input value={storyAuthor} onChange={(e) => setStoryAuthor(e.target.value)} className="input" />
            </Field>
          </div>
          <div>
            <span className="mb-1 block text-sm font-medium text-zinc-700">Story image</span>
            <ImageUploader value={storyImages} onChange={setStoryImages} max={1} />
          </div>
        </div>
      </fieldset>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="rounded-md bg-zinc-900 px-6 py-2 text-white hover:bg-zinc-800 disabled:opacity-50">
          {saving ? "Saving…" : editing ? "Update product" : "Create product"}
        </button>
        <button type="button" onClick={() => router.push("/dashboard/products")} className="rounded-md border border-zinc-300 px-6 py-2 hover:bg-zinc-50">
          Cancel
        </button>
      </div>

      <style jsx>{`
        :global(.input) {
          width: 100%;
          border: 1px solid #d4d4d8;
          border-radius: 0.375rem;
          padding: 0.5rem 0.75rem;
          outline: none;
          background: white;
        }
        :global(.input:focus) {
          border-color: #18181b;
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-zinc-700">{label}</span>
      {children}
    </label>
  );
}
