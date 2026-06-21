"use client";

import { Button } from "@/components/ui/button";
import { deleteproduct } from "@/sever/actions/product";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import Variantdialog from "@/app/components/Variantdialog";
import { VariantsWithImagesTags } from "@/app/lib/inter-types";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Product = {
  id: string;
  image: string | null;
  description: string;
  title: string;
  price: string;
  createdAt: Date | null;
};
export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      return <span className="text-[10px]">{id.slice(0, 2)}</span>;
    },
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const imageurl = row.getValue("image") as string;
      return (
        <div className="flex w-15 lg:w-17 md:w-17 sm:w-17  mx-auto items-center justify-center">
          {" "}
          <Image
            alt="image"
            src={imageurl ? imageurl : "/placeholder.jpg"}
            width={52}
            height={52}
            className="w-15 h-15 lg:w-17 lg:h-17 md:w-17 md:h-17 sm:w-17 sm:h-17 items-center justify-center object-cover rounded"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "productvariant",
    header: "Variants",
    cell: ({ row }) => {
      const variant = row.getValue(
        "productvariant",
      ) as VariantsWithImagesTags[];
      return <Variantdialog row={variant} productID={row.original.id} />;
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return <span className="text-[10px] lg:text-[12px]">{title}</span>;
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue("price") as string;
      return <span className="text-[8px] lg:text-[10px]">{price}</span>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const [isoen, setIsopne] = useState(false);
      const deletep = (id: string) => {
        deleteproduct(id);
        toast.success(`🥳 Product Deleted 🎉🎉`, {
          richColors: true,
          position: "top-center",
          duration: 2700,
        });
        window.location.reload();
      };
      return (
        <div className="relative flex items-center justify-center">
          <button onClick={() => setIsopne(!isoen)}>
            <i className="fa-solid fa-ellipsis"></i>
          </button>
          {isoen && (
            <div className="absolute flex-col justify-center items-start z-10 gap-1 bg-white border shadow-lg px-2 py-1 rounded-[10px] flex top-4 right-5">
              <span className="self-center font-bold">Actions</span>
              <Link
                href={`/dashboard/createproduct?editid=${row.original.id}`}
                className="text-green-500"
              >
                Edit Product
              </Link>
              <button
                onClick={() => deletep(row.original.id)}
                className="text-red-500"
              >
                Delete Product
              </button>
            </div>
          )}
        </div>
      );
    },
  },
];
