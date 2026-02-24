import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        //Convex automatically generates id for each entry and also the time of entry so no need to explicitly create it
        name: v.string(),
        email: v.string(),
        credits: v.number(),
        subscriptionId: v.string()
    })
})