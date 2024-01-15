import Log from "@utils/logger.js";
import { dataToWrite } from "./collectedDataFromUser.js";


/**
 * Requests the duration of the product from the user.
 * @param  ctx - The context object.
 * @returns  - A promise that resolves when the duration request message is sent.
 */
export async function requestDurationMessage(ctx: any) {
  // Send a message to the user requesting the duration of the product
  await ctx.reply('Type the duration of the product');

  // Log the information about the sent duration request message
  Log.info('Sent duration request message', 'GetDurationScene');
}



/**
 * Handles the duration input from the user.
 * 
 * @param  ctx - The context object.
 */
export async function handleDurationInput(ctx: any) {
    // Get the duration from the message
    const duration = ctx.message.text;
    // Regular expression to validate the duration format e.g. 1:30 or 1:30,1:30
    const durationRegex = /(,?)(0?[1-9]|[1-9][0-9]):([0-6]0|0[0-9]|[1-9])(,?)/g;

    // Check if the duration is empty or doesn't match the format
    if (!duration || duration.trim().length === 0 || !durationRegex.test(duration)) {
        // Delete the previous and current message
        await ctx.deleteMessage(ctx.message.message_id - 1);
        await ctx.deleteMessage(ctx.message.message_id);
        // Reply with an error message
        await ctx.reply('something went wrong');
        // Log the invalid duration
        Log.warn(`User entered invalid duration ${duration ?? ''}`, 'GetDurationScene');
        // Reenter the scene
        await ctx.scene.reenter();
        return;
    }

    // Set the product duration
    dataToWrite.productDuration = duration;
    // Delete the previous and current message
    await ctx.deleteMessage(ctx.message.message_id - 1);
    await ctx.deleteMessage(ctx.message.message_id);
    // Log the entered duration
    Log.info(`User entered duration ${duration}`, 'GetDurationScene');
    // Enter the getEmployee scene
    await ctx.scene.enter('getEmplyee');
    return;
}
