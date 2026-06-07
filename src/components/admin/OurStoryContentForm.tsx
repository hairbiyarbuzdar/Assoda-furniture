"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OurStoryContent, ProductImage, SiteContent } from "@/lib/types";
import { Card, ImageField, TextArea, TextField } from "@/components/admin/fields";

const paras = (s: string) => s.split(/\n\s*\n/).map((l) => l.trim()).filter(Boolean);

export default function OurStoryContentForm({
  initial,
}: {
  initial: SiteContent;
}) {
  const router = useRouter();
  const [s, setS] = useState<OurStoryContent>(initial.ourStory);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  function patch<K extends keyof OurStoryContent>(
    key: K,
    value: Partial<OurStoryContent[K]>,
  ) {
    setS((prev) => ({ ...prev, [key]: { ...prev[key], ...value } }));
  }

  async function save() {
    setSaving(true);
    setStatus("");
    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...initial, ourStory: s } satisfies SiteContent),
    });
    setSaving(false);
    setStatus(res.ok ? "Saved" : "Save failed");
    if (res.ok) router.refresh();
  }

  const setImage = (key: keyof OurStoryContent, img: ProductImage | null) =>
    patch(key, { image: img } as never);

  return (
    <div className="max-w-2xl space-y-6">
      <Card title="Hero">
        <TextField label="Eyebrow" value={s.hero.eyebrow} onChange={(v) => patch("hero", { eyebrow: v })} />
        <TextField label="Title" value={s.hero.title} onChange={(v) => patch("hero", { title: v })} />
        <ImageField label="Hero image" value={s.hero.image} onChange={(img) => setImage("hero", img)} />
      </Card>

      <Card title="Philosophy">
        <TextField label="Eyebrow" value={s.philosophy.eyebrow} onChange={(v) => patch("philosophy", { eyebrow: v })} />
        <TextField label="Title" value={s.philosophy.title} onChange={(v) => patch("philosophy", { title: v })} />
        <TextArea label="Body" rows={5} hint="One blank line between paragraphs." value={s.philosophy.body.join("\n\n")} onChange={(v) => patch("philosophy", { body: paras(v) })} />
      </Card>

      <Card title="Journey">
        <TextField label="Eyebrow" value={s.journey.eyebrow} onChange={(v) => patch("journey", { eyebrow: v })} />
        <TextField label="Title" value={s.journey.title} onChange={(v) => patch("journey", { title: v })} />
        <TextField label="Intro" value={s.journey.intro} onChange={(v) => patch("journey", { intro: v })} />
        {s.journey.steps.map((step, i) => (
          <div key={i} className="space-y-3 rounded-md bg-zinc-50 p-3">
            <TextField label={`Step ${i + 1} label`} value={step.label} onChange={(v) => patch("journey", { steps: s.journey.steps.map((x, idx) => (idx === i ? { ...x, label: v } : x)) })} />
            <TextArea label="Body" value={step.body} onChange={(v) => patch("journey", { steps: s.journey.steps.map((x, idx) => (idx === i ? { ...x, body: v } : x)) })} />
            <ImageField label="Image" value={step.image} onChange={(img) => patch("journey", { steps: s.journey.steps.map((x, idx) => (idx === i ? { ...x, image: img } : x)) })} />
          </div>
        ))}
      </Card>

      <Card title="Sustainability">
        <TextField label="Eyebrow" value={s.sustainability.eyebrow} onChange={(v) => patch("sustainability", { eyebrow: v })} />
        <TextField label="Title" value={s.sustainability.title} onChange={(v) => patch("sustainability", { title: v })} />
        <TextArea label="Body" value={s.sustainability.body} onChange={(v) => patch("sustainability", { body: v })} />
        {s.sustainability.stats.map((stat, i) => (
          <div key={i} className="grid grid-cols-2 gap-4 rounded-md bg-zinc-50 p-3">
            <TextField label={`Stat ${i + 1} value`} value={stat.value} onChange={(v) => patch("sustainability", { stats: s.sustainability.stats.map((x, idx) => (idx === i ? { ...x, value: v } : x)) })} />
            <TextField label="Label" value={stat.label} onChange={(v) => patch("sustainability", { stats: s.sustainability.stats.map((x, idx) => (idx === i ? { ...x, label: v } : x)) })} />
          </div>
        ))}
        <ImageField label="Image" value={s.sustainability.image} onChange={(img) => setImage("sustainability", img)} />
      </Card>

      <Card title="Closing call-to-action">
        <TextField label="Title" value={s.closingCta.title} onChange={(v) => patch("closingCta", { title: v })} />
        <div className="grid grid-cols-2 gap-4">
          <TextField label="Button label" value={s.closingCta.cta.label} onChange={(v) => patch("closingCta", { cta: { ...s.closingCta.cta, label: v } })} />
          <TextField label="Button link" value={s.closingCta.cta.href} onChange={(v) => patch("closingCta", { cta: { ...s.closingCta.cta, href: v } })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <TextField label="Secondary label" value={s.closingCta.secondary.label} onChange={(v) => patch("closingCta", { secondary: { ...s.closingCta.secondary, label: v } })} />
          <TextField label="Secondary link" value={s.closingCta.secondary.href} onChange={(v) => patch("closingCta", { secondary: { ...s.closingCta.secondary, href: v } })} />
        </div>
      </Card>

      <div className="sticky bottom-0 flex items-center gap-3 border-t border-zinc-200 bg-zinc-50 py-4">
        <button onClick={save} disabled={saving} className="rounded-md bg-zinc-900 px-6 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50">
          {saving ? "Saving…" : "Save changes"}
        </button>
        {status && <span className="text-sm text-zinc-500">{status}</span>}
      </div>
    </div>
  );
}
