import { fetchPricesData, selectPropValues } from '@/api/notion/fetchSelectPropValues.js';
import { exportNotionSelectPropertyValues } from '@/api/notion/notionSelectFilter.js';
import type { CacheType, PriceListRestructuredData } from '@/types.js';
import { formatTelegramKeyboard } from '@utils/telegramkeyboardFormater.js';

export const dataToWrite = {
  productCode: '',
  productDate: '',
  productDescription: '',
  selectedClient: '',
  productCount: 0,
  productLink: '',
  productPages: 0 as number | undefined,
  productManualPrice: 0 as number | undefined,
  productDuration: '' as string | undefined,
  productEmployee: '',
  priceListName: 'KMK-PRICING' as 'KMK-PRICING' | 'NO-PARTNER' | 'QYAM-PRICING',
  partnerSelection: 'KMK' as 'KMK' | 'QYAM' | 'UNKNOWN',
  priceStructuredData: [] as PriceListRestructuredData[],
  selectedType: '',
  filteredResults: null as PriceListRestructuredData | null,
};
export const dateRegex = /(20[0-9]{2})\s*-\s*(10|11|12|0[1-9])\s*-\s*(3[0-1]|2[0-9]|1[0-9]|0[1-9])\s*$/; //ex: 2022-01-01 (with zeros)

const cache: CacheType = {
  priceList: { data: null, time: 0 },
  uniqueProductCodes: { data: null, time: 0 },
  chooseTypeKeyboard: { data: null, time: 0 },
  clientsToSelectFrom: { data: null, time: 0 },
  employeeToSelectFrom: { data: null, time: 0 },
  clientsKeyboard: { data: null, time: 0 },
  employeesKeyboard: { data: null, time: 0 },
};
const cacheClearTime = 5 * 60 * 1000;
export const PriceListDataCache = {
  async getPriceList() {
    if (!cache.priceList.data || Date.now() - cache.priceList.time > cacheClearTime) {
      cache.priceList.data = await fetchPricesData(dataToWrite.partnerSelection);
      cache.priceList.time = Date.now();
      return cache.priceList.data;
    }
    return cache.priceList.data;
  },
  async getUniqueProductCodes() {
    if (!cache.uniqueProductCodes.data || Date.now() - cache.uniqueProductCodes.time > cacheClearTime) {
      cache.uniqueProductCodes.data = selectPropValues(await PriceListDataCache.getPriceList());
      cache.uniqueProductCodes.time = Date.now();
      return cache.uniqueProductCodes.data;
    }
    return cache.uniqueProductCodes.data;
  },
  async getChooseTypeKeyboard() {
    if (!cache.chooseTypeKeyboard.data || Date.now() - cache.chooseTypeKeyboard.time > cacheClearTime) {
      cache.chooseTypeKeyboard.data = formatTelegramKeyboard(await PriceListDataCache.getUniqueProductCodes());
      cache.chooseTypeKeyboard.time = Date.now();
      return cache.chooseTypeKeyboard.data;
    }
    return cache.chooseTypeKeyboard.data;
  },
  async getClientsToSelectFrom() {
    if (!cache.clientsToSelectFrom.data || Date.now() - cache.clientsToSelectFrom.time > cacheClearTime) {
      cache.clientsToSelectFrom.data = await exportNotionSelectPropertyValues('clients', true);
      cache.clientsToSelectFrom.time = Date.now();
      return cache.clientsToSelectFrom.data;
    }
    return cache.clientsToSelectFrom.data;
  },
  async getEmployeeToSelectFrom() {
    if (!cache.employeeToSelectFrom.data || Date.now() - cache.employeeToSelectFrom.time > cacheClearTime) {
      cache.employeeToSelectFrom.data = await exportNotionSelectPropertyValues('employees', true);
      cache.employeeToSelectFrom.time = Date.now();
      return cache.employeeToSelectFrom.data;
    }
    return cache.employeeToSelectFrom.data;
  },
  async getClientsKeyboard() {
    if (!cache.clientsKeyboard.data || Date.now() - cache.clientsKeyboard.time > cacheClearTime) {
      cache.clientsKeyboard.data = formatTelegramKeyboard((await PriceListDataCache.getClientsToSelectFrom()) as string[]);
      cache.clientsKeyboard.time = Date.now();
      return cache.clientsKeyboard.data;
    }
    return cache.clientsKeyboard.data;
  },
  async getEmployeesKeyboard() {
    if (!cache.employeesKeyboard.data || Date.now() - cache.employeesKeyboard.time > cacheClearTime) {
      cache.employeesKeyboard.data = formatTelegramKeyboard((await PriceListDataCache.getEmployeeToSelectFrom()) as string[]);
      cache.employeesKeyboard.time = Date.now();
      return cache.employeesKeyboard.data;
    }
    return cache.employeesKeyboard.data;
  },
};
