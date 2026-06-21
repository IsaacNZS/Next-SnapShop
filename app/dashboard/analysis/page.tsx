"use client";
import { Anadata } from "@/sever/actions/analytics";
import { useEffect, useState } from "react";
import Countcart from "./countcart";
import { ChartBarInteractive } from "./chartcart";

type success = {
  userCount: number;
  productCount: number;
  productvariantCount: number;
  pendingCount: number;
  orderCount: number;
  orderproductCount: number;
  completedCount: number;
  cancelledCount: number;
};

const Analyticspage = () => {
  const [anadata, setanadata] = useState<success | null>(null);
  const allcount = async () => {
    const res = await Anadata();
    setanadata(res.success);
  };

  useEffect(() => {
    allcount();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {" "}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        <Countcart
          logo="fa-users"
          title="Total Customers"
          count={anadata?.userCount!}
          iconcolr="#0dff00"
          bgcolor="#ffffff"
        />
        <Countcart
          logo="fa-box-open"
          title="Total Products"
          count={anadata?.productCount!}
          iconcolr="#2cceff"
          bgcolor="#ffffff"
        />
        <Countcart
          logo="fa-cubes"
          title="Total Product's Variants"
          count={anadata?.productvariantCount!}
          iconcolr="#6542ff"
          bgcolor="#ffffff"
        />
        <Countcart
          logo="fa-envelopes-bulk"
          title="Ordered Products"
          count={anadata?.orderproductCount!}
          iconcolr="#bf00ff"
          bgcolor="#ffffff"
        />
        <Countcart
          logo="fa-truck"
          title="All Orders"
          count={anadata?.orderCount!}
          iconcolr="#ff30b0"
          bgcolor="#ffffff"
        />
        <Countcart
          logo="fa-clock"
          title="Pending Orders"
          count={anadata?.pendingCount!}
          bgcolor="#FFA500"
          iconcolr="#ffffff"
        />
        <Countcart
          logo="fa-list-check"
          title="Completed Orders"
          count={anadata?.completedCount!}
          bgcolor="#1eff00"
          iconcolr="#ffffff"
        />
        <Countcart
          logo="fa-circle-xmark"
          title="Cancelled Orders"
          count={anadata?.cancelledCount!}
          bgcolor="#ff0000"
          iconcolr="#ffffff"
        />
      </div>
      <ChartBarInteractive />
    </div>
  );
};

export default Analyticspage;
