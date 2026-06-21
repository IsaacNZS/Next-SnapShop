"use client";

import { checktoken } from "@/sever/actions/register";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const page = () => {
  const token = useSearchParams().get("token");
  const router = useRouter();
  const [error, setError] = useState("");

  const handler = () => {
    if (!token) {
      setError("Invalid Token!");
      return;
    }
    checktoken(token).then((res) => {
      if (res.success) {
        toast.success(`🥳 ${res.success} 🎉🎉`, {
          richColors: true,
          position: "top-center",
          duration: 4000,
        });
        router.push("/change-password/");
      }
      if (res.error) {
        setError(res.error);
      }
    });
  };
  useEffect(() => {
    handler();
  }, []);

  return (
    <div className="border rounded-[10px] mt-5 px-3 py-2 w-[95%] mx-auto">
      <div className="flex flex-col gap-4 items-center justify-center">
        <h1 className="text-green-500 text-3xl font-bold">Email Confirming</h1>

        <p className="text-red-500 text-center text-xl my-4 font-bold">
          {error}
        </p>

        <button className="bg-green-500 rounded-[10px] text-white my-2 font-bold py-2 px-3">
          {error ? "Complete" : "Checking..."}
        </button>
      </div>
    </div>
  );
};

export default page;
