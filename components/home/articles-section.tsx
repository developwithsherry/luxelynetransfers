"use client"

import { Card, CardContent } from "@/components/ui/card"

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

export function HomeArticlesSection() {
  // Replicate 3 articles 3 times to get 9 items, ensuring continuous loop width coverage
  const repeatedArticles = [...blogPosts, ...blogPosts, ...blogPosts]

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-background via-muted/5 to-background border-t border-border overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading */}
          <div className="lg:col-span-4 space-y-6 text-left animate-in fade-in duration-750">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/5 text-accent text-sm font-semibold tracking-wide uppercase">
              Read Articles
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Our Latest <br />
              <span className="text-accent">Travel Guides</span> <br />
              & Insights
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-md">
              Stay updated with professional travel tips, airport transfer guides, and local transportation comparisons in London.
            </p>
            <div className="pt-2">
              <a
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-accent hover:text-accent-foreground hover:scale-105 transition-all duration-300 shadow-md text-sm"
              >
                <span>View All Articles</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Right Column: Blending Auto-Scrolling Marquee */}
          <div className="lg:col-span-8 relative w-full overflow-hidden py-4 select-none">
            {/* Blending Edge Gradients */}
            <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            <div
              className="flex animate-marquee hover:[animation-play-state:paused]"
              style={{ animationDuration: "50s" }} // Slow speed for comfortable reading
            >
              {/* Track 1 */}
              <div className="flex gap-6 pr-6 shrink-0">
                {repeatedArticles.map((post, idx) => (
                  <div key={`art1-${idx}`} className="w-[300px] sm:w-[340px] md:w-[380px] shrink-0 my-2">
                    <Card className="h-full bg-card border-border hover:border-accent/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group">
                      <a href={`/blog/${post.slug}`} className="flex flex-col h-full justify-between">
                        <div>
                          {/* Image */}
                          <div className="relative w-full h-44 overflow-hidden bg-muted">
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>

                          {/* Content */}
                          <div className="p-5 space-y-3 text-left">
                            <div className="flex items-center gap-3 text-xs font-semibold text-accent">
                              <span className="px-2 py-0.5 rounded border border-accent/25 bg-accent/5 uppercase tracking-wider text-[10px]">
                                {post.category}
                              </span>
                              <span className="text-muted-foreground">{post.date}</span>
                            </div>
                            <h3 className="text-lg font-bold text-card-foreground group-hover:text-accent transition-colors duration-200 line-clamp-2 leading-snug">
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground text-xs font-light line-clamp-3 leading-relaxed">
                              {post.excerpt}
                            </p>
                          </div>
                        </div>

                        {/* Read Link */}
                        <div className="p-5 pt-0 flex items-center gap-1.5 text-accent font-bold hover:underline text-xs text-left">
                          <span>Read Full Article</span>
                          <span className="transition-transform group-hover:translate-x-1">→</span>
                        </div>
                      </a>
                    </Card>
                  </div>
                ))}
              </div>

              {/* Track 2 */}
              <div className="flex gap-6 pr-6 shrink-0">
                {repeatedArticles.map((post, idx) => (
                  <div key={`art2-${idx}`} className="w-[300px] sm:w-[340px] md:w-[380px] shrink-0 my-2">
                    <Card className="h-full bg-card border-border hover:border-accent/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group">
                      <a href={`/blog/${post.slug}`} className="flex flex-col h-full justify-between">
                        <div>
                          {/* Image */}
                          <div className="relative w-full h-44 overflow-hidden bg-muted">
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>

                          {/* Content */}
                          <div className="p-5 space-y-3 text-left">
                            <div className="flex items-center gap-3 text-xs font-semibold text-accent">
                              <span className="px-2 py-0.5 rounded border border-accent/25 bg-accent/5 uppercase tracking-wider text-[10px]">
                                {post.category}
                              </span>
                              <span className="text-muted-foreground">{post.date}</span>
                            </div>
                            <h3 className="text-lg font-bold text-card-foreground group-hover:text-accent transition-colors duration-200 line-clamp-2 leading-snug">
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground text-xs font-light line-clamp-3 leading-relaxed">
                              {post.excerpt}
                            </p>
                          </div>
                        </div>

                        {/* Read Link */}
                        <div className="p-5 pt-0 flex items-center gap-1.5 text-accent font-bold hover:underline text-xs text-left">
                          <span>Read Full Article</span>
                          <span className="transition-transform group-hover:translate-x-1">→</span>
                        </div>
                      </a>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
