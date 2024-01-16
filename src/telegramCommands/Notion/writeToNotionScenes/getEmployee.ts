import Log from '@utils/logger.js';
import { PriceListDataCache, dataToWrite } from './collectedDataFromUser.js';
import type { CTX } from '@/types.js';
import { Arabic } from '@utils/arabicDictionary.js';

/**
 * Sends a keyboard to the user with a list of employees to choose from.
 *
 * @param  ctx - The context object.
 * @return  A promise that resolves when the keyboard has been sent.
 */
export async function requestEmployeeKeyboard(ctx: CTX) {
  await ctx.sendChatAction('typing');
  await ctx.reply(Arabic.RequestEmployee, {
    reply_markup: {
      inline_keyboard: [
        ...(await PriceListDataCache.getEmployeesKeyboard()),
        [
          {
            text: Arabic.Cancel,
            callback_data: 'cancel',
          },
        ],
      ],
    },
  });
  // Log that the employee selection keyboard has been sent
  Log.info('Sent employee selection keyboard', 'writeToNotionScenes');
  return;
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
    await ctx.reply(Arabic.Error);
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
    await ctx.reply(Arabic.ItsCanceled);
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
  await ctx.reply(`${Arabic.Employee}: ${userInput}`);
  // Log an info message
  Log.info('User selected an employee', 'handleEmployeeSelection');
  // Enter the 'runNotionWriteFunctionScene'
  await ctx.scene.enter('runNotionWriteFunctionScene');
  return;
}
