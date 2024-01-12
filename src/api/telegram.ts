import { Telegraf } from 'telegraf';
import { checkForRequests } from './telegramWaitForResponse.js';
import { NotionExportLogic } from 'src/telegramCommands/Notion/notionExportLogic.js';
import { writeNotionBill } from '@/telegramCommands/Notion/NotionWriteBill.js';
import { authCheck } from '@utils/auth.js';
import { message } from 'telegraf/filters';

export function telegram() {
  const bot = new Telegraf(process.env.telegramBotToken);

  bot.start(async ctx => {
    await ctx.reply('Welcome!');
  });

  bot.command('commands', async ctx => {
    const isAuthCheck = await authCheck(ctx);
    if (!isAuthCheck) return;
    await ctx.reply('choose a command', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Export data from Notion', callback_data: 'export' }],
          [{ text: 'Write to Notion', callback_data: 'NotionBillReg' }],
        ],
      },
    });
  });

  bot.action('NotionBillReg', async ctx => {
    await writeNotionBill(ctx, bot);
  });

  bot.command('test', ctx => {
    ctx.reply('\\ # shit normal', {
      parse_mode: 'Markdown',
    });
  });

  bot.action('export', async ctx => {
    await ctx.deleteMessage();
    await ctx.reply('Choose the filter type you want to export.', {
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
    await NotionExportLogic(bot);
  });
  bot.use(authCheck);
  bot.on(message('text'), ctx => {
    checkForRequests(ctx.message);
  });
  bot.launch();

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
