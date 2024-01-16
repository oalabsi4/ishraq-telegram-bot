import { filterPricesFormat } from '@/api/notion/fetchSelectPropValues.js';
import { dataToWrite, PriceListDataCache } from './collectedDataFromUser.js';
import Log from '@utils/logger.js';
import { Arabic } from '@utils/arabicDictionary.js';
import type { CTX } from '@/types.js';

/**
 * Display a selection keyboard for choosing a product  type.
 *
 * @param ctx - The context object.
 * @param chooseTypeKeyboard - The keyboard options for selecting the product  type.
 */
export async function productCodeSelectionKeyboard(ctx: CTX, chooseTypeKeyboard: any) {
  await ctx.sendChatAction('typing');
  await ctx.reply(Arabic.ChooseType, {
    reply_markup: {
      inline_keyboard: [...chooseTypeKeyboard, [{ text: Arabic.Cancel, callback_data: 'Cancel' }]],
    },
  });
  Log.info('Sent product type selection keyboard', 'productCodeSelectionKeyboard');
  return;
}

/**
 * Handle the user's selection of a product type.
 *
 * @param  ctx - The context object.
 */
export async function handleProductTypeSelection(ctx: any) {
  // Get the user's choice from the context match object
  const userChoice = ctx.match?.[0];

  // Check if userChoice is undefined or empty
  if (!userChoice) {
    // Delete the message
    await ctx.deleteMessage();
    // Reply with an error message
    await ctx.reply(Arabic.Error);
    // Log a warning message
    Log.warn('No user choice in picking a product type', 'handleProductTypeSelection');
    // Reenter the current scene
    await ctx.scene.reenter();
    return;
  }

  // Check if userChoice is 'Cancel'
  if (userChoice === 'Cancel') {
    // Delete the message
    await ctx.deleteMessage();
    // Reply with a cancellation message
    await ctx.reply(Arabic.ItsCanceled);
    // Log an info message
    Log.info('Write operation canceled', 'handleProductTypeSelection');
    // Leave the current scene
    await ctx.scene.leave();
    return;
  }

  // Check if userChoice is a valid product code
  if ((await PriceListDataCache.getUniqueProductCodes()).includes(userChoice)) {
    // Set the selectedType property in the dataToWrite object
    dataToWrite.selectedType = userChoice;
    // Filter the price list based on the selected product type
    const chosenRow = filterPricesFormat(dataToWrite.selectedType, await PriceListDataCache.getPriceList());
    // Set the priceStructuredData property in the dataToWrite object
    dataToWrite.priceStructuredData = chosenRow;
    // Delete the message
    await ctx.deleteMessage();
    // Reply with the chosen product type
    await ctx.reply(`${Arabic.Type}: ${userChoice}`);
    // Log an info message with the chosen product type
    Log.info(`Chosen product type: ${userChoice}`, 'handleProductTypeSelection');
    // Enter the 'getCode' scene
    await ctx.scene.enter('getCode');
  } else {
    // Delete the message
    await ctx.deleteMessage();
    // Reply with an error message
    await ctx.reply(Arabic.Error);
    // Log a warning message
    Log.warn('Product type not recognized', 'handleProductTypeSelection');
    // Reenter the current scene
    await ctx.scene.reenter();
  }
}
