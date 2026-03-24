import { v } from "convex/values";
import { mutation, query } from "./_generated/server";  // ✅ import query

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

export const GetDiscussionRoom = query({  // ✅ remove the arrow function wrapper
    args: {
        id: v.id('DiscussionRoom')
    },
    handler: async (ctx, args) => {  // ✅ add ctx and args params
        const result = await ctx.db.get(args.id);
        return result;
    }
})