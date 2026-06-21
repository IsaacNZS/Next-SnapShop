"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCartStore } from "@/store/Cart-store";
import Image from "next/image";

export function TableDemo() {
  const items = useCartStore((state) => state.cart);
  const addtocart = useCartStore((state) => state.addToCart);
  const reducetoCart = useCartStore((state) => state.removeFromCart);

  const totalFun = (price: number, quantity: number) => {
    return price * quantity;
  };

  const totalAmount = items.reduce((total, item) => {
    return (
      total + Number(item.price.replace(" MMK", "")) * item.variant.quantity
    );
  }, 0);

  return (
    <Table>
      <TableCaption>A list of your added items.</TableCaption>

      <TableHeader>
        <TableRow>
          <TableHead className="w-25">Product</TableHead>
          <TableHead className="text-center">Image</TableHead>
          <TableHead className="text-center">Quantity</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium text-[12px]">
              {item.name}
            </TableCell>
            <TableCell>
              <Image
                alt="cart-photo"
                width={50}
                height={60}
                src={item.image}
                className="w-13 mx-auto h-15"
              />
            </TableCell>
            <TableCell className="text-center">
              <div className="flex items-center gap-1 justify-center">
                {" "}
                <i
                  onClick={() =>
                    addtocart({
                      ...item,
                      variant: {
                        variantId: item.variant.variantId,
                        quantity: 1,
                      },
                    })
                  }
                  className="fa-solid text-[15px] text-green-500 fa-square-plus"
                ></i>
                {item.variant.quantity}x
                <span className="text-[10px]">
                  ({Number(item.price.replace(" MMK", "")).toLocaleString()})
                </span>
                <i
                  onClick={() => {
                    reducetoCart({
                      ...item,
                      variant: {
                        variantId: item.variant.variantId,
                        quantity: 1,
                      },
                    });
                  }}
                  className="fa-solid text-[15px] text-green-500 fa-square-minus"
                ></i>
              </div>
            </TableCell>
            <TableCell className="text-right text-[12px]">
              {totalFun(
                Number(item.price.replace(" MMK", "")),
                item.variant.quantity,
              ).toLocaleString()}
              {""}
              <span className="text-gray-500 text-[12px]"> MMK</span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">
            {totalAmount.toLocaleString()}{" "}
            <span className="text-gray-700 text-[14px]"> MMK</span>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
