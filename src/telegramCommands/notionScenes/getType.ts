import { filterPricesFormat } from '@/api/notion/fetchSelectPropValues.js';
import { dataToWrite, PriceListDataCache } from './collectedDataFromUser.js';

/**
 * Display a selection keyboard for choosing a product code type.
 *
 * @param ctx - The context object.
 * @param chooseTypeKeyboard - The keyboard options for selecting the product code type.
 */
export async function productCodeSelectionKeyboard(ctx: any, chooseTypeKeyboard: any) {
  // Display a message to choose a type
  await ctx.reply('Choose a type please:', {
    reply_markup: {
      inline_keyboard: [...chooseTypeKeyboard, [{ text: 'Cancel', callback_data: 'Cancel' }]],
    },
  });
}

export async function handleProductTypeSelection(ctx: any) {
  const userChoice = ctx.match?.[0];
  if (!userChoice) {
    await ctx.reply('something went wrong');
    await ctx.scene.reenter();
    return;
  }
  if (userChoice === 'Cancel') {
    await ctx.reply('canceled');
    await ctx.scene.leave();
    return;
  }
  if ((await PriceListDataCache.getUniqueProductCodes()).includes(userChoice)) {
    dataToWrite.selectedType = userChoice;
    const choosenRow = filterPricesFormat(dataToWrite.selectedType, await PriceListDataCache.getPriceList());
    dataToWrite.priceStructuredData = choosenRow;
    await ctx.scene.enter('getCode');
  } else {
    await ctx.reply('something went wrong');
    await ctx.scene.reenter();
  }
}
