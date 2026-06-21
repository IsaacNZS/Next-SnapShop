"use client";
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
import SubmitBtn from "@/app/components/Button";
import { useUploadThing } from "@/app/lib/uploading";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { VariantsWithImagesTags } from "../lib/inter-types";
import {
  createandupdateVariant,
  deleteV,
  getoldV,
} from "@/sever/actions/variants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  row: VariantsWithImagesTags[];
  productID: string;
};

const Variantdialog = ({ row, productID }: Props) => {
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<{ file?: File; url: string }[]>([]);
  const [tag, setTag] = useState("");
  const [vid, setVid] = useState<number | null>(null);
  const [isedit, setIsedit] = useState(false);
  const [loading, setloading] = useState(false);
  const [old, setOld] = useState<VariantsWithImagesTags | null>(null);
  const { startUpload } = useUploadThing("imageUploader");

  const createandedit = async (formdata: FormData) => {
    try {
      const files = images
        .map((img) => img.file)
        .filter((file): file is File => file !== undefined);
      const uploadedImages = await startUpload(files);
      if (!uploadedImages) return;

      const imageUrls = uploadedImages.map((img) => ({
        imageUrl: img.ufsUrl,
        name: img.name,
        size: String(img.size),
      }));
      const tagData = tags.map((tag) => ({
        tag,
      }));

      const res = await createandupdateVariant(
        formdata,
        productID,
        imageUrls,
        tagData,
      );
      if (res?.success) {
        setOpen(false);
        toast.success(`🥳 ${res.success} 🎉🎉`, {
          richColors: true,
          position: "top-center",
          duration: 2700,
        });
        setTags([]);
        setImages([]);
        setIsedit(false);
        window.location.reload();
      }
      if (res?.error) {
        toast.error(` ${res.error} `, {
          richColors: true,
          position: "top-center",
          duration: 2700,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getold = async (id: number) => {
    try {
      setloading(true);
      if (!id) return;
      const res = await getoldV(id);
      if (res?.success) {
        setOld(res.success);
        setTags(res.success.variantTag.map((t) => t.tag));
        setImages(
          res.success.variantImage.map((i) => ({
            url: i.imageUrl,
          })),
        );
        return;
      }
      toast.error(` Something Wrong `, {
        richColors: true,
        position: "top-center",
        duration: 2700,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  const deletevar = async (id: number) => {
    if (!id) return;
    const res = await deleteV(id);
    if (res.success) {
      window.location.reload();
      setOpen(false);
      toast.success(`🥳 ${res.success} 🎉🎉`, {
        richColors: true,
        position: "top-center",
        duration: 2700,
      });
      return;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="grid grid-cols-3 items-center justify-center">
        {row.map((v, index) => (
          <i
            onClick={() => {
              getold(v.id);
              setIsedit(true);
              setOpen(true);
              setVid(v.id);
            }}
            key={index}
            style={{ color: v.color }}
            className="text-[15px]  border-2 border-black rounded fa-solid fa-square"
          ></i>
        ))}
      </div>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <i
            onClick={() => {
              (setIsedit(false), setTags([]), setImages([]));
            }}
            className="fa-solid text-gray-500 fa-circle-plus"
          ></i>
        </Button>
      </DialogTrigger>

      <DialogContent className="overflow-y-auto max-h-[95vh] scrollbar-none sm:max-w-sm">
        <form
          action={createandedit}
          onKeyDown={(e) => {
            const target = e.target as HTMLInputElement;

            if (e.key === "Enter" && target.id !== "Variant_Tags-1") {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader className="mb-3">
            <DialogTitle className="text-green-500 text-xl">
              {loading ? (
                <p className="text-xl text-green-500 animate-pulse">
                  Taking Data Please Wait.
                </p>
              ) : isedit ? (
                "Edit the product's variants"
              ) : (
                "Create new product's variants"
              )}
            </DialogTitle>
            <DialogDescription>
              Manange your product's variants here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="Variant_Title-1">Variant Title 🖊</Label>
              <Input
                id="Variant_Title-1"
                name="title"
                defaultValue={isedit ? old?.productType : ""}
                placeholder="eq.Black"
              />
            </Field>
            {isedit && (
              <Field>
                <Input
                  hidden
                  name="id"
                  defaultValue={vid!}
                  placeholder="eq.Black"
                />
              </Field>
            )}
            <Field>
              <Label htmlFor="Variant_Color-1">Variant Color 🎨</Label>
              <Input
                type="color"
                id="Variant_Color-1"
                defaultValue={isedit ? old?.color : ""}
                name="color"
              />
            </Field>
            <Field>
              <Label htmlFor="Variant_Tags-1">Variant Tags 🏷️</Label>
              <Input
                id="Variant_Tags-1"
                name="tag"
                placeholder="eq.android"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (tag.trim() === "") return;
                    setTags((prev) => [...prev, tag]);
                    setTag("");
                  }
                }}
              />
              <div className="flex gap-1 flex-wrap">
                {" "}
                {tags.map((t, index) => (
                  <div key={index} className="relative">
                    <p className=" px-2 py-1 border-green-500 border rounded-[7px]">
                      {t}
                    </p>
                    <i
                      onClick={() => {
                        setTags(tags.filter((_, i) => i !== index));
                      }}
                      className="fa-solid text-red-500 absolute -top-1 -right-1 fa-circle-xmark"
                    ></i>
                  </div>
                ))}
              </div>
            </Field>
            <Field>
              {" "}
              <Label htmlFor="V-image">Variant Images 📸</Label>
              <p className="text-gray-500">
                You can upload 10 photos (max) at once.
              </p>
              <p className="w-full text-gray-500 px-3 py-2 text-[12px] font-bold rounded-[10px] border">
                {images.length ? (
                  `you have ${images.length} photo/s chosen`
                ) : (
                  <Label htmlFor="V-image">No Photos Choose!</Label>
                )}
              </p>
              <Input
                id="V-image"
                type="file"
                multiple
                hidden
                accept="image/*"
                onChange={(e) => {
                  const selected = Array.from(e.target.files ?? []);

                  const mapped = selected.map((file) => ({
                    file,
                    url: URL.createObjectURL(file),
                  }));

                  setImages(mapped);
                }}
              />
              <div className="flex gap-1 flex-wrap">
                {" "}
                {images.map((img, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={img.url}
                      width={50}
                      height={50}
                      alt="variantImage"
                      className="w-12 h-12 object-cover border rounded"
                    />

                    <i
                      onClick={() => {
                        setImages((prev) => prev.filter((_, i) => i !== index));
                      }}
                      className="fa-solid text-red-500 absolute -top-1 -right-1 fa-circle-xmark"
                    />
                  </div>
                ))}
              </div>
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-3 sm:items-center lg:flex md:flex md:items-center md:justify-end lg:items-center lg:justify-end">
            {isedit && (
              <button
                onClick={() => {
                  if (!old?.id) return;
                  deletevar(old.id);
                }}
                className="text-[14px] bg-red-500 rounded-[10px] font-bold text-white px-3 py-2"
              >
                Drop Variants
              </button>
            )}
            <SubmitBtn formtitle={isedit ? "Edit Variants" : "Save Variants"} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Variantdialog;
