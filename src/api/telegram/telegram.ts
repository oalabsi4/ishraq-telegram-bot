import { handleCreateCardRequest } from '@/telegramCommands/createTrelloCardScenes/handleCreateCardRequest.js';
import { telegramMistral } from '@/telegramCommands/mistral/mistrlaChatBot.js';
import { handleExportFromNotionDB } from '@/telegramCommands/Notion/exportFromNotionScenes/handleExportRequest.js';
import { writeToNotionScenes } from '@/telegramCommands/Notion/writeToNotionScenes/handleWriteRequest.js';
import { Arabic } from '@utils/arabicDictionary.js';
import { authCheck } from '@utils/auth.js';
import { Markup, Scenes, session, Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { imageOCR } from '../ocrAPI/ocr.js';

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
  const { getCardTitle, getBoard, getEmployee, getLabel, getDescription, getDueDate, createTrelloCardScene, getColorScene } = {
    getCardTitle: new Scenes.BaseScene<Scenes.SceneContext>('getCardTitle'),
    getBoard: new Scenes.BaseScene<Scenes.SceneContext>('getBoard'),
    getEmployee: new Scenes.BaseScene<Scenes.SceneContext>('getEmployee'),
    getLabel: new Scenes.BaseScene<Scenes.SceneContext>('getLabel'),
    getDescription: new Scenes.BaseScene<Scenes.SceneContext>('getCardDescription'),
    getDueDate: new Scenes.BaseScene<Scenes.SceneContext>('getDueDate'),
    createTrelloCardScene: new Scenes.BaseScene<Scenes.SceneContext>('createTrelloCardScene'),
    getColorScene: new Scenes.BaseScene<Scenes.SceneContext>('getColor'),
  };
  //*mistral
  const mistralChatScene = new Scenes.BaseScene<Scenes.SceneContext>('mistralChatScene');
  writeToNotionScenes(
    getPartnerScene,
    getCodeScene,
    getTypeScene,
    getDateSene,
    getDescriptionScene,
    getClientScene,
    getCountScene,
    GetDurationScene,
    getPagesScene,
    getEmplyeeScene,
    getManualPriceScene,
    getLinkScene,
    runNotionWriteFunctionScene
  );
  handleExportFromNotionDB(
    getFilterPropertyNameScene,
    getPartnerNameScene,
    getClientNameScene,
    getEmployeeNameScene,
    getTypeNameScene,
    checkForDateFilter,
    getDateString,
    getDateType,
    tryRunExportFunction
  );

  handleCreateCardRequest(
    getCardTitle,
    getBoard,
    getEmployee,
    getLabel,
    getDescription,
    getDueDate,
    getColorScene,
    createTrelloCardScene
  );

  telegramMistral(mistralChatScene);

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
      getColorScene,
      //mistral
      mistralChatScene,
    ],
    {
      ttl: 100,
    }
  );

  bot.use(session());
  bot.use(stage.middleware());
  // bot.start(async ctx => {
  //   await ctx.reply('Welcome!');
  // });

  bot.start(async ctx => {
    await ctx.reply(
      Arabic.ChooseCommand,
      Markup.keyboard([[Arabic.ExportFromNotion], [Arabic.WriteToNotion], [Arabic.CreateCardCommand]])
        .persistent()
        .resize()
    );
  });

  bot.hears([Arabic.ExportFromNotion, Arabic.WriteToNotion, Arabic.CreateCardCommand], async ctx => {
    const isAuthCheck = await authCheck(ctx);
    if (!isAuthCheck) return;
    const userInput = ctx.match[0];
    if (userInput === Arabic.ExportFromNotion) {
      await ctx.scene.enter('getFilterPropertyNameScene');
    }
    if (userInput === Arabic.WriteToNotion) {
      await ctx.scene.enter('getPartnerNameScene');
    }
    if (userInput === Arabic.CreateCardCommand) {
      await ctx.scene.enter('getBoard');
    }
    return;
  });

  //? arabic Image OCR
  bot.on(message('photo'), async ctx => {
    const isAuthCheck = await authCheck(ctx);
    if (!isAuthCheck) return;

    const photo = ctx.message.photo;
    const photoLink = (await ctx.telegram.getFileLink(photo[1].file_id)).href;
    if (!photoLink) return;
    await ctx.sendChatAction('typing');
    const text = await imageOCR(photoLink);
    if (!text) return;
    await ctx.reply(text);
    return;
  });

  bot.command('ai', async ctx => {
    const isAuthCheck = await authCheck(ctx);
    if (!isAuthCheck) return;
    await ctx.scene.enter('mistralChatScene');
    return;
  });
  bot.use(authCheck);
  // Start the bot
  bot.launch();

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
