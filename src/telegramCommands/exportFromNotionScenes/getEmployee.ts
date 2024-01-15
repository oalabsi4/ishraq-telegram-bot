import type { CTX } from '@/types.js';
import { dataToCompleteExport, exportData } from './filterData.js';
import { formatTelegramKeyboard } from '@utils/telegramkeyboardFormater.js';
import Log from '@utils/logger.js';

/**
 * Displays a keyboard with a list of employees for selection.
 *
 * @param ctx - The context object.
 * @return  - A promise that resolves when the keyboard is displayed.
 */
export async function displayEmployeesKeyboard(ctx: CTX) {
  const Loading = await ctx.reply('Loading...');
  const employeesArray = await dataToCompleteExport.getEmployeeToSelectFrom();
  const employeesKeyboard = formatTelegramKeyboard(employeesArray as string[]);

  await ctx.reply('Choose an employee please:', {
    reply_markup: {
      inline_keyboard: [...employeesKeyboard, [{ text: 'Cancel', callback_data: 'Cancel' }]],
    },
  });
  await ctx.deleteMessage(Loading.message_id);
  Log.info('Sent employee selection keyboard', 'displayEmployeesKeyboard');
  return;
}

/**
 * Handle the selection of an employee by the user.
 * @param ctx - The context object containing information about the user's interaction.
 */
export async function handleEmployeeSelection(ctx: any) {
  // Retrieve the array of employees to select from
  const employeesArray = await dataToCompleteExport.getEmployeeToSelectFrom();

  // Get the user input
  const userInput = ctx.match[0];

  // Check if the user input is valid
  if (!userInput || (!employeesArray.includes(userInput) && userInput !== 'Cancel')) {
    // If the user input is invalid, delete the message, send a retry message, log a warning, and reenter the scene
    await ctx.deleteMessage();
    await ctx.reply('retry selection');
    Log.warn('User did not select an employee', 'handleEmployeeSelection');
    await ctx.scene.reenter();
    return;
  }

  // Check if the user wants to cancel the selection
  if (userInput === 'Cancel') {
    // If the user wants to cancel, delete the message, send a cancellation message, log an info message, and leave the scene
    await ctx.deleteMessage();
    await ctx.reply('canceled');
    Log.info('User canceled the selection', 'handleEmployeeSelection');
    await ctx.scene.leave();
    return;
  }

  // If the user input is valid, delete the message, set the employee value, send a confirmation message,
  // log an info message, and enter the next scene
  await ctx.deleteMessage();
  exportData.employeeValue = userInput;
  await ctx.reply(`employee: ${userInput}`);
  Log.info(`User selected employee: ${userInput}`, 'handleEmployeeSelection');
  await ctx.scene.enter('checkForDateFilter');
  return;
}
