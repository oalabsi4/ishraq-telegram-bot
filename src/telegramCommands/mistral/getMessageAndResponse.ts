import { mistral } from '@/api/mistral_api.js';
import type { CTX } from '@/types.js';
import Log from '@utils/logger.js';
import { message } from 'telegraf/filters';

/**
 * Prompts the user to enter a message and handles the user's input.
 * If the input is valid, sends the input to an AI for processing and returns the AI's response.
 * If the input is invalid, prompts the user to enter a valid message again.
 * @param ctx - The context object containing information about the user and the current scene.
 */
export async function getMessageAndResponse(ctx: CTX) {
  // Prompt the user to enter a message
  await ctx.reply('Enter message');

  // Handle the 'end' command
  ctx.scene.current?.command('end', async ctx => {
    // Reply with a goodbye message
    await ctx.reply('Bye 👋');
    // Leave the current scene
    await ctx.scene.leave();
    return;
  });

  // Handle user's text input
  ctx.scene.current?.on(message('text'), async ctx => {
    const input = ctx.message.text;

    // Check if the input is empty or invalid
    if (!input || input.length === 0) {
      // Delete the previous messages
      await ctx.deleteMessage(ctx.message.message_id - 1);
      await ctx.deleteMessage(ctx.message.message_id);
      // Prompt the user to enter a valid message again
      await ctx.reply('Please enter a valid message');
      // Reenter the scene
      await ctx.scene.reenter();
      Log.warn('User did not enter a message', 'handleMembersSelection');
      return;
    }

    // Delete the previous messages
    await ctx.deleteMessage(ctx.message.message_id - 1);
    await ctx.deleteMessage(ctx.message.message_id);

    // Show typing action
    await ctx.sendChatAction('typing');

    // Process the input with an AI and get the response
    const aiResponse = await mistral(input);

    // Reply with the AI's response or a default message if no response is found
    await ctx.reply(aiResponse ?? 'No response found check the logs homie 🤕');

    // Log the user input and AI response
    Log.info(`User input: ${input}`, 'handleMembersSelection');
    Log.info(`AI response: ${aiResponse}`, 'handleMembersSelection');

    // Prompt the user to type /End to exit
    await ctx.reply('Type /End to exit');

    // Reenter the scene
    await ctx.scene.reenter();
    return;
  });
}
