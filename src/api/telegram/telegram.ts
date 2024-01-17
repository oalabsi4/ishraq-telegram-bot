import { Scenes, session, Telegraf } from 'telegraf';
import { writeToNotionScenes } from '@/telegramCommands/Notion/writeToNotionScenes/handleWriteRequest.js';
import { handleExportFromNotionDB } from '@/telegramCommands/Notion/exportFromNotionScenes/handleExportRequest.js';
import { authCheck } from '@utils/auth.js';
import { Arabic } from '@utils/arabicDictionary.js';
import { handleCreateCardRequest } from '@/telegramCommands/Notion/createTrelloCardScenes/handleCreateCardRequest.js';

export function telegram() {
  //* write to notion scenes
  const {
    getPartnerScene,
    getTypeScene,
    getCodeScene,
    getDateSene,
    getDescriptionScene,
    getClientScene,
    getCountScene,
    GetDurationScene,
    getPagesScene,
    getEmplyeeScene,
    getManualPriceScene,
    getLinkScene,
    runNotionWriteFunctionScene,
  } = {
    getCodeScene: new Scenes.BaseScene<Scenes.SceneContext>('getCode'),
    getPartnerScene: new Scenes.BaseScene<Scenes.SceneContext>('getPartner'),
    getDateSene: new Scenes.BaseScene<Scenes.SceneContext>('getDate'),
    getDescriptionScene: new Scenes.BaseScene<Scenes.SceneContext>('getDescription'),
    getClientScene: new Scenes.BaseScene<Scenes.SceneContext>('getClient'),
    getCountScene: new Scenes.BaseScene<Scenes.SceneContext>('getCount'),
    GetDurationScene: new Scenes.BaseScene<Scenes.SceneContext>('GetDuration'),
    getPagesScene: new Scenes.BaseScene<Scenes.SceneContext>('getPages'),
    getEmplyeeScene: new Scenes.BaseScene<Scenes.SceneContext>('getEmplyee'),
    getManualPriceScene: new Scenes.BaseScene<Scenes.SceneContext>('getManualPrice'),
    getTypeScene: new Scenes.BaseScene<Scenes.SceneContext>('getType'),
    getLinkScene: new Scenes.BaseScene<Scenes.SceneContext>('getLink'),
    runNotionWriteFunctionScene: new Scenes.BaseScene<Scenes.SceneContext>('runNotionWriteFunctionScene'),
  };

  //* Export data from Notion scenes
  const {
    getFilterPropertyNameScene,
    getPartnerNameScene,
    getClientNameScene,
    getEmployeeNameScene,
    getTypeNameScene,
    checkForDateFilter,
    getDateType,
    getDateString,
    tryRunExportFunction,
  } = {
    getFilterPropertyNameScene: new Scenes.BaseScene<Scenes.SceneContext>('getFilterPropertyNameScene'),
    getPartnerNameScene: new Scenes.BaseScene<Scenes.SceneContext>('getPartnerNameScene'),
    getClientNameScene: new Scenes.BaseScene<Scenes.SceneContext>('getClientNameScene'),
    getEmployeeNameScene: new Scenes.BaseScene<Scenes.SceneContext>('getEmployeeNameScene'),
    getTypeNameScene: new Scenes.BaseScene<Scenes.SceneContext>('getTypeNameScene'),
    checkForDateFilter: new Scenes.BaseScene<Scenes.SceneContext>('checkForDateFilter'),
    getDateString: new Scenes.BaseScene<Scenes.SceneContext>('getDateString'),
    getDateType: new Scenes.BaseScene<Scenes.SceneContext>('getDateType'),
    tryRunExportFunction: new Scenes.BaseScene<Scenes.SceneContext>('tryRunExportFunction'),
  };

  //* create trello card scenes
  const { getCardTitle, getBoard, getEmployee, getLabel, getDescription, getDueDate, createTrelloCardScene ,getColorScene} = {
    getCardTitle: new Scenes.BaseScene<Scenes.SceneContext>('getCardTitle'),
    getBoard: new Scenes.BaseScene<Scenes.SceneContext>('getBoard'),
    getEmployee: new Scenes.BaseScene<Scenes.SceneContext>('getEmployee'),
    getLabel: new Scenes.BaseScene<Scenes.SceneContext>('getLabel'),
    getDescription: new Scenes.BaseScene<Scenes.SceneContext>('getDescription'),
    getDueDate: new Scenes.BaseScene<Scenes.SceneContext>('getDueDate'),
    createTrelloCardScene: new Scenes.BaseScene<Scenes.SceneContext>('createTrelloCardScene'),
    getColorScene: new Scenes.BaseScene<Scenes.SceneContext>('getColor'),
  };

  // writeToNotionScenes(
  //   getPartnerScene,
  //   getCodeScene,
  //   getTypeScene,
  //   getDateSene,
  //   getDescriptionScene,
  //   getClientScene,
  //   getCountScene,
  //   GetDurationScene,
  //   getPagesScene,
  //   getEmplyeeScene,
  //   getManualPriceScene,
  //   getLinkScene,
  //   runNotionWriteFunctionScene
  // );
  // handleExportFromNotionDB(
  //   getFilterPropertyNameScene,
  //   getPartnerNameScene,
  //   getClientNameScene,
  //   getEmployeeNameScene,
  //   getTypeNameScene,
  //   checkForDateFilter,
  //   getDateString,
  //   getDateType,
  //   tryRunExportFunction
  // );

   handleCreateCardRequest(
getCardTitle,
getBoard,
getEmployee,
getLabel,
getDescription,
getDueDate,
getColorScene,
createTrelloCardScene
  )
  const bot = new Telegraf<Scenes.SceneContext>(process.env.telegramBotToken);
  const stage = new Scenes.Stage<Scenes.SceneContext>(
    [
      // write to notion scenes
      getPartnerScene,
      getTypeScene,
      getCodeScene,
      getDateSene,
      getDescriptionScene,
      getClientScene,
      getCountScene,
      GetDurationScene,
      getPagesScene,
      getEmplyeeScene,
      getManualPriceScene,
      runNotionWriteFunctionScene,
      getLinkScene,
      // Export data from Notion scenes
      getFilterPropertyNameScene,
      getPartnerNameScene,
      getClientNameScene,
      getEmployeeNameScene,
      getTypeNameScene,
      checkForDateFilter,
      getDateString,
      getDateType,
      tryRunExportFunction,
      //createTrelloCardScenes
      getCardTitle,
      getBoard,
      getEmployee,
      getLabel,
      getDescription,
      getDueDate,
      createTrelloCardScene,
      getColorScene
    ],
    {
      ttl: 100,
    }
  );

  bot.use(session());
  bot.use(stage.middleware());
  bot.start(async ctx => {
    await ctx.reply('Welcome!');
  });

  bot.command('commands', async ctx => {
    const isAuthCheck = await authCheck(ctx);
    if (!isAuthCheck) return;
    await ctx.reply(Arabic.ChooseCommand, {
      reply_markup: {
        inline_keyboard: [
          [{ text: Arabic.ExportFromNotion, callback_data: 'export' }],
          [{ text: Arabic.WriteToNotion, callback_data: 'NotionBillReg' }],
          [{ text: Arabic.CreateCardCommand, callback_data: 'createTrelloCard' }],
        ],
      },
    });
  });

  bot.action('NotionBillReg', async ctx => await ctx.scene.enter('getPartner'));

  bot.action('export', async ctx => await ctx.scene.enter('getFilterPropertyNameScene'));
  bot.action('createTrelloCard', async ctx => await ctx.scene.enter('getBoard'));
  bot.use(authCheck);

  // Start the bot
  bot.launch();

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
