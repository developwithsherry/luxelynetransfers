"use client";
import { useState, useEffect } from "react";
import { useBooking } from "@/context/booking-context";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "../ui/card";
import { useVehicles } from "@/context/vehicle-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { useAddons } from "@/context/addon-context";
import { Loader2 } from "lucide-react";
import type { Booking } from "@/types/booking";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Initialize Stripe Client
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function StripeCheckoutForm({
  clientSecret,
  booking,
  selectedAddon,
  onOpenChange,
  isProcessing,
  setIsProcessing,
  setError,
}: {
  clientSecret: string;
  booking: Booking;
  selectedAddon: any;
  onOpenChange: (open: boolean) => void;
  isProcessing: boolean;
  setIsProcessing: (proc: boolean) => void;
  setError: (err: string | null) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;

      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${booking.first_name || ""} ${booking.last_name || ""}`,
              email: booking.email || "",
              phone: booking.phone || "",
            },
          },
        }
      );

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        // Call backend API to confirm status in DB and send email notifications
        const response = await fetch("/api/stripe/confirm-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            bookingId: booking.id,
          }),
        });

        const confirmData = await response.json();
        if (!response.ok) {
          throw new Error(confirmData.error || "Failed to record transaction status");
        }

        onOpenChange(false);
        router.push(`/booking-success?orderID=${paymentIntent.id}`);
      } else {
        throw new Error("Payment confirmation was unsuccessful");
      }
    } catch (err: any) {
      setError(err.message || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="space-y-6">
      <div className="p-4 border rounded bg-gray-50 dark:bg-gray-800">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Card Details
        </label>
        <div className="p-3 border rounded bg-white dark:bg-gray-900">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#32325d",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#fa755a",
                  iconColor: "#fa755a",
                },
              },
            }}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-lime-500 hover:bg-lime-600 text-black font-bold py-3 rounded shadow transition flex items-center justify-center gap-2"
      >
        {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
        {isProcessing ? "Processing Payment..." : `Pay £${(booking.total_amount + (selectedAddon?.price ?? 0)).toLocaleString()}`}
      </Button>
    </form>
  );
}

export function Checkout({ open, onOpenChange }: Props) {
  const { booking } = useBooking();
  const { selectedVehicle } = useVehicles();
  const { selectedAddon } = useAddons();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingSecret, setLoadingSecret] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !booking || !booking.total_amount) return;

    const fetchSecret = async () => {
      setLoadingSecret(true);
      setError(null);
      try {
        let newBooking: Booking;
        if (selectedAddon) {
          newBooking = {
            ...booking,
            total_amount: (booking.total_amount || 0) + selectedAddon.price,
          };
        } else {
          newBooking = { ...booking };
        }

        const response = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newBooking),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to initiate Stripe payment session");
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingSecret(false);
      }
    };

    fetchSecret();
  }, [open, booking, selectedAddon]);

  const handleCancelClick = () => {
    onOpenChange(false);
    window.location.href = "/";
  };

  function formatLocation(location: string): string {
    if (!location) return "";
    return location.split(",")[0]?.trim() || location;
  }

  if (!booking || !booking.total_amount) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent
        className="max-w-4xl max-h-[90vh] flex flex-col"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Complete Your Payment</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          {/* Booking Summary */}
          <Card className="mb-6 w-full rounded border bg-white dark:bg-gray-900">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Payment Summary</h3>

              <div className="space-y-6 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Booking Service</span>
                  <span className="text-gray-700">
                    {`${formatLocation(booking.pickup_location || "")} → ${formatLocation(booking.drop_off_location || "")}`}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Selected Vehicle</span>
                  <span className="text-gray-700">{selectedVehicle?.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-semibold">Fare</span>
                  <span className="text-lime-600 font-bold">£ {booking.total_amount.toLocaleString()}</span>
                </div>

                {selectedAddon && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Addon</span>
                    <span className="text-lime-600 font-bold">£ {selectedAddon.price.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">Total</span>
                  <span className="text-lime-700 font-extrabold text-lg">
                    £ {(booking.total_amount + (selectedAddon?.price ?? 0)).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 border border-red-200 rounded-md bg-red-50">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Stripe payment element loading / rendering */}
          <div className="w-full max-w-4xl">
            {loadingSecret ? (
              <div className="flex justify-center items-center py-12 gap-2">
                <Loader2 className="animate-spin h-6 w-6 text-primary" />
                <span className="text-sm text-muted-foreground">Initializing secure payment...</span>
              </div>
            ) : clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripeCheckoutForm
                  clientSecret={clientSecret}
                  booking={booking}
                  selectedAddon={selectedAddon}
                  onOpenChange={onOpenChange}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                  setError={setError}
                />
              </Elements>
            ) : (
              <div className="text-center py-6 text-sm text-red-500 font-medium">
                {error || "Failed to initialize payment form."}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="destructive" disabled={isProcessing} onClick={handleCancelClick}>
            Cancel Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
