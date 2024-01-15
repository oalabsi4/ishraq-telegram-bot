import Log from "@utils/logger.js";
import { dataToWrite } from "./collectedDataFromUser.js";

/**
 * Sends a message requesting the user to type the link of the product.
 * 
 * @param  ctx - The context object.
 * @returns  - A promise that resolves once the message is sent.
 */
export async function requestLinkMessage(ctx: any): Promise<void> {
    await ctx.reply('type the link of the product');
    Log.info('Sent Link request message', 'requestLinkMessage');
}



/**
 * Handles the user input of a link.
 * 
 * @param  ctx - The context object.
 */
export async function handleLinkInput(ctx:any) {
    // Get the user input
    const userInput = ctx.message.text;

    // Check if the user input is empty or whitespace
    if (!userInput || userInput.trim().length === 0) {
        // Delete the previous and current messages
        await ctx.deleteMessage(ctx.message.message_id - 1);
        await ctx.deleteMessage(ctx.message.message_id);

        // Send an error message
        await ctx.reply('Something went wrong');

        // Log the error
        Log.warn(`User entered invalid link ${userInput}`, 'handleLinkInput');

        // Reenter the scene
        await ctx.scene.reenter();
        return;
    }

    // Set the product link in the dataToWrite object
    dataToWrite.productLink = userInput;

    // Delete the previous and current messages
    await ctx.deleteMessage(ctx.message.message_id - 1);
    await ctx.deleteMessage(ctx.message.message_id);

    // Send a confirmation message with the product link
    await ctx.reply(`Product link: ${userInput}`);

    // Log the user's input
    Log.info(`User entered product link: ${userInput}`, 'handleLinkInput');

    // Check the metric of the filtered results
    if (dataToWrite.filteredResults && ['بالصفحة'].includes(dataToWrite.filteredResults.metric)) {
        // Redirect the user to the getPages scene
        Log.info('Redirected user to getPagesScene', 'handleLinkInput');
        await ctx.scene.enter('getPages');
        return;
    } else if (dataToWrite.filteredResults && ['نسبة مئوية', 'برمجة'].includes(dataToWrite.filteredResults.metric)) {
        // Redirect the user to the getManualPrice scene
        Log.info('Redirected user to getManualPriceScene', 'handleLinkInput');
        await ctx.scene.enter('getManualPrice');
        return;
    } else if (dataToWrite.filteredResults && ['بالدقيقة', 'بالثانية'].includes(dataToWrite.filteredResults.metric)) {
        // Redirect the user to the GetDuration scene
        Log.info('Redirected user to GetDurationScene', 'handleLinkInput');
        await ctx.scene.enter('GetDuration');
        return;
    } else {
        // Redirect the user to the getEmployee scene
        Log.info('Redirected user to getEmplyeeScene', 'handleLinkInput');
        await ctx.scene.enter('getEmplyee');
        return;
    }
}
