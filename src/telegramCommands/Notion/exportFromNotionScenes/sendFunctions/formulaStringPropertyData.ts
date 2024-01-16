import type { stringFormulasKeys } from '@/api/notion/notionFormulaFetch.js';
import { notionStringFormulaFilter } from '@/api/notion/notionFormulaFilter.js';
import { sendTelegramFile } from '@/api/telegram/telegramSendFile.js';
import type { CTX } from '@/types.js';
import { Arabic } from '@utils/arabicDictionary.js';
import Log from '@utils/logger.js';

/**
 * Sends a formula string without a date to the specified context.
 * @param ctx The context object.
 * @param propName The property name.
 * @param propValue The property value.
 */
export async function sendFormulaStringNoDate(ctx: CTX, propName: string, propValue: string) {
  await ctx.sendChatAction('upload_document');
  try {
    await notionStringFormulaFilter(propName as (typeof stringFormulasKeys)[keyof typeof stringFormulasKeys], propValue);
    await sendTelegramFile(ctx, propName, Arabic.FileCaption);
    Log.success('Data sent successfully', 'sendFormulaStringNoDate');
    await ctx.scene.leave();
    return;
  } catch (error) {
    console.log(error);
    Log.error('Error while sending data', 'sendFormulaStringNoDate');
    await ctx.reply(Arabic.Error);
    await ctx.scene.leave();
    return;
  }
}

/**
 * Sends a formula string property, with date statement filter
 *
 * @param ctx - The context to send the data to.
 * @param propName - The name of the property.
 * @param propValue - The value of the property.
 * @param dataStatement - The type of date statement.
 */
export async function sendFormulaStringDtateStatement(ctx: CTX, propName: string, propValue: string, dataStatement: string) {
  // Send chat action to indicate that a document is being uploaded
  await ctx.sendChatAction('upload_document');

  try {
    // Apply notion string formula filter
    await notionStringFormulaFilter(
      propName as (typeof stringFormulasKeys)[keyof typeof stringFormulasKeys],
      propValue,
      dataStatement as
        | 'past_month'
        | 'past_year'
        | 'this_week'
        | 'past_week'
        | 'on_or_after'
        | 'on_or_before'
        | 'after'
        | 'before'
    );

    // Send Telegram file with the property name
    await sendTelegramFile(ctx, propName, Arabic.FileCaption);

    // Log success message
    Log.success('Data sent successfully', 'sendFormulaStringDateString');

    // Leave the current scene
    await ctx.scene.leave();
    return;
  } catch (error) {
    console.log(error);

    // Log error message
    Log.error('Error while sending data', 'sendFormulaStringDateString');
    await ctx.reply(Arabic.Error);
    // Leave the current scene
    await ctx.scene.leave();
    return;
  }
}

/**
 * Sends a formula string, along with a date filter, string.
 *
 * @param ctx - The chat context.
 * @param propName - The name of the property.
 * @param propValue - The value of the property.
 * @param dateStatement - The statement for filtering the date.
 * @param date - The date for filtering.
 */
export async function sendFormulaStringDateString(
  ctx: CTX,
  propName: string,
  propValue: string,
  dateStatement: string,
  date: string
) {
  // Send chat action to indicate that a document is being uploaded
  await ctx.sendChatAction('upload_document');

  try {
    // Apply the notion string formula filter with the provided parameters
    await notionStringFormulaFilter(
      propName as (typeof stringFormulasKeys)[keyof typeof stringFormulasKeys],
      propValue,
      dateStatement as
        | 'past_month'
        | 'past_year'
        | 'this_week'
        | 'past_week'
        | 'on_or_after'
        | 'on_or_before'
        | 'after'
        | 'before',
      date
    );

    // Send the filtered data as a Telegram file
    await sendTelegramFile(ctx, propName, Arabic.FileCaption);

    // Log the success message
    Log.success('Data sent successfully', 'sendFormulaStringDateString');

    // Leave the current scene
    await ctx.scene.leave();

    return;
  } catch (error) {
    // Log the error message
    console.log(error);
    Log.error('Error while sending data', 'sendFormulaStringDateString');
    await ctx.reply(Arabic.Error);
    // Leave the current scene
    await ctx.scene.leave();

    return;
  }
}
