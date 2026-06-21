"use client";
import { loginwithOTP } from "@/sever/actions/login";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import SubmitBtn from "../components/Button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const Auth = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const password = searchParams.get("password");

  const loginwithotp1 = async (formdata: FormData) => {
    try {
      const res = await loginwithOTP(formdata);
      if (!res) return;
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
        toast.success(`🥳 ${res.message} 🎉🎉`, {
          richColors: true,
          position: "top-center",
          duration: 3000,
        });
        router.push("/");
        router.refresh();
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

  return (
    <div className="flex mt-5 rounded-[10px] flex-col py-1 px-3 border">
      <h1 className="text-2xl text-green-600 font-bold">
        <i className="fa-regular fa-circle-user"></i> Verify Account
      </h1>
      <div className="flex mt-3 justify-center items-center gap-2 flex-col">
        <form action={loginwithotp1} className="flex w-full gap-2 flex-col">
          <div className="flex text-green-800 flex-col gap-2">
            <div className="flex text-green-800 flex-col gap-2">
              <input
                type="email"
                placeholder="snapshop@gmail.com"
                className="border-2 py-2 px-3 rounded-[10px] focus:none"
                name="email"
                defaultValue={email || ""}
                hidden
              />
            </div>
            <div className="flex text-green-800 flex-col gap-2">
              <div className="relative w-full">
                {" "}
                <input
                  type={showPassword ? "text" : "password"}
                  className="border-2 w-full py-2 px-3 rounded-[10px] focus:none"
                  name="password"
                  min={8}
                  placeholder="********"
                  defaultValue={password || ""}
                  hidden
                />
              </div>
            </div>
            <InputOTP name="otp" maxLength={6} id="otp-verification" required>
              <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator className="mx-2" />
              <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <button className="text-left">Resend</button>
            <SubmitBtn formtitle="Verify" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
