import { NotionProductSelection, formatSelectionDataForTelegram } from '@/api/notion/fetchSelectPropValues.js';
import { dataToWrite } from './collectedDataFromUser.js';
import Log from '@utils/logger.js';

/**
 * Display a selection list of product codes and prompt the user to select one.
 *
 * @param ctx - The context object containing information about the current session.
 * @returns  - A promise that resolves when the code selection list has been displayed.
 */
export async function displayCodeSelectionList(ctx: any): Promise<void> {
  // Format the selection data for display in Telegram
  const Loading = await ctx.reply('Loading...');
  const codeChoiceList = formatSelectionDataForTelegram(dataToWrite.priceStructuredData);

  // Prompt the user to type the number of the code they want
  await ctx.reply(`Type the number of the code you want:\n${codeChoiceList}`);
  await ctx.deleteMessage(Loading.message_id);
  // Log that the code selection list has been sent
  Log.info('Sent code selection list', 'displayCodeSelectionList');
}

/**
 * Handles the user's product code selection.
 *
 * @param ctx - The context object containing information about the user's interaction.
 */
export async function handleCodeSelection(ctx: any) {
  // Check if the message text is empty
  if (!ctx.message.text) {
    // Delete the previous message and reply with an error message
    await ctx.deleteMessage(ctx.message.message_id);
    await ctx.reply('something went wrong');
    Log.warn('No user choice in picking a product type', 'handleProductTypeSelection');
    await ctx.scene.reenter();
    return;
  }

  // Find the selected row from the price list DB based on the user's code selection
  const selectedRow = NotionProductSelection(dataToWrite.priceStructuredData, ctx.message.text);

  // Check if the selected row is not found e.g. the user entered an invalid code
  if (!selectedRow) {
    // Delete the previous two messages and reply with an error message
    await ctx.deleteMessage(ctx.message.message_id - 1); // message that the bot sent
    await ctx.deleteMessage(ctx.message.message_id); // message that the user sent
    await ctx.reply('something went wrong');
    Log.warn('Wrong user choice in picking a product type', 'handleProductTypeSelection');
    await ctx.scene.reenter();
    return;
  }

  // Delete the previous two messages
  await ctx.deleteMessage(ctx.message.message_id - 1); // message that the bot sent
  await ctx.deleteMessage(ctx.message.message_id); // message that the user sent

  // Reply with the selected code and log the selection
  await ctx.reply(`Selected code: ${selectedRow?.code}`);
  Log.info(`Selected code: ${selectedRow?.code}`, 'handleProductTypeSelection');

  // Update the filtered results and product code in the dataToWrite object
  dataToWrite.filteredResults = selectedRow;
  dataToWrite.productCode = selectedRow?.code;

  // Enter the 'getDate' scene
  await ctx.scene.enter('getDate');
}
