"use client";
import SubmitBtn from "@/app/components/Button";
import { stripeinit } from "@/lib/stripe.init";
import { orderAdd, processPayment } from "@/sever/actions/payment";
import { useCartStore } from "@/store/Cart-store";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { toast } from "sonner";

const stripeI = stripeinit();

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");
  const items = useCartStore((state) => state.cart);
  const cartposition = useCartStore((s) => s.setCartPosition);

  const totalAmountMMK = items.reduce((total, item) => {
    return (
      total + Number(item.price.replace(" MMK", "")) * item.variant.quantity
    );
  }, 0);
  const totalAmount = totalAmountMMK / 40;

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setloading(true);
    if (!stripe || !elements) {
      setloading(false);
      return;
    }
    const { error } = await elements.submit();
    if (error) {
      setloading(false);
      seterror(error.message!);
      return;
    }
    const res = await processPayment({
      amount: totalAmount,
      currency: "usd",
      cart: items.map((c) => ({
        id: c.id,
        name: c.name,
        image: c.image,
        price: Number(c.price.replace(" MMK", "")),
        quantity: c.variant.quantity,
      })),
    });
    if (res.error) {
      setloading(false);
      if (res.error) {
        toast.error(` ${res.error} `, {
          richColors: true,
          position: "top-center",
          duration: 3000,
        });
      }
      seterror(res.error);
      return;
    }
    if (res.success) {
      const paymentres = await stripe.confirmPayment({
        elements,
        clientSecret: res.success.clientSecretId!,
        redirect: "if_required",
        confirmParams: {
          return_url: process.env.NEXT_PUBLIC_LOCAL_URL!,
          receipt_email: res.success.user_email!,
        },
      });
      if (paymentres.error) {
        setloading(false);
        seterror(paymentres.error.message!);
        return;
      } else {
        try {
          const Orderres = await orderAdd({
            totalprice: totalAmountMMK,
            paymentId: res.success.paymentIntentId,
            status: "pending",
            products: items.map((i) => ({
              productId: i.id,
              quantity: i.variant.quantity,
              vatiantId: i.variant.variantId,
            })),
          });

          if (Orderres.error) {
            toast.error(` ${Orderres.error} `, {
              richColors: true,
              position: "top-center",
              duration: 3000,
            });
          }
          if (Orderres.success) {
            cartposition("Success");
          }
        } catch (error) {
          console.log(error);
        } finally {
          setloading(false);
        }
      }
    }
  };

  return (
    <div className="w-full sm:w-[70%] overflow-y-auto h-75 scrollbar-none md:w-[60%] lg:w-[60%] mx-auto">
      {" "}
      <form onSubmit={onSubmitHandler}>
        <PaymentElement />
        {elements && (
          <button
            disabled={loading}
            className="text-[14px] font-bold rounded w-full text-center text-white bg-green-500 my-3 px-3 py-2"
          >
            {loading ? (
              <p>
                <i className="fa-solid fa-spinner fa-spin-pulse"></i>
                <span className="animate-pulse"> Please wait ...</span>
              </p>
            ) : (
              "Submit to Pay"
            )}
          </button>
        )}
      </form>
    </div>
  );
}

const Cartcheckout = () => {
  const items = useCartStore((state) => state.cart);

  const totalAmount = items.reduce((total, item) => {
    return (
      total + Number(item.price.replace(" MMK", "")) * item.variant.quantity
    );
  }, 0);

  return (
    <div>
      <Elements
        stripe={stripeI}
        options={{ mode: "payment", currency: "usd", amount: totalAmount }}
      >
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default Cartcheckout;
