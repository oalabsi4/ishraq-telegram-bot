import Log from '@utils/logger.js';
import { PriceListDataCache, dataToWrite } from './collectedDataFromUser.js';
import type { CTX } from '@/types.js';
import { Arabic } from '@utils/arabicDictionary.js';

export async function clientListKeyboard(ctx: CTX) {
  await ctx.sendChatAction('typing');
  await ctx.reply(Arabic.ChooseClient, {
    reply_markup: {
      inline_keyboard: [...(await PriceListDataCache.getClientsKeyboard()), [{ text: Arabic.Cancel, callback_data: 'Cancel' }]],
    },
  });
  Log.info('Sent client selection keyboard', 'clientListKeyboard');
  return;
}

/**
 * Handles the client selection process.
 *
 * @param ctx - The context object containing information about the current session.
 */
export async function handleClientSelection(ctx: any) {
  // Get the user's choice from the context object
  const userChoice = ctx.match?.[0];

  // If userChoice is not provided, delete the message, send an error message,
  // log a warning, and reenter the scene
  if (!userChoice) {
    await ctx.deleteMessage();
    await ctx.reply(Arabic.Error);
    Log.warn('No user choice in picking a client', 'handleClientSelection');
    await ctx.scene.reenter();
    return;
  }

  // If userChoice is 'Cancel', delete the message, send a cancellation message,
  // log the cancellation, and leave the scene
  if (userChoice === 'Cancel') {
    await ctx.deleteMessage();
    await ctx.reply(Arabic.ItsCanceled);
    Log.info('Write operation canceled', 'handleClientSelection');
    await ctx.scene.leave();
    return;
  }

  // Get the list of clients to select from
  const clientsToSelectFrom = (await PriceListDataCache.getClientsToSelectFrom()) as string[];

  // If userChoice is in the list of clients, update the selected client,
  // delete the message, send a message with the selected client,
  // log the selection, and enter the 'getCount' scene
  if (clientsToSelectFrom.includes(userChoice)) {
    dataToWrite.selectedClient = userChoice;
    await ctx.deleteMessage();
    await ctx.reply(`${Arabic.Client}: ${userChoice}`);
    Log.info(`user selected client: ${userChoice}`, 'handleClientSelection');
    await ctx.scene.enter('getCount');
  } else {
    // If userChoice is not in the list of clients, delete the message,
    // send an error message, log a warning, and reenter the scene
    await ctx.deleteMessage();
    await ctx.reply(Arabic.Error);
    Log.warn('Invalid user choice in picking a client', 'handleClientSelection');
    await ctx.scene.reenter();
  }
}
