import type { CTX } from '@/types.js';
import { exportData } from './filterData.js';
import { formatTelegramKeyboard } from '@utils/telegramkeyboardFormater.js';
import Log from '@utils/logger.js';

export async function displayDateFilterTypes(ctx: CTX) {
  const DateTypesKeyboard = formatTelegramKeyboard(exportData.availableDateTypes);
  await ctx.reply('choose a date filter type', {
    reply_markup: {
      inline_keyboard: [...DateTypesKeyboard, [{ text: 'Cancel', callback_data: 'Cancel' }]],
    },
  });
  Log.info('Sent date filter type selection keyboard', 'displayDateFilterTypes');
  return;
}

/**
 * Handles the selection of a date filter type.
 * @param ctx - The context object.
 */
export async function handleDateFilterTypeSelection(ctx: any) {
  // Get the available date types from the exportData object
  const DateTypesArray = exportData.availableDateTypes;
  // Get the user input from the context
  const userInput = ctx.match[0];

  // Check if the user input is valid
  if (!userInput || !DateTypesArray.includes(userInput)) {
    // Delete the message
    await ctx.deleteMessage();
    // Reply with an error message
    await ctx.reply('Something went wrong');
    // Log a warning
    Log.warn('User did not select a date type', 'handleDateFilterTypeSelection');
    // Reenter the scene
    await ctx.scene.reenter();
    return;
  }

  // Check if the user input is 'Cancel'
  if (userInput === 'Cancel') {
    // Delete the message
    await ctx.deleteMessage();
    // Reply with a cancellation message
    await ctx.reply('Canceled');
    // Log an info message
    Log.info('User canceled the selection', 'handleDateFilterTypeSelection');
    // Leave the scene
    await ctx.scene.leave();
  }

  // Check if the user input is in the dateTypesNOString array
  if (exportData.dateTypesNOString.includes(userInput)) {
    // Delete the message
    await ctx.deleteMessage();
    // Reply with the selected date type
    await ctx.reply(`Date Type: ${userInput}`);
    // Log an info message
    Log.info(`User selected date type ${userInput}`, 'handleDateFilterTypeSelection');
    // Enter the 'tryRunExportFunction' scene
    await ctx.scene.enter('tryRunExportFunction');
    // store the date type Value
    exportData.selectedDateType = userInput;
    return;
  }

  // Check if the user input is in the dateTypesRequireString array
  if (exportData.dateTypesRequireString.includes(userInput)) {
    // Delete the message
    await ctx.deleteMessage();
    // Reply with the selected date type
    await ctx.reply(`Date Type: ${userInput}`);
    // Log an info message
    Log.info(`User selected date type ${userInput}`, 'handleDateFilterTypeSelection');
    // Enter the 'getDateString' scene
    await ctx.scene.enter('getDateString');
    // store the date type Value
    exportData.selectedDateType = userInput;
    return;
  }

  // If none of the above conditions are met, something went wrong
  // Delete the message
  await ctx.deleteMessage();
  // Reply with an error message
  await ctx.reply('Something went wrong');
  // Log a warning
  Log.warn('User did not select a date type', 'handleDateFilterTypeSelection');
  // Reenter the scene
  await ctx.scene.reenter();
  return;
}
