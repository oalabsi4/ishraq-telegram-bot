import type { CTX } from "@/types.js";
import { Arabic } from "@utils/arabicDictionary.js";
import Log from "@utils/logger.js";
import { message } from "telegraf/filters";
import { cardData } from "./cardData.js";



export async function cardDescription(ctx:CTX) {
    await ctx.reply(Arabic.RequestDescription)
    Log.info('Requested description from user', 'getDescriptionScene');
    ctx.scene.current?.on(message('text'),async ctx=>{
        const userInput = ctx.message.text;
        if(!userInput){
            await ctx.reply(Arabic.Error);
            Log.warn('User did not enter a description', 'getDescriptionScene');
            await ctx.scene.reenter();
            return
        }
        if(!userInput || userInput.length < 3){
            await ctx.deleteMessage(ctx.message.message_id - 1);
            await ctx.deleteMessage(ctx.message.message_id);
            await ctx.reply(Arabic.ShortDescription);
            Log.warn('User entered a short or empty  description', 'getDescriptionScene');
            await ctx.scene.reenter();
            return;
        }
        cardData.desc = userInput;
        await ctx.deleteMessage(ctx.message.message_id - 1);
        await ctx.deleteMessage(ctx.message.message_id);
        await ctx.scene.enter('getDueDate')
        Log.info(`User entered description ${userInput}`, 'getDescriptionScene');
        return 
    })
}