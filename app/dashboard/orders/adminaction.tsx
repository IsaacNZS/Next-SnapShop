"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { Adminstatus } from "@/sever/actions/payment";
import { useState } from "react";
import { toast } from "sonner";

type statusType = {
  id: number;
  status: string;
  uifun: (id: number, status: string) => void;
};

const Adminaction = ({ id, status, uifun }: statusType) => {
  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);

  const Statuschange = async (id: number, cstatus: string) => {
    try {
      setloading(true);
      const res = await Adminstatus(id, cstatus);
      if (res?.error) {
        toast.success(` ${res.error} `, {
          richColors: true,
          position: "top-center",
          duration: 3000,
        });
      }
      if (res?.success) {
        uifun(id, cstatus);
        setCurrentStatus(cstatus);
        toast.success(`🥳 ${res.success} 🎉🎉`, {
          richColors: true,
          position: "top-center",
          duration: 3000,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
      setOpen(!open);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className=" text-blue-500 underline text-[12px] cursor-pointer">
          {" "}
          Admin action
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Status details</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <button
              onClick={() => {
                Statuschange(id, "pending");
              }}
              className={cn(
                "text-white font-bold text-[13px] rounded-[7px] bg-orange-400 px-3 py-2",
                currentStatus === "pending" && "animate-pulse",
              )}
            >
              {loading ? (
                <i className="fa-solid fa-arrow-rotate-right fa-spin"></i>
              ) : (
                "pending"
              )}
            </button>
            <button
              onClick={() => {
                Statuschange(id, "completed");
              }}
              className={cn(
                "text-white font-bold text-[13px] rounded-[7px] bg-green-500 px-3 py-2",
                currentStatus === "completed" && "animate-pulse",
              )}
            >
              {loading ? (
                <i className="fa-solid fa-arrow-rotate-right fa-spin"></i>
              ) : (
                "completed"
              )}
            </button>
            <button
              onClick={() => {
                Statuschange(id, "cancelled");
              }}
              className={cn(
                "text-white font-bold text-[13px] rounded-[7px] bg-red-500 px-3 py-2",
                currentStatus === "cancelled" && "animate-pulse",
              )}
            >
              {loading ? (
                <i className="fa-solid fa-arrow-rotate-right fa-spin"></i>
              ) : (
                "cancelled"
              )}
            </button>
          </Field>
        </FieldGroup>
      </DialogContent>
    </Dialog>
  );
};

export default Adminaction;
