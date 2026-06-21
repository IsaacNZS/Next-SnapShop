"use client";
import SubmitBtn from "@/app/components/Button";
import { changepassword } from "@/sever/actions/register";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const page = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const changepassword1 = async (formdata: FormData) => {
    try {
      const res = await changepassword(formdata);
      if (!res.success) {
        toast.error(`❌ ${res.message} ❌`, {
          richColors: true,
          position: "top-center",
          duration: 5000,
        });
      } else {
        toast.success(`🥳 ${res.message} 🎉🎉`, {
          richColors: true,
          position: "top-center",
          duration: 5000,
        });
        router.push("/login/");
      }
    } catch (error) {
      console.error("Password changing:", error);
    }
  };

  return (
    <div className="flex mt-5 rounded-[10px] flex-col py-1 px-3 border">
      <h1 className="text-2xl text-green-600 font-bold">
        <i className="fa-regular fa-circle-user"></i> Account
      </h1>
      <div className="flex mt-3 justify-center items-center gap-2 flex-col">
        <p className="text-xl font-bold">
          Create Your New Password{" "}
          <i className="fa-solid fa-clipboard-check"></i>
        </p>
        <form action={changepassword1} className="flex w-full gap-2 flex-col">
          <div className="flex text-green-800 flex-col gap-2">
            <div className="flex text-green-800 flex-col gap-2">
              <label className="text-blue-900 font-bold" htmlFor="username">
                Email
              </label>
              <input
                type="email"
                placeholder="snapshop@gmail.com"
                className="border-2 py-2 px-3 rounded-[10px] focus:none"
                name="email"
              />
            </div>
            <div className="flex text-green-800 flex-col gap-2">
              <label className="text-blue-900 font-bold" htmlFor="username">
                New Password
              </label>
              <div className="relative w-full">
                {" "}
                <input
                  type={showPassword ? "text" : "password"}
                  className="border-2 w-full py-2 px-3 rounded-[10px] focus:none"
                  name="newPassword"
                  min={8}
                  placeholder="********"
                />
                <i
                  onClick={() => setShowPassword(!showPassword)}
                  className={`fa-solid ${
                    !showPassword ? "fa-eye-slash" : "fa-eye"
                  } absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer`}
                ></i>
              </div>
            </div>
            <div className="flex text-green-800 flex-col gap-2">
              <label className="text-blue-900 font-bold" htmlFor="username">
                Confirm Password
              </label>
              <div className="relative w-full">
                {" "}
                <input
                  type={showPassword ? "text" : "password"}
                  className="border-2 w-full py-2 px-3 rounded-[10px] focus:none"
                  name="confirmPassword"
                  min={8}
                  placeholder="********"
                />
                <i
                  onClick={() => setShowPassword(!showPassword)}
                  className={`fa-solid ${
                    !showPassword ? "fa-eye-slash" : "fa-eye"
                  } absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer`}
                ></i>
              </div>
            </div>
          </div>
          <SubmitBtn formtitle={"Submit"} />
        </form>
      </div>
    </div>
  );
};

export default page;
