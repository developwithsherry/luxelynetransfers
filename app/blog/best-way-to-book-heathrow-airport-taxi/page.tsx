import type { Metadata } from "next"
import Link from "next/link"
import Header from "@/components/header"
import { Footer } from "@/components/home/footer"
import WhatsAppContactButton from "@/components/home/whatsapp-button-fixed"
import { BreadcrumbSchema } from "@/components/seo/schema-markup"
import Image from "next/image"
import { List } from "lucide-react"

export const metadata: Metadata = {
  title: "Best Way to Book Heathrow Airport Taxi (2026 Guide)",
  description:
    "Compare Heathrow taxi options, black cabs, Uber, and pre-booked private hire. Learn the best way to book a Heathrow airport taxi for a stress-free, fixed-price ride.",
  alternates: {
    canonical: "https://luxelynetransfers.co.uk/blog/best-way-to-book-heathrow-airport-taxi",
  },
  openGraph: {
    type: "article",
    title: "Best Way to Book a Ride at Heathrow Airport (2026 Guide) | Luxelyne Transfers",
    description:
      "Compare London black cabs, Uber/Bolt rideshares, rail connections, and pre-booked private hire at Heathrow Terminals 2, 3, 4 & 5.",
    url: "https://luxelynetransfers.co.uk/blog/best-way-to-book-heathrow-airport-taxi",
    images: ["/blog_heathrow_taxi_guide.png"],
  },
}

export default function BlogAPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Best Way to Book a Ride at Heathrow Airport (2026 Guide)",
    "description":
      "Compare Heathrow taxi options, black cabs, Uber, and pre-booked private hire. Learn the best way to book Heathrow airport taxi for a stress-free ride.",
    "image": "https://luxelynetransfers.co.uk/blog_heathrow_taxi_guide.png",
    "datePublished": "2026-02-18T12:00:00Z",
    "dateModified": "2026-03-01T12:00:00Z",
    "author": {
      "@type": "Organization",
      "name": "Luxelyne Transfers LTD",
      "url": "https://luxelynetransfers.co.uk",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Luxelyne Transfers LTD",
      "logo": {
        "@type": "ImageObject",
        "url": "https://luxelynetransfers.co.uk/logo-main.png",
      },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://luxelynetransfers.co.uk/blog/best-way-to-book-heathrow-airport-taxi",
    },
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is it cheaper to book a taxi in advance at Heathrow?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, pre-booking a private hire transfer in advance is almost always cheaper than taking a metered black cab from the airport taxi rank. In addition to a lower rate, pre-booked private hire gives you a guaranteed fixed price agreed upon before flying, protecting you from unexpected traffic delays and surge pricing.",
        },
      },
      {
        "@type": "Question",
        "name": "Can I get a taxi at Heathrow without booking?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can take a London black cab from the designated taxi ranks outside all Heathrow terminal arrivals areas. However, these are metered and fares can rise significantly during peak traffic or bad weather. Rideshare apps like Uber also allow bookings on the spot, but you face potential wait times, short-stay car park walks, and surge pricing.",
        },
      },
      {
        "@type": "Question",
        "name": "What is the difference between a taxi and private hire at Heathrow?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Licensed London black cabs can be hailed on the street or taken directly from airport ranks without a reservation. Private hire vehicles (including executive transfer services like Luxelyne Transfers LTD) must be pre-booked in advance. Private hire operators offer fixed fares, customized vehicle sizes up to 8 seats, and terminal meet-and-greet services.",
        },
      },
      {
        "@type": "Question",
        "name": "How long does a Heathrow airport transfer take to Central London?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A road transfer between London Heathrow Airport (LHR) and Central London typically takes between 45 and 75 minutes, depending heavily on the time of day, traffic conditions, and your exact destination postcode.",
        },
      },
    ],
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://luxelynetransfers.co.uk" },
          { name: "Blog", url: "https://luxelynetransfers.co.uk/blog" },
          {
            name: "Best Way to Book a Ride at Heathrow Airport",
            url: "https://luxelynetransfers.co.uk/blog/best-way-to-book-heathrow-airport-taxi",
          },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />

      <main className="w-full bg-white text-neutral-900 selection:bg-lime-400 selection:text-black">
        {/* Premium Blended Hero Section */}
        <section className="relative overflow-hidden bg-neutral-950 text-white min-h-[500px] flex items-center border-b border-neutral-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(132,204,22,0.1),transparent_50%)] pointer-events-none" />

          <div className="container mx-auto px-4 max-w-7xl pt-32 pb-20 lg:py-28 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 text-left space-y-6">
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider text-lime-400">
                  <span className="px-3 py-1 rounded-full border border-lime-500/30 bg-lime-950/40">
                    Travel Guide
                  </span>
                  <span className="text-neutral-400 font-light">Published: February 2026</span>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight font-sans">
                  Best Way to Book a Ride at Heathrow Airport (2026 Guide)
                </h1>

                <p className="text-lg md:text-xl text-neutral-300 font-light leading-relaxed max-w-3xl">
                  Arriving at London Heathrow (LHR) can be overwhelming, with four active passenger terminals (T2, T3, T4, and T5) and hundreds of thousands of travellers passing through daily. Discovering the best way to book a Heathrow airport taxi is the key to ensuring your journey to Central London or surrounding regions is seamless, comfortable, and cost-effective.
                </p>
              </div>

              <div className="lg:col-span-5 relative w-full h-80 lg:h-[450px] min-h-[320px] rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 bg-neutral-900 group">
                <Image
                  src="/blog_heathrow_taxi_guide.png"
                  alt="The best way to book Heathrow airport taxi with premium private hire vehicles"
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-y-0 left-0 w-full lg:w-1/3 bg-gradient-to-r from-neutral-950 via-neutral-950/40 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-neutral-950 to-transparent lg:hidden pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* Blog Post Body Content */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="bg-neutral-50 border border-neutral-200/80 rounded-2xl p-6 mb-12 shadow-sm max-w-lg">
              <h2 className="text-base font-bold text-neutral-900 mb-4 font-sans flex items-center gap-2 tracking-wide uppercase text-xs">
                <List className="w-4 h-4 text-lime-600" />
                Table of Contents
              </h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#black-cab" className="text-neutral-600 hover:text-lime-700 font-medium hover:underline flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-500"></span>
                    1. The Black Cab Rank
                  </a>
                </li>
                <li>
                  <a href="#rideshare" className="text-neutral-600 hover:text-lime-700 font-medium hover:underline flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-500"></span>
                    2. Uber, Bolt, and FreeNow
                  </a>
                </li>
                <li>
                  <a href="#private-hire" className="text-neutral-600 hover:text-lime-700 font-medium hover:underline flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-500"></span>
                    3. Pre-Booked Private Hire
                  </a>
                </li>
                <li>
                  <a href="#public-transport" className="text-neutral-600 hover:text-lime-700 font-medium hover:underline flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-500"></span>
                    4. Public Transport Options
                  </a>
                </li>
                <li>
                  <a href="#comparison" className="text-neutral-600 hover:text-lime-700 font-medium hover:underline flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-500"></span>
                    Which Transport Method Should You Choose?
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-neutral-600 hover:text-lime-700 font-medium hover:underline flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-500"></span>
                    Frequently Asked Questions
                  </a>
                </li>
              </ul>
            </div>

            <div className="text-neutral-700 leading-relaxed font-light text-base md:text-lg space-y-8 font-sans">
              <p>
                When landing at London’s busiest hub, you have four real options to get to your final destination: queuing for a traditional London black cab, ordering an app-based rideshare like Uber or Bolt, pre-booking a private hire transfer service, or using public transport (the Elizabeth line, Heathrow Express, or national coaches). Each has its own distinct advantages and drawbacks. Choosing the right one depends on your budget, party size, luggage volume, and travel priorities.
              </p>

              <hr className="border-neutral-100" />

              <div id="black-cab" className="space-y-4 scroll-mt-24">
                <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 font-sans pt-4">
                  1. The Black Cab Rank
                </h2>
                <p>
                  London&apos;s iconic hackney carriages (black cabs) are readily available outside the arrivals halls of all active Heathrow terminals. You simply follow the overhead signs to the designated taxi rank and join the queue. There is no need to make any advance reservation, which offers immediate flexibility if you are unsure of your landing time or clearing customs.
                </p>
                <p>
                  However, black cabs operate on a regulated taximeter. This means the final price is determined by time and distance, leaving you highly vulnerable to London&apos;s notorious traffic delays on the M4 and A4.
                </p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li><strong>Rough Cost:</strong> £70 to £115+ to Central London, depending on traffic and time of day.</li>
                  <li><strong>Pros:</strong> No pre-booking required; knowledgeable local drivers; wheelchair accessible.</li>
                  <li><strong>Cons:</strong> Highly unpredictable pricing due to traffic; expensive; long queues during peak arrival waves.</li>
                </ul>
              </div>

              <div id="rideshare" className="space-y-4 scroll-mt-24">
                <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 font-sans pt-4">
                  2. Uber, Bolt, and FreeNow
                </h2>
                <p>
                  Ridesharing apps are popular for short city hops, but they operate under strict constraints at Heathrow Airport. Drivers cannot pick you up at the terminal doors. Instead, after booking on the app, you must walk to designated pickup bays located inside the multi-story terminal short-stay car parks. This walk can be confusing and exhausting when navigating with heavy luggage or young children.
                </p>
                <p>
                  Additionally, rideshare fares are subject to dynamic surge pricing. During periods of high demand, flight delays, or bad weather, prices can double or triple. You can <Link href="/blog/pre-booked-private-hire-vs-uber-heathrow" className="text-lime-600 font-semibold hover:underline">read our full comparison of pre-booked private hire vs Uber at Heathrow</Link> to understand these pickup differences in detail.
                </p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li><strong>Rough Cost:</strong> £45 to £95+ (higher during surge pricing).</li>
                  <li><strong>Pros:</strong> Booked via smartphone app; upfront estimate shown before requesting.</li>
                  <li><strong>Cons:</strong> No meet-and-greet service; long walks to car parks; surge pricing; risk of driver cancellations.</li>
                </ul>
              </div>

              <div id="private-hire" className="space-y-4 scroll-mt-24">
                <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 font-sans pt-4">
                  3. Pre-Booked Private Hire
                </h2>
                <p>
                  Pre-booking a <Link href="/heathrow-airport-transfers" className="text-lime-600 font-semibold hover:underline">Heathrow airport transfer</Link> with a dedicated UK operator like Luxelyne Transfers LTD (Company No. 16665396) provides a seamless, stress-free alternative. Unlike metered cabs, you lock in a transparent, fixed price at the time of booking. Whether your flight is delayed or you get stuck in heavy London traffic, your fare remains exactly the same.
                </p>
                <p>
                  Your driver monitors your flight in real time, includes 45 minutes of complimentary waiting time after landing, and enters the terminal arrivals hall holding a personalized name board right as you walk out. For travellers heading to or from East London, you can also explore how our <Link href="/blog/affordable-private-hire-ilford-east-london" className="text-lime-600 font-semibold hover:underline">affordable private hire in Ilford & East London</Link> saves you money on long-distance airport routes.
                </p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li><strong>Rough Cost:</strong> Competitive, transparent fixed rates tailored to your exact postcode and vehicle class.</li>
                  <li><strong>Pros:</strong> Meet and greet inside arrivals; live flight tracking + 45 mins free wait; fixed price guarantee; saloons, executive cars & 8-seater MPVs.</li>
                  <li><strong>Cons:</strong> Requires advance online or WhatsApp booking prior to travel.</li>
                </ul>
              </div>

              <div className="my-10 p-6 bg-lime-50/50 border-l-4 border-lime-500 rounded-r-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                <div className="space-y-1">
                  <h3 className="font-bold text-neutral-900 text-lg font-sans">Need a stress-free Heathrow airport transfer?</h3>
                  <p className="text-sm text-neutral-600 font-light">Get a fixed fare in under a minute with Luxelyne Transfers. No surge pricing, no delay charges.</p>
                </div>
                <Link href="/#book-now" className="inline-block px-6 py-3 bg-black hover:bg-neutral-900 text-white transition-colors rounded-xl font-bold text-sm text-center shadow-md whitespace-nowrap">
                  Calculate Fare
                </Link>
              </div>

              <div id="public-transport" className="space-y-4 scroll-mt-24">
                <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 font-sans pt-4">
                  4. Public Transport Options
                </h2>
                <p>
                  If you are traveling solo with light hand luggage, London&apos;s rail network is a fast option. The <a href="https://www.heathrow.com" target="_blank" rel="noopener noreferrer" className="text-lime-600 font-semibold hover:underline">Heathrow Express</a> connects you to Paddington Station in 15 minutes, while the Elizabeth line offers a direct rail link through Central London and out to East London.
                </p>
                <p>
                  However, public transport lacks door-to-door convenience. Navigating London Underground interchanges during peak hours with multiple suitcases or family members is physically demanding.
                </p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li><strong>Rough Cost:</strong> £12.80 (Elizabeth line) to £25 (Heathrow Express) per person, plus onward taxi to your hotel.</li>
                  <li><strong>Pros:</strong> Unaffected by road traffic; fast connection to Paddington or Liverpool Street.</li>
                  <li><strong>Cons:</strong> Not door-to-door; expensive for groups of 3+; inconvenient with heavy luggage or late-night arrivals.</li>
                </ul>
              </div>

              <hr className="border-neutral-100" />

              <div id="comparison" className="space-y-4 scroll-mt-24">
                <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 font-sans pt-4">
                  Which Transport Method Should You Choose?
                </h2>
                <p>
                  Here is an at-a-glance comparison based on common traveler profiles arriving at London Heathrow:
                </p>

                <div className="overflow-x-auto border border-neutral-200 rounded-2xl shadow-sm">
                  <table className="min-w-full divide-y divide-neutral-200 text-left text-sm">
                    <thead className="bg-neutral-50 text-neutral-900 font-semibold">
                      <tr>
                        <th className="px-6 py-4 font-sans text-xs uppercase tracking-wider text-neutral-500">Traveler Profile</th>
                        <th className="px-6 py-4 font-sans text-xs uppercase tracking-wider text-neutral-500">Best Option</th>
                        <th className="px-6 py-4 font-sans text-xs uppercase tracking-wider text-neutral-500">Key Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 text-neutral-600">
                      <tr>
                        <td className="px-6 py-4 font-medium text-neutral-900">Solo traveler with hand luggage</td>
                        <td className="px-6 py-4">Elizabeth Line / Train</td>
                        <td className="px-6 py-4">Fastest and cheapest way to reach a central station.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-neutral-900">Family or group with suitcases</td>
                        <td className="px-6 py-4">Pre-booked Private Hire</td>
                        <td className="px-6 py-4">Door-to-door ease, fixed fare, 8-seater MPVs & child seats.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-neutral-900">First-time visitors & business executives</td>
                        <td className="px-6 py-4">Pre-booked Private Hire</td>
                        <td className="px-6 py-4">Complimentary meet & greet inside the arrivals hall.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-neutral-900">Early morning / Late night flights</td>
                        <td className="px-6 py-4">Pre-booked Private Hire</td>
                        <td className="px-6 py-4">24/7 guaranteed pickup with automatic flight delay tracking.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <hr className="border-neutral-100" />

              <div id="faq" className="space-y-6 scroll-mt-24">
                <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 font-sans pt-4">
                  Frequently Asked Questions
                </h2>

                <div className="space-y-4">
                  <details className="group border border-neutral-200 rounded-xl bg-neutral-50/50 p-6 [&_summary::-webkit-details-marker]:hidden transition-all duration-300" open>
                    <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-neutral-900 font-bold text-base md:text-lg font-sans">
                      <span>Is it cheaper to book a taxi in advance at Heathrow?</span>
                      <span className="transition-transform duration-300 group-open:-rotate-180 text-lime-600">▼</span>
                    </summary>
                    <p className="mt-4 text-sm md:text-base leading-relaxed text-neutral-600">
                      Yes, pre-booking a private hire transfer in advance is almost always cheaper than taking a metered black cab from the airport taxi rank. In addition to a lower rate, pre-booked private hire gives you a guaranteed fixed price agreed upon before flying, protecting you from unexpected traffic delays and surge pricing.
                    </p>
                  </details>

                  <details className="group border border-neutral-200 rounded-xl bg-neutral-50/50 p-6 [&_summary::-webkit-details-marker]:hidden transition-all duration-300">
                    <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-neutral-900 font-bold text-base md:text-lg font-sans">
                      <span>Can I get a taxi at Heathrow without booking?</span>
                      <span className="transition-transform duration-300 group-open:-rotate-180 text-lime-600">▼</span>
                    </summary>
                    <p className="mt-4 text-sm md:text-base leading-relaxed text-neutral-600">
                      Yes, you can take a London black cab from the designated taxi ranks outside all Heathrow terminal arrivals areas. However, these are metered and fares can rise significantly during peak traffic or bad weather. Rideshare apps like Uber also allow bookings on the spot, but you face potential wait times, car park walks, and surge pricing.
                    </p>
                  </details>

                  <details className="group border border-neutral-200 rounded-xl bg-neutral-50/50 p-6 [&_summary::-webkit-details-marker]:hidden transition-all duration-300">
                    <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-neutral-900 font-bold text-base md:text-lg font-sans">
                      <span>What is the difference between a taxi and private hire at Heathrow?</span>
                      <span className="transition-transform duration-300 group-open:-rotate-180 text-lime-600">▼</span>
                    </summary>
                    <p className="mt-4 text-sm md:text-base leading-relaxed text-neutral-600">
                      Licensed London black cabs can be hailed on the street or taken directly from airport ranks without a reservation. Private hire vehicles (including executive transfer services like Luxelyne Transfers LTD) must be pre-booked in advance. Private hire operators offer fixed fares, customized vehicle sizes up to 8 seats, and terminal meet-and-greet services.
                    </p>
                  </details>

                  <details className="group border border-neutral-200 rounded-xl bg-neutral-50/50 p-6 [&_summary::-webkit-details-marker]:hidden transition-all duration-300">
                    <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-neutral-900 font-bold text-base md:text-lg font-sans">
                      <span>How long does a Heathrow airport transfer take to Central London?</span>
                      <span className="transition-transform duration-300 group-open:-rotate-180 text-lime-600">▼</span>
                    </summary>
                    <p className="mt-4 text-sm md:text-base leading-relaxed text-neutral-600">
                      A road transfer between London Heathrow Airport (LHR) and Central London typically takes between 45 and 75 minutes, depending heavily on the time of day, traffic conditions, and your exact destination postcode.
                    </p>
                  </details>
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-8 space-y-4">
                <h3 className="text-lg font-bold text-neutral-950 font-sans">Related Reading</h3>
                <ul className="grid md:grid-cols-2 gap-4">
                  <li className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 hover:border-lime-500 transition-colors">
                    <Link href="/blog/pre-booked-private-hire-vs-uber-heathrow" className="font-semibold text-neutral-900 hover:text-lime-650 text-sm">
                      Why Choose a Pre-Booked Private Hire Over Uber at Heathrow?
                    </Link>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      Compare pickup locations, surge pricing, cancellations, and vehicle space.
                    </p>
                  </li>
                  <li className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 hover:border-lime-500 transition-colors">
                    <Link href="/blog/affordable-private-hire-ilford-east-london" className="font-semibold text-neutral-900 hover:text-lime-650 text-sm">
                      Affordable Private Hire in Ilford & East London
                    </Link>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      Get premium door-to-door airport transfer rates in Ilford and Redbridge.
                    </p>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-lime-400 to-lime-500 p-8 rounded-2xl text-black space-y-6 shadow-lg mt-8">
                <div className="space-y-2 text-center md:text-left">
                  <h3 className="text-2xl font-black tracking-tight font-sans">
                    Book your fixed-price Heathrow transfer now
                  </h3>
                  <p className="text-sm font-medium opacity-90 max-w-xl">
                    Avoid Uber surge pricing and parking surprises. Lock in your fixed-fare private hire transfer today for complete peace of mind.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-black/10 pt-6">
                  <Link
                    href="/#book-now"
                    className="w-full sm:w-auto text-center px-6 py-3.5 bg-black text-white hover:bg-neutral-900 transition-colors rounded-xl font-bold text-sm shadow-md"
                  >
                    Get Instant Price Quote
                  </Link>

                  <div className="flex flex-col text-center sm:text-right">
                    <span className="text-xs font-semibold uppercase tracking-wider text-black/75">Or coordinate via WhatsApp</span>
                    <a
                      href="https://wa.me/447460019129"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-black hover:underline text-black flex items-center gap-1.5 justify-center sm:justify-end"
                    >
                      +44 7460 019129
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <WhatsAppContactButton />
      <Footer />
    </>
  )
}
