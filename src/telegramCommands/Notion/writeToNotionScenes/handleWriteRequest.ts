import { message } from 'telegraf/filters';
import { PriceListDataCache } from './collectedDataFromUser.js';
import { clientListKeyboard, handleClientSelection } from './getClient.js';
import { displayCodeSelectionList, handleCodeSelection } from './getCode.js';
import { requestCountMessage, handleCountInput } from './getCount.js';
import { requestDateMessage, handleDateInput } from './getDate.js';
import { requestDescriptionMessage, handleDescriptionInput } from './getDescription.js';
import { requestDurationMessage, handleDurationInput } from './getDuration.js';
import { requestEmployeeKeyboard, handleEmployeeSelection } from './getEmployee.js';
import { requestLinkMessage, handleLinkInput } from './getLink.js';
import { requestManualPriceMessage, handleManualPriceInput } from './getManualPrice.js';
import { requestPageCountMessage, handlePageCountInput } from './getPageCount.js';
import { partnerChoiceKeyboard, handlePartnerSelectionWrite } from './getPartner.js';
import { productCodeSelectionKeyboard, handleProductTypeSelection } from './getType.js';
import { tryRunNotionWrite } from './tryRunWriteToNotionFunction.js';
import type { Scenetype } from '@/types.js';

export async function writeToNotionScenes(
  getPartnerScene: Scenetype,
  getCodeScene: Scenetype,
  getTypeScene: Scenetype,
  getDateSene: Scenetype,
  getDescriptionScene: Scenetype,
  getClientScene: Scenetype,
  getCountScene: Scenetype,
  GetDurationScene: Scenetype,
  getPagesScene: Scenetype,
  getEmplyeeScene: Scenetype,
  getManualPriceScene: Scenetype,
  getLinkScene: Scenetype,
  runNotionWriteFunctionScene: Scenetype
) {
  //? get the partner name from the user
  getPartnerScene.enter(partnerChoiceKeyboard);
  getPartnerScene.action(['KMK', 'QYAM', 'UNKNOWN', 'Cancel'], handlePartnerSelectionWrite);

  //? get the code from the user
  const ChooseTypeKeyboard = await PriceListDataCache.getChooseTypeKeyboard();
  getTypeScene.enter(ctx => productCodeSelectionKeyboard(ctx, ChooseTypeKeyboard));
  getTypeScene.action([...(await PriceListDataCache.getUniqueProductCodes()), 'Cancel'], handleProductTypeSelection);

  //? get the product code from the user
  getCodeScene.enter(displayCodeSelectionList);
  getCodeScene.on(message('text'), handleCodeSelection);

  //? get the date from user
  getDateSene.enter(requestDateMessage);
  getDateSene.on(message('text'), handleDateInput);

  //? get the description from user
  getDescriptionScene.enter(requestDescriptionMessage);
  getDescriptionScene.on(message('text'), handleDescriptionInput);

  //? get the client from user
  getClientScene.enter(clientListKeyboard);
  getClientScene.action([...((await PriceListDataCache.getClientsToSelectFrom()) as string[]), 'Cancel'], handleClientSelection);

  //? get the count from user
  getCountScene.enter(requestCountMessage);
  getCountScene.on(message('text'), handleCountInput);

  //? get the link from user
  getLinkScene.enter(requestLinkMessage);
  getLinkScene.on(message('text'), handleLinkInput);

  //? get pages count from user
  getPagesScene.enter(requestPageCountMessage);
  getPagesScene.on(message('text'), handlePageCountInput);

  //? get manual price from user
  getManualPriceScene.enter(requestManualPriceMessage);
  getManualPriceScene.on(message('text'), handleManualPriceInput);

  //? get duration from user
  GetDurationScene.enter(requestDurationMessage);
  GetDurationScene.on(message('text'), handleDurationInput);

  //? get the employee name
  getEmplyeeScene.enter(requestEmployeeKeyboard);
  getEmplyeeScene.action(
    [...((await PriceListDataCache.getEmployeeToSelectFrom()) as string[]), 'cancel'],
    handleEmployeeSelection
  );

  //? try run the function
  runNotionWriteFunctionScene.enter(tryRunNotionWrite);

  return;
}
