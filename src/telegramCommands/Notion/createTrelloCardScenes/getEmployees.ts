import type { CTX } from '@/types.js';
import { cardData, dataFromTrello } from './cardData.js';
import { Arabic } from '@utils/arabicDictionary.js';
import Log from '@utils/logger.js';
import { sleep } from '@utils/cli-utils.js';

export async function displayMMembersKeyboard(ctx: CTX) {
  cardData.idMembers = []
  await ctx.deleteMessage();
  const memberKeyboardValues = (await dataFromTrello.getBoardMembers()).map(e => {
    return [
      {
        text: e.name,
        callback_data: e.id,
      },
    ];
  });
  const membersIds = memberKeyboardValues.flatMap(e => {
    return e.map(n => {
      return n.callback_data;
    });
  });

  const membersKeyboard = await ctx.reply(Arabic.ChooseMember, {
    reply_markup: {
      inline_keyboard: [
        ...memberKeyboardValues,
        [{ text: Arabic.Done, callback_data: 'Done' }],
        [{ text: Arabic.Cancel, callback_data: 'Cancel' }],
      ],
      
    }, 
  });
  Log.info('sent member selection keyboard', 'displayMMembersKeyboard');
  ctx.scene.current?.action(
    [...membersIds, 'Cancel', 'Done'],
    async ctx => await handleMembersSelection(ctx, membersKeyboard.message_id)
  );
  return;
}

export async function handleMembersSelection(ctx: any, messageId: number) {
  const userInput = ctx.match[0];
  if (!userInput) {
    await ctx.deleteMessage(messageId);
    await ctx.reply(Arabic.Error);
    Log.warn('User did not select a member', 'handleMembersSelection');
    await ctx.scene.reenter();
    return;
  }

  if (userInput === 'Cancel') {
    await sleep(500);
    await ctx.deleteMessage();
    await ctx.reply(Arabic.ItsCanceled);
    Log.info('User canceled the selection', 'handleMembersSelection');
    await ctx.scene.leave(); 
    return;
  }
  // increment the counter
  if (!cardData.idMembers.includes(userInput) && userInput !== 'Cancel' && userInput !== 'Done') {
    cardData.idMembers.push(userInput);
    const added = await ctx.reply(Arabic.AddedMember);
    await sleep(500);
    await ctx.deleteMessage(added.message_id);
    Log.info(`user added employee ${userInput }`, 'handleMembersSelection');
    return;
  }
  if (userInput === 'Done') {
    // await ctx.deleteMessage(messageId);
    await ctx.scene.enter('getLabel');
    return;
  }
  const alreadExists = await ctx.reply(Arabic.AlreadyExists);
  await sleep(1000);
  await ctx.deleteMessage(alreadExists.message_id);
  return;
}
