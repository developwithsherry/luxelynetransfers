"use client"

export default function AboutSection() {
  return (
    <section className="lg:py-24 py-12 bg-white text-neutral-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Side Label */}
        <div className="flex items-center gap-3 min-w-[280px]">
          <img src="/logo_lime.png" alt="Luxelyne Transfers LTD Logo" className="w-16 h-16" width={64} height={64} />
          <div>
            <h2 className="text-accent text-2xl font-bold tracking-tight">About Luxelyne</h2>
            <p className="text-xs text-neutral-500 font-medium">Licensed PHV Operator • Co. No. 16665396</p>
          </div>
        </div>

        {/* Right Side Text */}
        <div className="lg:text-lg text-base leading-relaxed max-w-5xl space-y-6 text-neutral-600 font-light">
          <p className="text-neutral-900 font-normal text-xl leading-snug">
            Luxelyne Transfers LTD (Registered in England & Wales under Company Number <strong>16665396</strong>) is a fully licensed private hire operator specializing in dedicated airport transfers and long-distance intercity travel across London and the United Kingdom.
          </p>
          <p>
            Operating from our dispatch headquarters at 58 Peregrine Rd, Ilford, IG6 3SZ, we manage pre-booked private hire journeys 24 hours a day, 365 days a year. Our core specialism covers direct door-to-door transfers across all major UK airports—including <strong>Heathrow (LHR)</strong>, <strong>Gatwick (LGW)</strong>, <strong>Stansted (STN)</strong>, <strong>Luton (LTN)</strong>, <strong>London City (LCY)</strong>, and <strong>London Southend (SEN)</strong>—alongside bespoke <strong>long-distance private hire runs</strong> connecting London with major UK cities, seaports, universities, and business hubs.
          </p>
          <p>
            Unlike ride-hailing apps or third-party brokers, we operate directly as a licensed private hire operator with full regulatory accountability. Every booking is pre-scheduled, logged, and assigned to a fully licensed, enhanced DBS-checked private hire driver in a PHV-inspected vehicle—giving corporate travelers, families, and international visitors guaranteed fixed fares with zero surge pricing.
          </p>
        </div>
      </div>
    </section>
  )
}
