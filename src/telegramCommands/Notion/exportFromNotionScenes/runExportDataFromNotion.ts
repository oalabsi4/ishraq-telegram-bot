import type { CTX } from '@/types.js';
import { exportData } from './filterData.js';
import { sendDataWithDateString, sendDateDataWithDataStatement } from './sendFunctions/sendDatePropertyData.js';
import {
  sendSelectPropertyDateStatement,
  sendSelectPropertyDateString,
  sendSelectPropertyNoDate,
} from './sendFunctions/selectPropertyData.js';
import {
  sendFormulaStringDateString,
  sendFormulaStringDtateStatement as sendFormulaStringDateStatement,
  sendFormulaStringNoDate,
} from './sendFunctions/formulaStringPropertyData.js';

export async function runExportDataFromNotion(ctx: CTX) {
  //? check if it's a formula string property
  if (['النوع', 'الشريك'].includes(exportData.selectedFilterPropertyName)) {
    const propValue = exportData.partnerValue !== '' ? exportData.partnerValue : exportData.typeValue;
    //* check if the filter does not require a date string
    if (exportData.dateTypesNOString.includes(exportData.selectedDateType)) {
      await sendFormulaStringDateStatement(ctx, exportData.selectedFilterPropertyName, propValue, exportData.selectedDateType);
      return;
    }
    //* check if the filter requires a date string
    if (exportData.dateTypesRequireString.includes(exportData.selectedDateType)) {
      await sendFormulaStringDateString(
        ctx,
        exportData.selectedFilterPropertyName,
        propValue,
        exportData.selectedDateType,
        exportData.dateString
      );
      return;
    }
    //* else send data with no date filter
    await sendFormulaStringNoDate(ctx, exportData.selectedFilterPropertyName, propValue);
    return;
  }
  //? check if it's a select property
  if (['العميل', 'الموظف المنتج'].includes(exportData.selectedFilterPropertyName)) {
    const propertyValue = exportData.clientValue !== '' ? exportData.clientValue : exportData.employeeValue;
    //* check if the filter does not require a date string
    if (exportData.dateTypesNOString.includes(exportData.selectedDateType)) {
      await sendSelectPropertyDateStatement(
        ctx,
        exportData.selectedFilterPropertyName,
        propertyValue,
        exportData.selectedDateType
      );
      return;
    }
    //* check if the filter requires a date string
    if (exportData.dateTypesRequireString.includes(exportData.selectedDateType)) {
      await sendSelectPropertyDateString(
        ctx,
        exportData.selectedFilterPropertyName,
        propertyValue,
        exportData.selectedDateType,
        exportData.dateString
      );
      return;
    }
    //* else send with no date filter
    await sendSelectPropertyNoDate(ctx, exportData.selectedFilterPropertyName, propertyValue);
    return;
  }
  //? check if it's a date property
  if (exportData.selectedFilterPropertyName === 'تاريخ الاستلام') {
    // * check if the filter requires a date string e.g. '2024-01-01'
    if (exportData.dateTypesRequireString.includes(exportData.selectedDateType)) {
      await sendDataWithDateString(ctx);
      return;
    }
    //* check if the filter does not require a date string e.g. 'this_week'
    if (exportData.dateTypesNOString.includes(exportData.selectedDateType)) {
      await sendDateDataWithDataStatement(ctx);
      return;
    }
    return;
  }
}
