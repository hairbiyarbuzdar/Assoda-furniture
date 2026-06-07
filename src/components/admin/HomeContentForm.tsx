"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { HomeContent, ProductImage, SiteContent } from "@/lib/types";
import { Card, ImageField, TextArea, TextField } from "@/components/admin/fields";

export default function HomeContentForm({ initial }: { initial: SiteContent }) {
  const router = useRouter();
  const [home, setHome] = useState<HomeContent>(initial.home);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  // generic immutable patch for a top-level home section
  function patch<K extends keyof HomeContent>(
    key: K,
    value: Partial<HomeContent[K]>,
  ) {
    setHome((prev) => ({ ...prev, [key]: { ...prev[key], ...value } }));
  }

  async function save() {
    setSaving(true);
    setStatus("");
    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...initial, home } satisfies SiteContent),
    });
    setSaving(false);
    if (res.ok) {
      setStatus("Saved");
      router.refresh();
    } else {
      setStatus("Save failed");
    }
  }

  const setImage = (key: keyof HomeContent, img: ProductImage | null) =>
    patch(key, { image: img } as never);

  return (
    <div className="max-w-2xl space-y-6">
      <Card title="Hero">
        <TextField label="Eyebrow" value={home.hero.eyebrow} onChange={(v) => patch("hero", { eyebrow: v })} />
        <TextField label="Title" value={home.hero.title} onChange={(v) => patch("hero", { title: v })} />
        <TextArea label="Subtitle" value={home.hero.subtitle} onChange={(v) => patch("hero", { subtitle: v })} />
        <div className="grid grid-cols-2 gap-4">
          <TextField label="Button label" value={home.hero.cta.label} onChange={(v) => patch("hero", { cta: { ...home.hero.cta, label: v } })} />
          <TextField label="Button link" value={home.hero.cta.href} onChange={(v) => patch("hero", { cta: { ...home.hero.cta, href: v } })} />
        </div>
        <ImageField label="Hero image" value={home.hero.image} onChange={(img) => setImage("hero", img)} />
      </Card>

      <Card title="Craftsmanship band">
        <TextField label="Eyebrow" value={home.craftBand.eyebrow} onChange={(v) => patch("craftBand", { eyebrow: v })} />
        <TextField label="Title" value={home.craftBand.title} onChange={(v) => patch("craftBand", { title: v })} />
        <TextArea label="Body" value={home.craftBand.body} onChange={(v) => patch("craftBand", { body: v })} />
        {home.craftBand.features.map((f, i) => (
          <div key={i} className="grid grid-cols-2 gap-4 rounded-md bg-zinc-50 p-3">
            <TextField label={`Feature ${i + 1} title`} value={f.title} onChange={(v) => patch("craftBand", { features: home.craftBand.features.map((x, idx) => (idx === i ? { ...x, title: v } : x)) })} />
            <TextField label="Feature text" value={f.body} onChange={(v) => patch("craftBand", { features: home.craftBand.features.map((x, idx) => (idx === i ? { ...x, body: v } : x)) })} />
          </div>
        ))}
        <div className="grid grid-cols-2 gap-4">
          <TextField label="Quote" value={home.craftBand.quote} onChange={(v) => patch("craftBand", { quote: v })} />
          <TextField label="Quote author" value={home.craftBand.quoteAuthor} onChange={(v) => patch("craftBand", { quoteAuthor: v })} />
        </div>
        <ImageField label="Band image" value={home.craftBand.image} onChange={(img) => setImage("craftBand", img)} />
      </Card>

      <Card title="Featured collections">
        <TextField label="Eyebrow" value={home.featuredCollections.eyebrow} onChange={(v) => patch("featuredCollections", { eyebrow: v })} />
        <TextField label="Title" value={home.featuredCollections.title} onChange={(v) => patch("featuredCollections", { title: v })} />
        <div className="grid grid-cols-2 gap-4">
          <TextField label="View-all label" value={home.featuredCollections.viewAll.label} onChange={(v) => patch("featuredCollections", { viewAll: { ...home.featuredCollections.viewAll, label: v } })} />
          <TextField label="View-all link" value={home.featuredCollections.viewAll.href} onChange={(v) => patch("featuredCollections", { viewAll: { ...home.featuredCollections.viewAll, href: v } })} />
        </div>
        {home.featuredCollections.items.map((item, i) => (
          <div key={i} className="space-y-3 rounded-md bg-zinc-50 p-3">
            <div className="grid grid-cols-2 gap-4">
              <TextField label={`Item ${i + 1} title`} value={item.title} onChange={(v) => patch("featuredCollections", { items: home.featuredCollections.items.map((x, idx) => (idx === i ? { ...x, title: v } : x)) })} />
              <TextField label="Link" value={item.href} onChange={(v) => patch("featuredCollections", { items: home.featuredCollections.items.map((x, idx) => (idx === i ? { ...x, href: v } : x)) })} />
            </div>
            <ImageField label="Image" value={item.image} onChange={(img) => patch("featuredCollections", { items: home.featuredCollections.items.map((x, idx) => (idx === i ? { ...x, image: img } : x)) })} />
          </div>
        ))}
      </Card>

      <Card title="Newsletter">
        <TextField label="Title" value={home.newsletter.title} onChange={(v) => patch("newsletter", { title: v })} />
        <TextArea label="Body" value={home.newsletter.body} onChange={(v) => patch("newsletter", { body: v })} />
      </Card>

      <SaveBar saving={saving} status={status} onSave={save} />
    </div>
  );
}

function SaveBar({
  saving,
  status,
  onSave,
}: {
  saving: boolean;
  status: string;
  onSave: () => void;
}) {
  return (
    <div className="sticky bottom-0 flex items-center gap-3 border-t border-zinc-200 bg-zinc-50 py-4">
      <button
        onClick={onSave}
        disabled={saving}
        className="rounded-md bg-zinc-900 px-6 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
      {status && <span className="text-sm text-zinc-500">{status}</span>}
    </div>
  );
}
