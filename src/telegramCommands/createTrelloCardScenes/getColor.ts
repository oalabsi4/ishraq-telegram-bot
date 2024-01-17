import type { CTX } from '@/types.js';
import { Arabic } from '@utils/arabicDictionary.js';
import Log from '@utils/logger.js';
import { fetchData } from './cardData.js';

/**
 * Prompts the user to select a card color and handles the user's selection.
 * @param ctx - The context object containing information about the Telegram message.
 */
export async function cardColor(ctx: CTX) {
  // Prompt the user to select a card color
  await ctx.reply(Arabic.ChooseColor, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🩷', callback_data: 'pink' },
          { text: '🟡', callback_data: 'yellow' },
          { text: '🍏', callback_data: 'lime' },
          { text: '🔵', callback_data: 'blue' },
        ],
        [
          { text: '⚫', callback_data: 'black' },
          { text: '🟠', callback_data: 'orange' },
          { text: '🔴', callback_data: 'red' },
          { text: '🟣', callback_data: 'purple' },
        ],
        [
          { text: '🩵', callback_data: 'sky' },
          { text: '🟢', callback_data: 'green' },
        ],
        [{ text: Arabic.Cancel, callback_data: 'Cancel' }],
      ],
    },
  });

  // Handle the user's selection
  ctx.scene.current?.action(
    ['pink', 'yellow', 'lime', 'blue', 'black', 'orange', 'red', 'purple', 'sky', 'green', 'Cancel'],
    async ctx => {
      const userInput = ctx.match[0];
      if (userInput === 'Cancel') {
        // If the user cancels the selection, delete the message, send a cancellation message, log the cancellation, and leave the scene
        await ctx.deleteMessage();
        await ctx.reply(Arabic.ItsCanceled);
        Log.warn('User canceled the selection', 'handleColorSelection');
        ctx.scene.leave();
        return;
      }

      // Set the selected color in the fetchData object and log the user's selection
      fetchData.color = userInput;
      Log.info(`user selected ${userInput}`, 'handleColorSelection');

      // Delete the message and proceed to the next scene
      await ctx.deleteMessage();
      await ctx.scene.enter('createTrelloCardScene');
    }
  );
}
