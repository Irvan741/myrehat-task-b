import { ORPCError } from "@orpc/server";
import { buyHomestay } from "@myrehat-task-b/db/schema";
import { desc } from "drizzle-orm";
import { nanoid } from "nanoid";

import { protectedProcedure, publicProcedure } from "../index";

const CATEGORIES = [
  "Buy Property",
  "Buy land to build homestay",
  "Buy Airbnb Profile",
  "Buy Airbnb Business",
] as const;

export const listingRouter = {
  list: publicProcedure.handler(async ({ context }) => {
    const listings = await context.db
      .select()
      .from(buyHomestay)
      .orderBy(desc(buyHomestay.createdAt));
    return listings;
  }),
  create: protectedProcedure.handler(async ({ context, input }: any) => {
    const data = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
    // oRPC v1 might pass directly or wrapped
    if (data.json && typeof data.json === "object") {
      Object.assign(data, data.json);
    }
    const title = String((data as any).title ?? "").trim();
    const price = String((data as any).price ?? "").trim();
    const location = String((data as any).location ?? "").trim();
    const category = String((data as any).category ?? "").trim();
    const contactWa = String((data as any).contactWa ?? (data as any).contact_wa ?? "").trim();

    if (!title || !price || !location || !category || !contactWa) {
      throw new ORPCError("BAD_REQUEST", { message: "All fields are required" });
    }
    if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
      throw new ORPCError("BAD_REQUEST", { message: "Invalid category" });
    }

    const id = nanoid();
    const [created] = await context.db
      .insert(buyHomestay)
      .values({
        id,
        title,
        price,
        location,
        category,
        contactWa,
        userId: context.session.user.id,
      })
      .returning();
    return created;
  }),
};
