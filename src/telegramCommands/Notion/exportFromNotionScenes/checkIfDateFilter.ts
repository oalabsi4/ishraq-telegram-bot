import type { CTX } from '@/types.js';
import { Arabic } from '@utils/arabicDictionary.js';
import Log from '@utils/logger.js';

/**
 * Displays a message asking the user if they want to filter by date.
 *
 * @param  ctx - The context object for the Telegram message.
 * @return  - A promise that resolves when the message is sent.
 */
export async function displayCheckIfDateFilter(ctx: CTX) {
  await ctx.reply(Arabic.DoYouWantDate, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: Arabic.Yes, callback_data: 'yes' },
          { text: Arabic.No, callback_data: 'no' },
        ],
        [{ text: Arabic.Cancel, callback_data: 'cancel' }],
      ],
    },
  });

  Log.info('asked the use if the filter by date should be applied', 'displayCheckIfDateFilter');
  return;
}

/**
 * Check if the user wants to add a date to the filter.
 * If the input is valid, navigate to the appropriate scene.
 * If the input is invalid, handle the error and return.
 *
 * @param ctx - The context object containing the user input.
 */
export async function CheckIfDateFilter(ctx: any) {
  const userInput = ctx.match[0];

  if (!userInput) {
    await ctx.deleteMessage();
    await ctx.reply(Arabic.Error);
    Log.warn('User did not select a property', 'handlePropertySelection');
    await ctx.scene.reenter();
    return;
  }

  if (userInput === 'cancel') {
    await ctx.deleteMessage();
    await ctx.reply(Arabic.ItsCanceled);
    Log.info('User canceled the selection', 'handlePropertySelection');
    await ctx.scene.leave();
    return;
  }

  if (userInput === 'no') {
    await ctx.deleteMessage();
    await ctx.scene.enter('tryRunExportFunction');
    return;
  }

  if (userInput === 'yes') {
    await ctx.deleteMessage();
    await ctx.scene.enter('getDateType');
    return;
  }

  // If none of the above conditions are met, handle the error and return.
  await ctx.reply(Arabic.Error);
  await ctx.scene.leave();
  Log.warn('User did not select a property', 'handlePropertySelection');
  return;
}
