import { Context, Telegraf } from 'telegraf';
import { Update } from 'telegraf/types';
import { exportNotionSelectPropertyValues } from '../../api/notion/notionSelectFilter.js';
import { TelegramSelectPropertyFilter, handleSelectPropNoDate } from './telegramSelectPropFillter.js';
import { TelegramDatePropertyFilter } from './telegramDatePropFiter.js';

export async function NotionExportLogic(bot: Telegraf<Context<Update>>) {
  const notionClients = await exportNotionSelectPropertyValues('clients');
  const notionEmployees = await exportNotionSelectPropertyValues('employees');
  const notionPartners = await exportNotionSelectPropertyValues('partners');
  const notionClientsArray = notionClients.flatMap(e => e.map(v => (v.text !== 'back' && v.text !== 'No_data' ? v.text : 'qwe')));
  const notionEmployeesArray = notionEmployees.flatMap(e =>
    e.map(v => (v.text !== 'back' && v.text !== 'No_data' ? v.text : 'qwe'))
  );
  const notionPartnersArray = notionPartners.flatMap(e =>
    e.map(v => (v.text !== 'back' && v.text !== 'No_data' ? v.text : 'qwe'))
  );



  //* Handle date filter
  bot.action('dateFilter', async ctx => {
    await TelegramDatePropertyFilter(bot, ctx, 'تاريخ الاستلام');
  });

  //* SHOW client filter keyboard
  bot.action('clientFilter', ctx => {
    ctx.deleteMessage();
    ctx.reply('Choose the client.', {
      reply_markup: {
        inline_keyboard: notionClients,
      },
    });
  });

  //* show filtering by employee keyboard
  bot.action('employeeFilter', ctx => {
    ctx.deleteMessage();
    ctx.reply('Choose the employee.', {
      reply_markup: {
        inline_keyboard: notionEmployees,
      },
    });
  });

  //* Checking if one of the employees is selected
  bot.action(notionEmployeesArray, ctx => {
    const format = ctx.match;
    ctx.deleteMessage(); //remove the previous keyboard
    ctx.reply(`Do you also want to Filter by date for ${format[0]} ?`, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'yes', callback_data: `EmployeeWithDate-${format[0]}` },
            { text: 'no', callback_data: `EmployeeWithoutDate-${format[0]}` },
          ],
        ],
      },
    });
  });

  //* checking if one of the client filter option is selected
  bot.action(notionClientsArray, ctx => {
    const format = ctx.match;

    ctx.deleteMessage(); //remove the previous keyboard
    ctx.reply(`Do you also want to Filter by date for ${format[0]} ?`, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'yes', callback_data: `ClientWithDate-${format[0]}` },
            { text: 'no', callback_data: `ClientWithoutDate-${format[0]}` },
          ],
        ],
      },
    });
  });

  //*filtering by partner
  bot.action('partnerFilter', async ctx => {
    await ctx.deleteMessage();
    await ctx.reply('Choose the partner.', {
      reply_markup: {
        inline_keyboard: notionPartners,
      },
    });

    bot.action(notionPartnersArray, async ctx => {
      const format = ctx.match;
      await ctx.deleteMessage(); //remove the previous keyboard
      await ctx.reply(`Do you also want to Filter by date for ${format[0]} ?`, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'yes', callback_data: `PartnerWithDate-${format[0]}` },
              { text: 'no', callback_data: `PartnerWithoutDate-${format[0]}` },
            ],
          ],
        },
      });
    });
  });

  // todo fix file names
  //* checking if a filter option is selected with or without date
  const ArgumentRegex = /^(.*?)-(.*)$/; //example: ClientWithDate-employee
  bot.action(ArgumentRegex, async ctx => {
    const filterType = ctx.match[1]; // example: ClientWithDate
    const propValue = ctx.match[2]; // example: employee
    //* if a Select property option is selected WITH date
    if (['EmployeeWithDate', 'ClientWithDate'].includes(filterType)) {
      TelegramSelectPropertyFilter(bot, ctx, filterType, propValue);
    }

    //* if a select property option is selected WITHOUT date
    if (['ClientWithoutDate', 'EmployeeWithoutDate'].includes(filterType)) {
      await handleSelectPropNoDate(ctx, filterType, propValue);
    }
    if (['PartnerWithoutDate'].includes(filterType)) {
      // todo make a function for this shit and export it
    }
  });

  bot.action('back_to_main_export', ctx => {
    ctx.deleteMessage();
    ctx.reply('Choose the filter type you want to export.', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'by date', callback_data: 'dateFilter' },
            { text: 'by client', callback_data: 'clientFilter' },
          ],
          [
            { text: 'by partner', callback_data: 'partnerFilter' },
            { text: 'by employee', callback_data: 'employeeFilter' },
          ],
        ],
      },
    });
  });
}
