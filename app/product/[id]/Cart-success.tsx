import { useCartStore } from "@/store/Cart-store";
import { useRouter } from "next/navigation";
import { DrawerClose } from "@/components/ui/drawer";

const Cartsuccess = () => {
  const cart = useCartStore((s) => s.clearCart);
  const cartposition = useCartStore((s) => s.setCartPosition);
  const router = useRouter();

  const final = () => {
    (router.push("/dashboard/orders"), cart(), cartposition("Order"));
  };

  return (
    <div className="flex flex-col gap-3 w-full sm:w-[60%] md:w-[50%] lg:w-[50%] mx-auto items-center justify-center">
      <p className="text-2xl text-green-500 font-bold">
        🎉🥳 Congratulations 🎉🥳
      </p>
      <p className="text-xl text-gray-400">You Successfully Added Orders!</p>
      <DrawerClose
        onClick={() => final()}
        className="text-[14px] font-bold rounded-lg w-[60%] text-center text-white bg-green-500 my-3 px-3 py-2"
      >
        Clear cart & Check orders
      </DrawerClose>
    </div>
  );
};

export default Cartsuccess;
