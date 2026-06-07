import type { HomeContent } from "@/lib/types";

// Visual-only newsletter band. No action wired yet (backend is a later phase).
export default function Newsletter({
  content,
}: {
  content: HomeContent["newsletter"];
}) {
  return (
    <section className="border-t border-maroon/10">
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h2 className="font-serif text-4xl text-maroon">{content.title}</h2>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink/70">
          {content.body}
        </p>

        <form className="mx-auto mt-10 flex max-w-lg items-end gap-4">
          <label className="flex-1 text-left">
            <span className="sr-only">Your email address</span>
            <input
              type="email"
              placeholder="YOUR EMAIL ADDRESS"
              className="w-full border-b border-ink/30 bg-transparent pb-2 text-sm tracking-wide text-ink placeholder:text-muted/80 focus:border-maroon focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="flex-none bg-maroon-dark px-7 py-3 text-xs uppercase tracking-[0.2em] text-cream transition-colors hover:bg-maroon"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
