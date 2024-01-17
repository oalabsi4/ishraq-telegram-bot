import { Boards } from '@/api/trello/trello.js';
import type { CTX } from '@/types.js';
import { Arabic } from '@utils/arabicDictionary.js';
import Log from '@utils/logger.js';
import { cardData, fetchData } from './cardData.js';

/**
 * Display a keyboard with board options.
 * @param  ctx - The context object.
 * @returns  - A promise that resolves when the keyboard is displayed.
 */
export async function displayBoardKeyboard(ctx: CTX) {
    // Reply with the message and keyboard options
    await ctx.reply(Arabic.ChoseBoard, {
      reply_markup: {
        inline_keyboard: [
          [{ text: Boards.DesignBoard.name, callback_data: `${Boards.DesignBoard.boardId}-${Boards.DesignBoard.lists.id}` }],
          [{ text: Boards.VideoBoard.name, callback_data: `${Boards.VideoBoard.boardId}-${Boards.VideoBoard.lists.id}` }],
          [{ text: Boards.MarketingBoard.name, callback_data: `${Boards.MarketingBoard.boardId}-${Boards.MarketingBoard.lists.id}` }],
          [{ text: Boards.ManagementBoard.name, callback_data: `${Boards.ManagementBoard.boardId}-${Boards.ManagementBoard.lists.id}` }],
          [{ text: Boards.TestBoard.name, callback_data: `${Boards.TestBoard.boardId}-${Boards.TestBoard.lists.id}` }],
          [{ text: Arabic.Cancel, callback_data: 'Cancel' }],
        ],
      },
    });
  
    // Log that the board selection keyboard was sent
    Log.info('sent board selection keyboard', 'displayBoardKeyboard');
  }


/**
 * Handles the selection of a board by the user.
 * @param  ctx - The context object containing the user input.
 */
export async function handleBoardSelection(ctx: any) {
  // Get the user input
  const userInput = ctx.match[0];

  // Check if the user input is empty
  if (!userInput) {
    // Delete the message
    await ctx.deleteMessage();
    // Reply with an error message
    await ctx.reply(Arabic.Error);
    // Log a warning message
    Log.warn('User did not select a board', 'handleBoardSelection');
    // Re-enter the scene
    await ctx.scene.reenter();
    return;
  }

  // Check if the user input is 'Cancel'
  if (userInput === 'Cancel') {
    // Delete the message
    await ctx.deleteMessage();
    // Reply with a cancellation message
    await ctx.reply(Arabic.ItsCanceled);
    // Log an info message
    Log.info('User canceled the selection', 'handleBoardSelection');
    // Leave the scene
    await ctx.scene.leave();
    return;
  }

  // Extract the board ID and list ID from the user input
  const [boardId, cardId] = userInput.split('-');
  fetchData.BoardId = boardId;
  cardData.idList = cardId;

  // Log the selected board ID
  Log.info(`User Choose board ${fetchData.BoardId}`, 'handleBoardSelection');

  // Enter the next scene
  await ctx.scene.enter('getEmployee');
}

