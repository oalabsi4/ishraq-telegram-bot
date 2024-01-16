import { notionDatePropFilterStatement, notionDatePropFilterString } from '@/api/notion/notionDateFilter.js';
import { sendTelegramFile } from '@/api/telegram/telegramSendFile.js';
import type { CTX } from '@/types.js';
import Log from '@utils/logger.js';
import { exportData } from '../filterData.js';
import { Arabic } from '@utils/arabicDictionary.js';

/**
 * Sends date data with a data statement.
 * @param ctx The context object.
 */
export async function sendDateDataWithDataStatement(ctx: CTX) {
  // Send chat action to indicate file upload
  await ctx.sendChatAction('upload_document');

  try {
    // Filter data based on selected filter property name and date type
    await notionDatePropFilterStatement(
      exportData.selectedFilterPropertyName,
      exportData.selectedDateType as 'past_month' | 'past_week' | 'past_year' | 'this_week'
    );

    // Send the filtered data as a file through Telegram
    await sendTelegramFile(ctx, exportData.selectedFilterPropertyName, Arabic.FileCaption);

    // Log success message
    Log.success('Data sent successfully', 'sendDateDataWithDataStatement');

    // Leave the current scene
    await ctx.scene.leave();
    return;
  } catch (error) {
    console.log(error);

    // Log error message
    Log.error('Error while filtering data', 'sendDateDataWithDataStatement');

    // Send error animation
    await ctx.sendAnimation('https://media.giphy.com/media/3owzWdzr9x9Ekg9Piw/giphy.gif', { caption: Arabic.Error });

    // Leave the current scene
    await ctx.scene.leave();
    return;
  }
}

/**
 * Send date property filter data with a date string filter.
 *
 * @param ctx - The context object.
 * @returns A promise that resolves when the data is sent.
 */
export async function sendDataWithDateString(ctx: CTX) {
  // Display loading message
  await ctx.sendChatAction('upload_document');

  try {
    // Filter the data based on the selected filter property name, date string, and selected date type
    await notionDatePropFilterString(
      exportData.selectedFilterPropertyName,
      exportData.dateString,
      exportData.selectedDateType as 'after' | 'before' | 'equals' | 'on_or_after' | 'on_or_before'
    );

    // Send the filtered data as a Telegram file
    await sendTelegramFile(ctx, exportData.selectedFilterPropertyName, Arabic.FileCaption);

    // Delete the loading message

    // Log success message
    Log.success('Data sent successfully', 'sendDataWithDateString');

    // Leave the current scene
    await ctx.scene.leave();

    return;
  } catch (error) {
    // Log error message
    Log.error('Error while filtering data', 'sendDataWithDateString');
    console.log(error);

    // Delete the loading message

    // Send an error animation
    await ctx.sendAnimation('https://media.giphy.com/media/3owzWdzr9x9Ekg9Piw/giphy.gif', { caption: Arabic.Error });
    Log.error('While sending data', 'sendDataWithDateString');
    // Leave the current scene
    await ctx.scene.leave();

    return;
  }
}
