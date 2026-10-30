"use client"

import FeatureCards from "./feature-cards"

export default function AboutSection() {
  return (
    <section className="lg:py-24 py-12 bg-white text-neutral-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Side Label */}
        <div className="flex items-center gap-3 min-w-[280px]">
          <img src="/logo_lime.png" alt="Luxelyne Transfers LTD Logo" className="w-16 h-16" width={64} height={64} />
          <div>
            <h2 className="text-accent text-2xl font-bold tracking-tight">About Luxelyne</h2>
            <p className="text-xs text-neutral-500 font-medium">Company No. 16665396</p>
          </div>
        </div>

        {/* Right Side Text */}
        <div className="lg:text-lg text-base leading-relaxed max-w-5xl space-y-6 text-neutral-600 font-light">
          <p className="text-neutral-900 font-normal text-xl leading-snug">
            Luxelyne Transfers LTD (Registered in England & Wales under Company Number <strong>16665396</strong>) is a premier UK private hire and airport transfer supplier dedicated to redefining ground transportation with safety, comfort, and 24/7 reliability.
          </p>
          <p>
            Headquartered at 58 Peregrine Rd, Ilford, IG6 3SZ, we specialize in direct door-to-door airport transfers and private hire journeys across Greater London and all major airports, including <strong>Heathrow (LHR)</strong>, <strong>Gatwick (LGW)</strong>, <strong>Stansted (STN)</strong>, <strong>Luton (LTN)</strong>, <strong>London City (LCY)</strong>, and <strong>London Southend (SEN)</strong>. Our passenger-first philosophy guarantees fixed-rate pricing, complete transparency, and complimentary terminal meet and greet experiences.
          </p>
          <p>
            We partner exclusively with fully licensed, vetted operators and clean, modern vehicles compliant with UK local authority and DVLA safety standards. Backed by real-time flight tracking technology and experienced, DBS-checked drivers, we make sure you reach your destination safely and on schedule, every time.
          </p>

          <div className="pt-8">
            <FeatureCards />
          </div>
        </div>
      </div>
    </section>
  )
}
