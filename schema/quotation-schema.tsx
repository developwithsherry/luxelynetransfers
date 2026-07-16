import * as z from "zod"
export const QuotationFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  pickUpLocation: z.string().min(3, {
    message: "Pick-up location must be at least 3 characters.",
  }),
  pickUpDate: z.date({
    required_error: "Please select a pick-up date.",
  }),
  phoneNo: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
})
