"use client";
import { useEffect, useState } from "react";
import { VariantsWithProduct } from "../lib/inter-types";
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
import Image from "next/image";
import Link from "next/link";

type ProductwithV = {
  res: VariantsWithProduct[];
};

const Homenav = ({ res }: ProductwithV) => {
  const [search, setSearch] = useState("");
  const [sdata, setSdata] = useState<VariantsWithProduct[] | []>([]);

  const filteredData = () => {
    if (!search.trim()) {
      setSdata([]);
      return;
    }
    const searvhD = search.toLowerCase();
    const data = res.filter((p) =>
      p?.products?.title?.toLowerCase().includes(searvhD),
    );
    setSdata(data);
  };

  useEffect(() => {
    filteredData();
  }, [search]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        onChange={(e) => setSearch(e.target.value)}
        className="text-[12px] font-bold shadow-lg w-full sm:w-[50%] md:w-[50%] lg:w-[50%] rounded-[10px] border-2 px-6 py-2"
        placeholder="Search products..."
      />
      <i className="fa-solid absolute top-3 left-2 fa-magnifying-glass"></i>
      {sdata.length !== 0 && (
        <div className="w-full md:w-[60%] lg:w-[60%] scrollbar-none shadow-lg overflow-y-auto max-h-100 absolute top-10 left-0 bg-white px-3 py-2 rounded-[10px] border-2 z-20">
          <p>{sdata.length} results found.</p>
          <Table>
            <TableBody>
              {sdata.map((p, index) => (
                <TableRow key={index}>
                  <Link
                    href={`/product/${p.products?.id}?color=${encodeURIComponent(p.color)}&title=${p.products?.title}&productType=${p.productType}&price=${p.products?.price}&image=${p.variantImage[0]?.imageUrl}&vid=${p.id}`}
                    className="flex justify-between items-center"
                  >
                    <TableCell>
                      <Image
                        alt="cart-photo"
                        width={50}
                        height={60}
                        src={p?.variantImage[0]?.imageUrl}
                        className="w-13 mx-auto h-15"
                      />
                    </TableCell>
                    <TableCell className="font-medium text-[12px]">
                      {p?.products?.title}
                    </TableCell>
                    <TableCell className="font-medium text-[12px]">
                      {p?.products?.price}
                    </TableCell>
                  </Link>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Homenav;
