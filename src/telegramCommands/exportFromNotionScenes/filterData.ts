import { fetchStringFormulaValues } from '@/api/notion/notionFormulaFetch.js';
import { exportNotionSelectPropertyValues } from '@/api/notion/notionSelectFilter.js';
import type { TeleggramInlineKeyboard } from '@/types.js';

export const exportData = {
  propertiesNames: ['النوع', 'العميل', 'الموظف المنتج', 'الشريك', 'تاريخ الاستلام'],
  availableDateTypes: [
    'after',
    'before',
    'equals',
    'on_or_after',
    'on_or_before',
    'past_month',
    'past_week',
    'past_year',
    'this_week',
  ],
  dateTypesRequireString: ['on_or_after', 'on_or_before', 'after', 'before', 'equals'],
  dateTypesNOString: ['past_month', 'past_week', 'past_year', 'this_week'],
  selectedFilterPropertyName: '',
  clientValue: '',
  employeeValue: '',
  typeValue: '',
  partnerValue: '',
  selectedDateType: '',
  dateString: '',
};

const exportDataCache: ExportDataCache = {
  clientValues: { data: null, time: 0 },
  employeeValues: { data: null, time: 0 },
  typesValues: { data: null, time: 0 },
  partnersValues: { data: null, time: 0 },
};

const cacheClearTime = 5 * 60 * 1000;

export const dataToCompleteExport = {
  async getClientsToSelectFrom() {
    if (!exportDataCache.clientValues.data || Date.now() - exportDataCache.clientValues.time > cacheClearTime) {
      exportDataCache.clientValues.data = await exportNotionSelectPropertyValues('clients', true);
      exportDataCache.clientValues.time = Date.now();
      return exportDataCache.clientValues.data;
    }
    return exportDataCache.clientValues.data;
  },
  async getEmployeeToSelectFrom() {
    if (!exportDataCache.employeeValues.data || Date.now() - exportDataCache.employeeValues.time > cacheClearTime) {
      exportDataCache.employeeValues.data = await exportNotionSelectPropertyValues('employees', true);
      exportDataCache.employeeValues.time = Date.now();
      return exportDataCache.employeeValues.data;
    }
    return exportDataCache.employeeValues.data;
  },
  async getTypesToSelectFrom() {
    if (!exportDataCache.typesValues.data || Date.now() - exportDataCache.typesValues.time > cacheClearTime) {
      exportDataCache.typesValues.data = await fetchStringFormulaValues('النوع');
      exportDataCache.typesValues.time = Date.now();
      return exportDataCache.typesValues.data;
    }
    return exportDataCache.typesValues.data;
  },
  async getPartnersValues() {
    if (!exportDataCache.partnersValues.data || Date.now() - exportDataCache.partnersValues.time > cacheClearTime) {
      exportDataCache.partnersValues.data = await fetchStringFormulaValues('الشريك');
      exportDataCache.partnersValues.time = Date.now();
      return exportDataCache.partnersValues.data;
    }
    return exportDataCache.partnersValues.data;
  },
};

type ExportDataCache = {
  clientValues: {
    data: string[] | TeleggramInlineKeyboard | null;
    time: number;
  };
  employeeValues: {
    data: string[] | TeleggramInlineKeyboard | null;
    time: number;
  };
  typesValues: {
    data: string[] | null;
    time: number;
  };
  partnersValues: {
    data: string[] | null;
    time: number;
  };
};
