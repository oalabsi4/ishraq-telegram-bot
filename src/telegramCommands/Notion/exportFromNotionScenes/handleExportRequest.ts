import type { Scenetype } from '@/types.js';
import { handlePropertySelection, requestPropertyName } from './getFilterPropertyName.js';
import { dataToCompleteExport, exportData } from './filterData.js';
import { displayClientsKeyboard, handleClientSelection } from './getClientValue.js';
import { displayEmployeesKeyboard, handleEmployeeSelection } from './getEmployee.js';
import { displayTypesKeyboard, handleTypeSelection } from './getTypeValue.js';
import { displayPartnersKeyboard, handlePartnerSelection } from './getPartnerValue.js';
import { CheckIfDateFilter, displayCheckIfDateFilter } from './checkIfDateFilter.js';
import { displayDateFilterTypes, handleDateFilterTypeSelection } from './getDateType.js';
import { handleDateString, requestDateStringMessage } from './getDateString.js';
import { message } from 'telegraf/filters';
import { runExportDataFromNotion } from './runExportDataFromNotion.js';

export async function handleExportFromNotionDB(
  getFilterPropertyNameScene: Scenetype,
  getPartnerNameScene: Scenetype,
  getClientNameScene: Scenetype,
  getEmployeeNameScene: Scenetype,
  getTypeNameScene: Scenetype,
  checkForDateFilter: Scenetype,
  getDateString: Scenetype,
  getDateType: Scenetype,
  tryRunExportFunction: Scenetype
) {
  //* get the partner name from the user
  getFilterPropertyNameScene.enter(requestPropertyName);
  getFilterPropertyNameScene.action([...exportData.propertiesNames, 'Cancel'], handlePropertySelection);

  //* get the client property value from user
  getClientNameScene.enter(displayClientsKeyboard);
  getClientNameScene.action(
    [...((await dataToCompleteExport.getClientsToSelectFrom()) as string[]), 'Cancel'],
    handleClientSelection
  );

  //* get the employee property value from user
  getEmployeeNameScene.enter(displayEmployeesKeyboard);
  getEmployeeNameScene.action(
    [...((await dataToCompleteExport.getEmployeeToSelectFrom()) as string[]), 'Cancel'],
    handleEmployeeSelection
  );

  //* get the type property value from user
  getTypeNameScene.enter(displayTypesKeyboard);
  getTypeNameScene.action([...(await dataToCompleteExport.getTypesToSelectFrom()), 'Cancel'], handleTypeSelection);

  //*get the partner property value from user
  getPartnerNameScene.enter(displayPartnersKeyboard);
  getPartnerNameScene.action([...(await dataToCompleteExport.getPartnersValues()), 'Cancel'], handlePartnerSelection);

  //* check if the user wants to add a date to the filter
  checkForDateFilter.enter(displayCheckIfDateFilter);
  checkForDateFilter.action(['yes', 'no', 'cancel'], CheckIfDateFilter);

  //* get the date filter type from user
  getDateType.enter(displayDateFilterTypes);
  getDateType.action([...exportData.availableDateTypes, 'Cancel'], handleDateFilterTypeSelection);

  //* get the date string from user
  getDateString.enter(requestDateStringMessage);
  getDateString.on(message('text'), handleDateString);

  //* run the export function
  tryRunExportFunction.enter(runExportDataFromNotion);
}
