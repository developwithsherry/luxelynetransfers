"use client"

import FeatureCards from "./feature-cards"

export default function AboutSection() {
  return (
    <section className="lg:py-24 py-12 bg-white text-neutral-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Side Label */}
        <div className="flex items-center gap-3 min-w-[280px]">
          <img src="/logo_lime.png" alt="Luxelyne Logo" className="w-16 h-16" />
          <h2 className="text-accent text-2xl font-bold tracking-tight">About Luxelyne</h2>
        </div>

        {/* Right Side Text */}
        <div className="lg:text-lg text-base leading-relaxed max-w-5xl space-y-6 text-neutral-600 font-light">
          <p className="text-neutral-900 font-normal text-xl leading-snug">
            Luxelyne Transfers LTD is a premier, UK-registered private hire and taxi supplier dedicated to redefining ground transportation with safety, comfort, and unmatched reliability. 
          </p>
          <p>
            Specializing in direct passenger airport transfers and private hire services, we provide seamless transport to and from all major London airports, including <strong>Heathrow (LHR)</strong>, <strong>Gatwick (LGW)</strong>, <strong>Stansted (STN)</strong>, <strong>Luton (LTN)</strong>, and <strong>London City (LCY)</strong>. Our passenger-first philosophy guarantees flat-rate pricing, absolute transparency, and professional meet and greet experiences.
          </p>
          <p>
            We operate fully licensed, clean, and modern vehicles compliant with Transport for London (TfL) and DVLA standards. Backed by real-time flight tracking technology and local, DBS-checked drivers, we make sure you reach your destination safely and on schedule, every time.
          </p>
          
          <div className="pt-8">
            <FeatureCards />
          </div>
        </div>

      </div>
    </section>
  )
}
