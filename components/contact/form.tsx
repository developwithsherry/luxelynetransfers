"use client"

import { useForm } from "react-hook-form"
import { Phone, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WhatsappButton } from "../whatsapp-button"
import { InsertContactUs } from "@/app/contact/action"
import { toast } from "sonner"
type FormData = {
    name: string
    company?: string
    phone?: string
    email: string
    message: string
}

export function ContactSection() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormData>()

    const onSubmit = async (data: FormData) => {
        try {
            const { error } = await InsertContactUs({
                name: data.name,
                email: data.email,
                phone: data.phone || null,
                message: data.message
            });

            if (error) {
                throw new Error(`${error}`)
            }
            reset()
            toast.success("Thanks for contacting us, our team will get to you shortly!")
        } catch (error) {
            toast.error("Unable to send your message something went wrong");
        }
    }

    return (
        <section id="contact" className="py-24 bg-white">
              <div className="py-16"><h1 className="text-4xl text-center font-bold">Contact us</h1></div>
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12">
                {/* Left side - Company info */}
              
                <div>
                    <h2 className="text-2xl font-bold mb-6">Get in touch</h2>
                    <p className="text-gray-600 mb-8">
                        Premium chauffeur services providing luxury transportation across London and the UK.
                        Experience comfort, reliability, and professionalism with every journey.
                    </p>

                    <div className="space-y-5">
                        <a
                            href="tel:+447882733291"
                            className="flex items-center gap-3 text-gray-700 hover:text-lime-400 underline transition-colors"
                        >
                            <Phone className="w-5 h-5 text-primary" />
                            <span>+44 7882 733291</span>
                        </a>

                        <WhatsappButton className="text-gray-700 underline hover:text-lime-400" />

                        <a
                            href="mailto:official@luxelynetransfers.com"
                            className="flex items-center gap-3 text-gray-700 hover:text-lime-400 underline transition-colors"
                        >
                            <Mail className="w-5 h-5 text-gray-700 hover:text-lime-400 underline" />
                            <span>official@luxelynetransfers.com</span>
                        </a>

                        <div className="flex items-center gap-3 text-gray-700">
                            <MapPin className="w-5 h-5 text-primary" />
                            <span>58 Peregrine Rd, Ilford IG6 3SZ, UK</span>
                        </div>
                    </div>
                </div>

                {/* Right side - Contact form */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">Send us a message</h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Name"
                                {...register("name")}
                                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <input
                                type="text"
                                placeholder="Company"
                                {...register("company")}
                                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <input
                                    type="tel"
                                    placeholder="Phone (optional)"
                                    {...register("phone", {
                                        pattern: {
                                            value: /^[0-9+\- ]*$/,
                                            message: "Invalid phone number",
                                        },
                                    })}
                                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                                )}
                            </div>

                            <div>
                                <input
                                    type="email"
                                    placeholder="Email *"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Invalid email address",
                                        },
                                    })}
                                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>
                        </div>



                        <div>
                            <textarea
                                rows={4}
                                placeholder="Message *"
                                {...register("message", { required: "Message is required" })}
                                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            {errors.message && (
                                <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-primary text-background rounded-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Sending..." : "Send"}
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    )
}
