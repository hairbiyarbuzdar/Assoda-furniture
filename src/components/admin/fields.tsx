"use client";

import ImageUploader from "@/components/ImageUploader";
import type { ProductImage } from "@/lib/types";

// Small controlled inputs shared by the Site Content editors.

export function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-zinc-700">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900"
      />
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-zinc-700">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900"
      />
      {hint && <span className="mt-1 block text-xs text-zinc-400">{hint}</span>}
    </label>
  );
}

export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: ProductImage | null;
  onChange: (img: ProductImage | null) => void;
}) {
  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-zinc-700">{label}</span>
      <ImageUploader
        value={value ? [value] : []}
        onChange={(arr) => onChange(arr[0] ?? null)}
        max={1}
      />
    </div>
  );
}

export function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5">
      <h2 className="text-sm font-semibold text-zinc-700">{title}</h2>
      {children}
    </section>
  );
}
