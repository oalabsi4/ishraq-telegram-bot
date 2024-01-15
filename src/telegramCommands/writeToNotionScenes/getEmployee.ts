import Log from '@utils/logger.js';
import { PriceListDataCache, dataToWrite } from './collectedDataFromUser.js';

/**
 * Sends a keyboard to the user with a list of employees to choose from.
 *
 * @param  ctx - The context object.
 * @return  A promise that resolves when the keyboard has been sent.
 */
export async function requestEmployeeKeyboard(ctx: any) {
  const Loading = await ctx.reply('Loading...');
  await ctx.reply('choose an employee from the list:', {
    reply_markup: {
      inline_keyboard: [
        ...(await PriceListDataCache.getEmployeesKeyboard()),
        [
          {
            text: 'cancel',
            callback_data: 'cancel',
          },
        ],
      ],
    },
  });
  await ctx.deleteMessage(Loading.message_id);
  // Log that the employee selection keyboard has been sent
  Log.info('Sent employee selection keyboard', 'writeToNotionScenes');
}

/**
 * Handle the selection of an employee.
 *
 * @param ctx - The context object.
 */
export async function handleEmployeeSelection(ctx: any) {
  // Get the user input from the context
  const userInput = ctx.match[0];

  // Check if the user input is empty or consists only of whitespace
  if (!userInput || userInput.trim().length === 0) {
    // Delete the message
    await ctx.deleteMessage();
    // Reply with an error message
    await ctx.reply('something went wrong');
    // Log a warning
    Log.warn('User did not select an employee', 'handleEmployeeSelection');
    // Reenter the scene
    await ctx.scene.reenter();
    return;
  }

  // Check if the user input is 'cancel'
  if (userInput === 'cancel') {
    // Delete the message
    await ctx.deleteMessage();
    // Leave the scene
    await ctx.scene.leave();
    // Log an info message
    Log.info('User canceled the selection', 'handleEmployeeSelection');
    return;
  }

  // Set the product employee in the data to write
  dataToWrite.productEmployee = userInput;

  // Delete the message
  await ctx.deleteMessage();
  // Reply with the selected employee
  await ctx.reply(`Employee: ${userInput}`);
  // Log an info message
  Log.info('User selected an employee', 'handleEmployeeSelection');
  // Enter the 'runNotionWriteFunctionScene'
  await ctx.scene.enter('runNotionWriteFunctionScene');
  return;
}
