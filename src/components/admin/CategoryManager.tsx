"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/types";

export default function CategoryManager({
  initial,
}: {
  initial: Category[];
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError("");
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setBusy(false);
    if (res.ok) {
      setName("");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not add category");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this category? Products keep existing but lose it.")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert("Delete failed");
  }

  return (
    <div className="max-w-xl">
      <form onSubmit={add} className="flex gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {busy ? "Adding…" : "Add"}
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <ul className="mt-6 divide-y divide-zinc-100 rounded-lg border border-zinc-200 bg-white">
        {initial.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-zinc-400">
            No categories yet.
          </li>
        )}
        {initial.map((c) => (
          <li key={c.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-medium">{c.name}</p>
              <p className="text-xs text-zinc-400">/{c.slug}</p>
            </div>
            <button
              onClick={() => remove(c.id)}
              className="text-sm text-red-600 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
