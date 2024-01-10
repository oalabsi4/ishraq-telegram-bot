import type { Context } from "telegraf";
import type { Update } from "telegraf/types";



/**
 * Generates a keyboard for selecting a date range and sends it as a reply to the user in the chat.
 *
 * @param ctx - The context object for handling the update.
 * @param deletePrevious - Optional. Indicates whether to delete the previous keyboard before sending the new one. Default is false.
 * @return A promise that resolves once the keyboard is sent.
 */
export async function dateSelectionKeyboard(ctx: Context<Update>,deletePrevious?:boolean ) {

    if(deletePrevious){
    await ctx.deleteMessage(); //remove the previous keyboard
    }
    await ctx.reply('Choose the time period.', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'past month', callback_data: 'past_month' },
            { text: 'past year', callback_data: 'past_year' },
          ],
          [
            { text: 'this week', callback_data: 'this_week' },
            { text: 'past week', callback_data: 'past_week' },
          ],
          [
            { text: 'on or after', callback_data: 'on_or_after' },
            { text: 'on or before', callback_data: 'on_or_before' },
          ],
          [
            { text: 'after', callback_data: 'after' },
            { text: 'before', callback_data: 'before' },
          ],
          [{ text: 'back', callback_data: 'back_to_main_export' }],
        ],
      },
    });
}