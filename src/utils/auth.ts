import fs from 'fs/promises';
import { sha256 } from 'js-sha256';
import type { Context } from 'telegraf';
import type { Update } from 'telegraf/types';
import Log from './logger.js';
import { Arabic } from './arabicDictionary.js';

/**
 * Checks if the user is authorized.
 *
 * @param ctx - The context object containing the update.
 * @returns A promise that resolves to a boolean indicating if the user is authorized.
 */
export async function authCheck(ctx: Context<Update>): Promise<boolean> {
  // Define file paths
  const hashPath = 'pass.txt';
  const userIdsPath = 'userIds.txt';

  // Read the hash from the file
  const hash = await fs.readFile(hashPath, 'utf-8');

  // Read the user IDs from the file and split them by newline
  const userIDs = (await fs.readFile(userIdsPath, 'utf-8')).split('\n');

  // Get the user ID from the context
  const userID = ctx.chat?.id;

  // Check if the user ID is included in the authorized user IDs
  if (userIDs.includes(sha256(`${userID}`))) {
    return true;
  }

  // Get the message from the context
  const message = ctx.message;

  // Check if the message is a text message
  if (message && 'text' in message) {
    // Check if the hashed message matches the stored hash
    if (sha256(message.text) === hash) {
      // Append the hashed user ID to the user IDs file
      await fs.appendFile(userIdsPath, `${sha256(`${userID}`)}\n`);
      return true;
    }

    // Log a warning message for incorrect password
    Log.warn(`wrong password ${userID} - ${message.text}`, 'authCheck');

    // Reply with a message indicating incorrect password
    await ctx.reply(Arabic.WrongPass);
  }

  // Reply with a message asking for password
  await ctx.reply(Arabic.EnterPass);

  // User is not authorized
  return false;
}
