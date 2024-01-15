import { writePageToBillDB } from "@/api/notion/writePagetoBillDB.js";
import Log from "@utils/logger.js";
import { dataToWrite } from "./collectedDataFromUser.js";


/**
 * Runs the "writePageToBillDB" function with the provided data and handles the result.
 * 
 * @param ctx The context object
 */
export async function tryRunNotionWrite(ctx: any) {
  // Show loading message
  const Loading = await ctx.reply('processing...');

  try {
    // Call the "writePageToBillDB" function with the provided data
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
      dataToWrite.productDuration,
      dataToWrite.productPages
    );

    // Delete the loading message
    await ctx.deleteMessage(Loading.message_id);

    // Reply with success message
    await ctx.reply('done');
    
    // Log the success
    Log.success(`Write to notion DB succeeded`, 'runNotionWriteFunctionScene');

    return;
  } catch (error) {
    // Log the error
    Log.error('while writing to notion DB', 'runNotionWriteFunctionScene');
    console.error('Error while running the function:', error);

    // Delete the loading message
    await ctx.deleteMessage(Loading.message_id);

    // Reply with error message
    await ctx.reply('something went wrong');

    // Leave the scene
    await ctx.scene.leave();
    
    return;
  }
}
