import Link from "next/link"
import Image from "next/image"

export function DriverCTASection() {
  return (
    <section className="py-16 md:py-24 bg-background border-t border-border">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-neutral-950 text-white border border-neutral-800 px-6 py-12 sm:px-10 md:px-14 md:py-16 shadow-xl">
          {/* Subtle lime glow */}
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-accent/15 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-5 text-left">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-semibold tracking-wide uppercase">
                Drive With Luxelyne
              </span>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-white">
                Are You a Driver Looking for{" "}
                <span className="text-accent">Bookings?</span> Apply With Us
              </h2>

              <p className="text-neutral-300 text-base md:text-lg leading-relaxed max-w-2xl">
                Receive steady, pre-booked airport transfers across Heathrow, Gatwick, Stansted, Luton, London City &amp; Southend. We welcome owner-drivers with{" "}
                <span className="text-white font-medium">
                  Saloon, Estate, People Carrier, Minibus, Executive Minibus &amp; Executive Saloon
                </span>{" "}
                vehicles.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/apply-as-driver"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-accent text-accent-foreground font-bold hover:bg-accent/90 hover:scale-105 transition-all duration-300 shadow-md text-sm"
                >
                  <span>Apply as a Driver</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Right Image Card */}
            <div className="lg:col-span-4 hidden lg:block">
              <div className="relative h-60 w-full rounded-2xl overflow-hidden border border-neutral-800 shadow-lg">
                <Image
                  src="/cab1.jpg"
                  alt="Apply as a Driver with Luxelyne Transfers"
                  fill
                  sizes="400px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

