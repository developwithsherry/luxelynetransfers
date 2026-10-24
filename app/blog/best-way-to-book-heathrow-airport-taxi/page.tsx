import type { Metadata } from "next"
import Header from "@/components/header"
import { Footer } from "@/components/home/footer"
import WhatsAppContactButton from "@/components/home/whatsapp-button-fixed"
import Image from "next/image"
import { List } from "lucide-react"

export const metadata: Metadata = {
  title: "Best Way to Book Heathrow Airport Taxi (2026 Guide)",
  description: "Compare Heathrow taxi options, black cabs, Uber, and pre-booked private hire. Learn the best way to book Heathrow airport taxi for a stress-free ride.",
  alternates: {
    canonical: "https://luxelynetransfers.co.uk/blog/best-way-to-book-heathrow-airport-taxi",
  },
}

export default function BlogAPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Best Way to Book a Ride at Heathrow Airport (2026 Guide)",
    "description": "Compare Heathrow taxi options, black cabs, Uber, and pre-booked private hire. Learn the best way to book Heathrow airport taxi for a stress-free ride.",
    "image": "https://luxelynetransfers.co.uk/blog_heathrow_taxi_guide.png",
    "datePublished": "2026-07-16T12:00:00Z",
    "dateModified": "2026-07-16T12:00:00Z",
    "author": {
      "@type": "Organization",
      "name": "Luxelyne Transfers LTD",
      "url": "https://luxelynetransfers.co.uk"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Luxelyne Transfers LTD",
      "logo": {
        "@type": "ImageObject",
        "url": "https://luxelynetransfers.co.uk/logo-main.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://luxelynetransfers.co.uk/blog/best-way-to-book-heathrow-airport-taxi"
    }
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
          "text": "Yes, pre-booking a private hire transfer in advance is almost always cheaper than taking a metered black cab from the airport taxi rank. In addition to a lower rate, pre-booked private hire gives you a guaranteed fixed price agreed upon before flying, protecting you from unexpected traffic delays and surge pricing."
        }
      },
      {
        "@type": "Question",
        "name": "Can I get a taxi at Heathrow without booking?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, you can take a London black cab from the designated taxi ranks outside all Heathrow terminal arrivals areas. However, these are metered and fares can rise significantly during peak traffic or bad weather. Rideshare apps like Uber also allow bookings on the spot, but you face potential wait times, airport pickup terminal navigation, and surge pricing."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between a taxi and private hire at Heathrow?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Licensed London black cabs can be hailed on the street or taken directly from airport ranks without a reservation. Private hire vehicles (including minicabs and luxury transfer services like Luxelyne Transfers) must be pre-booked in advance through a licensed operator. Private hire operators can offer fixed fares, customized vehicle sizes, and meet-and-greet services."
        }
      },
      {
        "@type": "Question",
        "name": "How long does a Heathrow airport transfer take to Central London?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A road transfer between London Heathrow Airport (LHR) and Central London typically takes between 45 and 75 minutes, depending heavily on the time of day, traffic conditions, and your exact destination postcode."
        }
      }
    ]
  }

  return (
    <>
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
          {/* Subtle ambient light overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(132,204,22,0.1),transparent_50%)] pointer-events-none" />

          <div className="container mx-auto px-4 max-w-7xl pt-32 pb-20 lg:py-28 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Post Details */}
              <div className="lg:col-span-7 text-left space-y-6">
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider text-lime-400">
                  <span className="px-3 py-1 rounded-full border border-lime-500/30 bg-lime-950/40">
                    Travel Guide
                  </span>
                  <span className="text-neutral-400 font-light">Last Updated: July 2026</span>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight font-sans">
                  Best Way to Book a Ride at Heathrow Airport (2026 Guide)
                </h1>

                <p className="text-lg md:text-xl text-neutral-300 font-light leading-relaxed max-w-3xl">
                  Arriving at London Heathrow (LHR) can be overwhelming, with five busy terminals and hundreds of thousands of passengers passing through daily. Discovering the best way to book Heathrow airport taxi is the key to ensuring your journey to Central London or surrounding regions is seamless, comfortable, and cost-effective.
                </p>
              </div>

              {/* Right Column: Image with Gradient Blending */}
              <div className="lg:col-span-5 relative w-full h-80 lg:h-[450px] min-h-[320px] rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 bg-neutral-900 group">
                <Image
                  src="/blog_heathrow_taxi_guide.png"
                  alt="The best way to book Heathrow airport taxi with premium private hire vehicles"
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                
                {/* Blending Gradients */}
                {/* Left blending mask for desktop */}
                <div className="absolute inset-y-0 left-0 w-full lg:w-1/3 bg-gradient-to-r from-neutral-950 via-neutral-950/40 to-transparent pointer-events-none" />
                {/* Bottom blending mask for mobile */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-neutral-950 to-transparent lg:hidden pointer-events-none" />
              </div>

            </div>
          </div>
        </section>

        {/* Blog Post Body Content */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            
            {/* Table of Contents Container */}
            <div className="bg-neutral-50 border border-neutral-200/80 rounded-2xl p-6 mb-12 shadow-sm max-w-lg">
              <h3 className="text-base font-bold text-neutral-900 mb-4 font-sans flex items-center gap-2 tracking-wide uppercase text-xs">
                <List className="w-4 h-4 text-lime-600" />
                Table of Contents
              </h3>
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

            {/* Prose Content */}
            <div className="text-neutral-700 leading-relaxed font-light text-base md:text-lg space-y-8 font-sans">
              
              <p>
                When landing at London’s busiest hub, you have four real options to get to your final destination: queuing for a traditional London black cab, ordering an app-based rideshare like Uber or Bolt, pre-booking a private hire transfer service, or using public transport (the Elizabeth line, Heathrow Express, or national coaches). Each has its own distinct advantages and drawbacks. Choosing the right one depends on your budget, party size, luggage volume, and travel priorities.
              </p>

              <hr className="border-neutral-100" />

              {/* Option 1 */}
              <div id="black-cab" className="space-y-4 scroll-mt-24">
                <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 font-sans pt-4">
                  1. The Black Cab Rank
                </h2>
                <p>
                  London's iconic hackney carriages (black cabs) are readily available outside the arrivals halls of all active Heathrow terminals. You simply follow the overhead signs to the designated taxi rank and join the queue. There is no need to make any advance reservation, which offers immediate flexibility if you are unsure of your landing time or clearing customs.
                </p>
                <p>
                  However, black cabs operate on a taximeter regulated by <a href="https://tfl.gov.uk" target="_blank" rel="noopener noreferrer" className="text-lime-600 font-semibold hover:underline">Transport for London (TfL)</a>. This means the final price is determined by time and distance, leaving you highly vulnerable to London's notorious traffic delays.
                </p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li><strong>Rough Cost:</strong> £70 to £110+ to Central London, depending on traffic and time of day.</li>
                  <li><strong>Pros:</strong> No pre-booking required; fully licensed, knowledgeable local drivers; wheelchair accessible.</li>
                  <li><strong>Cons:</strong> Highly unpredictable pricing due to traffic; expensive; long queues during peak arrival waves.</li>
                </ul>
              </div>

              {/* Option 2 */}
              <div id="rideshare" className="space-y-4 scroll-mt-24">
                <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 font-sans pt-4">
                  2. Uber, Bolt, and FreeNow
                </h2>
                <p>
                  Ridesharing apps are incredibly popular, but they operate under strict constraints at Heathrow Airport. Drivers cannot pick you up at the terminal doors. Instead, after booking on the app, you must walk to designated parking bays—often located in the multi-story terminal car parks or the Authorised Vehicle Area (AVA). This walk can be challenging, confusing, and uncomfortable when navigating with heavy luggage or small children.
                </p>
                <p>
                  Additionally, rideshare fares are subject to dynamic surge pricing. During periods of high demand, flight delays, or bad weather, prices can double or triple. If you are comparing private transport options, you can <a href="/blog/pre-booked-private-hire-vs-uber-heathrow" className="text-lime-600 font-semibold hover:underline">read our full comparison of pre-booked private hire vs Uber</a> to understand these pickup differences in detail.
                </p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li><strong>Rough Cost:</strong> £45 to £85+ (higher during surge pricing).</li>
                  <li><strong>Pros:</strong> Conveniently booked via smartphone; transparent pricing shown in the app before booking.</li>
                  <li><strong>Cons:</strong> No meet-and-greet service; long walks to car parks; surge pricing; risk of driver cancellations.</li>
                </ul>
              </div>

              {/* Option 3 */}
              <div id="private-hire" className="space-y-4 scroll-mt-24">
                <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 font-sans pt-4">
                  3. Pre-Booked Private Hire
                </h2>
                <p>
                  Pre-booking a <a href="/heathrow-airport-transfers" className="text-lime-600 font-semibold hover:underline">Heathrow airport transfer</a> with a specialized service like Luxelyne Transfers provides a seamless, stress-free alternative. Unlike metered cabs, you lock in a transparent, fixed price at the time of booking. Whether your flight is delayed or you get stuck in heavy London traffic, your price remains exactly the same.
                </p>
                <p>
                  Your driver monitors your flight in real time and enters the terminal arrivals hall holding a customized name board right as you walk out. The service is highly professional and personal. For localized or budget-friendly options starting or ending in East London, you can also explore how <a href="/blog/affordable-private-hire-ilford-east-london" className="text-lime-600 font-semibold hover:underline">affordable private hire Ilford</a> services can save you money on long-distance airport routes.
                </p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li><strong>Rough Cost:</strong> Competitive, transparent fixed rates starting from £55+ depending on location.</li>
                  <li><strong>Pros:</strong> Meet and greet in arrivals; flight tracking included; fixed price guarantee; premium clean vehicles.</li>
                  <li><strong>Cons:</strong> Requires advance booking (ideally 12-24 hours prior to travel).</li>
                </ul>
              </div>

              {/* Contextual Mid-Post CTA */}
              <div className="my-10 p-6 bg-lime-50/50 border-l-4 border-lime-500 rounded-r-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                <div className="space-y-1">
                  <h4 className="font-bold text-neutral-900 text-lg font-sans">Need a stress-free Heathrow airport transfer?</h4>
                  <p className="text-sm text-neutral-600 font-light">Get a fixed fare in under a minute with Luxelyne Transfers. No surge pricing, no delays billing.</p>
                </div>
                <a href="/#book-now" className="inline-block px-6 py-3 bg-black hover:bg-neutral-900 text-white transition-colors rounded-xl font-bold text-sm text-center shadow-md whitespace-nowrap">
                  Calculate Fare
                </a>
              </div>

              {/* Option 4 */}
              <div id="public-transport" className="space-y-4 scroll-mt-24">
                <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 font-sans pt-4">
                  4. Public Transport Options
                </h2>
                <p>
                  If you are traveling solo with light hand luggage, London's rail network is a fast and efficient option. The <a href="https://www.heathrow.com" target="_blank" rel="noopener noreferrer" className="text-lime-600 font-semibold hover:underline">Heathrow Express</a> connects you directly to Paddington Station in 15 minutes, while the Elizabeth line offers a more economical transit through Central London and out to East London.
                </p>
                <p>
                  However, public transport lacks door-to-door convenience. Navigating London Underground stairs or platforms during peak hours with multiple suitcases is physically demanding and stressful.
                </p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li><strong>Rough Cost:</strong> £12.20 (Elizabeth line) to £25 (Heathrow Express) per person.</li>
                  <li><strong>Pros:</strong> Unaffected by road traffic; very fast connection to central transport hubs.</li>
                  <li><strong>Cons:</strong> No door-to-door transit; inconvenient for groups or heavy luggage; restricted operating hours at night.</li>
                </ul>
              </div>

              <hr className="border-neutral-100" />

              {/* Comparison Table */}
              <div id="comparison" className="space-y-4 scroll-mt-24">
                <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 font-sans pt-4">
                  Which Transport Method Should You Choose?
                </h2>
                <p>
                  To help you make the best decision for your upcoming London journey, here is an at-a-glance comparison based on common traveler profiles:
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
                        <td className="px-6 py-4">Fastest and cheapest way to bypass road traffic.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-neutral-900">Family traveling with multiple bags</td>
                        <td className="px-6 py-4">Pre-booked Private Hire</td>
                        <td className="px-6 py-4">Door-to-door ease, fixed fare, and pre-installed child seats.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-neutral-900">First-time visitors to London</td>
                        <td className="px-6 py-4">Pre-booked Private Hire</td>
                        <td className="px-6 py-4">Complimentary meet & greet inside the arrival hall. No app-juggling.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-neutral-900">Early morning / Late night arrivals</td>
                        <td className="px-6 py-4">Pre-booked Private Hire</td>
                        <td className="px-6 py-4">24/7 availability guaranteed, avoiding night public transport limits.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <hr className="border-neutral-100" />

              {/* FAQ Accordion */}
              <div id="faq" className="space-y-6 scroll-mt-24">
                <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 font-sans pt-4">
                  Frequently Asked Questions
                </h2>

                <div className="space-y-4">
                  <details className="group border border-neutral-200 rounded-xl bg-neutral-50/50 p-6 [&_summary::-webkit-details-marker]:hidden transition-all duration-300">
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
                      Yes, you can take a London black cab from the designated taxi ranks outside all Heathrow terminal arrivals areas. However, these are metered and fares can rise significantly during peak traffic or bad weather. Rideshare apps like Uber also allow bookings on the spot, but you face potential wait times, airport pickup terminal navigation, and surge pricing.
                    </p>
                  </details>

                  <details className="group border border-neutral-200 rounded-xl bg-neutral-50/50 p-6 [&_summary::-webkit-details-marker]:hidden transition-all duration-300">
                    <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-neutral-900 font-bold text-base md:text-lg font-sans">
                      <span>What is the difference between a taxi and private hire at Heathrow?</span>
                      <span className="transition-transform duration-300 group-open:-rotate-180 text-lime-600">▼</span>
                    </summary>
                    <p className="mt-4 text-sm md:text-base leading-relaxed text-neutral-600">
                      Licensed London black cabs can be hailed on the street or taken directly from airport ranks without a reservation. Private hire vehicles (including minicabs and luxury transfer services like Luxelyne Transfers) must be pre-booked in advance through a licensed operator. Private hire operators can offer fixed fares, customized vehicle sizes, and meet-and-greet services.
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

              {/* Related Reading */}
              <div className="border-t border-neutral-200 pt-8 space-y-4">
                <h3 className="text-lg font-bold text-neutral-950 font-sans">Related Reading</h3>
                <ul className="grid md:grid-cols-2 gap-4">
                  <li className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 hover:border-lime-500 transition-colors">
                    <a href="/blog/pre-booked-private-hire-vs-uber-heathrow" className="font-semibold text-neutral-900 hover:text-lime-650 text-sm">
                      Why Choose a Pre-Booked Private Hire Over Uber at Heathrow?
                    </a>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      Compare pickup locations, surge pricing, cancellations, and vehicle space.
                    </p>
                  </li>
                  <li className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 hover:border-lime-500 transition-colors">
                    <a href="/blog/affordable-private-hire-ilford-east-london" className="font-semibold text-neutral-900 hover:text-lime-650 text-sm">
                      Affordable Private Hire in Ilford & East London
                    </a>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      Get premium door-to-door airport transfer rates in Ilford and Redbridge.
                    </p>
                  </li>
                </ul>
              </div>

              {/* Strong End of Post CTA */}
              <div className="bg-gradient-to-r from-lime-400 to-lime-500 p-8 rounded-2xl text-black space-y-6 shadow-lg mt-8">
                <div className="space-y-2 text-center md:text-left">
                  <h3 className="text-2xl font-black tracking-tight font-sans">
                    Book your fixed-price Heathrow transfer now
                  </h3>
                  <p className="text-sm font-medium opacity-90 max-w-xl">
                    Avoid Uber surge pricing and parking surprises. Lock in your premium, fully licensed private hire fare today for peace of mind.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-black/10 pt-6">
                  <a
                    href="/#book-now"
                    className="w-full sm:w-auto text-center px-6 py-3.5 bg-black text-white hover:bg-neutral-900 transition-colors rounded-xl font-bold text-sm shadow-md animate-pulse"
                  >
                    Get Instant Price Quote
                  </a>

                  <div className="flex flex-col text-center sm:text-right">
                    <span className="text-xs font-semibold uppercase tracking-wider text-black/75">Or coordinate via WhatsApp</span>
                    <a
                      href="https://wa.me/447640019129"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-black hover:underline text-black flex items-center gap-1.5 justify-center sm:justify-end"
                    >
                      +44 7640 019129
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
