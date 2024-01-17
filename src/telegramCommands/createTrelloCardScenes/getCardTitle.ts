import type { CTX } from '@/types.js';
import { Arabic } from '@utils/arabicDictionary.js';
import Log from '@utils/logger.js';
import { message } from 'telegraf/filters';
import { cardData } from './cardData.js';

/**
 * Deletes the current message, prompts the user to enter a card title,
 * and handles the user's response.
 * If the user does not enter a title or enters a title that is too short,
 * an error message is sent and the scene is reentered.
 * If a valid title is entered, it is stored in the cardData object,
 * the scene is transitioned to the 'getDescription' scene, and the function exits.
 * @param ctx - The context object containing information about the message and scene.
 */
export async function cardTitle(ctx: CTX) {
  // Delete the current message

  // Prompt the user to enter a card title
  await ctx.reply(Arabic.EnterCardTitle);

  // Log the request for a card title
  Log.info('Requested card title from user', 'getCardTitle');

  // Handle the user's response
  ctx.scene.current?.on(message('text'), async ctx => {
    // Get the user's input
    const userInput = ctx.message.text;

    // If no input is provided, send an error message, log a warning, reenter the scene, and exit
    if (!userInput) {
      await ctx.reply(Arabic.Error);
      Log.warn('User did not enter a title', 'handleMembersSelection');
      await ctx.scene.reenter();
      return;
    }

    // If the input is too short, delete the previous messages, send an error message, log a warning, reenter the scene, and exit
    if (userInput.length < 3) {
      await ctx.deleteMessage(ctx.message.message_id - 1);
      await ctx.deleteMessage(ctx.message.message_id);
      await ctx.reply('العنوان قصير 🚫');
      Log.warn('User entered a short title ', 'handleMembersSelection');
      await ctx.scene.reenter();
      return;
    }
    await ctx.deleteMessage(ctx.message.message_id - 1);
    await ctx.deleteMessage(ctx.message.message_id);
    // Store the user's input in the cardData object
    cardData.name = userInput;

    // Log the user's input and transition to the 'getDescription' scene
    Log.info(`User entered ${userInput}`, 'getCardTitle');
    await ctx.scene.enter('getCardDescription');
    return;
  });
}
