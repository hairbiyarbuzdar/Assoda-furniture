import Link from "next/link";
import HomeContentForm from "@/components/admin/HomeContentForm";
import { getSiteContent } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomeContentPage() {
  const content = await getSiteContent();
  return (
    <div>
      <Link href="/dashboard/content" className="text-sm text-zinc-500 hover:text-zinc-900">
        ← Site Content
      </Link>
      <h1 className="mt-2 text-2xl font-semibold">Homepage</h1>
      <div className="mt-8">
        <HomeContentForm initial={content} />
      </div>
    </div>
  );
}
