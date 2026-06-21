"use server";

import { Stripe } from "stripe";
import { auth } from "../auth";
import { db } from "..";
import { orderProduct, orders } from "../schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type Prop = {
  amount: number;
  currency: string;
  cart: {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
};

type Orderprop = {
  totalprice: number;
  status: "pending" | "completed" | "cancelled";
  paymentId: string;
  products: {
    productId: string;
    quantity: number;
    vatiantId: number;
  }[];
};

export const processPayment = async ({ amount, currency, cart }: Prop) => {
  const user = await auth();
  if (!user) return { error: "You need to logged in First!" };
  if (!amount) return { error: "No products in your cart!" };
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      cart: JSON.stringify(cart),
    },
  });
  return {
    success: {
      paymentIntentId: paymentIntent.id,
      clientSecretId: paymentIntent.client_secret,
      user_email: user.user?.email,
    },
  };
};

export const orderAdd = async ({ totalprice, status, products }: Orderprop) => {
  try {
    const user = await auth();
    console.log("SESSION =>", user);
    if (!user?.user?.id) {
      return { error: "You need to logged in First!" };
    }

    const order = await db
      .insert(orders)
      .values({
        userID: user.user.id,
        total: totalprice,
        status,
      })
      .returning();

    await Promise.all(
      products.map(({ productId, quantity, vatiantId }) =>
        db.insert(orderProduct).values({
          quantity,
          productVariantID: vatiantId,
          productID: productId,
          orderID: order[0].id,
        }),
      ),
    );

    return {
      success: "You Successfully added",
    };
  } catch (error) {
    console.log("ORDER ERROR =>", error);

    return {
      error: "Order Create Failed",
    };
  }
};

export const Adminstatus = async (id: number, status: string) => {
  try {
    const res = await db
      .update(orders)
      .set({
        status,
      })
      .where(eq(orders.id, id));
    if (!res) {
      return { error: "Fail!" };
    } else {
      return { success: "Succefully changed" };
    }
  } catch (error) {
    console.log(error);
  }
};
