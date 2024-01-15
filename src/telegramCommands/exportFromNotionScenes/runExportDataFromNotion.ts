import type { CTX } from '@/types.js';
import { exportData } from './filterData.js';
import { notionDatePropFilterString } from '@/api/notion/notionDateFilter.js';

export async function runExportDataFromNotion(ctx: CTX) {
  //   const loading = await ctx.reply('Loading...');
  if (['النوع', 'الشريك'].includes(exportData.selectedFilterPropertyName)) {
    if (exportData.dateTypesNOString.includes(exportData.selectedDateType)) {
      //todo add formula export function with not date string
      return;
    }
    if (exportData.dateTypesRequireString.includes(exportData.selectedDateType)) {
      //todo add formula export function  WITH date string
      return;
    }
    // todo run export function with no date filter
    return;
  }

  if (['العميل', 'الموظف المنتج'].includes(exportData.selectedFilterPropertyName)) {
    if (exportData.dateTypesNOString.includes(exportData.selectedDateType)) {
      //todo add select export function with not date string
      return;
    }
    if (exportData.dateTypesRequireString.includes(exportData.selectedDateType)) {
      //todo add select export function  WITH date string
      return;
    }
    // todo run export function with no date filter
    return;
  }
  if (exportData.selectedFilterPropertyName === 'تاريخ الاستلام') {
    //todo add select export function with not date string
    if (exportData.dateTypesRequireString.includes(exportData.selectedDateType)) {
      console.log(exportData.selectedFilterPropertyName);
      await notionDatePropFilterString(
        exportData.selectedFilterPropertyName,
        exportData.dateString,
        exportData.selectedDateType as 'after' | 'before' | 'equals' | 'on_or_after' | 'on_or_before'
      );
      return;
    }
    if (exportData.dateTypesRequireString.includes(exportData.selectedDateType)) {
      //todo add select export function  WITH date string
      return;
    }

    // todo error handling
    return;
  }
}
