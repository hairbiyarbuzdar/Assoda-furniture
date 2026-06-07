import { notFound } from "next/navigation";
import ProductForm from "@/components/ProductForm";
import { getStore } from "@/lib/store";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function EditProductPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const product = await getStore().getProductById(id);
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-zinc-900">Edit product</h1>
      <ProductForm product={product} />
    </div>
  );
}
