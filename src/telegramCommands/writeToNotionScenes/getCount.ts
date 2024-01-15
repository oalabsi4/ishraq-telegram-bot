import Log from '@utils/logger.js';
import { dataToWrite } from './collectedDataFromUser.js';
import { isValidNumber } from '@/api/notion/fetchSelectPropValues.js';

/**
 * Sends a message to the user requesting the count of a product.
 * @param ctx - The context object.
 */
export async function requestCountMessage(ctx: any) {
  // Send a message to the user requesting the count of the product
  await ctx.reply('type the count of the product');
  
  // Log that the count request message has been sent
  Log.info('Sent count request message', 'requestCountMessage');
}

/**
 * Handles the user input for count.

 *
 * @param  ctx - The context object.
 * @returns - A promise that resolves when the handling is complete.
 */
export async function handleCountInput(ctx: any): Promise<void> {
  const userInput = ctx.message.text;

  // Check if the user input is valid
  if (!userInput || userInput.trim().length === 0 || !isValidNumber(+userInput) || +userInput <= 0) {
    // Delete the previous message and the current message
    await ctx.deleteMessage(ctx.message.message_id - 1);
    await ctx.deleteMessage(ctx.message.message_id);

    // Prompt the user to enter a valid count
    await ctx.reply('Please enter a valid count');

    // Log the invalid count input
    Log.warn(`User entered invalid count ${userInput ?? ''}`, 'handleCountInput');

    // Reenter the scene
    await ctx.scene.reenter();
    return;
  }

  // Set the product count
  dataToWrite.productCount = +userInput;

  // Delete the previous message and the current message
  await ctx.deleteMessage(ctx.message.message_id - 1);
  await ctx.deleteMessage(ctx.message.message_id);

  // Reply with the product count
  await ctx.reply(`Product Count: ${userInput}`);

  // Log the valid count input
  Log.info(`User entered count ${userInput}`, 'handleCountInput');

  // Enter the 'getLink' scene
  await ctx.scene.enter('getLink');
}
