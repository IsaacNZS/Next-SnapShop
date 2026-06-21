"use client";
import React, { useEffect, useState } from "react";
import { columns } from "./Coloumn";
import { allproducts } from "@/sever/actions/product";
import { DataTable } from "./DataTable";

const Productspage = () => {
  type Product = {
    id: string;
    image: string | null;
    description: string;
    title: string;
    price: string;
    createdAt: Date | null;
  };
  const [products, setproducts] = useState<Product[]>([]);

  const allproducts1 = async () => {
    try {
      const res = await allproducts();
      setproducts(res.products);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    allproducts1();
  }, []);
  return (
    <div>
      <DataTable columns={columns} data={products} />
    </div>
  );
};

export default Productspage;
