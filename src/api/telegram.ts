import { Context, Scenes, session, Telegraf } from 'telegraf';
import { checkForRequests } from './telegramWaitForResponse.js';
import { NotionExportLogic } from 'src/telegramCommands/Notion/notionExportLogic.js';
import { writeNotionBill } from '@/telegramCommands/Notion/NotionWriteBill.js';
import { authCheck } from '@utils/auth.js';
import { message } from 'telegraf/filters';
import { testScene } from './testingScenes.js';
import { fetchPricesData, filterPricesFormat, formatSelectionDataForTelegram, isValidNumber, NotionProductSelection, selectPropValues } from './notion/fetchSelectPropValues.js';
import { formatTelegramKeyboard } from '@utils/telegramkeyboardFormater.js';
import { PriceListRestructuredData } from '@/types.js';
import { date } from 'zod';
import { exportNotionSelectPropertyValues } from './notion/notionSelectFilter.js';

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
    getLinkScene
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
    getLinkScene: Scenetype
  ) {
    const dateRegex = /(20[0-9]{2})\s*-\s*(10|11|12|0[1-9])\s*-\s*(3[0-1]|2[0-9]|1[0-9]|0[1-9])\s*$/; //ex: 2022-01-01 (with zeros)

    let partnerSelection: 'KMK' | 'QYAM' | 'UNKNOWN'= 'KMK';
    let selectedType: string;
    const priceList = await fetchPricesData(partnerSelection);
    const uniqueProductCodes = selectPropValues(priceList);
    const chooseTypeKeyboard = formatTelegramKeyboard(uniqueProductCodes);
    let priceStructuredData :PriceListRestructuredData[]
    let filteredResults :PriceListRestructuredData | null
    const clientsToSelectFrom =await  exportNotionSelectPropertyValues('clients',true);
    const clientsKeyboard = formatTelegramKeyboard(clientsToSelectFrom as string[]);
    //! to use in writing
    let priceListName: 'KMK-PRICING' | 'QYAM-PRICING' | 'NO-PARTNER';
    let productCode:string
    let productDate :string
    let productDescription : string
    let selectedClient:string
    let productCount : number
    let productLink : string
    //? get the partner name from the user
    getPartnerScene.enter(async ctx => {
      await ctx.reply('please enter the partner name:', {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'KMK', callback_data: 'KMK' }],
            [{ text: 'QYAM', callback_data: 'QYAM' }],
            [{ text: 'UNKOWN', callback_data: 'UNKNOWN' }],
            [{ text: 'Cancel', callback_data: 'Cancel' }],
          ],
        },
      });
    });
    getPartnerScene.action(['KMK', 'QYAM', 'UNKNOWN', 'Cancel'], async ctx => {
      const choice = ctx.match?.[0] as 'KMK' | 'QYAM' | 'UNKNOWN' | 'Cancel';
      if (choice === 'Cancel') {
        await ctx.reply('canceled');
        return await ctx.scene.leave();
      }
      if (['KMK', 'QYAM', 'UNKNOWN'].includes(choice)) {
        priceListName = choice === 'KMK' ? 'KMK-PRICING' : choice === 'QYAM' ? 'QYAM-PRICING' : 'NO-PARTNER';
        partnerSelection = choice;
        await ctx.scene.enter('getType');
      } else {
        await ctx.reply('something went wrong');
        await ctx.scene.reenter();
      }
    });

    //? get the code from the user
    getTypeScene.enter(async ctx => {
      await ctx.reply('choose a type please:', {
        reply_markup: {
          inline_keyboard: [...chooseTypeKeyboard, [{ text: 'Cancel', callback_data: 'Cancel' }]],
        },
      });
    });
    getTypeScene.action([...uniqueProductCodes, 'Cancel'], async ctx => {
      const userChoice = ctx.match?.[0];
      if (!userChoice) {
        await ctx.reply('something went wrong');
        await ctx.scene.reenter();
      }
      if (userChoice === 'Cancel') {
        await ctx.reply('canceled');
        return await ctx.scene.leave();
      }
      if (uniqueProductCodes.includes(userChoice)) {
        selectedType = userChoice;
        const choosenRow = filterPricesFormat(selectedType, priceList);
        priceStructuredData = choosenRow;
        await ctx.scene.enter('getCode');
      }else{
        await ctx.reply('something went wrong');
        await ctx.scene.reenter();
      }
    });

    getCodeScene.enter(async ctx => {
      const codeCHoiceList = formatSelectionDataForTelegram(priceStructuredData);
      await ctx.reply(`type the number of the code you want:\n${codeCHoiceList}`)
    })
    getCodeScene.on(message('text'), async ctx => {
      if(!ctx.message.text){
        await ctx.reply('something went wrong');
        await ctx.scene.reenter();
      }
      const selectedRow = NotionProductSelection(priceStructuredData, ctx.message.text);
      filteredResults = selectedRow
      productCode = selectedRow?.code ?? ''

      await ctx.scene.enter('getDate');

    })
    getDateSene.enter(async ctx => {
      await ctx.reply('type the date in the format: YYYY-MM-DD');

    })
    getDateSene.on(message('text'),async ctx =>{
      const userinput = ctx.message.text
      if(!userinput || !dateRegex.test(userinput)){
        await ctx.reply('something went wrong');
        await ctx.scene.reenter();
      }
      productDate = userinput
      await ctx.scene.enter('getDescription');

    })
    getDescriptionScene.enter(async ctx => {

      await ctx.reply('type the description of the product');
    })
    getDescriptionScene.on(message('text'),async ctx=>{
      const userinput = ctx.message.text
      if(!userinput || userinput.length < 3){
        await ctx.reply('something went wrong');
        await ctx.scene.reenter();
      }
      productDescription = userinput
      await ctx.scene.enter('getClient');
    })
    getClientScene.enter(async ctx => {
      await ctx.reply('choose a client please:', {
        reply_markup:{
          inline_keyboard: [...clientsKeyboard, [{ text: 'Cancel', callback_data: 'Cancel' }]],
        }
      })
    })
    getClientScene.action([...clientsToSelectFrom as string[], 'Cancel'], async ctx => {
      const userChoice = ctx.match?.[0];
      if(!userChoice){
        await ctx.reply('something went wrong');
        await ctx.scene.reenter();
      }
      if(userChoice === 'Cancel'){
        await ctx.reply('Operation canceled')
        await ctx.scene.leave()
      }
      if( (clientsToSelectFrom as string[]).includes(userChoice)){
        selectedClient = userChoice
        await ctx.scene.enter('getCount');
      }else{
        await ctx.reply('something went wrong');
        await ctx.scene.reenter();
      }
    })

    getCountScene.enter(async ctx => {

      await ctx.reply('type the count of the product');
    })
    getCountScene.on(message('text'), async ctx => {
      const userInput = ctx.message.text
      if (!userInput || userInput.trim().length === 0 || !isValidNumber(+userInput) || +userInput <= 0) {
        await ctx.reply('Please enter a valid count');
        await ctx.scene.reenter();
      }
      productCount = +userInput
      await ctx.scene.enter('getLink');
    })
    getLinkScene.enter(async ctx => {
      await ctx.reply('type the link of the product');
    })
    getLinkScene.on(message('text'), async ctx => {
      const userInput = ctx.message.text
      if(!userInput || userInput.trim().length === 0 ){
        await ctx.reply('something went wrong');
        await ctx.scene.reenter();
      }
      productLink = userInput
      if (filteredResults && ['بالصفحة'].includes(filteredResults.metric)) {
          //todo request pages
      }
      if (filteredResults && ['نسبة مئوية', 'برمجة'].includes(filteredResults.metric)) {
          //todo request manual price
      }
      if (filteredResults && ['بالدقيقة', 'بالثانية'].includes(filteredResults.metric)) {
          //todo request duration 
      }
    })
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
    getLinkScene
  )
  testScene(getNameScene, getAgeScene, getGenderScene, displayInfoScene);
  const bot = new Telegraf<Scenes.SceneContext>(process.env.telegramBotToken);
  const stage = new Scenes.Stage<Scenes.SceneContext>([getPartnerScene,
    getTypeScene,
    getCodeScene,
    getDateSene,
    getDescriptionScene,
    getClientScene,
    getCountScene,
    GetDurationScene,
    getPagesScene,
    getEmplyeeScene,
    getManualPriceScene,], {
    ttl: 100,
  });

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
