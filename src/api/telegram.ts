import { dataToWrite, dateRegex, PriceListDataCache } from '@/telegramCommands/notionScenes/collectedDataFromUser.js';
import { displayCodeSelectionList, handleCodeSelection } from '@/telegramCommands/notionScenes/getCode.js';
import { handlePartnerSelection, partnerChoiceKeyboard } from '@/telegramCommands/notionScenes/getPartner.js';
import { handleProductTypeSelection, productCodeSelectionKeyboard } from '@/telegramCommands/notionScenes/getType.js';
import { Scenes, session, Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import {
  isValidNumber
} from './notion/fetchSelectPropValues.js';
import { writePageToBillDB } from './notion/writePagetoBillDB.js';
import { testScene } from './testingScenes.js';

export function telegram() {
  // test scenes
  const { getNameScene, getAgeScene, getGenderScene, displayInfoScene } = {
    getNameScene: new Scenes.BaseScene<Scenes.SceneContext>('getName'),
    getAgeScene: new Scenes.BaseScene<Scenes.SceneContext>('getAge'),
    getGenderScene: new Scenes.BaseScene<Scenes.SceneContext>('getGender'),
    displayInfoScene: new Scenes.BaseScene<Scenes.SceneContext>('displayInfo'),
  };

  // write to notion scenes
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

  type Scenetype = Scenes.BaseScene<Scenes.SceneContext>;

  async function writeToNotionScenes(
    getPartnerScene: Scenetype,
    getCodeScene: Scenetype,
    getTypeScene: Scenetype,
    getDateSene: Scenetype,
    getDescriptionScene: Scenetype,
    getClientScene: Scenetype,
    getCountScene: Scenetype,
    GetDurationScene: Scenetype,
    getPagesScene: Scenetype,
    getEmplyeeScene: Scenetype,
    getManualPriceScene: Scenetype,
    getLinkScene: Scenetype,
    runNotionWriteFunctionScene: Scenetype
  ) {
    //? get the partner name from the user
    getPartnerScene.enter(partnerChoiceKeyboard());
    getPartnerScene.action(['KMK', 'QYAM', 'UNKNOWN', 'Cancel'], handlePartnerSelection);

    //? get the code from the user
    const ChooseTypeKeyboard = await PriceListDataCache.getChooseTypeKeyboard()
    getTypeScene.enter(ctx => productCodeSelectionKeyboard(ctx, ChooseTypeKeyboard));
    getTypeScene.action([...(await PriceListDataCache.getUniqueProductCodes()), 'Cancel'], handleProductTypeSelection);

    //? get the product code from the user
    getCodeScene.enter(displayCodeSelectionList);

    getCodeScene.on(message('text'), handleCodeSelection);

    //? get the date from user
    getDateSene.enter(async ctx => {
      await ctx.reply('type the date in the format: YYYY-MM-DD');
    });
    getDateSene.on(message('text'), async ctx => {
      const userinput = ctx.message.text;
      if (!userinput || !dateRegex.test(userinput)) {
        await ctx.reply('something went wrong');
        await ctx.scene.reenter();
        return;
      }
      dataToWrite.productDate = userinput;
      await ctx.scene.enter('getDescription');
    });

    //? get the description from user
    getDescriptionScene.enter(async ctx => {
      await ctx.reply('type the description of the product');
    });
    getDescriptionScene.on(message('text'), async ctx => {
      const userinput = ctx.message.text;
      if (!userinput || userinput.length < 3) {
        await ctx.reply('something went wrong');
        await ctx.scene.reenter();
        return;
      }
      dataToWrite.productDescription = userinput;
      await ctx.scene.enter('getClient');
    });
    //? get the client from user
    getClientScene.enter(async ctx => {
      await ctx.reply('choose a client please:', {
        reply_markup: {
          inline_keyboard: [...(await PriceListDataCache.getClientsKeyboard()), [{ text: 'Cancel', callback_data: 'Cancel' }]],
        },
      });
    });
    getClientScene.action([...((await PriceListDataCache.getClientsToSelectFrom()) as string[]), 'Cancel'], async ctx => {
      const userChoice = ctx.match?.[0];
      if (!userChoice) {
        await ctx.reply('something went wrong');
        await ctx.scene.reenter();
        return;
      }
      if (userChoice === 'Cancel') {
        await ctx.reply('Operation canceled');
        await ctx.scene.leave();
        return;
      }
      if (((await PriceListDataCache.getClientsToSelectFrom()) as string[]).includes(userChoice)) {
        dataToWrite.selectedClient = userChoice;
        await ctx.scene.enter('getCount');
      } else {
        await ctx.reply('something went wrong');
        await ctx.scene.reenter();
      }
    });

    //? get the count from user
    getCountScene.enter(async ctx => {
      await ctx.reply('type the count of the product');
    });
    getCountScene.on(message('text'), async ctx => {
      const userInput = ctx.message.text;
      if (!userInput || userInput.trim().length === 0 || !isValidNumber(+userInput) || +userInput <= 0) {
        await ctx.reply('Please enter a valid count');
        await ctx.scene.reenter();
        return;
      }
      dataToWrite.productCount = +userInput;
      await ctx.scene.enter('getLink');
    });
    //? get the link from user
    getLinkScene.enter(async ctx => {
      await ctx.reply('type the link of the product');
    });
    getLinkScene.on(message('text'), async ctx => {
      const userInput = ctx.message.text;
      if (!userInput || userInput.trim().length === 0) {
        await ctx.reply('something went wrong');
        await ctx.scene.reenter();
        return;
      }
      dataToWrite.productLink = userInput;
      if (dataToWrite.filteredResults && ['بالصفحة'].includes(dataToWrite.filteredResults.metric)) {
        //todo request pages
        await ctx.scene.enter('getPages');
        return;
      }
      if (dataToWrite.filteredResults && ['نسبة مئوية', 'برمجة'].includes(dataToWrite.filteredResults.metric)) {
        //todo request manual price
        await ctx.scene.enter('getManualPrice');
        return;
      }
      if (dataToWrite.filteredResults && ['بالدقيقة', 'بالثانية'].includes(dataToWrite.filteredResults.metric)) {
        //todo request duration
        await ctx.scene.enter('GetDuration');
        return;
      }
    });
    //? get pages count from user
    getPagesScene.enter(async ctx => {
      await ctx.reply('type the number of pages');
    });
    getPagesScene.on(message('text'), async ctx => {
      const userInput = ctx.message.text;
      if (!userInput || userInput.trim().length === 0 || !isValidNumber(+userInput) || +userInput <= 0) {
        await ctx.reply('Please enter a valid page count');
        await ctx.scene.reenter();
        return;
      }
      dataToWrite.productPages = +userInput;
      await ctx.scene.enter('getEmplyee');
    });

    //? get manual price from user
    getManualPriceScene.enter(async ctx => {
      await ctx.reply('type the manual price');
    });
    getManualPriceScene.on(message('text'), async ctx => {
      const userInput = ctx.message.text;
      if (!userInput || userInput.trim().length === 0 || !isValidNumber(+userInput) || +userInput < 0) {
        await ctx.reply('Please enter a valid manual price');
        await ctx.scene.reenter();
        return;
      }
      dataToWrite.productManualPrice = +userInput;
      await ctx.scene.enter('getEmplyee');
    });

    //? get duration from user
    GetDurationScene.enter(async ctx => {
      await ctx.reply('type the duration of the product');
    });
    GetDurationScene.on(message('text'), async ctx => {
      const duration = ctx.message.text;
      const durationRegext = /(,?)(0?[1-9]|[1-9][0-9]):([0-6]0|0[0-9]|[1-9])(,?)/g;
      if (!duration || duration.trim().length === 0 || !durationRegext.test(duration)) {
        await ctx.reply('something went wrong');
        await ctx.scene.reenter();
        return;
      }
      dataToWrite.productDuration = duration;
      await ctx.scene.enter('getEmplyee');
    });

    //? get the employee name
    getEmplyeeScene.enter(async ctx => {
      await ctx.reply('choose an employee from the list:', {
        reply_markup: {
          inline_keyboard: [
            ...(await PriceListDataCache.getEmployeesKeyboard()),
            [
              {
                text: 'cancel',
                callback_data: 'cancel',
              },
            ],
          ],
        },
      });
    });
    getEmplyeeScene.action([...((await PriceListDataCache.getEmployeeToSelectFrom()) as string[]), 'cancel'], async ctx => {
      const userInput = ctx.match[0];
      if (!userInput || userInput.trim().length === 0) {
        await ctx.reply('something went wrong');
        await ctx.scene.reenter();
        return;
      }
      if (userInput === 'cancel') {
        await ctx.scene.leave();
        return;
      }
      dataToWrite.productEmployee = userInput;
      await ctx.scene.enter('runNotionWriteFunctionScene');
      return;
    });
    //? try run the function
    runNotionWriteFunctionScene.enter(async ctx => {
      await ctx.reply('processing...');
      try {
        await writePageToBillDB(
          process.env.dataBaseId,
          dataToWrite.filteredResults?.pageID ?? '',
          dataToWrite.priceListName,
          dataToWrite.productCode,
          dataToWrite.productDate,
          dataToWrite.productDescription,
          dataToWrite.selectedClient,
          dataToWrite.productCount,
          dataToWrite.productEmployee,
          dataToWrite.productLink,
          dataToWrite.productManualPrice,
          dataToWrite.productDuration,
          dataToWrite.productPages
        ); // Call the function you want to try running here
        await ctx.reply('done');
      } catch (error) {
        console.error('Error while running the function:', error);
        await ctx.reply('something went wrong');
        await ctx.scene.leave();
        return;
      }
    });
  }
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
  testScene(getNameScene, getAgeScene, getGenderScene, displayInfoScene);
  const bot = new Telegraf<Scenes.SceneContext>(process.env.telegramBotToken);
  const stage = new Scenes.Stage<Scenes.SceneContext>(
    [
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
    ],
    {
      ttl: 100,
    }
  );

  // const bot = new Telegraf(process.env.telegramBotToken);
  bot.use(session());
  bot.use(stage.middleware());
  bot.start(async ctx => {
    await ctx.reply('Welcome!');
  });
  bot.command('w', ctx => ctx.scene.enter('getPartner'));
  // bot.command('commands', async ctx => {
  //   const isAuthCheck = await authCheck(ctx);
  //   if (!isAuthCheck) return;
  //   await ctx.reply('choose a command', {
  //     reply_markup: {
  //       inline_keyboard: [
  //         [{ text: 'Export data from Notion', callback_data: 'export' }],
  //         [{ text: 'Write to Notion', callback_data: 'NotionBillReg' }],
  //       ],
  //     },
  //   });
  // });

  // bot.action('NotionBillReg', async ctx => {
  //   await writeNotionBill(ctx, bot);
  // });

  // bot.command('test', ctx => {
  //   ctx.reply('\\ # shit normal', {
  //     parse_mode: 'Markdown',
  //   });
  // });

  // bot.action('export', async ctx => {
  //   await ctx.deleteMessage();
  //   await ctx.reply('Choose the filter type you want to export.', {
  //     reply_markup: {
  //       inline_keyboard: [
  //         [
  //           { text: 'by date', callback_data: 'dateFilter' },
  //           { text: 'by client', callback_data: 'clientFilter' },
  //         ],
  //         [
  //           { text: 'by partner', callback_data: 'partnerFilter' },
  //           { text: 'by employee', callback_data: 'employeeFilter' },
  //         ],
  //       ],
  //     },
  //   });
  //   await NotionExportLogic(bot);
  // });
  // bot.use(authCheck);

  // bot.on(message('text'), ctx => {
  //   checkForRequests(ctx.message);
  // });
  bot.launch();

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
