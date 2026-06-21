"use client";
import { login } from "@/sever/actions/login";
import { register } from "@/sever/actions/register";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import SubmitBtn from "./Button";

type authprop = {
  formtitle: string;
  showprovider: boolean;
  footerlabel: string;
  footerhref: string;
};
const Auth = ({ footerhref, footerlabel, formtitle }: authprop) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const login1 = async (formdata: FormData) => {
    try {
      const res = await login(formdata);
      if (res.success) {
        toast.success("🙏Adding Imformation Please Wait!🙏", {
          richColors: true,
          position: "top-center",
          duration: 2700,
        });
        await signIn("credentials", {
          email: formdata.get("email"),
          password: formdata.get("password"),
          redirect: false,
        });
        toast.success("🥳 You Successfully Logined 🎉🎉", {
          richColors: true,
          position: "top-center",
          duration: 2000,
        });
        router.push("/");
        router.refresh();
      } else if (res.istwo) {
        toast.success(`🥳 ${res.message} 🎉🎉`, {
          richColors: true,
          position: "top-center",
          duration: 3700,
        });
        router.push(
          `/twofactorlogin?email=${res.email}&password=${res.password}`,
        );
      } else {
        toast.error(res.message, {
          richColors: true,
          position: "top-center",
          duration: 2000,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const register1 = async (formdata: FormData) => {
    try {
      const res = await register(formdata);
      if (res.success) {
        toast.success(`🥳 ${res.message} 🎉🎉`, {
          richColors: true,
          position: "top-center",
          duration: 3000,
        });
      } else {
        toast.error(res.message, {
          richColors: true,
          position: "top-center",
          duration: 2000,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const formaction = (formdata: FormData) => {
    if (formtitle === "Register") {
      register1(formdata);
    } else {
      login1(formdata);
    }
  };

  return (
    <div className="flex mt-5 w-full sm:w-[70%] md:w-[50%] lg:w-[50%] mx-auto rounded-[10px] flex-col py-1 px-3 border">
      <h1 className="text-2xl text-green-600 font-bold">
        <i className="fa-regular fa-circle-user"></i> {formtitle} Account
      </h1>
      <div className="flex mt-3 justify-center items-center gap-2 flex-col">
        <p className="text-xl font-bold">
          {formtitle} Form <i className="fa-solid fa-clipboard-check"></i>
        </p>
        <form action={formaction} className="flex w-full gap-2 flex-col">
          {" "}
          {formtitle === "Register" && (
            <div className="flex text-green-800 flex-col gap-2">
              <label className="text-blue-900 font-bold" htmlFor="username">
                User Name
              </label>
              <input
                type="text"
                min={4}
                placeholder="Type full name."
                className="border-2 py-2 px-3 rounded-[10px] focus:none"
                name="username"
              />
            </div>
          )}
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
              Password
            </label>
            <div className="relative w-full">
              {" "}
              <input
                type={showPassword ? "text" : "password"}
                className="border-2 w-full py-2 px-3 rounded-[10px] focus:none"
                name="password"
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
          {formtitle === "Login" && (
            <Link
              href={"/login/reset/"}
              className="text-blue-500 font-bold text-[15px]"
            >
              Forget Password?
            </Link>
          )}
          <SubmitBtn formtitle={formtitle} />
        </form>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="bg-black text-green-100 font-bold text-center py-2 rounded-[10px] w-full mx-auto"
        >
          {formtitle} with Google <i className="fa-brands fa-google"></i>
        </button>
        <button
          onClick={() =>
            signIn("github", {
              callbackUrl: "/",
            })
          }
          className="bg-black text-green-100 font-bold text-center py-2 rounded-[10px] w-full mx-auto"
        >
          {formtitle} with GitHub <i className="fa-brands fa-github"></i>
        </button>
      </div>
      <Link
        href={footerhref}
        className="text-blue-500 font-bold my-4 text-[15px]"
      >
        {footerlabel}
      </Link>
    </div>
  );
};

export default Auth;
