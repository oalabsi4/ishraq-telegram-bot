import Log from '@utils/logger.js';
import { dataToWrite } from './collectedDataFromUser.js';

/**
 * sends a message to the user thatRequests the user to type the description of the product.
 * @param  ctx - The context object.
 * @returns - A promise that resolves after the message is sent.
 */
export async function requestDescriptionMessage(ctx: any): Promise<void> {
  // Send a message to the user asking to type the description of the product
  await ctx.reply('type the description of the product');

  // Log the request for description from the user
  Log.info('Requested description from user', 'getDescriptionScene');
}



/**
 * Handles the user input for the description and performs necessary actions.
 * @param ctx - The context object containing information about the message and scene.
 */
export async function handleDescriptionInput(ctx: any) {
  const userInput = ctx.message.text;
  
  // Check if user input is empty or too short
  if (!userInput || userInput.length < 3) {
    // Delete previous and current messages
    await ctx.deleteMessage(ctx.message?.message_id - 1);
    await ctx.deleteMessage(ctx.message.message_id);

    // Reply with error message
    await ctx.reply('something went wrong');

    // Log warning
    Log.warn(`User entered invalid description ${userInput}`, 'getDescriptionScene');

    // Re-enter the scene
    await ctx.scene.reenter();
    
    return;
  }

  // Save user input as product description
  dataToWrite.productDescription = userInput;

  // Delete previous and current messages
  await ctx.deleteMessage(ctx.message?.message_id - 1);
  await ctx.deleteMessage(ctx.message.message_id);

  // Reply with success message
  await ctx.reply(`your description is ${userInput}`);

  // Log info
  Log.info(`User entered description ${userInput}`, 'getDescriptionScene');

  // Enter the next scene
  await ctx.scene.enter('getClient');
}
