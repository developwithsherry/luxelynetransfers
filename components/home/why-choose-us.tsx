import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function WhyChooseUs() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-accent mb-4 text-balance">
          Why Choose LuxeLyne?
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
          Book your trip and travel in comfort.
        </p>
      </div>

      {/* Three-column bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-8">
        {/* Row 1: Image | Text | Image */}
        <div className="bg-card rounded-none overflow-hidden shadow-none border-neutral-200">
          <div className="aspect-[4/3] relative">
            <Image src="/p2.png" alt="Luxelyne Transfers - Premium Private Hire Mercedes Interior Comfort" fill className="object-cover" />
          </div>
        </div>

        <div className="bg-accent/5 rounded-none p-6 flex flex-col justify-center border-none">
          <h3 className="text-2xl font-display font-bold text-accent mb-3">Luxury & Comfort</h3>
          <p className="text-muted-foreground mb-4 leading-relaxed">
           Experience premium vehicles with plush interiors, climate control, and smooth rides—perfect for business or leisure.
          </p>
          
        </div>

        <div className="bg-card rounded-none overflow-hidden shadow-none border-neutral-200">
          <div className="aspect-[4/3] relative">
            <Image src="/p1.png" alt="Professional Chauffeur Driver Welcoming Airport Transfer Passenger" fill className="object-cover" />
          </div>
        </div>

        {/* Row 2: Text | Image | Text */}
        <div className="bg-accent/5 rounded-none p-6 flex flex-col justify-center border-neutral-200">
          <h3 className="text-2xl font-display font-bold text-accent mb-3">Professional Drivers</h3>
          <p className="text-muted-foreground mb-4 leading-relaxed">
           Our courteous, DBS-checked drivers know the local routes inside out, ensuring safe and efficient journeys every time.
          </p>
          
        </div>

        <div className="bg-card rounded-none overflow-hidden shadow-none border-neutral-200">
          <div className="aspect-[4/3] relative">
            <Image src="/p3.png" alt="Luxury Mercedes Benz Saloon Taxi Airport Pickup" fill className="object-cover" />
          </div>
        </div>

        <div className="bg-accent/5 rounded-none p-6 flex flex-col justify-center border border-accent/20">
          <h3 className="text-2xl font-display font-bold  mb-3 text-accent">Easy Online Payment</h3>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Pay securely via major debit/credit cards or digital wallets—fast, simple, and hassle-free.
          </p>
         
        </div>
      </div>

      {/* Additional content row for visual balance */}
    
    </section>
  )
}
