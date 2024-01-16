import {
  notionSelectPropDateStatement,
  notionSelectPropDateString,
  notionSelectPropNoDate,
} from '@/api/notion/notionSelectFilter.js';
import type { CTX } from '@/types.js';
import { sendTelegramFile } from '@/api/telegram/telegramSendFile.js';
import Log from '@utils/logger.js';
import { Arabic } from '@utils/arabicDictionary.js';

/**
 * Sends a select property with no date to the specified context.
 *
 * @param ctx - The context object.
 * @param propName - The name of the property.
 * @param propValue - The value of the property.
 */
export async function sendSelectPropertyNoDate(ctx: CTX, propName: string, propValue: string) {
  // Send chat action indicating that a document will be uploaded
  await ctx.sendChatAction('upload_document');

  try {
    // Call the notionSelectPropNoDate function with the specified property name and value
    await notionSelectPropNoDate(propName, propValue);

    // Send the Telegram file with the property name and a message
    await sendTelegramFile(ctx, propName, Arabic.FileCaption);

    // Log a success message
    Log.success('Data sent successfully', 'sendSelectPropertyNoDate');

    // Leave the scene and return
    await ctx.scene.leave();
    return;
  } catch (error) {
    console.log(error);

    // Log an error message
    Log.error('Error while sending data', 'sendSelectPropertyNoDate');

    // Leave the scene and return
    await ctx.reply(Arabic.Error);
    await ctx.scene.leave();
    return;
  }
}

/**
 * Sends selected property data with a date string filter.
 *
 * @param  ctx - The context object.
 * @param  propName - The name of the property.
 * @param  propValue - The value of the property.
 * @param  dateStatement - The date statement.
 * @param  date - The date value.
 */
export async function sendSelectPropertyDateString(
  ctx: CTX,
  propName: string,
  propValue: string,
  dateStatement: string,
  date: string
) {
  // Notify the user that a document is being uploaded
  await ctx.sendChatAction('upload_document');

  try {
    // Call the notionSelectPropDateString function to perform the desired action
    await notionSelectPropDateString(
      propName,
      propValue,
      date,
      dateStatement as 'on_or_after' | 'on_or_before' | 'after' | 'before' | 'equals'
    );

    // Send the Telegram file to the user
    await sendTelegramFile(ctx, propName, Arabic.FileCaption);

    // Log the success message
    Log.success('Data sent successfully', 'sendSelectPropertyDataString');

    // Leave the current scene
    await ctx.scene.leave();

    return;
  } catch (error) {
    console.log(error);

    // Log the error message
    Log.error('Error while sending data', 'sendSelectPropertyDataString');
    await ctx.reply(Arabic.Error);
    // Leave the current scene
    await ctx.scene.leave();

    return;
  }
}

/**
 * Sends a select property with a date statement filter.
 *
 * @param ctx - The context object.
 * @param propName - The name of the property.
 * @param propValue - The value of the property.
 * @param dateStatement - The date statement ('past_month', 'past_year', 'this_week', 'past_week').
 */
export async function sendSelectPropertyDateStatement(ctx: CTX, propName: string, propValue: string, dateStatement: string) {
  // Send chat action
  await ctx.sendChatAction('upload_document');

  try {
    // Call notionSelectPropDateStatement function
    await notionSelectPropDateStatement(
      propName,
      propValue,
      dateStatement as 'past_month' | 'past_year' | 'this_week' | 'past_week'
    );

    // Send telegram file
    await sendTelegramFile(ctx, propName, Arabic.FileCaption);

    // Log success
    Log.success('Data sent successfully', 'sendSelectPropertyDateStatement');

    // Leave the current scene
    await ctx.scene.leave();

    return;
  } catch (error) {
    console.log(error);

    // Log error
    Log.error('Error while sending data', 'sendSelectPropertyDateStatement');
    await ctx.reply(Arabic.Error);
    // Leave the current scene
    await ctx.scene.leave();

    return;
  }
}
