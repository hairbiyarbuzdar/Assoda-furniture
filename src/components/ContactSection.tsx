export default function ContactSection() {
  return (
    <section id="contact" className="border-t border-maroon/10">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-16 md:grid-cols-2">
          {/* Left: heading */}
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted">
              Get in touch
            </p>
            <h2 className="mt-3 font-serif text-4xl leading-tight text-maroon sm:text-5xl">
              We'd love to<br />hear from you.
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink/70">
              Whether you have a question about a piece, a custom order, or
              just want to talk about craft — our studio is always open.
            </p>

            <div className="mt-10 space-y-4">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted">Email</p>
                <a
                  href="mailto:hello@asooda.com"
                  className="mt-1 block text-sm text-ink/80 transition-colors hover:text-maroon"
                >
                  hello@asooda.com
                </a>
              </div>
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted">Studio</p>
                <p className="mt-1 text-sm text-ink/80">
                  Open Mon–Fri, 9am–6pm
                </p>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <form className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="text-[0.65rem] uppercase tracking-[0.2em] text-muted">Name</span>
                <input
                  type="text"
                  placeholder="Your name"
                  className="mt-2 w-full border-b border-ink/20 bg-transparent pb-2 text-sm text-ink placeholder:text-muted/60 focus:border-maroon focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="text-[0.65rem] uppercase tracking-[0.2em] text-muted">Email</span>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="mt-2 w-full border-b border-ink/20 bg-transparent pb-2 text-sm text-ink placeholder:text-muted/60 focus:border-maroon focus:outline-none"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-[0.65rem] uppercase tracking-[0.2em] text-muted">Subject</span>
              <input
                type="text"
                placeholder="What's on your mind?"
                className="mt-2 w-full border-b border-ink/20 bg-transparent pb-2 text-sm text-ink placeholder:text-muted/60 focus:border-maroon focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="text-[0.65rem] uppercase tracking-[0.2em] text-muted">Message</span>
              <textarea
                rows={4}
                placeholder="Tell us more..."
                className="mt-2 w-full resize-none border-b border-ink/20 bg-transparent pb-2 text-sm text-ink placeholder:text-muted/60 focus:border-maroon focus:outline-none"
              />
            </label>

            <button
              type="submit"
              className="bg-maroon px-10 py-4 text-xs uppercase tracking-[0.2em] text-cream transition-colors hover:bg-maroon-dark"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
