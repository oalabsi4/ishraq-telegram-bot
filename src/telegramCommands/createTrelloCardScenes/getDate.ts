import type { CTX } from '@/types.js';
import { Arabic } from '@utils/arabicDictionary.js';
import Log from '@utils/logger.js';
import { cardData } from './cardData.js';
import { message } from 'telegraf/filters';
import { dateRegex } from '../Notion/writeToNotionScenes/collectedDataFromUser.js';

export async function getdate(ctx: CTX) {
  //*get current data in MS
  const todayDataAsNumber = Date.now();
  //*added date from example after 2 days would be 48 * 60 * 60 * 1000
  let daySelectionMs: number;
  //* parsed from manual date string
  let month: number;
  let day: number;
  let year: number;
  let hours: number;
  let minutes: number;
  //* convert between manula and auto input for the date the time is always 00:00 string
  let custom = false as boolean;
  //* send the date selection keyboard and recive the equivalent hours number from the user
  await ctx.reply(Arabic.SelectDate, {
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
  //*on button click
  ctx.scene.current?.action(['0', '24', '48', '72', '96', '168', 'Cancel', 'custom'], async ctx => {
    const userInput = ctx.match[0];
    //*cancle condition
    if (userInput === 'Cancel') {
      await ctx.deleteMessage();
      await ctx.reply(Arabic.ItsCanceled);
      Log.info('User canceled the selection', 'getdate');
      await ctx.scene.leave();
      return;
    }
    //* custom condition
    if (userInput === 'custom') {
      //remove keyboard
      await ctx.deleteMessage();
      // sends message requesting the date string
      await ctx.reply(Arabic.RequestDate);
      // switch mode to manual input
      custom = true;
    }
    //* on auto input
    if (['0', '24', '48', '72', '96', '168'].includes(userInput)) {
      //convert to ms
      daySelectionMs = +userInput * 60 * 60 * 1000;
      //remove keyboard
      await ctx.deleteMessage();
      //send message request time input  00:00
      await ctx.reply(Arabic.RequestTime);
    }

    //* parsing string input
    ctx.scene.current?.on(message('text'), async ctx => {
      const userInput = ctx.message.text;
      const timeRegex = /(1[0-9]|0[1-9]|1[0-9]|2[0-4]):([1-5][0-9]|[1-6]0|00|0[1-9])$/; // HH:MM
      //*checking for date input
      if (dateRegex.test(userInput.trim())) {
        //remove bot message and user message
        await ctx.deleteMessage(ctx.message.message_id - 1);
        await ctx.deleteMessage(ctx.message.message_id);
        //parse date string
        year = +userInput.split('-')[0];
        month = +userInput.split('-')[1];
        day = +userInput.split('-')[2];

        Log.info(`user Choose date ${year}-${month}-${day}`, 'getdate => manual');
        //send message request time input  00:00
        await ctx.reply(Arabic.RequestTime);
        return;
      }
      //*checking for time input
      if (timeRegex.test(userInput.trim())) {
        //remove bot message and user message
        await ctx.deleteMessage(ctx.message.message_id - 1);
        await ctx.deleteMessage(ctx.message.message_id);
        //parse time string
        hours = +userInput.split(':')[0];
        minutes = +userInput.split(':')[1];
        //if the mode is manual
        if (custom) {
          //convert user input to ISO date format
          const date = new Date(year, month - 1, day, hours, minutes, 0).toISOString();
          //storing value
          cardData.due = date;
          Log.info(`user Choose date ${date}`, 'getdate');
          //switch scene
          ctx.scene.enter('getColor');
          return;
        }
        // if the mode auto
        if (!custom) {
          //convert back to date from ms
          const selectedDate = new Date(todayDataAsNumber + daySelectionMs);
          //convert user input to ISO date format
          const date = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            hours,
            minutes,
            0
          ).toISOString();
          //storing value
          cardData.due = date;
          Log.info(`user Choose date ${date}`, 'getdate');
          //switch scene
          ctx.scene.enter('getColor');
          return;
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
  });
}
