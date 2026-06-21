"use client";
import SubmitBtn from "@/app/components/Button";
import { resetpassword } from "@/sever/actions/register";
import { toast } from "sonner";

const page = () => {
  const resetpassword1 = async (formdata: FormData) => {
    try {
      const res = await resetpassword(formdata);
      if (res.success === false) {
        toast.error(`❌ ${res.message} ❌`, {
          richColors: true,
          position: "top-center",
          duration: 3000,
        });
      }
      toast.success(`🥳 ${res.message} 🎉🎉`, {
        richColors: true,
        position: "top-center",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  return (
    <div className="flex mt-5 rounded-[10px] flex-col py-1 px-3 border">
      <h1 className="text-2xl text-green-600 font-bold">
        <i className="fa-regular fa-circle-user"></i> Account
      </h1>
      <div className="flex mt-3 justify-center items-center gap-2 flex-col">
        <p className="text-xl font-bold">
          Your Account Email <i className="fa-solid fa-clipboard-check"></i>
        </p>
        <form action={resetpassword1} className="flex w-full gap-2 flex-col">
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
          <SubmitBtn formtitle={"Submit"} />
        </form>
      </div>
    </div>
  );
};

export default page;
