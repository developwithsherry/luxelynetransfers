import type { Metadata } from "next"
import Image from "next/image"
import Script from "next/script"
import Header from "@/components/header"
import { Footer } from "@/components/home/footer"
import { BreadcrumbSchema } from "@/components/seo/schema-markup"
import { DriverApplyForm } from "@/components/driver-apply/driver-apply-form"
import { Check, Phone } from "lucide-react"

export const metadata: Metadata = {
  title: "Apply as Driver | London Airport Transfer & Private Hire Driver Jobs",
  description:
    "Drive with Luxelyne Transfers. Pre-booked London airport transfers across Heathrow, Gatwick, Stansted, Luton, London City & Southend for Saloon, Estate, People Carrier, Minibus, Executive Minibus & Executive Saloon owner-drivers.",
  keywords: [
    "Apply as Driver London",
    "Private Hire Driver Jobs London",
    "Owner Driver Jobs Heathrow Gatwick",
    "Airport Transfer Driver Jobs UK",
    "Chauffeur Jobs London",
    "Minibus Driver Jobs London",
    "Executive Saloon Driver Work London",
    "Luxelyne Transfers Driver Application",
  ],
  alternates: {
    canonical: "https://luxelynetransfers.co.uk/apply-as-driver",
  },
  openGraph: {
    title: "Drive with Luxelyne Transfers | London Airport & Private Hire Driver Work",
    description:
      "Apply online in under a minute. Steady pre-booked airport transfers across Heathrow, Gatwick, Stansted, Luton, London City, Southend, and Greater London.",
    url: "https://luxelynetransfers.co.uk/apply-as-driver",
    images: ["/og-image.png"],
  },
}

const DRIVER_FAQS = [
  {
    question: "Which vehicles do you take on?",
    answer:
      "We work with owner-drivers across six categories: Saloon, Estate, People Carrier, Minibus, Executive Minibus (such as Mercedes V-Class), and Executive Saloon (such as Mercedes E-Class or BMW 5 Series).",
  },
  {
    question: "What kind of jobs will I be offered?",
    answer:
      "Almost all of our work is pre-booked airport transfers to and from Heathrow, Gatwick, Stansted, Luton, London City, and Southend, alongside hotel pickups and long-distance UK runs.",
  },
  {
    question: "Do I have to work fixed shifts?",
    answer:
      "No. You tell us when you're available and which areas or airports suit you best. Whether you want full-time airport runs or extra jobs around your existing schedule, our controllers allocate work that fits your routine.",
  },
  {
    question: "What happens after I send the form?",
    answer:
      "One of our dispatch team members will give you a ring or message you on WhatsApp to have a quick chat, check your paperwork, and get you added to our driver roster.",
  },
]

export default function ApplyAsDriverPage() {
  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title:
      "Owner Driver — Airport Transfers & Private Hire (Saloon, Estate, MPV, Minibus & Executive)",
    description:
      "Luxelyne Transfers is recruiting owner-drivers with Saloon, Estate, People Carrier, Minibus, Executive Minibus, or Executive Saloon vehicles for pre-booked London airport transfers (Heathrow, Gatwick, Stansted, Luton, London City, Southend) and UK private hire journeys.",
    datePosted: "2026-03-01",
    validThrough: "2027-12-31",
    employmentType: ["CONTRACTOR", "FULL_TIME", "PART_TIME"],
    hiringOrganization: {
      "@type": "Organization",
      name: "Luxelyne Transfers",
      sameAs: "https://luxelynetransfers.co.uk",
      logo: "https://luxelynetransfers.co.uk/logo.png",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: "58 Peregrine Rd",
        addressLocality: "Ilford, London",
        postalCode: "IG6 3SZ",
        addressCountry: "GB",
      },
    },
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: DRIVER_FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://luxelynetransfers.co.uk" },
          {
            name: "Apply as Driver",
            url: "https://luxelynetransfers.co.uk/apply-as-driver",
          },
        ]}
      />
      <Script
        id="driver-job-posting-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
      />
      <Script
        id="driver-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />

      <main className="w-full bg-neutral-50/60 text-neutral-900">
        {/* ================================================================= */}
        {/* 1. HERO + FORM SECTION (MOBILE-FIRST: HEADING -> FORM -> INFO)    */}
        {/* ================================================================= */}
        <section className="pt-28 pb-14 md:pt-36 md:pb-24">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* Intro Heading (Visible right away on mobile & desktop) */}
            <div className="max-w-2xl mb-8 md:mb-12">
              <p className="text-xs font-bold uppercase tracking-widest text-lime-700 mb-2">
                Join Our Driver Network
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-950 leading-tight">
                Apply as a Driver with Luxelyne Transfers
              </h1>
              <p className="text-neutral-600 text-base sm:text-lg mt-3 leading-relaxed">
                Looking for steady, pre-booked airport runs without the stress of street hailing? We work with reliable owner-drivers across London and all six major airports.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Application Form — First on Mobile so phone users can apply immediately */}
              <div className="lg:col-span-7 order-1 lg:order-2">
                <DriverApplyForm />
              </div>

              {/* Left Column on Desktop / Below Form on Mobile: Real Human Context */}
              <div className="lg:col-span-5 order-2 lg:order-1 space-y-6">
                <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-5">
                  <h2 className="text-lg font-bold text-neutral-900">
                    Why drivers stay with us
                  </h2>

                  <ul className="space-y-4 text-sm text-neutral-600">
                    <li className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-lime-400 text-neutral-950 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                      <div>
                        <strong className="text-neutral-900 block">
                          Pre-booked airport &amp; long-distance work
                        </strong>
                        Plan your week ahead with confirmed pickups at Heathrow, Gatwick, Stansted, Luton, London City, and Southend.
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-lime-400 text-neutral-950 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                      <div>
                        <strong className="text-neutral-900 block">
                          Clear driver rates agreed upfront
                        </strong>
                        You always know the exact driver payout before taking a job—no hidden commission surprises.
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-lime-400 text-neutral-950 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                      <div>
                        <strong className="text-neutral-900 block">
                          A real dispatch desk you can actually talk to
                        </strong>
                        Our controllers are on the phone and WhatsApp 24/7 if a flight is delayed or a passenger needs assistance.
                      </div>
                    </li>

                    <li className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-lime-400 text-neutral-950 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                      <div>
                        <strong className="text-neutral-900 block">
                          Return legs &amp; local matching
                        </strong>
                        We match jobs around your home postcode and help pair airport drop-offs with return pickups wherever possible.
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Real Chauffeur Photo Card */}
                <div className="relative rounded-2xl overflow-hidden bg-neutral-950 text-white border border-neutral-800">
                  <div className="relative h-52 w-full">
                    <Image
                      src="/cab1.jpg"
                      alt="Luxelyne Transfers Partner Driver"
                      fill
                      className="object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                  </div>
                  <div className="p-5 space-y-2 relative">
                    <p className="text-sm font-medium text-neutral-200 leading-relaxed">
                      Prefer to speak to someone first? Give our dispatch desk a quick ring and ask about driver onboarding.
                    </p>
                    <a
                      href="tel:+447460019129"
                      className="inline-flex items-center gap-2 text-lime-400 font-bold text-sm hover:underline pt-1"
                    >
                      <Phone className="w-4 h-4" />
                      +44 7460 019129
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 2. VEHICLES WE WORK WITH (CLEAN & SCANNABLE ON MOBILE)            */}
        {/* ================================================================= */}
        <section className="py-14 md:py-20 bg-white border-t border-b border-neutral-200/80">
          <div className="container mx-auto px-4 max-w-6xl space-y-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950">
                Vehicles we recruit for airport &amp; private hire work
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 mt-2">
                We take on clean, well-kept vehicles across these six categories:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  name: "Saloon",
                  cars: "Toyota Prius, Corolla, Skoda Octavia, Hyundai Ioniq",
                  note: "Everyday solo and couple airport runs across all London terminals.",
                },
                {
                  name: "Estate",
                  cars: "Corolla Touring, Superb Estate, MG5 EV",
                  note: "Ideal for airport passengers travelling with extra suitcases.",
                },
                {
                  name: "People Carrier",
                  cars: "Ford Galaxy, VW Sharan, Seat Alhambra, Prius+",
                  note: "Family airport transfers and 5–6 passenger bookings.",
                },
                {
                  name: "Minibus",
                  cars: "VW Transporter, Ford Tourneo Custom, Vito Tourer",
                  note: "High-fare 7–8 passenger group and cruise port transfers.",
                },
                {
                  name: "Executive Minibus",
                  cars: "Mercedes-Benz V-Class, Mercedes EQV",
                  note: "Corporate groups, VIP families, and West End hotel transfers.",
                },
                {
                  name: "Executive Saloon",
                  cars: "Mercedes-Benz E-Class, BMW 5 Series, Audi A6",
                  note: "Business class airport Meet & Greet and Canary Wharf / City travel.",
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/90 space-y-1.5"
                >
                  <h3 className="text-base font-bold text-neutral-950">
                    {item.name}
                  </h3>
                  <p className="text-xs font-semibold text-lime-800">
                    {item.cars}
                  </p>
                  <p className="text-xs text-neutral-600 leading-relaxed pt-1">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 3. COMMON QUESTIONS FROM DRIVERS                                  */}
        {/* ================================================================= */}
        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4 max-w-4xl space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950">
                Common questions from drivers
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 mt-1">
                Everything you need to know before sending your details.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DRIVER_FAQS.map((faq) => (
                <div
                  key={faq.question}
                  className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-2"
                >
                  <h3 className="text-base font-bold text-neutral-900">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
