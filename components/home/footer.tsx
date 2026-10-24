import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-300 border-t border-neutral-900" id="contact">
      <div className="container mx-auto px-6 py-16 md:py-20 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Column 1: Logo & Contact Info (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="/logo_lime.png"
                alt="Luxelyne Transfers Logo"
                className="w-14 h-14 object-contain"
                width={56}
                height={56}
              />
              <div>
                <h3 className="text-xl font-bold tracking-tight text-white leading-none mb-1">
                  Luxelyne Transfers
                </h3>
                <span className="text-[10px] text-accent font-bold uppercase tracking-widest">
                  Premium Chauffeur
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <a
                href="tel:+447460019129"
                className="flex items-center gap-3 text-neutral-400 hover:text-accent transition-colors duration-200 group text-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center group-hover:bg-accent/15 group-hover:text-accent transition-colors duration-200 shrink-0">
                  <Phone className="w-4 h-4 text-accent" />
                </div>
                <span>+44 7460 019129</span>
              </a>

              <a
                href="https://wa.me/447640019129"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-neutral-400 hover:text-accent transition-colors duration-200 group text-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center group-hover:bg-accent/15 group-hover:text-accent transition-colors duration-200 shrink-0">
                  <svg className="w-4 h-4 text-accent fill-accent" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.733-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966a9.9 9.9 0 0 0-6.98-2.879c-5.443 0-9.87 4.37-9.874 9.8-.001 1.768.465 3.49 1.348 5.021l-.986 3.6 3.692-.977zm11.168-6.64c-.266-.134-1.583-.78-1.827-.868-.243-.088-.421-.132-.599.133-.177.265-.688.868-.843 1.044-.155.177-.31.199-.577.065-.266-.133-1.12-.413-2.133-1.319-.788-.702-1.32-1.569-1.475-1.834-.155-.266-.017-.409.117-.541.12-.119.266-.31.399-.465.133-.155.177-.266.266-.443.088-.177.044-.332-.022-.465-.067-.133-.599-1.44-.82-1.972-.215-.519-.469-.448-.65-.458l-.553-.01c-.199 0-.523.074-.797.373-.274.298-1.045 1.02-1.045 2.487 0 1.467 1.066 2.883 1.213 3.082.148.199 2.096 3.201 5.08 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.284.173-1.413-.074-.129-.272-.21-.538-.344z"/>
                  </svg>
                </div>
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href="mailto:info@luxelynetransfers.co.uk"
                className="flex items-center gap-3 text-neutral-400 hover:text-accent transition-colors duration-200 group text-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center group-hover:bg-accent/15 group-hover:text-accent transition-colors duration-200 shrink-0">
                  <Mail className="w-4 h-4 text-accent" />
                </div>
                <span>info@luxelynetransfers.co.uk</span>
              </a>

              <div className="flex items-center gap-3 text-neutral-400 text-sm">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-accent" />
                </div>
                <span>58 Peregrine Rd, Ilford IG6 3SZ, UK</span>
              </div>
            </div>
          </div>

          {/* Column 2: Airports (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-accent">
              Airports We Cover
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Heathrow Airport (LHR)", href: "/heathrow-airport-transfers" },
                { name: "Gatwick Airport (LGW)", href: "/gatwick-airport-transfers" },
                { name: "Stansted Airport (STN)", href: "/stansted-airport-transfers" },
                { name: "Luton Airport (LTN)", href: "/luton-airport-transfers" },
                { name: "London City Airport (LCY)", href: "/london-city-airport-transfers" },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm hover:underline"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-accent">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "#" },
                { name: "Fleet", href: "/fleets" },
                { name: "Services", href: "/services" },
                { name: "About Us", href: "/about" },
                { name: "Blog", href: "/blog" },
                { name: "Book Now", href: "/#book-now" },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm hover:underline"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal & Socials (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent">
                Legal
              </h4>
              <ul className="space-y-3">
                {[
                  { name: "Privacy Policy", href: "/policy" },
                  { name: "Terms of Service", href: "/terms" },
                ].map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm hover:underline"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent">
                Follow Us
              </h4>
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/luxelynetransfers/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-neutral-900 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all duration-300 shadow-inner text-white hover:scale-105"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.facebook.com/luxelynetransfers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-neutral-900 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-all duration-300 shadow-inner text-white hover:scale-105"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-neutral-900 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Luxelyne Transfers Ltd. All rights reserved.</p>
          <p className="mt-2 md:mt-0 font-medium">
            Website Developed by:{" "}
            <a
              href="https://www.theadeology.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline font-bold transition-colors"
            >
              The Adeology
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
