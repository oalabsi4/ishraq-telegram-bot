import fs from 'fs/promises';
import { sha256 } from 'js-sha256';
import type { Context } from 'telegraf';
import type { Update } from 'telegraf/types';
import Log from './logger.js';

export async function authCheck(ctx: Context<Update>): Promise<boolean> {
  const hashPth = 'pass.txt';
  const userIdsPath = 'userIds.txt';
  const hash = await fs.readFile(hashPth, 'utf-8');
  const userIDs = (await fs.readFile(userIdsPath, 'utf-8')).split('\n');
  const userID = ctx.chat?.id;

  if (userIDs.includes(sha256(`${userID}`))) {
    return true;
  }

  console.log('match!');
  const message = ctx.message;
  if (message && 'text' in message) {
    if (sha256(message.text) === hash) {
      await fs.appendFile(userIdsPath, `${sha256(`${userID}`)}\n`);
      return true;
    }
    Log.warn(`wrong password ${userID} - ${message.text}`, 'authCheck');
    await ctx.reply('wrong password');
  }
  await ctx.reply('enter password');
  return false;
}
