import type { CTX } from '@/types.js';
import { dataToCompleteExport, exportData } from './filterData.js';
import { formatTelegramKeyboard } from '@utils/telegramkeyboardFormater.js';
import Log from '@utils/logger.js';
import { Arabic } from '@utils/arabicDictionary.js';

/**
 * Retrieves a list of clients and displays a keyboard for client selection in the Telegram chat.
 * @param ctx - The context object containing information about the Telegram chat.
 */
export async function displayClientsKeyboard(ctx: CTX) {
  ctx.sendChatAction('typing');
  // Retrieve clients to select from
  const clients = await dataToCompleteExport.getClientsToSelectFrom();

  // Format clients into a Telegram keyboard
  const clientsKeyboard = formatTelegramKeyboard(clients as string[]);

  // Show client selection keyboard with the option to cancel
  await ctx.reply(Arabic.ChooseClient, {
    reply_markup: {
      inline_keyboard: [...clientsKeyboard, [{ text: Arabic.Cancel, callback_data: 'Cancel' }]],
    },
  });

  // Log the action
  Log.info('Sent client selection keyboard', 'displayClientsKeyboard');

  return;
}

/**
 * Handles the client selection by the user.
 * @param  ctx - The context object containing information about the user interaction.
 */
export async function handleClientSelection(ctx: any) {
  // Get the user input
  const userInput = ctx.match[0];

  // Check if the user input is valid
  if (!userInput || (!(await dataToCompleteExport.getClientsToSelectFrom()).includes(userInput) && userInput !== 'Cancel')) {
    // If not valid, delete the message and show an error message
    await ctx.deleteMessage();
    ctx.reply(Arabic.Error);
    Log.warn('User did not select a client', 'handleClientSelection');

    // Reenter the scene
    await ctx.scene.reenter();
    return;
  }
  if (userInput === 'Cancel') {
    await ctx.deleteMessage();
    await ctx.reply(Arabic.ItsCanceled);
    Log.info('User canceled the selection', 'handleClientSelection');
    await ctx.scene.leave();
    return;
  }

  // If valid, delete the message, store the selected client value, and show a success message
  await ctx.deleteMessage();
  exportData.clientValue = userInput;
  await ctx.reply(`${Arabic.Client}: ${userInput}`);
  Log.info(`User selected client: ${userInput}`, 'handleClientSelection');

  // Move to the next scene
  await ctx.scene.enter('checkForDateFilter');
}
