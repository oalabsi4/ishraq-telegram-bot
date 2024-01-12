import type { Telegraf } from 'node_modules/telegraf/typings/telegraf.js';
import { Context } from 'telegraf';
import { Update } from 'telegraf/types';
import Log from '@utils/logger.js';
import chalk from 'chalk';
import { notionDatePropFilterStatement, notionDatePropFilterString } from '../../api/notion/notionDateFilter.js';
import { awaitReply } from '../../api/telegramWaitForResponse.js';
import { dateSelectionKeyboard } from './dateSelectionKeyboard.js';
import { sendTelegramFile } from 'src/api/telegramSendFile.js';

const dateRegex = /(20[0-9]{2})\s*-\s*(10|11|12|0[1-9])\s*-\s*(3[0-1]|2[0-9]|1[0-9]|0[1-9])\s*$/; //ex: 2022-01-01 (with zeros)

/**
+ * Handles generation of the date filter file.
+ *
+ * @param bot - The Telegram bot instance.
+ * @param ctx - The context of the update.
+ * @param propertyName - The name of the property to filter.
+ * @return A promise that resolves when the filter is applied.
+ */
export async function TelegramDatePropertyFilter(bot: Telegraf<Context<Update>>, ctx: Context<Update>, propertyName: string) {
  const statementsNoString = ['past_month', 'past_year', 'this_week', 'past_week'];
  const statementsString = ['on_or_after', 'on_or_before', 'after', 'before'];
  const dateFilterTypes = ['past_month', 'past_year', 'this_week', 'past_week', 'on_or_after', 'on_or_before', 'after', 'before'];
  // asking for date filter type
  await dateSelectionKeyboard(ctx, true);
  bot.action(dateFilterTypes, async ctx => {
    const dateFilterType = ctx.match[0];
    if (statementsNoString.includes(dateFilterType)) {
      await handleDateFilterNoInput(ctx, propertyName, dateFilterType as 'past_month' | 'past_year' | 'this_week' | 'past_week');
    }
    if (statementsString.includes(dateFilterType)) {
      await handleDateFilterInput(ctx, propertyName, dateFilterType as 'on_or_after' | 'on_or_before' | 'after' | 'before');
    }
  });
}

/**
 * Handles the date filter when no input is Needed.
 *
 * @param ctx - The context of the update.
 * @param propertyName - The name of the property.
 * @param dateStatement - The date statement.
 * @return A promise that resolves when the function completes.
 */
async function handleDateFilterNoInput(
  ctx: Context<Update>,
  propertyName: string,
  dateStatement: 'past_month' | 'past_year' | 'this_week' | 'past_week'
) {
  // removing date selection keyboard
  await ctx.deleteMessage();

  try {
    // generate the xlsx File
    await notionDatePropFilterStatement(propertyName, dateStatement);
    // send the data
    await sendTelegramFile(ctx, propertyName, `Data for ${propertyName} - ${dateStatement} 😃`);

    Log.success('Data sent successfully', 'TelegramDatePropertyFilter => statementsNoString');
    return;
  } catch (error) {
    Log.error('Error while filtering data', 'TelegramDatePropertyFilter => statementsNoString');
    console.log(error);
  }
}

/**
 * Handles the date filter when an input is Needed.
 *
 * @param ctx - The context object.
 * @param propertyName - The name of the property.
 * @param dateStatement - The type of date statement.
 * @return A promise that resolves when the function is complete.
 */
async function handleDateFilterInput(
  ctx: Context<Update>,
  propertyName: string,
  dateStatement: 'on_or_after' | 'on_or_before' | 'after' | 'before'
) {
  // removing date selection keyboard
  await ctx.deleteMessage();
  const askForDateAnswer = await ctx.reply('please enter the date you want filter with:', {
    reply_markup: {
      force_reply: true,
      input_field_placeholder: 'ex: 2022-01-01',
    },
  });
  // wait for user response
  awaitReply(askForDateAnswer.message_id)
    .then(async message => {
      Log.info(`user entered: ${message.text}`, 'TelegramDatePropertyFilter => statementsString');
      const date = message.text;

      // checking the date format
      if (dateRegex.test(date)) {
        await ctx.deleteMessage(askForDateAnswer.message_id);
        Log.info(`Date filter was chosen type: ${dateStatement} - ${date}`, 'TelegramPropertyFilter => dateStatementsString');

        try {
          await notionDatePropFilterString(propertyName, date, dateStatement);
          await sendTelegramFile(ctx, propertyName, `Data for ${propertyName} - ${dateStatement} 😃`);
          Log.success('Data sent successfully', 'TelegramDatePropertyFilter => statementsString');
          return;
        } catch (error) {
          Log.error('Error while filtering data', 'TelegramDatePropertyFilter => statementsString');
          console.log(error);
        }
        //if date is not valid
      } else {
        Log.warn(`user entered a wrong date: ${chalk.red(date)}`, 'TelegramDatePropertyFilter => statementsString');
        await ctx.reply('please enter a valid date (ex: 2022-01-01) you can reply to the same message again ');
      }
    })
    .catch(err => {
      Log.error(err, 'TelegramDatePropertyFilter => statementsString');
      ctx.reply('⏰ You took too long to reply, please try again');
    });
}
