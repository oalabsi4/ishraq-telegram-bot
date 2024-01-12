import { sha256 } from 'js-sha256';
import fs from 'fs/promises';
import Log from './logger.js';
import type { Context, Telegraf } from 'telegraf';
import type { Update } from 'telegraf/types';
import type { Message } from 'telegraf/types';
import { message } from 'telegraf/filters';

export async function authCheck(ctx: Context<Update>, bot: Telegraf<Context<Update>>) {
  const hashPth = 'pass.txt';
  const userIdsPath = 'userIds.txt';
  const hash = await fs.readFile(hashPth, 'utf-8');
  const userIDs = (await fs.readFile(userIdsPath, 'utf-8')).split('\n');
  const userID = ctx.chat?.id;

  if (userIDs.includes(sha256(`${userID}`))) {
    return;
  }

  const askForPassword = await ctx.reply('enter password', { reply_markup: { force_reply: true } });
  bot.on(message('reply_to_message'), async ctx => {
    console.log('match!')
    const message = ctx.message as Message.TextMessage;
    if (!message.text || askForPassword.message_id !== message.reply_to_message?.message_id) return;

    if (sha256(message.text) === hash) {
      await fs.appendFile(userIdsPath, `${sha256(`${userID}`)}\n`);
      return;
    }
    Log.warn(`wrong password ${userID} - ${message.text}`, 'authCheck');
    await ctx.reply('wrong password');
  });
}
