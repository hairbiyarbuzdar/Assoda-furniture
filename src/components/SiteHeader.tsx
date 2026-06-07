import { getCategories } from "@/lib/queries";
import { sampleCategories } from "@/lib/sample-data";
import SiteHeaderClient from "./SiteHeaderClient";
import type { Category } from "@/lib/types";

export default async function SiteHeader() {
  let categories: Category[] = [];
  try {
    categories = await getCategories();
  } catch {
    categories = sampleCategories;
  }
  if (!categories.length) categories = sampleCategories;
  return <SiteHeaderClient categories={categories} />;
}
