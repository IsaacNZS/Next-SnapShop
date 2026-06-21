import { auth } from "@/sever/auth";
import DasNav from "./DasNav";

const Dashboardlayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const seccion = await auth();
  return (
    <div>
      <DasNav user={seccion?.user} expires={seccion?.expires!} />
      {children}
    </div>
  );
};

export default Dashboardlayout;
