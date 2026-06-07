import Link from "next/link";

export default function ContentHubPage() {
  const editors = [
    {
      href: "/dashboard/content/home",
      title: "Homepage",
      desc: "Hero, craftsmanship band, featured collections, newsletter.",
    },
    {
      href: "/dashboard/content/our-story",
      title: "Our Story",
      desc: "Hero, philosophy, journey, sustainability, closing call-to-action.",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Site Content</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Edit the editorial copy and imagery on your public pages.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {editors.map((e) => (
          <Link
            key={e.href}
            href={e.href}
            className="rounded-lg border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300"
          >
            <p className="font-medium">{e.title}</p>
            <p className="mt-1 text-sm text-zinc-500">{e.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
