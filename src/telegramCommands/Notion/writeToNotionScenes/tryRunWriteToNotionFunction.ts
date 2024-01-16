import Log from '@utils/logger.js';
import { dataToWrite } from './collectedDataFromUser.js';
import { writePageToBillDB } from '@/api/notion/writePageToBillDB.js';
import { Arabic } from '@utils/arabicDictionary.js';

/**
 * Runs the "writePageToBillDB" function with the provided data and handles the result.
 *
 * @param ctx The context object
 */
export async function tryRunNotionWrite(ctx: any) {
  // Show loading message
  const Loading = await ctx.reply(Arabic.Working);

  try {
    // Call the "writePageToBillDB" function with the provided data
    if (['بالدقيقة', 'بالثانية'].includes(dataToWrite.filteredResults?.metric as string)) {
      await writePageToBillDB(
        process.env.dataBaseId,
        dataToWrite.filteredResults?.pageID ?? '',
        dataToWrite.priceListName,
        dataToWrite.productCode,
        dataToWrite.productDate,
        dataToWrite.productDescription,
        dataToWrite.selectedClient,
        dataToWrite.productCount,
        dataToWrite.productEmployee,
        dataToWrite.productLink,
        undefined,
        dataToWrite.productDuration,
        undefined
      );
      // Delete the loading message
      await ctx.deleteMessage(Loading.message_id);

      // Reply with success message
      await ctx.reply(Arabic.Done);

      // Log the success
      Log.success(`Write to notion DB succeeded`, 'runNotionWriteFunctionScene');
      return;
    } else if (['بالصفحة'].includes(dataToWrite.filteredResults?.metric as string)) {
      await writePageToBillDB(
        process.env.dataBaseId,
        dataToWrite.filteredResults?.pageID ?? '',
        dataToWrite.priceListName,
        dataToWrite.productCode,
        dataToWrite.productDate,
        dataToWrite.productDescription,
        dataToWrite.selectedClient,
        dataToWrite.productCount,
        dataToWrite.productEmployee,
        dataToWrite.productLink,
        undefined,
        undefined,
        dataToWrite.productPages
      );
      // Delete the loading message
      await ctx.deleteMessage(Loading.message_id);

      // Reply with success message
      await ctx.reply(Arabic.Done);

      // Log the success
      Log.success(`Write to notion DB succeeded`, 'runNotionWriteFunctionScene');
      return;
    } else if (['نسبة مئوية', 'برمجة'].includes(dataToWrite.filteredResults?.metric as string)) {
      await writePageToBillDB(
        process.env.dataBaseId,
        dataToWrite.filteredResults?.pageID ?? '',
        dataToWrite.priceListName,
        dataToWrite.productCode,
        dataToWrite.productDate,
        dataToWrite.productDescription,
        dataToWrite.selectedClient,
        dataToWrite.productCount,
        dataToWrite.productEmployee,
        dataToWrite.productLink,
        dataToWrite.productManualPrice,
        undefined,
        undefined
      );
      // Delete the loading message
      await ctx.deleteMessage(Loading.message_id);

      // Reply with success message
      await ctx.reply(Arabic.Done);

      // Log the success
      Log.success(`Write to notion DB succeeded`, 'runNotionWriteFunctionScene');
      return;
    } else {
      await writePageToBillDB(
        process.env.dataBaseId,
        dataToWrite.filteredResults?.pageID ?? '',
        dataToWrite.priceListName,
        dataToWrite.productCode,
        dataToWrite.productDate,
        dataToWrite.productDescription,
        dataToWrite.selectedClient,
        dataToWrite.productCount,
        dataToWrite.productEmployee,
        dataToWrite.productLink,
        undefined,
        undefined,
        undefined
      );
      // Delete the loading message
      await ctx.deleteMessage(Loading.message_id);

      // Reply with success message
      await ctx.reply(Arabic.Done);

      // Log the success
      Log.success(`Write to notion DB succeeded`, 'runNotionWriteFunctionScene');
      return;
    }
  } catch (error) {
    // Log the error
    Log.error('while writing to notion DB', 'runNotionWriteFunctionScene');
    console.error('Error while running the function:', error);

    // Delete the loading message
    await ctx.deleteMessage(Loading.message_id);

    // Reply with error message
    await ctx.reply(Arabic.Error);

    // Leave the scene
    await ctx.scene.leave();

    return;
  }
}
