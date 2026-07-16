"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Plane, Calendar, MapPin, GraduationCap, X, ArrowRight, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const services = [
  {
    id: "airport-transfers",
    icon: Plane,
    title: "Airport Transfers",
    description:
      "Punctual and stress-free airport transfers with professional drivers, ensuring a smooth start or end to your journey.",
    detailedDescription: "Our premium airport transfer service takes the stress out of travel. We monitor your flight status in real-time, meaning that if your flight is early or delayed, our driver will be there exactly when you land. We provide a professional Meet & Greet service in the arrivals hall, helping with your luggage and guiding you to your executive vehicle.",
    features: ["Real-time flight monitoring", "Professional Meet & Greet", "Complimentary waiting time (60 mins)", "24/7 booking & support", "Flight tracking integration"],
    keywords: ["LHR Transfers", "24/7 Airport Cab", "Flight Tracking", "Meet & Greet", "Executive Cars", "Gatwick Taxi", "Stansted Private Hire", "Luton Airport Taxi"],
    image: "/luxury-car-at-airport-terminal-professional-chauff.png",
  },
  {
    id: "event-transfers",
    icon: Calendar,
    title: "Event Transfers",
    description:
      "Reliable transport for weddings, parties, and corporate events—your guests arrive on time, in comfort and style.",
    detailedDescription: "Arrive at your next event in comfort and make a lasting impression. Whether it is a grand wedding, corporate gala, sports event, or private party, our fleet of luxury vehicles and professional chauffeurs ensure seamless group coordination, prompt pickups, and stress-free drop-offs.",
    features: ["VIP Chauffeur service", "Group passenger coordination", "Multiple luxury vehicle classes", "Flexible, hourly bookings", "Impeccable vehicle cleaning standards"],
    keywords: ["Wedding Chauffeur", "Corporate Travel", "VIP Chauffeur", "Luxury MPV", "Party Transport", "Chauffeur Service London"],
    image: "/elegant-wedding-car-with-ribbons-luxury-event-tran.png",
  },
  {
    id: "day-tours",
    icon: MapPin,
    title: "Day & Weekly Tours",
    description: "Explore iconic destinations across London and the UK with our tailored day and weekly tour packages.",
    detailedDescription: "Discover the best of the UK on your own schedule. Our customized day and weekly tours offer you a private chauffeur with local route expertise. From historical castles and landmarks in London to scenic tours of the English countryside, we tailor the itinerary completely to your travel preferences.",
    features: ["Customized itineraries", "Local route expertise", "Multiple sightseeing stops", "Photography & luggage support", "Stops at popular historical landmarks"],
    keywords: ["London Sightseeing", "Custom Tour", "Private Chauffeur Tour", "UK Sightseeing", "Castle Tours", "Tour Guide Service"],
    image: "/luxury-car-in-front-of-big-ben-london-tourist-dest.png",
  },
  {
    id: "school-transport",
    icon: GraduationCap,
    title: "School & College Transport",
    description:
      "Safe, timely, and trusted pickup and drop-off services for students, with DBS-checked drivers and GPS-tracked vehicles.",
    detailedDescription: "We provide trusted and safe school and college transport solutions. Our drivers are fully DBS-checked, licensed, and highly experienced in student transport. With GPS-tracked vehicles and regular scheduling, we ensure absolute peace of mind for parents and timely transport for students.",
    features: ["Fully DBS-checked drivers", "GPS-tracked fleet", "Consistent daily scheduling", "Direct parent communications", "Top-tier safety compliance"],
    keywords: ["Safe School Taxi", "DBS-Checked Chauffeur", "Student Travel", "GPS-Tracked Ride", "TfL Licensed", "Reliable Pickups"],
    image: "/safe-family-car-school-transport-professional-driv.png",
  },
]

export function ServicesSection() {
  const [activeService, setActiveService] = useState<typeof services[0] | null>(null)

  return (
    <section id="services" className="py-24 bg-neutral-950 text-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-accent mb-3 block">Our Expertise</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white max-w-4xl mx-auto leading-tight mb-4">
            Exclusive Chauffeur Services
          </h2>
          <p className="text-neutral-400 max-w-xl mx-auto text-pretty">
            Experience premium transport tailored to your journey. Click on any service to explore detailed features.
          </p>
        </div>

        {/* Modern Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 h-auto lg:h-[620px]">
          
          {/* Card 1: Airport Transfers (Large 7 Columns) */}
          <motion.div 
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-7 lg:row-span-2 cursor-pointer group relative"
            onClick={() => setActiveService(services[0])}
          >
            {/* Full-opacity brand green offset background shown on hover */}
            <div className="absolute inset-0 bg-accent rounded-2xl opacity-0 translate-x-0 translate-y-0 group-hover:opacity-100 group-hover:translate-x-3 group-hover:translate-y-3 transition-all duration-300 z-0 shadow-lg shadow-accent/30" />
            <Card className="bg-neutral-900 border-neutral-800 h-full overflow-hidden relative z-10 shadow-2xl rounded-2xl group transition-transform duration-300">
              <CardContent className="p-0 h-full relative">
                {/* Image overlay with Grayscale */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={services[0].image}
                    alt={services[0].title}
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/20" />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between p-8 min-h-[350px] lg:min-h-full">
                  <div className="flex justify-between items-start">
                    <div className="bg-accent/10 border border-accent/20 text-accent p-4 rounded-2xl backdrop-blur-md">
                      <Plane className="w-6 h-6" />
                    </div>
                    <span className="text-7xl font-display font-extrabold text-white/5 select-none">01</span>
                  </div>

                  <div>
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-3 group-hover:text-accent transition-colors">
                      {services[0].title}
                    </h3>
                    <p className="text-neutral-300 text-sm md:text-base max-w-xl mb-6">
                      {services[0].description}
                    </p>
                    <div className="flex items-center gap-2 text-accent font-semibold text-sm group-hover:gap-4 transition-all duration-200">
                      <span>Explore Service Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 2: Event Transfers (Tall 5 Columns) */}
          <motion.div 
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-5 lg:row-span-2 cursor-pointer group relative"
            onClick={() => setActiveService(services[1])}
          >
            {/* Full-opacity brand green offset background shown on hover */}
            <div className="absolute inset-0 bg-accent rounded-2xl opacity-0 translate-x-0 translate-y-0 group-hover:opacity-100 group-hover:translate-x-3 group-hover:translate-y-3 transition-all duration-300 z-0 shadow-lg shadow-accent/30" />
            <Card className="bg-neutral-900 border-neutral-800 h-full overflow-hidden relative z-10 shadow-2xl rounded-2xl group transition-transform duration-300">
              <CardContent className="p-0 h-full relative">
                {/* Image overlay with Grayscale */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={services[1].image}
                    alt={services[1].title}
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/20" />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between p-8 min-h-[350px] lg:min-h-full">
                  <div className="flex justify-between items-start">
                    <div className="bg-accent/10 border border-accent/20 text-accent p-4 rounded-2xl backdrop-blur-md">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <span className="text-7xl font-display font-extrabold text-white/5 select-none">02</span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-accent transition-colors">
                      {services[1].title}
                    </h3>
                    <p className="text-neutral-300 text-sm max-w-md mb-6">
                      {services[1].description}
                    </p>
                    <div className="flex items-center gap-2 text-accent font-semibold text-sm group-hover:gap-4 transition-all duration-200">
                      <span>Explore Service Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 3: Day & Weekly Tours (Wide 6 Columns) */}
          <motion.div 
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-6 cursor-pointer group relative"
            onClick={() => setActiveService(services[2])}
          >
            {/* Full-opacity brand green offset background shown on hover */}
            <div className="absolute inset-0 bg-accent rounded-2xl opacity-0 translate-x-0 translate-y-0 group-hover:opacity-100 group-hover:translate-x-3 group-hover:translate-y-3 transition-all duration-300 z-0 shadow-lg shadow-accent/30" />
            <Card className="bg-neutral-900 border-neutral-800 h-full overflow-hidden relative z-10 shadow-2xl rounded-2xl group transition-transform duration-300">
              <CardContent className="p-0 h-full relative">
                {/* Image overlay with Grayscale */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={services[2].image}
                    alt={services[2].title}
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/20" />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between p-8 min-h-[300px] lg:min-h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-accent/10 border border-accent/20 text-accent p-4 rounded-2xl backdrop-blur-md">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <span className="text-7xl font-display font-extrabold text-white/5 select-none">03</span>
                  </div>

                  <div>
                    <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2 group-hover:text-accent transition-colors">
                      {services[2].title}
                    </h3>
                    <p className="text-neutral-300 text-sm max-w-lg mb-4">
                      {services[2].description}
                    </p>
                    <div className="flex items-center gap-2 text-accent font-semibold text-sm group-hover:gap-4 transition-all duration-200">
                      <span>Explore Service Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 4: School & College Transport (Wide 6 Columns) */}
          <motion.div 
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-6 cursor-pointer group relative"
            onClick={() => setActiveService(services[3])}
          >
            {/* Full-opacity brand green offset background shown on hover */}
            <div className="absolute inset-0 bg-accent rounded-2xl opacity-0 translate-x-0 translate-y-0 group-hover:opacity-100 group-hover:translate-x-3 group-hover:translate-y-3 transition-all duration-300 z-0 shadow-lg shadow-accent/30" />
            <Card className="bg-neutral-900 border-neutral-800 h-full overflow-hidden relative z-10 shadow-2xl rounded-2xl group transition-transform duration-300">
              <CardContent className="p-0 h-full relative">
                {/* Image overlay with Grayscale */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={services[3].image}
                    alt={services[3].title}
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/20" />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between p-8 min-h-[300px] lg:min-h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-accent/10 border border-accent/20 text-accent p-4 rounded-2xl backdrop-blur-md">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <span className="text-7xl font-display font-extrabold text-white/5 select-none">04</span>
                  </div>

                  <div>
                    <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2 group-hover:text-accent transition-colors">
                      {services[3].title}
                    </h3>
                    <p className="text-neutral-300 text-sm max-w-lg mb-4">
                      {services[3].description}
                    </p>
                    <div className="flex items-center gap-2 text-accent font-semibold text-sm group-hover:gap-4 transition-all duration-200">
                      <span>Explore Service Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>

      {/* Pop-Up Modal (Details Overlay) */}
      <AnimatePresence>
        {activeService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveService(null)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl z-10 text-white max-h-[90vh] flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveService(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/55 backdrop-blur-md flex items-center justify-center border border-neutral-850 hover:bg-accent hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Body (Scrollable) */}
              <div className="overflow-y-auto flex-1">
                {/* Header Image (Grayscale) */}
                <div className="relative h-64 md:h-72 w-full">
                  <img
                    src={activeService.image}
                    alt={activeService.title}
                    className="w-full h-full object-cover filter grayscale"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent" />
                  <div className="absolute bottom-6 left-6 flex items-center gap-4">
                    <div className="bg-accent text-black p-3 rounded-2xl shadow-lg">
                      <activeService.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-white shadow-sm">
                      {activeService.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  {/* Detailed Description */}
                  <p className="text-neutral-300 leading-relaxed text-sm md:text-base">
                    {activeService.detailedDescription}
                  </p>

                  {/* Key Features */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-accent mb-3">Key Features</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activeService.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-neutral-300 text-sm">
                          <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Keywords / Tags */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-accent mb-3">Service Areas & Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {activeService.keywords.map((keyword, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-semibold tracking-wider uppercase bg-accent/10 border border-accent/20 text-accent px-3 py-1 rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer (Call to action) */}
              <div className="p-6 border-t border-neutral-800 bg-neutral-950 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-neutral-400 text-center sm:text-left">
                  Ready to book? Speak to our team or book online.
                </p>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setActiveService(null)}
                    className="flex-1 sm:flex-none px-6 py-3 border border-neutral-800 hover:bg-neutral-800 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Close
                  </button>
                  <a
                    href="/#book-now"
                    onClick={() => setActiveService(null)}
                    className="flex-1 sm:flex-none px-6 py-3 bg-accent text-black hover:bg-accent/90 rounded-xl text-sm font-bold text-center transition-colors shadow-lg shadow-accent/15"
                  >
                    Book This Service
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
