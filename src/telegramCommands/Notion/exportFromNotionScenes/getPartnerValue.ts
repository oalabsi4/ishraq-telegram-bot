import { formatTelegramKeyboard } from '@utils/telegramkeyboardFormater.js';
import { dataToCompleteExport, exportData } from './filterData.js';
import Log from '@utils/logger.js';
import type { CTX } from '@/types.js';
import { Arabic } from '@utils/arabicDictionary.js';

/**
 * Display a keyboard with partners to select from.
 *
 * @param ctx - The context object containing information about the message.
 * @returns Promise<void>
 */
export async function displayPartnersKeyboard(ctx: CTX): Promise<void> {
  await ctx.sendChatAction('typing');
  // Get the partners to select from
  const partnersArray = await dataToCompleteExport.getPartnersValues();

  // Format partners into a Telegram keyboard
  const partnersKeyboard = formatTelegramKeyboard(partnersArray);

  // Show keyboard with partners and cancel option
  await ctx.reply(Arabic.ChoosePartner, {
    reply_markup: {
      inline_keyboard: [...partnersKeyboard, [{ text: Arabic.Cancel, callback_data: 'Cancel' }]],
    },
  });

  // Log the action
  Log.info('Sent partner selection keyboard', 'displayPartnersKeyboard');
  return;
}

/**
 * Handles the selection of a partner by the user.
 *
 * @param ctx - The context object containing information about the user and the message.
 */
export async function handlePartnerSelection(ctx: any) {
  // Get the user input from the message
  const userInput = ctx.match[0];

  // Get the partners to select from
  const partnersArray = await dataToCompleteExport.getPartnersValues();

  // Check if the user input is empty or not a valid partner
  if (!userInput || (!partnersArray.includes(userInput) && userInput !== 'Cancel')) {
    // Delete the message
    await ctx.deleteMessage();
    // Send an error message
    await ctx.reply(Arabic.Error);
    // Log a warning message
    Log.warn('User did not select a partner', 'handlePartnerSelection');
    // Reenter the scene
    await ctx.scene.reenter();
    return;
  }

  // Check if the user input is 'Cancel'
  if (userInput === 'Cancel') {
    // Delete the message
    await ctx.deleteMessage();
    // Send a cancellation message
    await ctx.reply(Arabic.ItsCanceled);
    // Log an info message
    Log.info('User canceled the selection', 'handlePartnerSelection');
    // Leave the scene
    await ctx.scene.leave();
    return;
  }

  // Set the selected partner value
  exportData.partnerValue = userInput;
  // Delete the message
  await ctx.deleteMessage();
  // Send a message confirming the selected partner
  await ctx.reply(`${Arabic.Partner}: ${userInput}`);
  // Log an info message
  Log.info(`User selected a partner: ${userInput}`, 'handlePartnerSelection');
  // Enter the next scene
  await ctx.scene.enter('checkForDateFilter');
  return;
}
