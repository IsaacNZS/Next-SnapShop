"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Field, FieldGroup } from "@/components/ui/field";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Adminaction from "./adminaction";

type Orders = {
  id: number;
  userID: string;
  total: number;
  status: string;
  created: Date | null;
  receiptURL: string | null;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    password: string | null;
    emailVerified: Date | null;
    image: string | null;
    isTwo: boolean | null;
    role: "user" | "admin" | null;
    clientId: string | null;
  };
  orderProduct: {
    id: number;
    quantity: number;
    productVariantID: number;
    productID: string;
    orderID: number;
    product: {
      id: string;
      image: string | null;
      description: string;
      title: string;
      price: string;
      createdAt: Date | null;
    };
    productVariants: {
      id: number;
      color: string;
      productType: string;
      productId: string;
      updatedAt: Date | null;
      variantImage: {
        id: number;
        name: string;
        imageUrl: string;
        size: string;
        order: number;
        variantId: number;
      }[];
    };
  }[];
};

type Prop = {
  orders: Orders[];
  userEmail: string;
};

export function Ordertable({ orders, userEmail }: Prop) {
  const [orderList, setOrderList] = useState(orders);

  const handleStatusChange = (id: number, status: string) => {
    setOrderList((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order)),
    );
  };

  return (
    <div className="rounded-[10px] border w-[98%] py-1 mx-auto">
      {" "}
      <Table>
        <TableCaption>A list of your ordered items.</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead className="text-center">Total</TableHead>
            <TableHead className="text-center">Ordered On</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">User action</TableHead>
            {userEmail === "jas794613@gmail.com" && (
              <TableHead className="text-right">Admin action</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderList.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium text-[12px]">
                {item.id}
              </TableCell>
              <TableCell>
                <div className="font-medium gap-1 flex justify-center items-center text-[12px]">
                  {" "}
                  {item.total.toLocaleString()}
                  <span className="text-gray-500 text-[11px]"> MMK</span>
                </div>
              </TableCell>
              <TableCell className="text-center text-[12px]">
                {item.created?.toLocaleString()}
              </TableCell>
              <TableCell className="flex justify-center items-center">
                {item.status === "pending" ? (
                  <button className="text-white w-22 animate-pulse text-[12px] font-bold rounded-[7px] bg-orange-400 px-3 py-1 ">
                    pending
                  </button>
                ) : item.status === "completed" ? (
                  <button className="text-white w-22 animate-pulse text-[12px] font-bold rounded-[7px] bg-green-500 px-3 py-1">
                    completed
                  </button>
                ) : (
                  <button className="text-white w-22 animate-pulse text-[12px] font-bold rounded-[7px] bg-red-500 px-3 py-1">
                    cancelled
                  </button>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className=" text-blue-500 underline text-[12px] cursor-pointer">
                      {" "}
                      View detail
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Order details</DialogTitle>
                      <DialogDescription>
                        Buyer's name : {item.user?.name}
                      </DialogDescription>
                      <DialogDescription>
                        Order's total price : {item.total.toLocaleString()} MMK
                      </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                      <Field>
                        {" "}
                        <Table className="px-2 py-2 rounded-2xl border w-[98%] mx-auto">
                          <TableCaption>Stay home,stay save.</TableCaption>

                          <TableHeader>
                            <TableRow>
                              <TableHead>Image</TableHead>
                              <TableHead className="text-center">
                                Product
                              </TableHead>
                              <TableHead className="text-center">
                                Price
                              </TableHead>
                              <TableHead className="text-center">
                                Variant
                              </TableHead>
                              <TableHead className="text-right">
                                Quantity
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {item.orderProduct.map((items, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium text-[12px]">
                                  <Image
                                    alt="photos"
                                    width={50}
                                    height={50}
                                    src={
                                      items.productVariants.variantImage[0]
                                        .imageUrl!
                                    }
                                    className="w-11 h-10"
                                  />
                                </TableCell>
                                <TableCell>{items.product.title}</TableCell>
                                <TableCell className="text-center text-[12px]">
                                  {Number(
                                    items.product.price.replace(" MMK", ""),
                                  ).toLocaleString()}{" "}
                                  MMK
                                </TableCell>
                                <TableCell className="text-center">
                                  <i
                                    style={{
                                      color: items.productVariants.color,
                                    }}
                                    className={cn(
                                      `fa-solid fa-square border-2 border-black rounded-[5px]`,
                                    )}
                                  ></i>
                                </TableCell>
                                <TableCell className="text-center">
                                  {items.quantity}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>{" "}
                      </Field>
                    </FieldGroup>
                  </DialogContent>
                </Dialog>
              </TableCell>
              {userEmail === "jas794613@gmail.com" && (
                <TableCell className="text-right">
                  <Adminaction
                    id={item.id}
                    status={item.status}
                    uifun={handleStatusChange}
                  />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>{" "}
    </div>
  );
}
