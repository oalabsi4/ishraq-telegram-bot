import { formatTelegramKeyboard } from '@utils/telegramkeyboardFormater.js';
import { dataToCompleteExport, exportData } from './filterData.js';
import Log from '@utils/logger.js';
import type { CTX } from '@/types.js';

/**
 * Display a keyboard with types to select from.
 *
 * @param ctx - The context object containing information about the message.
 * @returns Promise<void>
 */
export async function displayTypesKeyboard(ctx: CTX): Promise<void> {
  // Show loading message
  const loading = await ctx.reply('Loading...');

  // Get the types to select from
  const typesArray = await dataToCompleteExport.getTypesToSelectFrom();

  // Format types into a Telegram keyboard
  const typesKeyboard = formatTelegramKeyboard(typesArray);

  // Show keyboard with types and cancel option
  await ctx.reply('Choose a type please:', {
    reply_markup: {
      inline_keyboard: [...typesKeyboard, [{ text: 'Cancel', callback_data: 'Cancel' }]],
    },
  });

  // Delete the loading message
  await ctx.deleteMessage(loading.message_id);

  // Log the action
  Log.info('Sent type selection keyboard', 'displayTypesKeyboard');
  return;
}

/**
 * Handles the selection of a type by the user.
 *
 * @param ctx - The context object containing information about the user and the message.
 */
export async function handleTypeSelection(ctx: any) {
  // Get the user input from the message
  const userInput = ctx.match[0];

  // Get the types to select from
  const typesArray = await dataToCompleteExport.getTypesToSelectFrom();

  // Check if the user input is empty or not a valid type
  if (!userInput || (!typesArray.includes(userInput) && userInput !== 'Cancel')) {
    // Delete the message
    await ctx.deleteMessage();
    // Send an error message
    await ctx.reply('Something went wrong');
    // Log a warning message
    Log.warn('User did not select a type', 'handleTypeSelection');
    // Reenter the scene
    await ctx.scene.reenter();
    return;
  }

  // Check if the user input is 'Cancel'
  if (userInput === 'Cancel') {
    // Delete the message
    await ctx.deleteMessage();
    // Send a cancellation message
    await ctx.reply('canceled');
    // Log an info message
    Log.info('User canceled the selection', 'handleTypeSelection');
    // Leave the scene
    await ctx.scene.leave();
    return;
  }

  // Set the selected type value
  exportData.typeValue = userInput;
  // Delete the message
  await ctx.deleteMessage();
  // Send a message confirming the selected type
  await ctx.reply(`Selected type: ${userInput}`);
  // Log an info message
  Log.info('User selected a type', 'handleTypeSelection');
  // Enter the next scene
  await ctx.scene.enter('checkForDateFilter');
  return;
}
