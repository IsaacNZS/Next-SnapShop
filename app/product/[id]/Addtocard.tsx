import { useCartStore } from "@/store/Cart-store";
import { redirect, useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
type Prop = {
  image: string;
  color: string;
  productType: string;
  vid: number;
};

const Addtocard = ({ image, color, productType, vid }: Prop) => {
  const params = useParams();
  const searchParams = useSearchParams();
  const productId = params.id?.toString();
  const title = searchParams.get("title");
  const price = searchParams.get("price");
  const [count, setCount] = useState<number>(1);
  const addToCart = useCartStore((state) => state.addToCart);
  if (
    !productId ||
    !vid ||
    !color ||
    !title ||
    !productType ||
    !price ||
    !image
  ) {
    return redirect("/");
  }
  const handeller = () => {
    addToCart({
      id: productId,
      name: title,
      image: image,
      price: price,
      variant: {
        variantId: vid,
        quantity: count,
      },
    });
    toast.success(
      `🥳 You successfully added to cart. Check to your cart. 🎉🎉`,
      {
        richColors: true,
        position: "top-center",
        duration: 3000,
      },
    );
  };

  return (
    <div className="flex flex-col items-center gap-2 justify-between w-full md:w-[70%] lg:w-[50%]">
      {" "}
      <div className="flex items-center justify-between w-full gap-2">
        {" "}
        <i
          onClick={() => setCount(count + 1)}
          className="fa-solid text-[30px] text-green-500 fa-square-plus"
        ></i>
        <p className="text-[14px] text-green-500 text-center font-bold border py-1 border-green-500 rounded w-full">
          Quantity : {count}
        </p>
        <i
          onClick={() => {
            if (count !== 1) setCount(count - 1);
          }}
          hidden={count === 1}
          className="fa-solid text-[30px] text-green-500 fa-square-minus"
        ></i>
      </div>
      <button
        onClick={() => handeller()}
        className="text-[14px]  py-1 text-white font-bold text-center w-full bg-green-500 rounded"
      >
        Add to cart <i className="fa-solid fa-cart-plus"></i>
      </button>
    </div>
  );
};

export default Addtocard;
