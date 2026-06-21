import { db } from "@/sever";
import { Ordertable } from "./Ordertable";
import { asc, eq } from "drizzle-orm";
import { auth } from "@/sever/auth";
import { orders } from "@/sever/schema";

const Orderpage = async () => {
  const user = await auth();

  const res =
    user?.user?.email === "jas794613@gmail.com"
      ? await db.query.orders.findMany({
          with: {
            user: true,
            orderProduct: {
              with: {
                product: true,
                productVariants: {
                  with: { variantImage: true },
                },
              },
            },
          },
          orderBy: [asc(orders.id)],
        })
      : await db.query.orders.findMany({
          where: eq(orders.userID, user?.user?.id!),
          with: {
            user: true,
            orderProduct: {
              with: {
                product: true,
                productVariants: {
                  with: { variantImage: true },
                },
              },
            },
          },
          orderBy: [asc(orders.id)],
        });
  return <Ordertable orders={res} userEmail={user?.user?.email!} />;
};

export default Orderpage;
