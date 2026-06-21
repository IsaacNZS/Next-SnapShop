import { cn } from "@/lib/utils";

type Prop = {
  logo: string;
  count: number;
  title: string;
  bgcolor?: string;
  iconcolr?: string;
};
const Countcart = ({ logo, count, title, bgcolor, iconcolr }: Prop) => {
  return (
    <div
      style={{ backgroundColor: `${bgcolor}`, color: iconcolr }}
      className="flex border rounded-[10px] font-bold text-[12px] items-center justify-between px-4 py-2"
    >
      <div className="flex flex-col gap-2 items-start justify-center">
        <i className={cn(`fa-solid ${logo} text-[20px]`)}></i>

        {title}
      </div>
      <p>{count}+</p>
    </div>
  );
};

export default Countcart;
