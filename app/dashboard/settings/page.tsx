"use client";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import {
  changeprofile,
  isTwo,
  updateProfile,
  userInfo,
} from "@/sever/actions/register";
import SubmitBtn from "../../components/Button";
import { toast } from "sonner";
import { useUploadThing } from "@/app/lib/uploading";

const page = () => {
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
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [user, setUser] = useState<User | null>();
  const route = useRouter();
  const [pageLoading, setPageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [profileloading, setProfileloading] = useState(false);
  const { startUpload } = useUploadThing("imageUploader");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileloading(true);
    if (!file) return;

    try {
      const res = await startUpload([file]);

      const imageUrl = res?.[0]?.ufsUrl;
      if (!imageUrl) return null;
      if (!email) return null;

      // DB update
      const response = await updateProfile(imageUrl, email);
      if (response.success) {
        await userInfo1(email!);
        toast.success(`🥳 ${response.message} 🎉🎉`, {
          richColors: true,
          position: "top-center",
          duration: 2700,
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setProfileloading(false);
    }
  };

  const istwo = async (email: string | null) => {
    try {
      setLoading(true);
      const res = await isTwo(email);
      if (res) {
        await userInfo1(email!);
        toast.success(`🥳 Successfully Changed 🎉🎉`, {
          richColors: true,
          position: "top-center",
          duration: 2700,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const changeprofile1 = async (formdata: FormData) => {
    try {
      const res = await changeprofile(formdata);
      if (res.success) {
        await userInfo1(email!);
        toast.success(`🥳 ${res.message} 🎉🎉`, {
          richColors: true,
          position: "top-center",
          duration: 2700,
        });
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const userInfo1 = async (email: string) => {
    try {
      setPageLoading(true);
      const res = await userInfo(email);
      if (res.success) {
        setUser(res.result);
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
    <div className="flex gap-4 md:w-[50%] lg:w-[50%] mx-auto flex-col font-bold w-full rounded-2xl h-auto px-3 py-3 border shadow-2xl">
      <h1 className="text-3xl text-center text-green-500">Profile Settings</h1>
      <div className="items-center h-30 relative border rounded-2xl px-2 py-2 gap-2 flex">
        <Image
          src={user?.image ? user.image : "/profile.png"}
          alt="Picture of the author"
          width={50}
          height={50}
          className="rounded-full w-auto h-auto"
        />
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="avatar"
            className="absolute bottom-7 left-0 cursor-pointer"
          >
            <i className="fa-solid text-lg text-green-500 fa-camera"></i>
          </label>

          <input
            id="avatar"
            type="file"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (selected) {
                setFile(selected);
              }
            }}
            className="hidden"
          />
          <button
            className="text-[10px] absolute bottom-0 bg-green-500 left-1 text-white rounded-[5px] px-2 py-1"
            type="submit"
          >
            {profileloading ? "Updating" : "Update"}
          </button>
        </form>

        <div className="flex w-full items-center justify-between">
          <div className="flex text-[13px] flex-col gap-1">
            <p>{pageLoading ? "Updating..." : user?.name}</p>
            <p>{pageLoading ? "Updating..." : user?.email}</p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <i className="fa-solid fa-pen-to-square"></i>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <form action={changeprofile1}>
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when
                    you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                  <Field>
                    <Label htmlFor="name-1">Name</Label>
                    <Input
                      id="name-1"
                      name="name"
                      defaultValue={user?.name || ""}
                    />
                  </Field>
                  <Field>
                    <Label htmlFor="email-1">Email</Label>
                    <Input
                      id="email-1"
                      name="email"
                      defaultValue={user?.email || ""}
                      readOnly
                    />
                  </Field>
                </FieldGroup>
                <DialogFooter className="lg:flex md:flex md:items-center md:justify-end lg:items-center lg:justify-end">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>

                  <SubmitBtn formtitle="Save Changes" />
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex items-center justify-between border rounded-xl px-4 py-2">
        <Link href="/change-password">Change Your Password</Link>
        <i className="fa-solid text-green-500 text-xl fa-key"></i>
      </div>
      <div className="flex items-center justify-between border rounded-xl px-4 py-2">
        <p>Two factor Authentication</p>
        {!loading ? (
          user?.isTwo ? (
            <i
              onClick={() => istwo(email)}
              className="fa-solid fa-toggle-on text-2xl text-green-500"
            ></i>
          ) : (
            <i
              onClick={() => istwo(email)}
              className="fa-solid fa-toggle-off text-2xl text-red-500"
            ></i>
          )
        ) : (
          <i className="fa-solid animate-spin text-green-500 fa-spinner"></i>
        )}
      </div>
      <button
        onClick={async () => {
          await signOut({
            callbackUrl: "/login",
          });
        }}
        className="w-[50%] mx-auto rounded-[10px] text-center px-4 py-2 bg-red-400 text-white hover:bg-red-500"
      >
        <i className="fa-solid fa-right-from-bracket"></i> Logout
      </button>
    </div>
  );
};

export default page;
