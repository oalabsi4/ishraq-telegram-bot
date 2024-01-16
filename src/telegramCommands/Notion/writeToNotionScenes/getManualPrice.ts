import { isValidNumber } from '@/api/notion/fetchSelectPropValues.js';
import Log from '@utils/logger.js';
import { dataToWrite } from './collectedDataFromUser.js';
import { Arabic } from '@utils/arabicDictionary.js';

/**
 * Requests the user to input a manual price .
 * @param ctx - The context object containing information about the current session.
 */
export async function requestManualPriceMessage(ctx: any) {
  // Prompt the user to type the manual price
  await ctx.reply(Arabic.RequestManualPrice);

  // Log the action of sending the manual price request message
  Log.info('Sent manual price request message', 'getManualPriceScene');
  return;
}

/**
 * Handles the input of a manual price.
 *
 * @param  ctx - The context object.
 */
export async function handleManualPriceInput(ctx: any) {
  // Get the user input
  const userInput = ctx.message.text;

  // Check if the user input is valid
  if (!userInput || userInput.trim().length === 0 || !isValidNumber(+userInput) || +userInput < 0) {
    // Delete the previous and current messages
    await ctx.deleteMessage(ctx.message.message_id - 1);
    await ctx.deleteMessage(ctx.message.message_id);

    // Reply with an error message
    await ctx.reply(Arabic.NotNumber);

    // Log the invalid input
    Log.warn(`User entered invalid manual price ${userInput ?? ''}`, 'getManualPriceScene');

    // Re-enter the scene
    await ctx.scene.reenter();

    // Exit the function
    return;
  }

  // Set the manual price in the data object
  dataToWrite.productManualPrice = +userInput;

  // Delete the previous and current messages
  await ctx.deleteMessage(ctx.message.message_id - 1);
  await ctx.deleteMessage(ctx.message.message_id);

  // Reply with the manual price
  await ctx.reply(`${Arabic.ManualPrice}: ${userInput}`);

  // Log the manual price
  Log.info(`Manual price set to ${userInput}`, 'getManualPriceScene');

  // Enter the next scene
  await ctx.scene.enter('getEmployee');

  // Exit the function
  return;
}
