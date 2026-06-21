import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/Cart-store";

const Cartnav = () => {
  const cartposition = useCartStore((state) => state.cartPosition);
  const setCartposition = useCartStore((state) => state.setCartPosition);
  return (
    <div className="flex items-center justify-between w-[80%] lg:w-[50%] md:w-[50%] mb-3 mx-auto border-b-2 py-2 gap-2 text-xl">
      <div
        className={cn(
          cartposition === "Order"
            ? "text-green-500 animate-bounce"
            : "text-gray-400",
          cartposition === "Checkout" && "text-green-500",
          cartposition === "Success" && "text-green-500",
        )}
        onClick={() => {
          setCartposition("Order");
        }}
      >
        <i className="fa-solid fa-cart-shopping"></i>{" "}
      </div>
      <div
        className={cn(
          cartposition === "Checkout" ? "text-green-500" : "text-gray-400",
          cartposition === "Success" && "text-green-500",
        )}
        onClick={() => {
          setCartposition("Checkout");
        }}
      >
        <i className="fa-solid fa-arrow-right-long"></i>
      </div>
      <div
        className={cn(
          cartposition === "Checkout"
            ? "text-green-500 animate-bounce"
            : "text-gray-400",
          cartposition === "Success" && "text-green-500",
        )}
        onClick={() => {
          setCartposition("Checkout");
        }}
      >
        <i className="fa-solid fa-ticket"></i>
      </div>
      <div
        className={cn(
          cartposition === "Success" ? "text-green-500" : "text-gray-400",
        )}
        onClick={() => {
          setCartposition("Success");
        }}
      >
        <i className="fa-solid fa-arrow-right-long"></i>
      </div>
      <div
        className={cn(
          cartposition === "Success"
            ? "text-green-500 animate-bounce"
            : "text-gray-400",
        )}
      >
        <i className="fa-solid fa-box-open"></i>
      </div>
    </div>
  );
};

export default Cartnav;
