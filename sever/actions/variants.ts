"use server";
import { eq } from "drizzle-orm";
import { db } from "..";
import { productvariant, variantImage, variantTag } from "../schema";
import { revalidatePath } from "next/cache";

export type Img = {
  imageUrl: string;
  name: string;
  size: string;
}[];
type Tag = { tag: string }[];

export const createandupdateVariant = async (
  formdata: FormData,
  productId: string,
  images: Img,
  tags: Tag,
) => {
  const id = Number(formdata.get("id"));
  const color = formdata.get("color")?.toString();
  const productType = formdata.get("title")?.toString();
  if (!color || !productId || !productType || !tags || !images) return null;
  try {
    if (!id) {
      await db.transaction(async (tx) => {
        // 1. Create Variant
        const [variant] = await tx
          .insert(productvariant)
          .values({
            color,
            productType,
            productId,
          })
          .returning();

        // 2. Create Images
        await Promise.all(
          images.map((img, index) =>
            tx.insert(variantImage).values({
              imageUrl: img.imageUrl,
              name: img.name,
              size: img.size,
              order: index,
              variantId: variant.id,
            }),
          ),
        );

        // 3. Create Tags
        await Promise.all(
          tags.map((tag) =>
            tx.insert(variantTag).values({
              tag: tag.tag,
              variantId: variant.id,
            }),
          ),
        );
      });
      return {
        success: "Successfully Created Variant",
      };
    }
    if (id) {
      await db.transaction(async (tx) => {
        //variat update
        await tx
          .update(productvariant)
          .set({
            productType,
            color,
            productId,
          })
          .where(eq(productvariant.id, id))
          .returning();

        //image update
        await tx.delete(variantImage).where(eq(variantImage.variantId, id));

        await Promise.all(
          images.map((img, index) =>
            tx.insert(variantImage).values({
              imageUrl: img.imageUrl,
              name: img.name,
              size: img.size,
              order: index,
              variantId: id,
            }),
          ),
        );
        // 3. Create Tags
        await tx.delete(variantTag).where(eq(variantTag.variantId, id));

        await Promise.all(
          tags.map((tag) =>
            tx.insert(variantTag).values({
              tag: tag.tag,
              variantId: id,
            }),
          ),
        );
      });
      return {
        success: "Successfully Edited Variant",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to create variant",
    };
  }
};

export const getoldV = async (id: number) => {
  try {
    const v = await db.query.productvariant.findFirst({
      with: {
        variantImage: true,
        variantTag: true,
      },
      where: eq(productvariant.id, id),
    });
    return {
      success: v,
    };
  } catch (error) {
    console.log(error);
  }
};

export const deleteV = async (id: number) => {
  await db.delete(productvariant).where(eq(productvariant.id, id));
  return {
    success: "Successfully Deleted Variant",
  };
};
