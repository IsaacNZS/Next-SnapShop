import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  boolean,
  real,
  serial,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";

export const Rollenum = pgEnum("roles", ["user", "admin"]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name"),
  email: text("email").unique(),
  password: text("password"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image").default(""),
  isTwo: boolean("isTwo").default(false),
  role: Rollenum("roles").default("user"),
  clientId: text("clientId"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // acc del yin all pyat
    type: text("type").$type<AdapterAccount>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ],
);

export const emailVerificationtoken = pgTable("email-vt", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$default(() => createId()),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
  email: text("email").notNull(),
});

export const otptoken = pgTable("OTPs", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$default(() => createId()),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
  email: text("email").notNull(),
});

export const products = pgTable("products", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$default(() => createId()),
  image: text("image").default(""),
  description: text("description").notNull(),
  title: text("title").notNull(),
  price: text("price").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

export const productvariant = pgTable("productvariant", {
  id: serial("id").primaryKey(),
  color: text("color").notNull(),
  productType: text("productType").notNull(),
  productId: text("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  updatedAt: timestamp("updateAt").defaultNow(),
});

export const variantImage = pgTable("variantImage", {
  id: serial("id").primaryKey(),
  imageUrl: text("imageUrl").notNull(),
  name: text("name").notNull(),
  size: text("size").notNull(),
  order: real("order").notNull(),
  variantId: integer("variantId")
    .notNull()
    .references(() => productvariant.id, { onDelete: "cascade" }),
});

export const variantTag = pgTable("variantTag", {
  id: serial("id").primaryKey(),
  tag: text("tag").notNull(),
  variantId: integer("variantId")
    .notNull()
    .references(() => productvariant.id, { onDelete: "cascade" }),
});

export const productrelations = relations(products, ({ many, one }) => ({
  productvariant: many(productvariant),
}));

export const productvariantrelations = relations(
  productvariant,
  ({ many, one }) => ({
    products: one(products, {
      fields: [productvariant.productId],
      references: [products.id],
    }),
    variantImage: many(variantImage),
    variantTag: many(variantTag),
  }),
);

export const variantTagrelations = relations(variantTag, ({ one }) => ({
  productvariant: one(productvariant, {
    fields: [variantTag.variantId],
    references: [productvariant.id],
  }),
}));

export const variantImagerelations = relations(variantImage, ({ one }) => ({
  productvariant: one(productvariant, {
    fields: [variantImage.variantId],
    references: [productvariant.id],
  }),
}));

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userID: text("userID")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  total: real("total").notNull(),
  status: text("status").notNull(),
  created: timestamp("created").defaultNow(),
  receiptURL: text("receiptURL"),
});

export const userRelations = relations(users, ({ many }) => ({
  orders: many(orders, { relationName: "user_orders" }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userID],
    references: [users.id],
    relationName: "user_orders",
  }),
  orderProduct: many(orderProduct, { relationName: "orderProduct" }),
}));

export const orderProduct = pgTable("orderProduct", {
  id: serial("id").primaryKey(),
  quantity: integer("quantity").notNull(),
  productVariantID: integer("productVariantID")
    .notNull()
    .references(() => productvariant.id, { onDelete: "cascade" }),
  productID: text("productID")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  orderID: integer("OrderID")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
});

export const orderProductRelations = relations(orderProduct, ({ one }) => ({
  order: one(orders, {
    fields: [orderProduct.orderID],
    references: [orders.id],
    relationName: "orderProduct",
  }),
  product: one(products, {
    fields: [orderProduct.productID],
    references: [products.id],
    relationName: "products",
  }),
  productVariants: one(productvariant, {
    fields: [orderProduct.productVariantID],
    references: [productvariant.id],
    relationName: "productVariants",
  }),
}));
