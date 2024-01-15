import type { CTX } from '@/types.js';
import Log from '@utils/logger.js';
import { dateRegex } from '../writeToNotionScenes/collectedDataFromUser.js';
import { exportData } from './filterData.js';

export async function requestDateStringMessage(ctx: CTX) {
  await ctx.reply("Please enter a date in the format 'YYYY-MM-DD'");
  Log.info('Requested date from user', 'requestDateStringMessage');
  return;
}

/**
 * Handle the user input for a date string.
 *
 * @param ctx - The context object containing the user input.
 */
export async function handleDateString(ctx: any) {
  // Get the user input
  const userInput = ctx.message.text;

  // If no user input is provided
  if (!userInput) {
    await ctx.reply('something went wrong');
    Log.warn('User did not enter a date', 'handleDateString');
    await ctx.scene.reenter();
    return;
  }

  // If the user input does not match the date format
  if (!dateRegex.test(userInput)) {
    await ctx.deleteMessage(ctx.message.message_id - 1);
    await ctx.deleteMessage(ctx.message.message_id);
    await ctx.reply('wrong input format');
    Log.warn(`User entered invalid date ${userInput}`, 'handleDateString');
    await ctx.scene.reenter();
    return;
  }

  // Set the date string in the export data
  exportData.dateString = userInput;

  // Delete the previous messages
  await ctx.deleteMessage(ctx.message.message_id - 1);
  await ctx.deleteMessage(ctx.message.message_id);

  // Reply with the date
  await ctx.reply(`Date: ${userInput}`);
  Log.info(`User entered date: ${userInput}`, 'handleDateString');

  // Enter the next scene
  await ctx.scene.enter('tryRunExportFunction');
  return;
}
