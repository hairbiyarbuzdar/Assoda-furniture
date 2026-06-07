"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (!confirm("Delete this product? This also removes its images.")) return;
    setBusy(true);
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) router.refresh();
    else alert("Delete failed");
  }

  return (
    <button
      onClick={onDelete}
      disabled={busy}
      className="text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      {busy ? "Deleting…" : "Delete"}
    </button>
  );
}
