"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const Tagsfilter = () => {
  const params = useSearchParams();
  const Tags = [
    {
      tag: "All",
    },
    {
      tag: "Phone",
    },
    {
      tag: "Tablet",
    },
    {
      tag: "MAC",
    },
    {
      tag: "Watch",
    },
    {
      tag: "Accessory",
    },
    {
      tag: "Other",
    },
  ];
  return (
    <div className="mt-2 overflow-x-auto scrollbar-none py-3 px-2 md:justify-center sm:justify-center lg:justify-center gap-1 flex items-center">
      {Tags.map((t, index) => (
        <Link
          href={`/?tag=${t.tag}`}
          key={index}
          className={cn(
            "text-[12px] font-bold shadow-lg rounded-[10px] px-3 py-2",
            params.get("tag") === t.tag &&
              "bg-green-500 text-white shadow-green-300 animate-bounce",
          )}
        >
          {t.tag}
        </Link>
      ))}
    </div>
  );
};

export default Tagsfilter;
