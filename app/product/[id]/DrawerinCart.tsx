import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useCartStore } from "@/store/Cart-store";
import { TableDemo } from "./Cart-table";
import Image from "next/image";
import Cartnav from "./Cart-nav";
import Cartcheckout from "./Cart-checkout";
import Cartsuccess from "./Cart-success";

const DrawerinCart = () => {
  const cartcount = useCartStore((state) => state.cart.length);
  const cartposition = useCartStore((state) => state.cartPosition);
  const setCartposition = useCartStore((state) => state.setCartPosition);
  return (
    <>
      <Drawer>
        <DrawerTrigger>
          {" "}
          <p className="text-xl relative">
            🛒
            <span className="text-red-500 absolute -top-1 font-bold left-1.5 text-[20px]">
              {cartcount}
            </span>
          </p>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Your Items</DrawerTitle>
            <DrawerDescription>
              This action cannot be undone yet.
            </DrawerDescription>
          </DrawerHeader>
          {cartcount ? (
            <>
              {" "}
              <Cartnav />
              {cartposition === "Order" ? (
                <TableDemo />
              ) : cartposition === "Checkout" ? (
                <Cartcheckout />
              ) : (
                <Cartsuccess />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 w-full">
              <Image
                alt="photo"
                width={80}
                height={80}
                src="/empty.png"
                className="w-30 h-30"
              />
              <p className="text-[16px] font-bold">Your Cart Is Empty!</p>
              <p className="text-[14px] animate-bounce text-green-500 font-bold">
                Go buy something.
              </p>
            </div>
          )}
          {cartcount && (
            <DrawerFooter>
              {cartposition === "Order" && (
                <button
                  onClick={() => {
                    {
                      cartposition === "Order"
                        ? setCartposition("Checkout")
                        : cartposition === "Checkout"
                          ? setCartposition("Success")
                          : setCartposition("Order");
                    }
                  }}
                  className="text-[14px] md:w-[50%] lg:w-[50%] py-1 text-white font-bold text-center mx-auto w-full bg-green-500 rounded"
                >
                  Ready to Payment! <i className="fa-solid fa-truck-fast"></i>
                </button>
              )}
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DrawerinCart;
