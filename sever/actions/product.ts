"use server";

import { and, eq } from "drizzle-orm";
import { db } from "..";
import { products, productvariant, variantImage, variantTag } from "../schema";
import { desc } from "drizzle-orm";

export const createandeditproduct = async (
  formdata: FormData,
  photo?: string,
) => {
  const id = formdata.get("id")?.toString();
  const title = formdata.get("title")?.toString();
  const description = formdata.get("description")?.toString();
  const price = formdata.get("price")?.toString();
  if (!title || !description || !price) return null;

  if (id) {
    const exitproduct = await db.query.products.findFirst({
      where: eq(products.id, id),
    });
    if (!exitproduct) {
      return {
        error: "This product is not exited!",
      };
    }
    await db
      .update(products)
      .set({
        title,
        description,
        price,
        ...(photo && { image: photo }),
      })
      .where(eq(products.id, id));
    return {
      success: "Product edited successfully",
    };
  }
  await db
    .insert(products)
    .values({
      title,
      description,
      price,
      image: photo,
    })
    .returning();
  return {
    success: "Product created successfully",
  };
};

export const allproducts = async () => {
  const allProducts = await db.query.products.findMany({
    with: {
      productvariant: {
        with: {
          variantImage: true,
          variantTag: true,
        },
      },
    },

    orderBy: desc(products.createdAt),
  });

  return {
    products: allProducts,
  };
};

export const singleproduct = async (id: string) => {
  const single = await db.query.products.findFirst({
    where: eq(products.id, id),
  });
  if (!single) return;
  return {
    single,
  };
};

export const deleteproduct = async (id: string) => {
  await db.delete(products).where(eq(products.id, id));
  return;
};

// import { Temproducts } from "../tempopro";

// export const productsadding = async () => {
//   try {
//     for (const product of Temproducts.products) {
//       // Product
//       const [newProduct] = await db
//         .insert(products)
//         .values({
//           image: product.image,
//           description: product.description,
//           title: product.title,
//           price: product.price,
//         })
//         .returning();

//       // Variants
//       for (const variant of product.productvariant) {
//         const [newVariant] = await db
//           .insert(productvariant)
//           .values({
//             color: variant.color,
//             productType: variant.productType,
//             productId: newProduct.id,
//           })
//           .returning();

//         // Images
//         for (let i = 0; i < variant.variantImage.length; i++) {
//           const image = variant.variantImage[i];

//           await db.insert(variantImage).values({
//             imageUrl: image.imageUrl,
//             name: image.name,
//             size: image.size,
//             order: i + 1,
//             variantId: newVariant.id,
//           });
//         }

//         // Tags
//         for (const tag of variant.variantTag) {
//           await db.insert(variantTag).values({
//             tag: tag.tag,
//             variantId: newVariant.id,
//           });
//         }
//       }
//     }

//     return {
//       success: "Products inserted successfully",
//     };
//   } catch (error) {
//     console.log(error);

//     return {
//       error: "Insert failed",
//     };
//   }
// };
export const detailData = async (id: string) => {
  const data = await db.query.products.findFirst({
    with: {
      productvariant: {
        with: {
          variantImage: true,
          variantTag: true,
        },
      },
    },
    where: eq(products.id, id),
  });
  return {
    success: data,
  };
};

export const varitantColor = async (color: string, id: number) => {
  try {
    const res = await db.query.productvariant.findFirst({
      with: {
        variantImage: true,
        variantTag: true,
      },
      where: and(eq(productvariant.color, color), eq(productvariant.id, id)),
    });
    return { success: res };
  } catch (error) {
    return {
      error: "NoVariant",
    };
  }
};
