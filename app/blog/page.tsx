import type { Metadata } from "next"
import Header from "@/components/header"
import { Footer } from "@/components/home/footer"
import WhatsAppContactButton from "@/components/home/whatsapp-button-fixed"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Official Blog | Luxelyne Transfers",
  description: "Read the latest London travel guides, airport taxi guides, local private hire tips, and comparisons. Get expert advice for Heathrow, Gatwick, and London travel.",
  alternates: {
    canonical: "https://luxelynetransfers.co.uk/blog",
  },
}

const blogPosts = [
  {
    title: "Best Way to Book a Ride at Heathrow Airport (2026 Guide)",
    slug: "best-way-to-book-heathrow-airport-taxi",
    excerpt: "Compare London black cabs, Uber/Bolt rideshares, rail connections, and pre-booked private hire. Learn the best way to book your Heathrow airport taxi safely.",
    image: "/blog_heathrow_taxi_guide.png",
    category: "Travel Guide",
    date: "July 16, 2026",
    readingTime: "5 min read",
  },
  {
    title: "Why Choose a Pre-Booked Private Hire Over Uber at Heathrow?",
    slug: "pre-booked-private-hire-vs-uber-heathrow",
    excerpt: "Acknowledge the facts: Uber is handy, but airport runs have unique constraints. Compare pickup logistics, dynamic surge pricing, cancellations, and space guarantees.",
    image: "/blog_chauffeur_meet_greet.png",
    category: "Comparison",
    date: "July 16, 2026",
    readingTime: "6 min read",
  },
  {
    title: "Affordable Private Hire in Ilford & East London",
    slug: "affordable-private-hire-ilford-east-london",
    excerpt: "Reframe what affordable means. Discover how local fixed-fare private hire models protect you from dynamic pricing, traffic delay charges, and surprise forecourt fees.",
    image: "/blog_ilford_private_hire.png",
    category: "Local Services",
    date: "July 16, 2026",
    readingTime: "4 min read",
  },
]

export default function BlogListingPage() {
  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": blogPosts.map((post, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "url": `https://luxelynetransfers.co.uk/blog/${post.slug}`
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
      />

      <Header />

      <main className="w-full bg-white text-neutral-900 selection:bg-lime-400 selection:text-black">
        {/* Hero Section */}
        <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-neutral-50 via-white to-white border-b border-neutral-100">
          <div className="container mx-auto px-4 max-w-7xl text-center space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-lime-500/30 bg-lime-50 text-lime-700 text-xs font-semibold uppercase tracking-wider">
              Insights & Guides
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 leading-tight">
              Our Blog & Travel Guides
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 font-light max-w-2xl mx-auto leading-relaxed">
              Expert advice, taxi comparisons, airport guides, and local travel insights to make your London transfers comfortable and stress-free.
            </p>
          </div>
        </section>

        {/* Featured Post (First Post) */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="bg-neutral-50 border border-neutral-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <a href={`/blog/${blogPosts[0].slug}`} className="flex flex-col lg:flex-row items-stretch">
                {/* Image */}
                <div className="relative w-full lg:w-1/2 h-64 md:h-96 lg:h-auto min-h-[300px]">
                  <Image
                    src={blogPosts[0].image}
                    alt={blogPosts[0].title}
                    fill
                    className="object-cover object-top hover:scale-[1.01] transition-transform duration-500"
                  />
                </div>
                
                {/* Content */}
                <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-xs font-semibold text-lime-700">
                      <span className="px-3 py-1 rounded-full border border-lime-500/30 bg-lime-50 uppercase tracking-wider">
                        {blogPosts[0].category}
                      </span>
                      <span>{blogPosts[0].date}</span>
                      <span>•</span>
                      <span>{blogPosts[0].readingTime}</span>
                    </div>

                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-neutral-900 leading-tight hover:text-lime-600 transition-colors">
                      {blogPosts[0].title}
                    </h2>

                    <p className="text-neutral-600 font-light leading-relaxed text-base md:text-lg">
                      {blogPosts[0].excerpt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-lime-750 font-bold hover:underline group">
                    <span>Read Featured Guide</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Secondary Posts Grid */}
        <section className="py-12 pb-24 bg-white">
          <div className="container mx-auto px-4 max-w-7xl space-y-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 border-l-4 border-lime-500 pl-4">
              More Travel Insights
            </h2>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
              {blogPosts.slice(1).map((post) => (
                <div
                  key={post.slug}
                  className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  <a href={`/blog/${post.slug}`} className="block">
                    {/* Card Image */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-4 text-xs font-semibold text-lime-700">
                        <span className="px-2.5 py-0.5 rounded border border-lime-500/20 bg-lime-50/50 uppercase tracking-wider">
                          {post.category}
                        </span>
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readingTime}</span>
                      </div>

                      <h3 className="text-xl md:text-2xl font-bold text-neutral-900 group-hover:text-lime-600 transition-colors leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-neutral-500 font-light text-sm md:text-base leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </a>

                  <div className="p-6 pt-0">
                    <a
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-lime-750 font-bold hover:underline group/btn text-sm"
                    >
                      <span>Read Full Article</span>
                      <span className="transition-transform group-hover/btn:translate-x-1">→</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Global CTA banner */}
        <section className="bg-gradient-to-r from-lime-400 to-lime-500 text-black py-16">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight">Ready to book your premium London transfer?</h2>
            <p className="max-w-2xl mx-auto font-light text-neutral-850">
              Calculate your exact fare online using our instant booking form. Enter your postcodes, pick your executive vehicle, and secure your ride with no hidden charges.
            </p>
            <div>
              <a
                href="/#book-now"
                className="inline-block px-8 py-4 bg-black text-white hover:bg-neutral-900 transition-colors rounded-xl font-bold text-base shadow-lg"
              >
                Book Your Transfer Now
              </a>
            </div>
          </div>
        </section>
      </main>

      <WhatsAppContactButton />
      <Footer />
    </>
  )
}
