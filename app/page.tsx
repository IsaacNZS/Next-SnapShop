import { db } from "@/sever";
import Singleproduct from "./components/Singleproduct";
import Homenav from "./components/Homenav";
import { desc, eq } from "drizzle-orm";
import { productvariant, variantTag } from "@/sever/schema";
import Tagsfilter from "./components/Tagsfilter";

type Props = {
  searchParams: Promise<{
    tag?: string;
  }>;
};

export default async function Home({ searchParams }: Props) {
  const { tag } = await searchParams;

  const data = await db.query.productvariant.findMany({
    with: {
      products: true,
      variantImage: true,
      variantTag: true,
    },

    orderBy: [desc(productvariant.updatedAt)],
  });

  const res =
    !tag || tag === "All"
      ? data
      : data.filter((item) => item.variantTag.some((v) => v.tag === tag));

  return (
    <div className="w-full">
      <Homenav res={res} />
      <Tagsfilter />
      <Singleproduct res={res} />
    </div>
  );
}
