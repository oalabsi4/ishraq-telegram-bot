import type { Scenetype } from '@/types.js';
import { boardChoices } from './cardData.js';
import { createCardFunction } from './createCard.js';
import { displayBoardKeyboard, handleBoardSelection } from './getBoard.js';
import { cardTitle } from './getCardTitle.js';
import { cardColor } from './getColor.js';
import { getdate } from './getDate.js';
import { cardDescription } from './getDescription.js';
import { displayMMembersKeyboard } from './getEmployees.js';
import { getLabels } from './getLabels.js';

export function handleCreateCardRequest(
  getCardTitle: Scenetype,
  getBoard: Scenetype,
  getEmployee: Scenetype,
  getLabel: Scenetype,
  getDescription: Scenetype,
  getDueDate: Scenetype,
  getColorScene: Scenetype,
  createTrelloCardScene: Scenetype
) {
  //? get the board Id from the user
  getBoard.enter(displayBoardKeyboard);
  getBoard.action([...boardChoices, 'Cancel'], handleBoardSelection);

  //? get the members
  getEmployee.enter(displayMMembersKeyboard);

  //?get labels
  getLabel.enter(getLabels);

  //? get card title
  getCardTitle.enter(cardTitle);

  //? get description
  getDescription.enter(cardDescription);

  //? get due date
  getDueDate.enter(getdate);

  //? get color
  getColorScene.enter(cardColor);

  //?create card
  createTrelloCardScene.enter(createCardFunction);
}
