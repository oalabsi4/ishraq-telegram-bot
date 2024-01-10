import { Telegraf } from 'telegraf';
import { checkForRequests } from './telegramWaitForResponse.js';
import { NotionExportLogic } from 'src/telegramCommands/Notion/notionExportLogic.js';

export async function telegram() {
  const bot = new Telegraf(process.env.telegramBotToken);

  bot.start(async ctx => await ctx.reply('👋'));

  bot.command('export', async ctx => {
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
  });

  bot.on('message', async ctx => {
    if ('text' in ctx.message) {
      checkForRequests(ctx.message);
      console.log('first');
    }
  });
  await NotionExportLogic(bot);
  bot.launch();

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
