"use client";
import {
  ProductsWithVariants,
  VariantsWithImagesTags,
} from "@/app/lib/inter-types";
import { detailData, varitantColor } from "@/sever/actions/product";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import Addtocard from "@/app/product/[id]/Addtocard";

export default function Page() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const id = params.id?.toString();
  const title = searchParams.get("title");
  const productType = searchParams.get("productType");
  const price = searchParams.get("price");
  const [singVar, setSigVar] = useState<VariantsWithImagesTags | null>(null);
  const [data, setData] = useState<ProductsWithVariants | null>(null);
  const [loading, setLoading] = useState(false);
  const [sinloading, setSinloading] = useState(false);
  const [image, setImage] = useState(searchParams.get("image"));
  const [vid, setVid] = useState(Number(searchParams.get("vid")));
  const [productype, setProducttype] = useState(productType);
  const [color, setColor] = useState(searchParams.get("color"));

  const oldData = async (id: string) => {
    try {
      setLoading(true);
      const res = await detailData(id);
      if (res.success) {
        setData(res.success);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    oldData(id!);
  }, []);

  const singleVar = async (color: string, id: number) => {
    try {
      setSinloading(true);
      const res = await varitantColor(color, id);
      if (res.success) {
        setSigVar(res.success);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSinloading(false);
    }
  };
  useEffect(() => {
    singleVar(color!, vid!);
  }, [color, vid]);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api, singVar]);

  return (
    <div className="flex flex-col">
      {" "}
      <div className="grid sm:grid-cols-2 gap-2 md:grid-cols-2 border-2 rounded-2xl px-3 py-3 lg:grid-cols-2 w-full items-center justify-between">
        <div className="border py-3 rounded-2xl">
          <Carousel
            setApi={setApi}
            plugins={[
              Autoplay({
                delay: 2000, // Time in milliseconds between slides
              }),
            ]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="lg:w-[70%] mx-auto border flex-1"
          >
            {loading && (
              <p className="text-xl text-center animate-pulse text-green-500">
                Pleast wait...
              </p>
            )}
            <CarouselContent>
              {singVar?.variantImage.map((i, index) => (
                <CarouselItem key={index}>
                  {" "}
                  <Image
                    key={index}
                    alt="vimage"
                    src={i.imageUrl}
                    width={1100}
                    height={600}
                    className="w-full object-cover h-100"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="text-center mt-2">
            {current} / {count}
          </div>
        </div>
        <div className="gap-2 flex w-full flex-col">
          {" "}
          <h1>
            <span className="font-bold">Title :</span> {title}
          </h1>
          <p>
            <span className="font-bold">Variant Type :</span>{" "}
            {singVar ? singVar.productType : productType}
          </p>
          <p>
            <span className="font-bold">Description :</span> {data?.description}
          </p>
          <p>
            <span className="font-bold">Price :</span>{" "}
            {Number(price?.replace(" MMK", "")).toLocaleString()} MMK
          </p>
          <div className="flex gap-1 flex-wrap">
            {" "}
            <span className="font-bold">Tags :</span>
            {singVar?.variantTag.map((t, index) => (
              <div key={index} className="relative">
                <p className=" px-2 border-green-500 border rounded-[7px]">
                  {t.tag}
                </p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <span className="font-bold">Color :</span>
            {sinloading ? (
              <i className="fa-solid text-green-500 text-[15px] fa-spinner fa-spin-pulse"></i>
            ) : (
              data?.productvariant.map((v, index) => (
                <div key={index} className="flex ">
                  {" "}
                  <i
                    style={{ color: v.color }}
                    onClick={() => {
                      setColor(v.color);
                      setImage(v.variantImage[0].imageUrl);
                      setProducttype(v.productType);
                      setVid(v.id);
                    }}
                    className={cn(
                      "text-[15px] border-2 border-black opacity-50 rounded fa-solid fa-square",
                      color === v.color &&
                        "opacity-100 shadow-sm shadow-green-500",
                    )}
                  ></i>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 mt-2 w-full flex-col">
        {" "}
        <Addtocard
          image={image!}
          vid={vid!}
          productType={productype!}
          color={color!}
        />
      </div>
    </div>
  );
}
