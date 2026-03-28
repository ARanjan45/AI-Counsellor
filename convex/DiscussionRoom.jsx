import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateNewRoom = mutation({
    args: {
        feelingOption: v.string(),
        feeling: v.string(),
        expertName: v.string(),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.insert('DiscussionRoom', {
            feelingOption: args.feelingOption,
            feeling: args.feeling,
            expertName: args.expertName,
        });
        return result;
    }
})

export const GetDiscussionRoom = query({
    args: { id: v.id('DiscussionRoom') },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    }
})

export const SaveConversation = mutation({
    args: {
        id: v.id('DiscussionRoom'),
        conversation: v.any(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { conversation: args.conversation });
    }
})

export const SaveFeedback = mutation({
    args: {
        id: v.id('DiscussionRoom'),
        feedback: v.any(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { feedback: args.feedback });
    }
})

export const GetAllRooms = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        // Get all rooms — we'll filter by user email from users table
        const rooms = await ctx.db.query('DiscussionRoom').collect();
        return rooms;
    }
})