import type { CTX } from '@/types.js';
import { Arabic } from '@utils/arabicDictionary.js';
import Log from '@utils/logger.js';
import { cardData } from './cardData.js';
import { message } from 'telegraf/filters';
import { dateRegex } from '../writeToNotionScenes/collectedDataFromUser.js';

export async function getdate(ctx: CTX) {
  const todayDataAsNumber = Date.now();
  // const todayDataAsDate = new Date(todayDataAsNumber).getMonth;
  let daySelectionMs:number
  let month : number
  let day : number
  let year:number
  let custom=  false as boolean
  let hours :number
  let minutes : number
  await ctx.reply('choose Date', {
    reply_markup: { 
      inline_keyboard: [
        [
          { text: 'اليوم', callback_data: '0' },
          { text: 'غداً', callback_data: '24' },
          { text: 'بعد يومين', callback_data: '48' },
        ], 
        [
          { text: 'بعد ثلاثة أيام', callback_data: '72' },
          { text: 'بعد اربع ايام', callback_data: '96' },
          { text: 'بعد اسبوع', callback_data: '168' },
        ],
        [
          { text: 'إدخال تاريخ', callback_data: 'custom' },
          { text: Arabic.Cancel, callback_data: 'Cancel' },
        ],
      ],
    },
  });

  Log.info('sent date selection keyboard', 'getdate');
  ctx.scene.current?.action(['0', '24', '48', '72', '96', '168', 'Cancel', 'custom'], async ctx => {

    const userInput = ctx.match[0];
    if (userInput === 'Cancel') {
      await ctx.deleteMessage();
      await ctx.reply(Arabic.ItsCanceled);
      Log.info('User canceled the selection', 'getdate');
      await ctx.scene.leave();
      return;
    }
    if (userInput === 'custom') {
      await ctx.deleteMessage();
      await ctx.reply(Arabic.RequestDate);
      custom = true
      
    }
    if(['0', '24', '48', '72', '96', '168'].includes(userInput)){
      daySelectionMs = +userInput * 24 * 60 * 60 * 1000
      await ctx.deleteMessage();
      await ctx.reply(Arabic.RequestTime)
  
  }



  ctx.scene.current?.on(message('text'), async ctx => {
    const userInput = ctx.message.text;
    const timeRegex = /(1[0-9]|0[1-9]|1[0-9]|2[0-4]):([1-5][0-9]|[1-6]0|00|0[1-9])$/

    if (dateRegex.test(userInput.trim())) {
        await ctx.deleteMessage(ctx.message.message_id - 1);
        await ctx.deleteMessage(ctx.message.message_id);
        year = +userInput.split('-')[0]
        month = +userInput.split('-')[1]
        day = +userInput.split('-')[2]
        console.log(year,month,day)
        await ctx.reply(Arabic.RequestTime)
        return 
    }
    if (timeRegex.test(userInput.trim())) {
        await ctx.deleteMessage(ctx.message.message_id - 1);
        await ctx.deleteMessage(ctx.message.message_id );
        hours = +userInput.split(':')[0]
        minutes = +userInput.split(':')[1]
        if(custom){
            const date  = new Date(year,month-1,day,hours,minutes,0).toISOString()
            cardData.due = date
            Log.info(`user Choose date ${date}`, 'getdate');
            ctx.scene.enter('getColor')
            return 
        }
        if(!custom){
            const selectedDate = new Date(todayDataAsNumber + daySelectionMs)
            console.log(selectedDate)
            console.log(todayDataAsNumber + daySelectionMs)
            const date  = new Date(selectedDate.getFullYear(),selectedDate.getMonth(),selectedDate.getDay(),hours,minutes,0).toISOString()
            cardData.due = date
            Log.info(`user Choose date ${date}`, 'getdate');
            ctx.scene.enter('getColor')
            return 
        }

    }
    if (!userInput) {
        await ctx.deleteMessage(ctx.message.message_id - 1);
        await ctx.deleteMessage(ctx.message.message_id);
        await ctx.reply(Arabic.Error);
        Log.warn('User entered a short or empty date', 'getdate');
        await ctx.scene.reenter();
        return;
    }
    await ctx.deleteMessage(ctx.message.message_id - 1);
    await ctx.deleteMessage(ctx.message.message_id);
    await ctx.reply(Arabic.Error);
    Log.warn('User did not enter a date', 'getdate');
    await ctx.scene.reenter();
    return;
  });
})






}
