import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const buyHomestay = pgTable("buy_homestay", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  price: text("price").notNull(),
  location: text("location").notNull(),
  category: text("category").notNull(),
  contactWa: text("contact_wa").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
