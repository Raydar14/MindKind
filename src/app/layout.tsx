import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "MindKind — a kinder inner language",
  description:
    "Translate hard thoughts and words into steady, kind self-talk. Grounded in ACT, NVC, self-compassion, and interoception.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink-950 bg-nebula bg-fixed">
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-5 pb-28 pt-8 sm:px-8">
          <header className="mb-10 flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-3">
              <span
                aria-hidden
                className="block h-8 w-8 rounded-full bg-gradient-to-br from-moss-400 via-dusk-400 to-petal-400 opacity-90 shadow-[0_0_40px_rgba(154,181,162,0.35)] transition group-hover:opacity-100"
              />
              <span className="font-serif text-lg tracking-wide text-sand-200">
                MindKind
              </span>
            </Link>
            <nav className="hidden gap-6 text-sm text-sand-300/80 sm:flex">
              <Link href="/reframe" className="hover:text-sand-200">
                Reframe
              </Link>
              <Link href="/dial" className="hover:text-sand-200">
                Dial
              </Link>
              <Link href="/log" className="hover:text-sand-200">
                Log
              </Link>
              <Link href="/pillars" className="hover:text-sand-200">
                Pillars
              </Link>
            </nav>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="mt-16 border-t border-white/5 pt-6 text-center">
            <p className="mx-auto max-w-xl font-serif text-sm italic leading-relaxed text-sand-300/70">
              You are not behind. You are building peace in real time. Quiet
              work is still real work. Gentle steps still carry you forward.
            </p>
          </footer>
        </div>

        <nav className="fixed inset-x-0 bottom-4 z-40 mx-auto flex w-[min(28rem,calc(100%-2rem))] items-center justify-between rounded-full border border-white/10 bg-ink-900/85 px-3 py-2 shadow-xl backdrop-blur-lg sm:hidden">
          <TabLink href="/" label="Home" />
          <TabLink href="/reframe" label="Reframe" />
          <TabLink href="/dial" label="Dial" />
          <TabLink href="/log" label="Log" />
        </nav>
      </body>
    </html>
  );
}

function TabLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex-1 rounded-full px-3 py-2 text-center text-xs font-medium text-sand-300/80 transition hover:bg-white/5 hover:text-sand-200"
    >
      {label}
    </Link>
  );
}
