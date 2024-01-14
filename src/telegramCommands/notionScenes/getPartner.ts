import {
  dataToWrite
} from './collectedDataFromUser.js';

/**
 * Generates a keyboard for partner choice.
 * @returns {Function} - The async function to be executed.
 */
export function partnerChoiceKeyboard() {
  return async (ctx: any) => {
    await ctx.reply('Please enter the partner name:', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'KMK', callback_data: 'KMK' }],
          [{ text: 'QYAM', callback_data: 'QYAM' }],
          [{ text: 'UNKNOWN', callback_data: 'UNKNOWN' }],
          [{ text: 'Cancel', callback_data: 'Cancel' }],
        ],
      },
    });
  };
}

/**
 * Handles partner selection in the given context.
 * @param ctx - The context object.
 */
export async function handlePartnerSelection(ctx: any) {
  // Get the user's choice from the context match
  const choice = ctx.match?.[0] as 'KMK' | 'QYAM' | 'UNKNOWN' | 'Cancel';

  if (choice === 'Cancel') {
    // If choice is 'Cancel', reply with 'canceled' and leave the scene
    await ctx.reply('canceled');
    await ctx.scene.leave();
    return;
  }

  if (['KMK', 'QYAM', 'UNKNOWN'].includes(choice)) {
    // If choice is one of 'KMK', 'QYAM', 'UNKNOWN', update the priceListName and partnerSelection accordingly
    dataToWrite.priceListName = choice === 'KMK' ? 'KMK-PRICING' : choice === 'QYAM' ? 'QYAM-PRICING' : 'NO-PARTNER';
    dataToWrite.partnerSelection = choice;
    await ctx.scene.enter('getType');
  } else {
    // If choice is not recognized, reply with 'something went wrong' and reenter the scene
    await ctx.reply('something went wrong');
    await ctx.scene.reenter();
  }
}


