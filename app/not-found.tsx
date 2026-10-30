import Link from "next/link"
import Header from "@/components/header"
import { Footer } from "@/components/home/footer"

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-4 py-28">
        <div className="max-w-2xl w-full text-center space-y-6">
          <span className="inline-block px-3 py-1 rounded-full border border-lime-500/30 bg-lime-500/10 text-lime-400 text-xs font-semibold uppercase tracking-wider">
            404 — Page Not Found
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Looking for a London Airport Transfer?
          </h1>
          <p className="text-neutral-400 text-base md:text-lg leading-relaxed">
            The page you requested could not be found, but you can calculate an instant fixed-price quote or explore our 24/7 UK airport transfer pages below.
          </p>

          <div className="pt-2">
            <Link
              href="/#book-now"
              className="inline-flex items-center justify-center bg-accent text-accent-foreground font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-accent/90 transition-all text-sm uppercase tracking-wider"
            >
              Get Instant Fare Quote
            </Link>
          </div>

          <div className="pt-6 border-t border-neutral-800 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-semibold">
            <Link href="/heathrow-airport-transfers" className="p-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white">
              Heathrow (LHR)
            </Link>
            <Link href="/gatwick-airport-transfers" className="p-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white">
              Gatwick (LGW)
            </Link>
            <Link href="/stansted-airport-transfers" className="p-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white">
              Stansted (STN)
            </Link>
            <Link href="/luton-airport-transfers" className="p-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white">
              Luton (LTN)
            </Link>
            <Link href="/london-city-airport-transfers" className="p-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white">
              London City (LCY)
            </Link>
            <Link href="/southend-airport-transfers" className="p-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white">
              Southend (SEN)
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

