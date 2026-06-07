import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import LogoutButton from "@/components/LogoutButton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        {/* Sidebar */}
        <aside className="hidden w-60 flex-none flex-col border-r border-zinc-200 bg-white p-5 md:flex">
          <Link href="/dashboard" className="text-lg font-semibold tracking-tight">
            Assoda Admin
          </Link>
          <p className="mt-1 text-xs text-zinc-400">Control panel</p>
          <div className="mt-8 flex-1">
            <AdminNav />
          </div>
          <div className="border-t border-zinc-200 pt-4 text-sm">
            <Link
              href="/"
              className="block py-1 text-zinc-500 hover:text-zinc-900"
            >
              ↗ View site
            </Link>
            <LogoutButton />
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile top bar */}
          <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-5 py-3 md:hidden">
            <Link href="/dashboard" className="font-semibold">
              Assoda Admin
            </Link>
            <LogoutButton />
          </header>
          <main className="flex-1 p-6 lg:p-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
