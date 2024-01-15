import type { CTX } from '@/types.js';
import { exportData } from './filterData.js';
import { formatTelegramKeyboard } from '@utils/telegramkeyboardFormater.js';
import Log from '@utils/logger.js';

/**
 * Requests the user to choose a property from a list and sends a keyboard with the options.
 * @param ctx - The context object containing information about the request and the user.
 */
export async function requestPropertyName(ctx: CTX) {
  // Get the list of property names
  const propName = exportData.propertiesNames;

  // Format the property names as a Telegram keyboard
  const propsAsKeyboard = formatTelegramKeyboard(propName);

  // Send the keyboard to the user with the property options
  await ctx.reply('Choose a property', {
    reply_markup: {
      inline_keyboard: [...propsAsKeyboard, [{ text: 'Cancel', callback_data: 'Cancel' }]],
    },
  });

  // Log the action of sending the property selection keyboard
  Log.info('Sent property selection keyboard', 'requestPropertyName');
  return;
}

/**
 * This function handles the user's property selection.
 * If the user selects a valid property, it performs the necessary actions based on the selected property.
 * If the user cancels the selection, it exits the scene.
 * If the user selects an invalid property, it displays an error message and exits the scene.
 *
 * @param ctx - The context object containing information about the user's interaction.
 */
export async function handlePropertySelection(ctx: any) {
  const userInput = ctx.match[0];

  // Check if the user input is empty or not a valid property
  if (!userInput || (!exportData.propertiesNames.includes(userInput) && userInput !== 'Cancel')) {
    await ctx.deleteMessage();
    await ctx.reply('something went wrong');
    Log.warn('User did not select a property', 'handlePropertySelection');
    await ctx.scene.reenter();
    return;
  }

  // Check if the user selected the "Cancel" option
  if (userInput === 'Cancel') {
    await ctx.deleteMessage();
    await ctx.reply('canceled');
    Log.info('User canceled the selection', 'handlePropertySelection');
    await ctx.scene.leave();
    return;
  }

  await ctx.deleteMessage();
  exportData.selectedFilterPropertyName = userInput;
  await ctx.reply(`Chosen property: ${userInput}`);
  Log.info('User selected a property', 'handlePropertySelection');

  // Redirect to the next scene based on the selected property
  if (userInput === 'النوع') {
    await ctx.scene.enter('getTypeNameScene');
    return;
  }
  if (userInput === 'العميل') {
    await ctx.scene.enter('getClientNameScene');
    return;
  }
  if (userInput === 'الموظف المنتج') {
    await ctx.scene.enter('getEmployeeNameScene');
    return;
  }
  if (userInput === 'الشريك') {
    await ctx.scene.enter('getPartnerNameScene');
    return;
  }
  if (userInput === 'تاريخ الاستلام') {
    await ctx.scene.enter('getDateType');
    return;
  } else {
    await ctx.reply('something went wrong');
    Log.warn('User did not select a property', 'handlePropertySelection');
    await ctx.scene.leave();
    return;
  }
}
