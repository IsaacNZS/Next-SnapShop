import Image from "next/image";
import { VariantsWithProduct } from "../lib/inter-types";
import Link from "next/link";

type ProductwithV = {
  res: VariantsWithProduct[];
};

const Singleproduct = ({ res }: ProductwithV) => {
  return (
    <>
      <p className="text-right font-bold text-green-400">
        Products : {res.length}
      </p>
      <div className="grid grid-cols-2 mt-5 w-full h-full sm:grid-cols-3 md:grid-cols-4 gap-3 lg:grid-cols-5">
        {res?.map((p, index) => (
          <Link
            href={`/product/${p.products?.id}?color=${encodeURIComponent(p.color)}&title=${p.products?.title}&productType=${p.productType}&price=${p.products?.price}&image=${p.variantImage[0]?.imageUrl}&vid=${p.id}`}
            className="flex w-full h-full px-3 py-2 flex-col items-center justify-center border rounded-2xl"
            key={index}
          >
            <Image
              alt="image"
              src={p.variantImage[0]?.imageUrl!}
              width={120}
              height={200}
              className="w-30 h-40 lg:w-60 lg:h-70 md:w-50 md:h-60 sm:w-50 sm:h-60 items-center object-cover justify-center rounded"
            />
            <div className="flex flex-col self-start font-bold">
              <p className="text-green-500">
                Title :{" "}
                <span className="text-black text-[14px]">
                  {p.products?.title}
                </span>
              </p>
              <p className="text-green-500">
                Des :{" "}
                <span className="text-black text-[14px]">
                  {p.products?.description.slice(0, 10)}...
                </span>
              </p>
              <p className="text-green-500">
                Price :{" "}
                <span className="text-black text-[14px]">
                  {Number(
                    p.products?.price.replace(" MMK", ""),
                  ).toLocaleString()}{" "}
                  <span className="text-gray-500 text-[12px]">MMK</span>
                </span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Singleproduct;
