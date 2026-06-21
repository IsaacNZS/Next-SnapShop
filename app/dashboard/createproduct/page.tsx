"use client";
import SubmitBtn from "@/app/components/Button";
import { useUploadThing } from "@/app/lib/uploading";
import { createandeditproduct, singleproduct } from "@/sever/actions/product";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Createproductpage = () => {
  type single1 = {
    id: string;
    image: string | null;
    description: string;
    title: string;
    price: string;
    createdAt: Date | null;
  };
  const [file, setFile] = useState<File | null>(null);
  const search = useSearchParams();
  const id = search.get("editid");
  const { startUpload } = useUploadThing("imageUploader");
  const [editdata, setEditdata] = useState<single1 | null>();
  const route = useRouter();
  const createandedit = async (formdata: FormData) => {
    try {
      if (!file) return;
      const photo = await startUpload([file]);
      const imageUrl = photo?.[0]?.ufsUrl;
      if (!imageUrl) return;
      const response = await createandeditproduct(formdata, imageUrl);
      if (response?.success) {
        route.push("/dashboard/products");
        toast.success(`🥳 ${response.success} 🎉🎉`, {
          richColors: true,
          position: "top-center",
          duration: 2700,
        });
      } else {
        toast.error(`${response?.error}`, {
          richColors: true,
          position: "top-center",
          duration: 2700,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const single = async (id: string) => {
    try {
      const res = await singleproduct(id);
      setEditdata(res?.single);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!id) return;
    single(id);
  }, []);

  return (
    <form
      action={createandedit}
      className="w-full flex md:w-[50%] lg:w-[50%] mx-auto border rounded-[15px] shadow-xl px-3 py-2 flex-col gap-4"
    >
      <h1 className="text-2xl text-green-600 font-bold">
        {id ? "Edit The Product" : "Create A Product"}
      </h1>{" "}
      <div className="text-[12px] font-bold flex flex-col w-full">
        <p>Product Title</p>
        {editdata && (
          <input
            type="text"
            name="id"
            defaultValue={editdata.id}
            required
            hidden
            className="px-3 py-2 outline-green-500 rounded-[10px] border"
            placeholder="eg . T_Shirt"
          />
        )}
        <input
          type="text"
          name="title"
          defaultValue={editdata ? editdata.title : ""}
          required
          className="px-3 py-2 outline-green-500 rounded-[10px] border"
          placeholder="eg . T_Shirt"
        />
      </div>
      <div className="text-[12px] font-bold flex flex-col w-full">
        {" "}
        <p>Product Image</p>
        <input
          type="file"
          onChange={(e) => {
            const selected = e.target.files?.[0];
            if (selected) {
              setFile(selected);
            }
          }}
          required
          className="px-3 py-2 outline-green-500 rounded-[10px] border"
        />
      </div>
      <div className="text-[12px] font-bold flex flex-col w-full">
        {" "}
        <p>Product Description</p>
        <input
          type="text"
          name="description"
          defaultValue={editdata ? editdata.description : ""}
          required
          className="px-3 py-2 outline-green-500 rounded-[10px] border"
          placeholder="Something..."
        />
      </div>
      <div className="text-[12px] font-bold flex flex-col w-full">
        {" "}
        <div className="flex items-center gap-1">
          {" "}
          <i className="fa-solid fa-dollar-sign"></i>
          <p>Product Price</p>
        </div>
        <input
          type="text"
          name="price"
          required
          placeholder="500MMK"
          className="px-3 py-2 outline-green-500 rounded-[10px] border"
          defaultValue={editdata ? editdata.price : ""}
        />
      </div>
      <SubmitBtn formtitle={editdata ? "Edit Product" : "Create Product"} />
    </form>
  );
};

export default Createproductpage;
