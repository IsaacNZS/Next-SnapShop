"use client";
import { userInfo } from "@/sever/actions/register";
import { Session } from "next-auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DasNav = ({ user }: Session) => {
  interface User {
    id: string;
    name: string | null;
    email: string | null;
    password: string | null;
    emailVerified: Date | null;
    image: string | null;
    isTwo: boolean | null;
    role: "user" | "admin" | null;
  }
  const route = useRouter();
  const email = user?.email;
  const [pageloading, setPageLoading] = useState(false);
  const [user1, setUser1] = useState<User | null>();
  const pathname = usePathname();
  const userInfo1 = async (email: string) => {
    try {
      setPageLoading(true);
      const res = await userInfo(email);
      if (res.success) {
        setUser1(res.result);
      }
      if (!res.success) {
        route.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    userInfo1(email!);
  }, [email]);

  return (
    <div className="flex shadow-lg border-b-green-500 border-b my-4 items-center justify-between mx-auto">
      {user1?.role === "admin" && (
        <>
          {" "}
          <Link
            href={"/dashboard/analysis"}
            className={
              pathname === "/dashboard/analysis"
                ? "text-green-500 border-b-2 py-2 border-green-500 text-[10px]"
                : "text-[10px] py-2"
            }
          >
            <i className="fa-solid fa-chart-column"></i> Analysis
          </Link>
          <Link
            href={"/dashboard/createproduct"}
            className={
              pathname === "/dashboard/createproduct"
                ? "text-green-500 border-b-2 py-2 border-green-500 text-[10px]"
                : "text-[10px] py-2"
            }
          >
            <i className="fa-brands fa-unity"></i> Create Products
          </Link>
          <Link
            href={"/dashboard/products"}
            className={
              pathname === "/dashboard/products"
                ? "text-green-500 border-b-2 py-2 border-green-500 text-[10px]"
                : "text-[10px] py-2"
            }
          >
            <i className="fa-solid fa-cart-arrow-down"></i> Products
          </Link>
        </>
      )}

      <Link
        href={"/dashboard/orders"}
        className={
          pathname === "/dashboard/orders"
            ? "text-green-500 border-b-2 py-2 border-green-500 text-[10px]"
            : "text-[10px] py-2"
        }
      >
        <i className="fa-solid fa-truck-moving"></i> Orders
      </Link>
      <Link
        href={`/dashboard/settings?email=${user?.email}`}
        className={
          pathname === "/dashboard/settings"
            ? "text-green-500 border-b-2 py-2 border-green-500 text-[10px]"
            : "text-[10px] py-2"
        }
      >
        <i className="fa-solid animate-spin fa-gear active:border-b-2"></i>{" "}
        Settings
      </Link>
    </div>
  );
};

export default DasNav;
