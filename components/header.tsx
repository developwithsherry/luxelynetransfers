"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown } from "lucide-react"

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

  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled ? "bg-black/45 backdrop-blur-lg shadow-sm" : "bg-black/45"
  }`

  const textColor = "text-white"
  const hoverColor = "hover:text-accent"

  // Utility to check if a link is active
  const getLinkClasses = (href: string) => {
    const isActive = pathname.includes(href) && href !== "/"
    return `${textColor} ${hoverColor} transition-colors font-medium ${
      isActive
        ? "text-lime-400 font-semibold underline underline-offset-4"
        : ""
    }`
  }

  if(pathname.includes("/admin")){
    return null;
  }

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-2  lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/">
            <img
              className="lg:w-72 w-56 h-auto"
              src="/logo-main.png"
              alt="LuxeLyne Transfers"
              width={288}
              height={64}
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/about" className={getLinkClasses("/about")}>
              About
            </a>
            <a href="/fleets" className={getLinkClasses("/fleets")}>
              Fleets
            </a>

            {/* Airports We Cover Dropdown */}
            <div className="relative group">
              <button className={`${textColor} ${hoverColor} transition-colors font-medium flex items-center gap-1 py-2`}>
                Airports We Cover
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 mt-0 w-64 rounded-xl bg-black border border-neutral-800 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 p-2 space-y-1">
                <a href="/heathrow-airport-transfers" className="block px-4 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors">
                  Heathrow Airport (LHR)
                </a>
                <a href="/gatwick-airport-transfers" className="block px-4 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors">
                  Gatwick Airport (LGW)
                </a>
                <a href="/stansted-airport-transfers" className="block px-4 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors">
                  Stansted Airport (STN)
                </a>
                <a href="/luton-airport-transfers" className="block px-4 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors">
                  Luton Airport (LTN)
                </a>
                <a href="/london-city-airport-transfers" className="block px-4 py-2 text-sm text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors">
                  London City Airport (LCY)
                </a>
              </div>
            </div>

            <a href="/blog" className={getLinkClasses("/blog")}>
              Blog
            </a>

            <a href="/contact" className={getLinkClasses("/contact")}>
              Contact
            </a>
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
            <nav className="flex flex-col space-y-4 text-black">
              <a href="/about" className={getLinkClasses("/about")}>
                About
              </a>
              <a href="/fleets" className={getLinkClasses("/fleets")}>
                Fleets
              </a>

              {/* Mobile Airports Dropdown */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setIsMobileAirportsOpen(!isMobileAirportsOpen)}
                  className="flex items-center justify-between w-full text-white transition-colors font-medium text-left"
                >
                  <span>Airports We Cover</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isMobileAirportsOpen ? "rotate-180 text-lime-400" : ""}`} />
                </button>
                {isMobileAirportsOpen && (
                  <div className="pl-4 flex flex-col space-y-2 border-l border-neutral-800 mt-1">
                    <a href="/heathrow-airport-transfers" className="text-sm text-neutral-400 hover:text-white py-1">Heathrow Airport (LHR)</a>
                    <a href="/gatwick-airport-transfers" className="text-sm text-neutral-400 hover:text-white py-1">Gatwick Airport (LGW)</a>
                    <a href="/stansted-airport-transfers" className="text-sm text-neutral-400 hover:text-white py-1">Stansted Airport (STN)</a>
                    <a href="/luton-airport-transfers" className="text-sm text-neutral-400 hover:text-white py-1">Luton Airport (LTN)</a>
                    <a href="/london-city-airport-transfers" className="text-sm text-neutral-400 hover:text-white py-1">London City Airport (LCY)</a>
                  </div>
                )}
              </div>

              <a href="/blog" className={getLinkClasses("/blog")}>
                Blog
              </a>

              <a href="/contact" className={getLinkClasses("/contact")}>
                Contact
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
