/** Turn "Oak Dining Table" into "oak-dining-table". */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Format a number as a price. Adjust currency/locale to your market. */
export function formatPrice(
  price: number | null | undefined,
  currency = "USD",
  locale = "en-US",
): string {
  if (price === null || price === undefined) return "Price on request";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

/** Like formatPrice but always shows cents, e.g. $4,850.00 (used on the product page). */
export function formatPriceExact(
  price: number | null | undefined,
  currency = "USD",
  locale = "en-US",
): string {
  if (price === null || price === undefined) return "Price on request";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(price);
}

/**
 * Parse a dimensions string like "220 x 95 x 78 cm (W x D x H)" into labeled
 * rows. Falls back to a single raw row if it can't find 2-3 numbers.
 */
export function parseDimensions(
  dimensions: string | null | undefined,
): { label: string; value: string }[] {
  if (!dimensions) return [];
  const unit = /cm|mm|in|"|inch/i.exec(dimensions)?.[0] ?? "";
  const numbers = dimensions.match(/\d+(?:\.\d+)?/g) ?? [];
  const labels = ["Overall Width", "Overall Depth", "Overall Height"];
  if (numbers.length >= 2) {
    return numbers.slice(0, 3).map((n, i) => ({
      label: labels[i] ?? `Dimension ${i + 1}`,
      value: `${n}${unit ? ` ${unit}` : ""}`,
    }));
  }
  return [{ label: "Dimensions", value: dimensions }];
}
