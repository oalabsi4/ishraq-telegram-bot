import { getBoardLabels } from '@/api/trello/getBoardLabels.js';
import Log from '@utils/logger.js';
import { cardData, fetchData } from './cardData.js';
import { Arabic } from '@utils/arabicDictionary.js';
import type { CTX } from '@/types.js';
import { sleep } from '@utils/cli-utils.js';

/**
 * Retrieves the labels for a given context.
 * @param ctx - The context object.
 */
export async function getLabels(ctx: CTX) {
  // Reset the idLabels property of cardData
  cardData.idLabels = [];

  // Delete the current message
  await ctx.deleteMessage();

  // Retrieve the labels for the board
  const labels = await getBoardLabels(fetchData.BoardId);

  // Create the inline keyboard for labels
  const labelsKeyboard = labels.map(e => {
    return [
      {
        text: e.name,
        callback_data: e.id,
      },
    ];
  });

  // Extract the label IDs from the keyboard
  const labelsIds = labelsKeyboard.flatMap(e => {
    return e.map(n => {
      return n.callback_data;
    });
  });

  // Send a reply with the label selection keyboard
  await ctx.reply(Arabic.ChooseLabel, {
    reply_markup: {
      inline_keyboard: [
        ...labelsKeyboard,
        [{ text: Arabic.Done, callback_data: 'Done' }],
        [{ text: Arabic.Cancel, callback_data: 'Cancel' }],
      ],
    },
  });

  // Log the action
  Log.info('Sent Label selection keyboard', 'getLabels');

  // Set the action for label selection
  ctx.scene.current?.action([...labelsIds, 'Cancel', 'Done'], handleLabelSelection);

  return;
}

async function handleLabelSelection(ctx: any) {
  const userInput = ctx.match[0];

  if (!userInput) {
    await ctx.deleteMessage();
    await ctx.reply(Arabic.Error);
    Log.warn('User did not select a label', 'handleLabelSelection');
    await ctx.scene.reenter();
    return;
  }

  if (userInput === 'Cancel') {
    await sleep(500);
    await ctx.deleteMessage();
    await ctx.reply(Arabic.ItsCanceled);
    Log.info('User canceled the selection', 'handleLabelSelection');
    await ctx.scene.leave();
    return;
  }
  if (userInput === 'Done') {
    await ctx.deleteMessage();
    await ctx.scene.enter('getCardTitle');
    return;
  }
  if (userInput !== 'Done' && userInput !== 'Cancel' && !(cardData.idLabels as string[]).includes(userInput)) {
    (cardData.idLabels as string[]).push(userInput);
    const added = await ctx.reply(Arabic.AddedLabel);
    await sleep(500);
    await ctx.deleteMessage(added.message_id);
    Log.info(`user added label ${cardData.idMembers}`, 'handleMembersSelection');
    return;
  }
  const alreadyExists = await ctx.reply(Arabic.LabelAlreadyExists);
  await sleep(1000);
  await ctx.deleteMessage(alreadyExists.message_id);
  return;
}
