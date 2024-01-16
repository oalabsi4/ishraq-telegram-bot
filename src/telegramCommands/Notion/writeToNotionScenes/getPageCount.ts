import { isValidNumber } from '@/api/notion/fetchSelectPropValues.js';
import Log from '@utils/logger.js';
import { dataToWrite } from './collectedDataFromUser.js';
import { Arabic } from '@utils/arabicDictionary.js';

/**
 * Prompts the user to enter the number of pages.

 * 
 * @param  ctx - The context object containing information about the user and the current state of the conversation.
 * @returns  - A promise that resolves once the message has been sent.
 */
export async function requestPageCountMessage(ctx: any): Promise<void> {
  // Prompt the user to enter the number of pages
  await ctx.reply(Arabic.RequestPageCount);

  // Log the action
  Log.info('Sent pages request message', 'getPagesScene');
  return;
}

/**
 * Handles the user input for page count.
 *
 * @param  ctx - The context object.
 */
export async function handlePageCountInput(ctx: any) {
  // Get the user input
  const userInput = ctx.message.text;

  // Check if the user input is valid
  if (!userInput || userInput.trim().length === 0 || !isValidNumber(+userInput) || +userInput <= 0) {
    // Delete the previous message
    await ctx.deleteMessage(ctx.message.message_id - 1);
    // Delete the current message
    await ctx.deleteMessage(ctx.message.message_id);
    // Reply with an error message
    await ctx.reply(Arabic.NotNumber);
    // Log the error
    Log.warn(`User entered invalid page count ${userInput ?? ''}`, 'getPagesScene');
    // Re-enter the current scene
    await ctx.scene.reenter();
    // Exit the function
    return;
  }

  // Update the page count in the data object
  dataToWrite.productPages = +userInput;

  // Delete the previous message
  await ctx.deleteMessage(ctx.message.message_id - 1);
  // Delete the current message
  await ctx.deleteMessage(ctx.message.message_id);
  // Reply with the page count
  await ctx.reply(`${Arabic.PageCount}: ${userInput}`);
  // Log the page count
  Log.info(`User entered page count: ${userInput}`, 'getPagesScene');
  // Enter the next scene
  await ctx.scene.enter('getEmplyee');
  // Exit the function
  return;
}
