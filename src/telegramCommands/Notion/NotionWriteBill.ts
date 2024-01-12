import {
  NotionProductSelection,
  fetchPricesData,
  filterPricesFormat,
  formatSelectionDataForTelegram,
  isValidNumber,
  selectPropValues,
} from '@/api/notion/fetchSelectPropValues.js';
import { exportNotionSelectPropertyValues } from '@/api/notion/notionSelectFilter.js';
import { writePageToBillDB } from '@/api/notion/writePagetoBillDB.js';
import { awaitReply } from '@/api/telegramWaitForResponse.js';
import { telegramLoading } from '@utils/TelegramProssessing.js';
import Log from '@utils/logger.js';
import { formatTelegramKeyboard } from '@utils/telegramkeyboardFormater.js';
import type { Context, Telegraf } from 'telegraf';
import type { Update } from 'telegraf/types';
const dateRegex = /(20[0-9]{2})\s*-\s*(10|11|12|0[1-9])\s*-\s*(3[0-1]|2[0-9]|1[0-9]|0[1-9])\s*$/; //ex: 2022-01-01 (with zeros)

export async function writeNotionBill(ctx: Context<Update>, bot: Telegraf<Context<Update>>) {
  await ctx.deleteMessage(); //remove previous message
  await ctx.reply('Choose a partner:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'KMK', callback_data: 'KMK' }],
        [{ text: 'قيم', callback_data: 'QYAM' }],
        [{ text: 'عميل جديد', callback_data: 'UNKNOWN' }],
        [{ text: 'Back', callback_data: 'backToMainMenu' }],
      ],
    },
  });

  // on user partner selection send list of product types
  bot.action(['KMK', 'QYAM', 'UNKNOWN'], async ctx => {
    await ctx.deleteMessage();
    const matchUserInput = ctx.match?.[0] as 'KMK' | 'QYAM' | 'UNKNOWN';
    const relationName = matchUserInput === 'KMK' ? 'KMK-PRICING' : matchUserInput === 'QYAM' ? 'QYAM-PRICING' : 'NO-PARTNER';

    if (!matchUserInput) {
      // incase of error
      await ctx.reply('something went wrong');
      return;
    }
    // fetching the price list table
    const stopLoadingTypes = await telegramLoading(ctx, 'Loading... ');
    const fullData = await fetchPricesData(matchUserInput);
    // get uinque product types
    const productTypes = selectPropValues(fullData);
    //formatting the product types to a telegram keyboard for the user to chose from
    const typesKeyboard = formatTelegramKeyboard(productTypes);
    //displaying the keyboard to the user
    await ctx.reply('Choose a product type:', {
      reply_markup: {
        inline_keyboard: [...typesKeyboard, [{ text: 'Back', callback_data: 'backToMainMenu' }]],
      },
    });
    stopLoadingTypes();
    // on user product type selection send list of codes
    bot.action(productTypes, async ctx => {
      await ctx.deleteMessage();
      const type = ctx.match?.[0] as string;
      const formattedData = filterPricesFormat(type, fullData);
      const codeChoiceList = formatSelectionDataForTelegram(formattedData);

      const userChoice = await ctx.reply(`Choose a code form the list:\n${codeChoiceList}`, {
        reply_markup: {
          force_reply: true,
          input_field_placeholder: '1',
        },
      });
      // wait for user input 10 sec timeout
      awaitReply(userChoice.message_id, 30000)
        .then(async message => {
          const userSelectedNum = message.text;
          //validate user input
          const results = NotionProductSelection(formattedData, userSelectedNum);

          // if invalid input
          if (!results) {
            await ctx.reply('Wrong input 😅');
            return;
          }
          await ctx.deleteMessage(userChoice.message_id);
          // if valid input store the code in a variable to send to database
          const productCode = results.code;
          //* get the date from the user
          const userDateInput = await ctx.reply('please enter the date you want to bill:', {
            reply_markup: {
              force_reply: true,
              input_field_placeholder: 'ex: 2024-01-01',
            },
          });
          awaitReply(userDateInput.message_id, 30000)
            .then(async message => {
              const productDate = message.text.trim(); // User input

              // validating the date
              if (!dateRegex.test(productDate)) {
                Log.warn(`user entered invalid date: ${message.text}`, 'NotionWriteBill');
                await ctx.reply('Please enter a valid date in the format: YYYY-MM-DD\nTRY AGAIN 😫');
                return;
              }
              await ctx.deleteMessage(userDateInput.message_id); // Remove the previous message
              //* getting the item description from the user
              const descriptionInput = await ctx.reply('please enter the item description:', {
                reply_markup: {
                  force_reply: true,
                },
              });
              awaitReply(descriptionInput.message_id, 90000)
                .then(async message => {
                  const description = message.text;
                  await ctx.deleteMessage(descriptionInput.message_id);
                  // Validate the description
                  if (!description || description.trim().length === 0) {
                    Log.warn(`user entered invalid description: ${message.text}`, 'NotionWriteBill');
                    await ctx.reply('Please enter a valid description');
                  }
                  //* getting the list of client from the bills database
                  const stopLoadingClient = await telegramLoading(ctx, 'Loading clients... ');
                  const exitingClients = await exportNotionSelectPropertyValues('clients');
                  const StopLoadingEmployee = await telegramLoading(ctx, 'Loading ... ');
                  const exitingEmployees = await exportNotionSelectPropertyValues('employees');
                  exitingClients.pop();
                  exitingEmployees.pop();
                  const exitingClientsArray = exitingClients.flatMap(x => x.map(x => x.callback_data));
                  const exitingEmployeesArray = exitingEmployees.flatMap(x => x.map(x => x.callback_data));
                  //* getting the client from the user
                  await ctx.reply('please choose a client:', {
                    reply_markup: {
                      inline_keyboard: [...exitingClients, [{ text: 'Back', callback_data: 'backToMainMenu' }]],
                    },
                  });
                  stopLoadingClient();
                  bot.action([...exitingClientsArray, 'addNewClient'], async ctx => {
                    const clientInput = ctx.match?.[0] as string;
                    await ctx.deleteMessage();
                    //validate the client input
                    if (!clientInput || clientInput.trim().length === 0) {
                      Log.warn(`user entered invalid client: ${clientInput}`, 'NotionWriteBill');
                      await ctx.reply('Please enter a valid client');
                      return;
                    }
                    //* get the count from the user
                    const countInput = await ctx.reply('please enter the count:', {
                      reply_markup: {
                        force_reply: true,
                      },
                    });
                    awaitReply(countInput.message_id)
                      .then(async message => {
                        const count = message.text;
                        await ctx.deleteMessage(countInput.message_id);
                        //validate the count
                        if (!count || count.trim().length === 0 || !isValidNumber(+count) || +count <= 0) {
                          Log.warn(`user entered invalid count: ${count}`, 'NotionWriteBill');
                          await ctx.reply('Please enter a valid count');
                          return;
                        }
                        // ask for the employee
                        await ctx.reply('please choose an employee:', {
                          reply_markup: {
                            inline_keyboard: [...exitingEmployees, [{ text: 'back', callback_data: 'backToMainMenu' }]],
                          },
                        });
                        StopLoadingEmployee();
                        bot.action(exitingEmployeesArray, async ctx => {
                          await ctx.deleteMessage();
                          const employeeInput = ctx.match?.[0] as string;
                          // validate the employee input
                          if (!employeeInput || employeeInput.trim().length === 0) {
                            Log.warn(`user entered invalid employee: ${employeeInput}`, 'NotionWriteBill');
                            await ctx.reply('Please enter a valid employee');
                            return;
                          }
                          // get the product URL
                          const productUrl = await ctx.reply('please enter the product URL:', {
                            reply_markup: {
                              force_reply: true,
                              input_field_placeholder: 'ex: https://example.com',
                            },
                          });
                          awaitReply(productUrl.message_id, 40000)
                            .then(async message => {
                              const url = message.text;
                              await ctx.deleteMessage(productUrl.message_id);

                              if (['بالدقيقة', 'بالثانية'].includes(results.metric)) {
                                //* ask for duration
                                const durationInput = await ctx.reply('please enter the duration:', {
                                  reply_markup: {
                                    force_reply: true,
                                    input_field_placeholder: 'ex: 1:30 or 1:30,1:30',
                                  },
                                });
                                awaitReply(durationInput.message_id, 60000).then(async message => {
                                  const duration = message.text;
                                  const durationRegext = /(,?)(0?[1-9]|[1-9][0-9]):([0-6]0|0[0-9]|[1-9])(,?)/g;
                                  //validate the duration input
                                  if (!duration || duration.trim().length === 0 || !durationRegext.test(duration)) {
                                    Log.warn(`user entered invalid duration: ${duration}`, 'NotionWriteBill');
                                    await ctx.reply('Please enter a valid duration');
                                    return;
                                  }
                                  await ctx.deleteMessage(durationInput.message_id);
                                  try {
                                    await writePageToBillDB(
                                      process.env.dataBaseId,
                                      results.pageID,
                                      relationName,
                                      productCode,
                                      productDate,
                                      description,
                                      clientInput,
                                      +count,
                                      employeeInput,
                                      url,
                                      undefined,
                                      duration
                                    );
                                    Log.success('page written to db successfully with duration', 'NotionWriteBill');
                                  } catch (error) {
                                    Log.error('error while writing page to db with duration', 'NotionWriteBill');
                                    await ctx.reply('page written to Notion successfully 👍');
                                    console.log(error);
                                    return;
                                  }
                                });
                              }
                              if (['بالصفحة'].includes(results.metric)) {
                                //* ask for pages

                                const pagesInput = await ctx.reply('please enter the pages:', {
                                  reply_markup: {
                                    force_reply: true,
                                  },
                                });
                                awaitReply(pagesInput.message_id).then(async message => {
                                  const pages = message.text;
                                  //validate the pages input
                                  if (!pages || pages.trim().length === 0 || !isValidNumber(+pages) || +pages <= 0) {
                                    Log.warn(`user entered invalid pages: ${pages}`, 'NotionWriteBill');
                                    await ctx.reply('Please enter a valid page number');
                                    return;
                                  }
                                  await ctx.deleteMessage(pagesInput.message_id);
                                  try {
                                    await writePageToBillDB(
                                      process.env.dataBaseId,
                                      results.pageID,
                                      relationName,
                                      productCode,
                                      productDate,
                                      description,
                                      clientInput,
                                      +count,
                                      employeeInput,
                                      url,
                                      undefined,
                                      undefined,
                                      +pages
                                    );
                                    Log.success('page written to db successfully with pages', 'NotionWriteBill');
                                  } catch (error) {
                                    Log.error('error while writing page to db with page number', 'NotionWriteBill');
                                    await ctx.reply('page written to Notion successfully 👍');
                                    console.log(error);
                                    return;
                                  }
                                });
                              }
                              if (['نسبة مئوية', 'برمجة'].includes(results.metric)) {
                                //* ask for manual price
                                const manualPriceInput = await ctx.reply('please enter the manual price:', {
                                  reply_markup: {
                                    force_reply: true,
                                  },
                                });
                                awaitReply(manualPriceInput.message_id).then(async message => {
                                  const manualPrice = message.text;
                                  //validate the manual price input
                                  if (!manualPrice || manualPrice.trim().length === 0 || !isValidNumber(+manualPrice)) {
                                    Log.warn(`user entered invalid manual price: ${manualPrice}`, 'NotionWriteBill');
                                    await ctx.reply('Please enter a valid manual price');
                                    return;
                                  }
                                  await ctx.deleteMessage(manualPriceInput.message_id);
                                  try {
                                    await writePageToBillDB(
                                      process.env.dataBaseId,
                                      results.pageID,
                                      relationName,
                                      productCode,
                                      productDate,
                                      description,
                                      clientInput,
                                      +count,
                                      employeeInput,
                                      url,
                                      +manualPrice,
                                      undefined,
                                      undefined
                                    );
                                    Log.success('page written to db successfully with manual price', 'NotionWriteBill');
                                    await ctx.reply('page written to Notion successfully 👍');
                                  } catch (error) {
                                    Log.error('error while writing page to db with page number', 'NotionWriteBill');
                                    console.log(error);
                                    return;
                                  }
                                });
                              }
                              if (!['نسبة مئوية', 'برمجة', 'بالصفحة', 'بالدقيقة', 'بالثانية'].includes(results.metric)) {
                                try {
                                  await writePageToBillDB(
                                    process.env.dataBaseId,
                                    results.pageID,
                                    relationName,
                                    productCode,
                                    productDate,
                                    description,
                                    clientInput,
                                    +count,
                                    employeeInput,
                                    url,
                                    undefined,
                                    undefined,
                                    undefined
                                  );
                                  Log.success('page written to db successfully, Normal', 'NotionWriteBill');
                                  await ctx.reply('page written to Notion successfully 👍');
                                } catch (error) {
                                  Log.error('error while writing page to db with page number', 'NotionWriteBill');
                                  console.log(error);
                                  return;
                                }
                              }
                            })
                            .catch(async err => {
                              await ctx.reply('something went wrong');
                              Log.warn('Something while trying to get the URL from user', 'NotionWriteBill');
                              console.log(err);
                              return;
                            });
                        });
                      })
                      .catch(async err => {
                        await ctx.reply('something went wrong');
                        Log.warn('Something while trying to get the COUNT from user', 'NotionWriteBill');
                        console.log(err);
                        return;
                      });
                  });
                })
                .catch(async err => {
                  await ctx.reply('something went wrong');
                  Log.warn('Something while trying to get the description from user', 'NotionWriteBill');
                  console.log(err);
                  return;
                });
            })
            .catch(async err => {
              await ctx.reply('something went wrong');
              Log.warn('Something while trying to get the dte from user', 'NotionWriteBill');
              console.log(err);
              return;
            });
        })
        .catch(async err => {
          await ctx.reply('something went wrong');
          Log.warn('user time out or something else I dunno', 'NotionWriteBill');
          console.log(err);
          return;
        });
    });
  });
  bot.action('backToMainMenu', async ctx => {
    await ctx.deleteMessage();
    await ctx.reply('choose a command', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Export data from Notion', callback_data: 'export' }],
          [{ text: 'Write to Notion', callback_data: 'NotionBillReg' }],
        ],
      },
    });
  });
}
