"use client";
import { Session } from "next-auth";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import DrawerinCart from "../product/[id]/DrawerinCart";

const Navcom = ({ user }: Session) => {
  const [isOpen, setIsOpen] = useState(false);
  const route = useRouter();

  return (
    <div className="flex z-50 mb-3 px-3 py-2 rounded-[10px] shadow-xl flex-col w-full">
      <div className="flex items-center relative justify-between">
        {" "}
        <div className="flex items-center gap-1">
          {" "}
          <div className="flex flex-col justify-center gap-1 text-green-500">
            <Link
              href={"/"}
              className="text-xl md:text-2xl lg:text-2xl font-bold"
            >
              Snap-Shop
            </Link>
          </div>
          <i className="fa-brands text-2xl md:text-3xl lg:text-3xl  text-green-500 fa-shopify"></i>
        </div>
        <div className="flex items-center gap-2">
          <DrawerinCart />
          <Link
            className="text-[12px] border px-3 py-1 font-bold rounded-[5px] text-green-500"
            href={user ? "/dashboard/orders" : "/register/"}
          >
            {user ? "Orders" : "Register"}
          </Link>
          {!user ? (
            <Link
              className="text-[12px] bg-green-400 px-3 py-1 font-bold rounded-[5px] text-white"
              href={"/login/"}
            >
              <i className="fa-solid fa-arrow-right-to-bracket"></i> Login
            </Link>
          ) : (
            <button onClick={() => setIsOpen(!isOpen)}>
              {user.image ? (
                <div className="border-2 border-green-500 rounded-full">
                  <Image
                    src={user?.image ? user.image : "/profile.png"}
                    alt="Picture of the author"
                    width={50}
                    height={50}
                    className="rounded-full w-10 h-10 border-white border-2"
                  />
                </div>
              ) : (
                <i className="fa-solid fa-circle-user relative text-3xl text-green-800"></i>
              )}
            </button>
          )}{" "}
        </div>
      </div>
      {isOpen && (
        <div className="flex px-4 py-2 flex-col absolute mt-10 w-auto items-center font-bold top-10 right-7 bg-white border rounded-lg shadow-xl">
          <div className="flex flex-col hover:bg-gray-100">
            <div className="w-full px-4 py-2 rounded-2xl text-white bg-green-500 hover:bg-gray-100">
              <div className="flex items-center gap-2">
                {" "}
                <Image
                  src={user?.image ? user.image : "/profile.png"}
                  alt="Picture of the author"
                  width={50}
                  height={50}
                  className="rounded-full w-13 h-13 border-white border-2"
                />{" "}
                Account Infomation
              </div>
              <p className=" px-4 py-2 hover:bg-gray-100">
                <i className=" fa-solid fa-user"></i> {user?.name}
              </p>
              <p className=" px-4 py-2 hover:bg-gray-100">
                <i className="fa-solid fa-envelope"></i> {user?.email}
              </p>
            </div>
          </div>
          <div className="flex flex-col w-full justify-center items-start mt-3 gap-3">
            {" "}
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className=" hover:bg-gray-100"
            >
              <i className="fa-solid fa-house"></i> Home
            </Link>
            <Link
              href={`/dashboard/settings?email=${user?.email}`}
              onClick={() => setIsOpen(false)}
              className=" hover:bg-gray-100"
            >
              <i className="fa-solid animate-spin fa-gear"></i> Settings
            </Link>
            <Link
              href="/change-password"
              onClick={() => setIsOpen(false)}
              className=" hover:bg-gray-100"
            >
              <i className="fa-solid fa-key"></i> Change Password
            </Link>
            <button
              onClick={() => {
                (signOut(), setIsOpen(false), route.push("/login/"));
              }}
              className="w-full text-center bg-red-400 text-white hover:bg-red-300"
            >
              <i className="fa-solid fa-right-from-bracket"></i> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navcom;
