import { createTrelloCard } from '@/api/trello/createTrelloCard.js';
import type { CTX } from '@/types.js';
import { cardData, fetchData } from './cardData.js';
import Log from '@utils/logger.js';
import { Arabic } from '@utils/arabicDictionary.js';

export async function createCardFunction(ctx: CTX) {
  try {
    await createTrelloCard(
      cardData,
      fetchData.color as 'pink' | 'yellow' | 'lime' | 'blue' | 'black' | 'orange' | 'red' | 'purple' | 'sky' | 'green'
    );
    await ctx.reply(Arabic.CardCreated);
    await ctx.scene.leave();
  } catch (error) {
    Log.error('Error creating Trello card', 'createCardFunction');
    await ctx.reply(Arabic.Error);
    await ctx.scene.leave();
  }
}
