// import Log from '@utils/logger.js';
// import chalk from 'chalk';
// import type { Telegraf } from 'node_modules/telegraf/typings/telegraf.js';
// import { awaitReply } from 'src/api/telegramWaitForResponse.js';
// import type { Context } from 'telegraf';
// import type { Update } from 'telegraf/types';
// import {
//   notionSelectPropDateStatement,
//   notionSelectPropDateString,
//   notionSelectPropNoDate,
// } from '../../api/notion/notionSelectFilter.js';
// import { dateSelectionKeyboard } from './dateSelectionKeyboard.js';
// import { sendTelegramFile } from 'src/api/telegramSendFile.js';

// /**
//  * Handles Telegram property filtering based on the provided date.
//  *
//  * @param bot - The Telegraf bot instance.
//  * @param filterType - Type of filtering (e.g., 'ClientWithDate', 'EmployeeWithDate').
//  * @param propValue - The property value for filtering.
//  */
// export async function TelegramSelectPropertyFilter(
//   bot: Telegraf<Context<Update>>,
//   ctx: Context<Update>,
//   filterType: string,
//   propValue: string
// ) {
//   // Define date filter types and regex for date validation
//   const dateFilterTypes = ['past_month', 'past_year', 'this_week', 'past_week', 'on_or_after', 'on_or_before', 'after', 'before'];
//   const dateRegex = /(20[0-9]{2})\s*-\s*(10|11|12|0[1-9])\s*-\s*(3[0-1]|2[0-9]|1[0-9]|0[1-9])\s*$/; //ex: 2022-01-01 (with zeros)
//   await dateSelectionKeyboard(ctx, true);
//   // Handle date filter actions
//   bot.action(dateFilterTypes, async ctx => {
//     const dateFilterType = ctx.match[0];

//     // Handle date filters that require user input
//     if (['on_or_after', 'on_or_before', 'after', 'before'].includes(dateFilterType)) {
//       handleDateWithInput(ctx, filterType, propValue, dateFilterType);
//     }

//     // Handle date filters that don't require user input
//     if (['past_month', 'past_year', 'this_week', 'past_week'].includes(dateFilterType)) {
//       handleDateWithoutInput(ctx, filterType, propValue, dateFilterType);
//     }
//   });

//   /**
//    * Handles date filters that require user input.
//    *
//    * @param ctx - The Telegraf context.
//    * @param filterType - Type of filtering (e.g., 'ClientWithDate', 'EmployeeWithDate').
//    * @param propValue - The property value for filtering.
//    * @param dateFilterType - Type of date filter.
//    */
//   async function handleDateWithInput(ctx: Context<Update>, filterType: string, propValue: string, dateFilterType: string) {
//     ctx.deleteMessage(); // Remove the previous keyboard
//     const getDate = await ctx.reply('Please enter the date you want to filter with:', {
//       reply_markup: {
//         force_reply: true,
//         input_field_placeholder: 'ex: 2022-01-01',
//       },
//     });
//     awaitReply(getDate.message_id)
//       .then(async message => {
//         if (filterType === 'ClientWithDate' || filterType === 'EmployeeWithDate') {
//           const date = message.text.trim(); // User input

//           if (dateRegex.test(date)) {
//             Log.info(
//               `Fetching data for select property: ${propValue} and date: ${dateFilterType} ${date}`,
//               'TelegramPropertyFilter'
//             );
//             await ctx.deleteMessage(getDate.message_id); // Remove the previous keyboard
//             // Generate the xlsx file
//             await notionSelectPropDateString(
//               filterType === 'ClientWithDate' ? 'العميل' : filterType === 'EmployeeWithDate' ? 'الموظف المنتج' : 'error',
//               propValue,
//               date,
//               dateFilterType as 'on_or_after' | 'on_or_before' | 'after' | 'before'
//             );
//             // Send the data
//             const propName =
//               filterType === 'ClientWithDate' ? 'العميل' : filterType === 'EmployeeWithDate' ? 'الموظف المنتج' : 'error';
//             await sendTelegramFile(ctx, propName, `Data for ${filterType} ${propValue} and ${dateFilterType} 😃`);
//           } else {
//             await ctx.reply(`Wrong date format: ${chalk.magenta(date)}\n😈 START OVER`);
//             Log.warn(`The user entered a wrong date format: ${chalk.magenta(date)}\n😈 START OVER`, 'TelegramPropertyFilter');
//           }
//         }
//       })
//       .catch(error => {
//         Log.error('user did not reply', 'TelegramPropertyFilter');
//         console.log(error);
//       });
//   }

//   /**
//    * Handles date filters that don't require user input.
//    *
//    * @param ctx - The Telegraf context.
//    * @param filterType - Type of filtering (e.g., 'ClientWithDate', 'EmployeeWithDate').
//    * @param propValue - The property value for filtering.
//    * @param dateFilterType - Type of date filter.
//    */
//   async function handleDateWithoutInput(ctx: Context<Update>, filterType: string, propValue: string, dateFilterType: string) {
//     ctx.deleteMessage(); // Remove the previous keyboard
//     // Generating the xlsx file
//     await notionSelectPropDateStatement(
//       filterType === 'ClientWithDate' ? 'العميل' : filterType === 'EmployeeWithDate' ? 'الموظف المنتج' : 'error',
//       propValue,
//       dateFilterType as 'past_month' | 'past_year' | 'this_week' | 'past_week'
//     );

//     // Send the data
//     const propName = filterType === 'ClientWithDate' ? 'العميل' : filterType === 'EmployeeWithDate' ? 'الموظف المنتج' : 'error';
//     await sendTelegramFile(ctx, propName, `Data for ${filterType} ${propValue} and ${dateFilterType} 😃`);
//   }
// }

// /**
//  * Generates an xlsx file based on the filter type and property value if no date is required.
//  *
//  * @param ctx - The context object containing information about the update.
//  * @param filterType - The type of filter to apply.
//  * @param propValue - The property value to use for filtering.
//  */
// export async function handleSelectPropNoDate(ctx: Context<Update>, filterType: string, propValue: string) {

//   // generating xlsx file
//   await notionSelectPropNoDate(filterType === 'ClientWithoutDate' ? 'العميل' : 'الموظف المنتج', propValue);
//   const propName = filterType === 'ClientWithoutDate' ? 'العميل' : 'الموظف المنتج';

//   await sendTelegramFile(ctx, propName, `Data for ${propName} - ${propValue} 😃`);
// }
