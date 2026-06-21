"use server";

import { eq } from "drizzle-orm";
import { db } from "..";
import {
  orderProduct,
  orders,
  products,
  productvariant,
  users,
} from "../schema";

export const Anadata = async () => {
  const userCount = (await db.select().from(users)).length;
  const productCount = (await db.select().from(products)).length;
  const productvariantCount = (await db.select().from(productvariant)).length;
  const orderproductCount = (await db.select().from(orderProduct)).length;
  const orderCount = (await db.select().from(orders)).length;
  const pendingCount = (
    await db.select().from(orders).where(eq(orders.status, "pending"))
  ).length;
  const completedCount = (
    await db.select().from(orders).where(eq(orders.status, "completed"))
  ).length;
  const cancelledCount = (
    await db.select().from(orders).where(eq(orders.status, "cancelled"))
  ).length;
  return {
    success: {
      userCount,
      productCount,
      productvariantCount,
      pendingCount,
      orderCount,
      orderproductCount,
      completedCount,
      cancelledCount,
    },
  };
};

export const Chartdata = async () => {
  try {
    const productvariantdata = await db.query.productvariant.findMany();
    const orderdata = await db.query.orders.findMany();

    const chartMap = new Map<
      string,
      {
        date: string;
        desktop: number;
        mobile: number;
      }
    >();

    // Orders
    orderdata.forEach((order) => {
      if (!order.created) return;

      const date = order.created.toISOString().split("T")[0];

      if (!chartMap.has(date)) {
        chartMap.set(date, {
          date,
          desktop: 0,
          mobile: 0,
        });
      }

      chartMap.get(date)!.desktop += 1;
    });

    // Product Variants
    productvariantdata.forEach((variant) => {
      if (!variant.updatedAt) return;

      const date = variant.updatedAt.toISOString().split("T")[0];

      if (!chartMap.has(date)) {
        chartMap.set(date, {
          date,
          desktop: 0,
          mobile: 0,
        });
      }

      chartMap.get(date)!.mobile += 1;
    });

    const chartData = Array.from(chartMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    return {
      success: chartData,
    };
  } catch (error) {
    console.log(error);
  }
};
