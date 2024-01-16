// import type { Context, Telegraf } from 'telegraf';
// import type { Update } from 'telegraf/types';
// import { dateSelectionKeyboard } from './Notion/dateSelectionKeyboard.js';
// import { notionStringFormulaFilter } from '../api/notion/notionFormulaFilter.js';
// import { sendTelegramFile } from '../api/telegramSendFile.js';
// import type { stringFormulasKeys } from '../api/notion/notionFormulaFetch.js';
// import { awaitReply } from '../api/telegramWaitForResponse.js';
// import Log from '@utils/logger.js';

// const dateRegex = /(20[0-9]{2})\s*-\s*(10|11|12|0[1-9])\s*-\s*(3[0-1]|2[0-9]|1[0-9]|0[1-9])\s*$/; //ex: 2022-01-01 (with zeros)

// const dateFilterTypes = ['past_month', 'past_year', 'this_week', 'past_week', 'on_or_after', 'on_or_before', 'after', 'before'];
// export async function TelegramNotionPropertyFilter(
//   bot: Telegraf<Context<Update>>,
//   ctx: Context<Update>,
//   propName: FormulaStringName,
//   propValue: string,
//   filterWithDate?: boolean
// ) {
//   if (!filterWithDate) {
//     await handleFormulaNoDate(ctx, propName, propValue);
//     return;
//   } else {
//     await dateSelectionKeyboard(ctx, true);
//     bot.action(dateFilterTypes, async ctx => {
//       const dateFilterType = ctx.match[0];

//       if (['past_month', 'past_year', 'this_week', 'past_week'].includes(dateFilterType)) {
//         await handleFormulaWithDataStatement(ctx, propName, propValue, dateFilterType as DateStatement);
//       }
//       if (['on_or_after', 'on_or_before', 'after', 'before'].includes(dateFilterType)) {
//         //todo
//         await handleFormulaWithDateString(ctx, propName, propValue, dateFilterType as DateStatement);
//       }
//     });
//   }
// }

// async function handleFormulaNoDate(ctx: Context<Update>, propName: FormulaStringName, propValue: string) {
//   await ctx.deleteMessage();
//   // Generating the xlsx file
//   await notionStringFormulaFilter(propName, propValue);
//   // Send the data
//   await sendTelegramFile(ctx, propName, `Data for ${propName} ${propValue}`);
// }

// async function handleFormulaWithDataStatement(
//   ctx: Context<Update>,
//   propName: FormulaStringName,
//   propValue: string,
//   dateStatement: DateStatement
// ) {
//   await ctx.deleteMessage();
//   // generate the file and fetch data
//   await notionStringFormulaFilter(propName, propValue, dateStatement);
//   // Send the data
//   await sendTelegramFile(ctx, propName, `Data for ${propName} ${propValue} and ${dateStatement}`);
// }

// async function handleFormulaWithDateString(
//   ctx: Context<Update>,
//   propName: FormulaStringName,
//   propValue: string,
//   dateStatement: DateStatement
// ) {
//   // getting the date from the user
//   const userInput = await ctx.reply('please enter the date you want filter with:', {
//     reply_markup: {
//       force_reply: true,
//       input_field_placeholder: 'ex: 2022-01-01',
//     },
//   });

//   awaitReply(userInput.message_id)
//     .then(async message => {
//       const date = message.text.trim(); // User input
//       //validate the date
//       if (dateRegex.test(date)) {
//         Log.info(`Fetching data for select property: ${propValue} and date: ${dateStatement} ${date}`);
//         await ctx.deleteMessage(userInput.message_id); // Remove the previous keyboard
//         // Generate the xlsx file
//         await notionStringFormulaFilter(propName, propValue, dateStatement, date);
//         // Send the data
//         await sendTelegramFile(ctx, propName, `Data for ${propName} ${propValue} and ${dateStatement} ${date}`);
//       } else {
//         // invalid date
//         await ctx.reply('Please enter a valid date in the format: YYYY-MM-DD\nTRY AGAIN 😫');
//         Log.warn(`user entered invalid date: ${date}`, 'handleFormulaWithDateString');
//       }
//     })
//     .catch(async error => {
//       await ctx.reply('Took too llong to respond ⏰');
//       Log.warn(`user took too long to respond`, 'handleFormulaWithDateString');
//       console.log(error);
//     });
// }
// type FormulaStringName = (typeof stringFormulasKeys)[keyof typeof stringFormulasKeys];
// type DateStatement = 'past_month' | 'past_year' | 'this_week' | 'past_week' | 'on_or_after' | 'on_or_before' | 'after' | 'before';
