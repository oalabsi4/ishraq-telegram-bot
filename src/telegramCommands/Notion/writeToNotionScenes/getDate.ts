import Log from '@utils/logger.js';
import { dateRegex, dataToWrite } from './collectedDataFromUser.js';
import { Arabic } from '@utils/arabicDictionary.js';

/**
 * Display request date message from the user and log the request.
 * @param  ctx - The context object.
 */
export async function requestDateMessage(ctx: any) {
  // Send a message to the user requesting the date.
  await ctx.reply(Arabic.RequestDate);

  // Log the request for the date.
  Log.info('Requested date from user', 'displayCodeSelectionList');
  return;
}

/**
 * Handles the date input from the user.

 * 
 * @param ctx - The context object containing the message and scene information.
 */
export async function handleDateInput(ctx: any) {
  const userInput = ctx.message.text;

  // Check if the user input is valid
  if (!userInput || !dateRegex.test(userInput)) {
    // Delete the previous and current message
    await ctx.deleteMessage(ctx.message.message_id - 1);
    await ctx.deleteMessage(ctx.message?.message_id);

    // Reply with an error message
    await ctx.reply(Arabic.Error + ' \nقد تكون صيغة التاريخ خاطئة');

    // Log the invalid input
    Log.warn(`User entered invalid date: ${userInput ?? 'NO-INPUT'}`, 'handleDateInput');

    // Reenter the scene
    await ctx.scene.reenter();
    return;
  }

  // Set the product date
  dataToWrite.productDate = userInput;

  // Delete the previous and current message
  await ctx.deleteMessage(ctx.message.message_id - 1);
  await ctx.deleteMessage(ctx.message?.message_id);

  // Reply with the chosen date
  await ctx.reply(`${Arabic.Date}: ${userInput}`);

  // Log the chosen date
  Log.info(`Chosen date: ${userInput}`, 'handleDateInput');

  // Enter the 'getDescription' scene
  await ctx.scene.enter('getDescription');
  return;
}
