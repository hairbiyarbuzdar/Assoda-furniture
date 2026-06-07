"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { Category } from "@/lib/types";

type Props = {
  categories: Category[];
  materials: readonly string[];
};

export default function CatalogFilters({ categories, materials }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const selectedCategories = (params.get("category") ?? "").split(",").filter(Boolean);
  const selectedMaterials = (params.get("material") ?? "").split(",").filter(Boolean);

  function toggle(key: "category" | "material", value: string) {
    const next = new URLSearchParams(params.toString());
    const current = (next.get(key) ?? "").split(",").filter(Boolean);
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    if (updated.length) next.set(key, updated.join(","));
    else next.delete(key);
    next.delete("page"); // reset to first page on filter change

    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  function reset() {
    router.push(pathname, { scroll: false });
  }

  const hasFilters = selectedCategories.length > 0 || selectedMaterials.length > 0;

  return (
    <aside className="space-y-10">
      <FilterGroup
        title="Room Type"
        options={categories.map((c) => ({ value: c.slug, label: c.name }))}
        selected={selectedCategories}
        onToggle={(v) => toggle("category", v)}
      />

      <FilterGroup
        title="Material"
        options={materials.map((m) => ({ value: m, label: m }))}
        selected={selectedMaterials}
        onToggle={(v) => toggle("material", v)}
      />

      <button
        type="button"
        onClick={reset}
        disabled={!hasFilters}
        className="w-full border border-maroon/40 py-3 text-xs uppercase tracking-[0.18em] text-maroon transition-colors hover:bg-maroon hover:text-cream disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-maroon"
      >
        Reset Filters
      </button>
    </aside>
  );
}

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-[0.2em] text-muted">{title}</h3>
      <ul className="mt-4 space-y-3">
        {options.map((opt) => {
          const checked = selected.includes(opt.value);
          return (
            <li key={opt.value}>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-ink/80">
                <span
                  className={`flex h-4 w-4 flex-none items-center justify-center border ${
                    checked ? "border-maroon bg-maroon" : "border-ink/30"
                  }`}
                >
                  {checked && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(opt.value)}
                  className="sr-only"
                />
                {opt.label}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
