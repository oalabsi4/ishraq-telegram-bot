import type { CTX } from '@/types.js';
import { Arabic } from '@utils/arabicDictionary.js';
import Log from '@utils/logger.js';
import { fetchData } from './cardData.js';

export async function cardColor(ctx: CTX) {
  await ctx.reply(Arabic.ChooseColor, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🩷', callback_data: 'pink' },
          { text: '🟡', callback_data: 'yellow' },
          { text: '🍏', callback_data: 'lime' },
          { text: '🔵', callback_data: 'blue' },
        ],
        [
          { text: '⚫', callback_data: 'black' },
          { text: '🟠', callback_data: 'orange' },
          { text: '🔴', callback_data: 'red' },
          { text: '🟣', callback_data: 'purple' },
        ],
        [
          { text: '🩵', callback_data: 'sky' },
          { text: '🟢', callback_data: 'green' },
        ],
        [{ text: Arabic.Cancel, callback_data: 'Cancel' }],
      ],
    },
  });


  ctx.scene.current?.action(['pink', 'yellow', 'lime', 'blue', 'black', 'orange', 'red', 'purple', 'sky', 'green','Cancel'],async ctx => {
    const userInput = ctx.match[0];
    if(userInput === 'Cancel') {
      await ctx.deleteMessage();
      await ctx.reply(Arabic.ItsCanceled)
      Log.warn('User canceled the selection', 'handleColorSelection');
      ctx.scene.leave()
      return 
    } 
    fetchData.color = userInput
    Log.info(`user selected ${userInput}`, 'handleColorSelection');
    await ctx.deleteMessage();
    await ctx.scene.enter('createTrelloCardScene')
  })
}
