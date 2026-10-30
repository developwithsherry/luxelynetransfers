"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown } from "lucide-react"

const airportLinks = [
  { name: "Heathrow Airport (LHR)", href: "/heathrow-airport-transfers" },
  { name: "Gatwick Airport (LGW)", href: "/gatwick-airport-transfers" },
  { name: "Stansted Airport (STN)", href: "/stansted-airport-transfers" },
  { name: "Luton Airport (LTN)", href: "/luton-airport-transfers" },
  { name: "London City Airport (LCY)", href: "/london-city-airport-transfers" },
  { name: "Southend Airport (SEN)", href: "/southend-airport-transfers" },
  { name: "London Private Hire & Stations", href: "/london-private-hire" },
]

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileAirportsOpen, setIsMobileAirportsOpen] = useState(false)
  const pathname = usePathname() || ""

  // Add scroll effect for background change
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Auto collapse menu when transition states change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [isScrolled])

  const textColor = "text-white"
  const hoverColor = "hover:text-accent"

  // Utility to check if a link is active for top state
  const getLinkClasses = (href: string) => {
    const isActive = pathname.includes(href) && href !== "/"
    return `${textColor} ${hoverColor} transition-colors font-medium ${
      isActive
        ? "text-lime-400 font-semibold underline underline-offset-4"
        : ""
    }`
  }

  // Utility to check if a link is active for scrolled state
  const getScrolledLinkClasses = (href: string) => {
    const isActive = pathname === href || (href !== "/" && pathname.startsWith(href))
    return `text-black hover:text-black/70 font-semibold transition-colors relative py-1 text-sm ${
      isActive ? "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-black" : ""
    }`
  }

  if (pathname.includes("/admin")) {
    return null
  }

  // Floating capsule header when scrolled
  if (isScrolled) {
    return (
      <header className="fixed top-4 left-0 right-0 z-50 px-4 max-w-5xl mx-auto transition-all duration-300">
        <div className="w-full bg-accent rounded-full py-2 px-4 md:px-6 flex items-center justify-between text-black shadow-2xl border border-accent/20">
          
          {/* Left / Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6" aria-label="Main Navigation">
            <Link href="/" className={getScrolledLinkClasses("/")}>
              Home
            </Link>
            <Link href="/about" className={getScrolledLinkClasses("/about")}>
              About
            </Link>
            <Link href="/services" className={getScrolledLinkClasses("/services")}>
              Services
            </Link>
            <Link href="/fleets" className={getScrolledLinkClasses("/fleets")}>
              Fleets
            </Link>

            {/* Airports We Cover Dropdown */}
            <div className="relative group">
              <button className="text-black hover:text-black/70 font-semibold transition-colors flex items-center gap-1 py-1 text-sm focus:outline-none">
                Airports & Areas
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 mt-2 w-64 rounded-xl bg-black border border-neutral-800 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 p-2 space-y-1 text-neutral-300">
                {airportLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-sm hover:text-white hover:bg-neutral-900 rounded-lg transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/blog" className={getScrolledLinkClasses("/blog")}>
              Blog
            </Link>

            <Link href="/contact" className={getScrolledLinkClasses("/contact")}>
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button - Scrolled state */}
          <div className="md:hidden flex items-center">
            <button
              className="text-black hover:text-black/70 p-2.5 rounded-lg focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Navigation Menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-black" />
              ) : (
                <Menu className="h-6 w-6 text-black" />
              )}
            </button>
          </div>

          {/* Right Side: Call Now Button */}
          <div className="flex items-center">
            <a
              href="tel:+447460019129"
              className="bg-white text-black font-bold px-5 py-2 rounded-full text-xs md:text-sm shadow-md transition-all duration-300 hover:bg-neutral-950 hover:text-white inline-flex items-center justify-center tracking-wider uppercase"
            >
              Call Now
            </a>
          </div>

        </div>

        {/* Mobile Menu Drawer - Scrolled state */}
        {isMenuOpen && (
          <div className="md:hidden bg-neutral-950/95 backdrop-blur-md my-2 rounded-2xl p-4 border border-neutral-800 shadow-2xl">
            <nav className="flex flex-col space-y-3" aria-label="Mobile Navigation">
              <Link href="/" className="text-white hover:text-accent font-semibold transition-colors py-1 text-sm border-b border-neutral-900">
                Home
              </Link>
              <Link href="/about" className="text-white hover:text-accent font-semibold transition-colors py-1 text-sm border-b border-neutral-900">
                About
              </Link>
              <Link href="/services" className="text-white hover:text-accent font-semibold transition-colors py-1 text-sm border-b border-neutral-900">
                Services
              </Link>
              <Link href="/fleets" className="text-white hover:text-accent font-semibold transition-colors py-1 text-sm border-b border-neutral-900">
                Fleets
              </Link>

              {/* Mobile Airports Dropdown */}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setIsMobileAirportsOpen(!isMobileAirportsOpen)}
                  className="flex items-center justify-between w-full text-white hover:text-accent font-semibold transition-colors py-1 text-sm text-left border-b border-neutral-900"
                >
                  <span>Airports & Areas</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isMobileAirportsOpen ? "rotate-180 text-lime-400" : ""}`} />
                </button>
                {isMobileAirportsOpen && (
                  <div className="pl-4 flex flex-col space-y-2 border-l border-neutral-800 mt-2 pb-2">
                    {airportLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="text-xs text-neutral-400 hover:text-white py-1"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/blog" className="text-white hover:text-accent font-semibold transition-colors py-1 text-sm border-b border-neutral-900">
                Blog
              </Link>

              <Link href="/contact" className="text-white hover:text-accent font-semibold transition-colors py-1 text-sm">
                Contact
              </Link>
            </nav>
          </div>
        )}
      </header>
    )
  }

  // Top header (default state when not scrolled)
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/45 transition-all duration-300">
      <div className="container mx-auto px-2 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <img
              className="lg:w-72 w-56 h-auto"
              src="/logo-main.png"
              alt="Luxelyne Transfers - London Airport Transfers & Private Hire"
              width={288}
              height={64}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
            <Link href="/about" className={getLinkClasses("/about")}>
              About
            </Link>
            <Link href="/services" className={getLinkClasses("/services")}>
              Services
            </Link>
            <Link href="/fleets" className={getLinkClasses("/fleets")}>
              Fleets
            </Link>

            {/* Airports We Cover Dropdown */}
            <div className="relative group">
              <button className={`${textColor} ${hoverColor} transition-colors font-medium flex items-center gap-1 py-2 focus:outline-none`}>
                Airports & Areas
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 mt-0 w-64 rounded-xl bg-black border border-neutral-800 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 p-2 space-y-1">
                {airportLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/blog" className={getLinkClasses("/blog")}>
              Blog
            </Link>

            <Link href="/contact" className={getLinkClasses("/contact")}>
              Contact
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            className={`md:hidden ${textColor} ${hoverColor} transition-colors p-2.5 rounded-lg focus:outline-none`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-accent" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/55 backdrop-blur-sm my-5 rounded-lg mt-2 p-4 border border-gray-950 shadow-lg">
            <nav className="flex flex-col space-y-4 text-black" aria-label="Mobile Navigation">
              <Link href="/about" className={getLinkClasses("/about")}>
                About
              </Link>
              <Link href="/services" className={getLinkClasses("/services")}>
                Services
              </Link>
              <Link href="/fleets" className={getLinkClasses("/fleets")}>
                Fleets
              </Link>

              {/* Mobile Airports Dropdown */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setIsMobileAirportsOpen(!isMobileAirportsOpen)}
                  className="flex items-center justify-between w-full text-white transition-colors font-medium text-left focus:outline-none"
                >
                  <span>Airports & Areas</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isMobileAirportsOpen ? "rotate-180 text-lime-400" : ""}`} />
                </button>
                {isMobileAirportsOpen && (
                  <div className="pl-4 flex flex-col space-y-2 border-l border-neutral-800 mt-1">
                    {airportLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="text-sm text-neutral-400 hover:text-white py-1"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/blog" className={getLinkClasses("/blog")}>
                Blog
              </Link>

              <Link href="/contact" className={getLinkClasses("/contact")}>
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
