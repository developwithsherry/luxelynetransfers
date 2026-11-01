"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { submitDriverApplication } from "@/app/apply-as-driver/action"
import {
  DRIVER_VEHICLE_CATEGORIES,
  type DriverVehicleCategory,
} from "@/types/driver-application"
import { toast } from "sonner"

type DriverApplyFormData = {
  full_name: string
  phone: string
  email: string
  city_area: string
  vehicle_category: DriverVehicleCategory
  vehicle_make_model?: string
  message?: string
}

const VEHICLE_CAPACITY_HINT: Record<DriverVehicleCategory, string> = {
  Saloon: "Up to 4 passengers",
  Estate: "4 passengers + large boot",
  "People Carrier": "5–6 passengers",
  Minibus: "7–8 passengers",
  "Executive Minibus": "V-Class / EQV",
  "Executive Saloon": "E-Class / 5 Series",
}

export function DriverApplyForm() {
  const [submittedName, setSubmittedName] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DriverApplyFormData>({
    defaultValues: {
      vehicle_category: "Saloon",
    },
  })

  const selectedVehicle = watch("vehicle_category")

  const onSubmit = async (data: DriverApplyFormData) => {
    try {
      const res = await submitDriverApplication({
        ...data,
        availability: "Flexible",
      })
      if (!res.success) {
        toast.error(res.error || "Could not send your details. Please try again.")
        return
      }
      setSubmittedName(data.full_name)
      toast.success("Application sent! We will be in touch soon.")
      reset()
    } catch {
      toast.error("Something went wrong. Please try again.")
    }
  }

  if (submittedName) {
    return (
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm text-center space-y-5">
        <div className="w-12 h-12 rounded-full bg-lime-400 text-neutral-950 flex items-center justify-center mx-auto">
          <Check className="w-6 h-6 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold text-neutral-900">
            Thanks, {submittedName}. We&apos;ve got your details.
          </h3>
          <p className="text-neutral-600 text-sm leading-relaxed max-w-md mx-auto">
            One of our dispatch coordinators will give you a call or message you on WhatsApp to have a quick chat about your vehicle and preferred airport routes.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://wa.me/447460019129?text=Hi%20Luxelyne%20team%2C%20I%20just%20applied%20as%20a%20driver%20on%20your%20website."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-sm font-semibold transition"
          >
            Chat with us on WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setSubmittedName(null)}
            className="w-full sm:w-auto px-4 py-3 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition"
          >
            Send another application
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      id="driver-application-form"
      className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-8 shadow-sm"
    >
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
          Driver Application
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          Leave your contact details and vehicle type below—we&apos;ll call you back to get you set up.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
          <label
            htmlFor="full_name"
            className="block text-sm font-medium text-neutral-800 mb-1.5"
          >
            Full name
          </label>
          <input
            id="full_name"
            type="text"
            autoComplete="name"
            placeholder="Enter your full name"
            {...register("full_name", {
              required: "Please enter your name",
            })}
            className="w-full h-12 rounded-xl border border-neutral-300 bg-white px-4 text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition"
          />
          {errors.full_name && (
            <p className="text-red-600 text-xs mt-1">{errors.full_name.message}</p>
          )}
        </div>

        {/* Phone & Email (Stacked on mobile for easy thumb typing, side-by-side on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-neutral-800 mb-1.5"
            >
              Mobile / WhatsApp number
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="07460 019129"
              {...register("phone", {
                required: "Please enter your phone number",
                pattern: {
                  value: /^[0-9+\-\s()]{7,20}$/,
                  message: "Enter a valid phone number",
                },
              })}
              className="w-full h-12 rounded-xl border border-neutral-300 bg-white px-4 text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition"
            />
            {errors.phone && (
              <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-800 mb-1.5"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register("email", {
                required: "Please enter your email",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              className="w-full h-12 rounded-xl border border-neutral-300 bg-white px-4 text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition"
            />
            {errors.email && (
              <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Vehicle Category Selection (Only the 6 categories) */}
        <div className="pt-1">
          <label className="block text-sm font-medium text-neutral-800 mb-2">
            Which vehicle do you have?
          </label>
          <input
            type="hidden"
            {...register("vehicle_category", {
              required: "Please choose a vehicle category",
            })}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {DRIVER_VEHICLE_CATEGORIES.map((category) => {
              const active = selectedVehicle === category
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setValue("vehicle_category", category, {
                      shouldValidate: true,
                    })
                  }
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    active
                      ? "bg-neutral-950 border-neutral-950 text-white shadow-xs"
                      : "bg-neutral-50/70 border-neutral-200 text-neutral-800 hover:border-neutral-400 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-semibold leading-tight">
                      {category}
                    </span>
                    {active && (
                      <span className="w-4 h-4 rounded-full bg-lime-400 text-neutral-950 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <span
                    className={`block text-[11px] mt-1 ${
                      active ? "text-neutral-300" : "text-neutral-500"
                    }`}
                  >
                    {VEHICLE_CAPACITY_HINT[category]}
                  </span>
                </button>
              )
            })}
          </div>
          {errors.vehicle_category && (
            <p className="text-red-600 text-xs mt-1">
              {errors.vehicle_category.message}
            </p>
          )}
        </div>

        {/* Area & Vehicle Make/Model */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label
              htmlFor="city_area"
              className="block text-sm font-medium text-neutral-800 mb-1.5"
            >
              Your area or postcode
            </label>
            <input
              id="city_area"
              type="text"
              placeholder="e.g. Ilford, Heathrow, Gatwick"
              {...register("city_area", {
                required: "Please let us know where you are based",
              })}
              className="w-full h-12 rounded-xl border border-neutral-300 bg-white px-4 text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition"
            />
            {errors.city_area && (
              <p className="text-red-600 text-xs mt-1">{errors.city_area.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="vehicle_make_model"
              className="block text-sm font-medium text-neutral-800 mb-1.5"
            >
              Car make &amp; model <span className="text-neutral-400 font-normal">(optional)</span>
            </label>
            <input
              id="vehicle_make_model"
              type="text"
              placeholder="e.g. Toyota Prius 2022"
              {...register("vehicle_make_model")}
              className="w-full h-12 rounded-xl border border-neutral-300 bg-white px-4 text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition"
            />
          </div>
        </div>

        {/* Short Optional Note */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-neutral-800 mb-1.5"
          >
            Anything else you&apos;d like to mention?{" "}
            <span className="text-neutral-400 font-normal">(optional)</span>
          </label>
          <textarea
            id="message"
            rows={2}
            placeholder="Preferred airports, working hours, or questions..."
            {...register("message")}
            className="w-full rounded-xl border border-neutral-300 bg-white p-3.5 text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition"
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-xl bg-lime-400 hover:bg-lime-500 text-neutral-950 font-bold text-base shadow-xs transition cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending your application...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
