import type { Context } from 'telegraf';
import type { Update } from 'telegraf/types';
import Log from './logger.js';

// a function that send a loading message then delete it when the process is done
export async function telegramLoading(ctx: Context<Update>, message: string) {
  const id = await ctx.reply(message);

  return () => {
    if (id.message_id) {
      ctx.deleteMessage(id.message_id);
      console.log(id.message_id, 'if');
    } else Log.warn('could not delete message', 'telegramLoading');
  };
}
