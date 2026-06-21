import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
} from "drizzle-orm";
import * as schema from "@/sever/schema";

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
  "one" | "many",
  boolean,
  TSchema,
  TSchema[TableName]
>["with"];

export type InferResultType<
  TableName extends keyof TSchema,
  With extends IncludeRelation<TableName> | undefined = undefined,
> = BuildQueryResult<
  TSchema,
  TSchema[TableName],
  {
    with: With;
  }
>;

export type VariantsWithImagesTags = InferResultType<
  "productvariant",
  { variantImage: true; variantTag: true }
>;

export type ProductsWithVariants = InferResultType<
  "products",
  {
    productvariant: {
      with: {
        variantImage: true;
        variantTag: true;
      };
    };
  }
>;

export type VariantsWithProduct = InferResultType<
  "productvariant",
  { variantImage: true; variantTag: true; products: true }
>;
