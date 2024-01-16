import type { NotionPriceListRes, PriceListRestructuredData } from '@/types.js';
import { fetchNotionData } from './notionSelectFilter.js';

export async function fetchPricesData(dateBase: 'KMK' | 'QYAM' | 'UNKNOWN') {
  const databaseID =
    dateBase === 'KMK' ? process.env.kmkPricesId : dateBase === 'QYAM' ? process.env.qyamPricesId : process.env.unknowPrisesId;
  return await fetchNotionData<NotionPriceListRes>(databaseID);
}

export function selectPropValues(data: NotionPriceListRes[]) {
  const formattedData = data.map(e => e.properties['النوع'].select?.name ?? 'EMPTY');
  // remove duplicates
  const uniquePropertyArray = Array.from(new Set(formattedData));
  return uniquePropertyArray;
}

export function filterPricesFormat(typeName: string, data: NotionPriceListRes[]) {
  const filteredData = data.filter(e => e.properties['النوع'].select.name === typeName);
  const RestructuredData: PriceListRestructuredData[] = filteredData.map(e => ({
    code: e.properties['الرمز'].rich_text[0].text.content,
    description: e.properties['الشرح'].title[0].text.content,
    metric: e.properties['وحدة القياس'].select.name,
    type: e.properties['النوع'].select.name,
    price: e.properties['السعر'].number ?? 0,
    notes: e.properties['ملاحظة'].rich_text?.[0]?.plain_text ?? '',
    pageID: e.id,
  }));

  return RestructuredData;
}

export function formatSelectionDataForTelegram(data: PriceListRestructuredData[]) {
  const selectionListFormat = data.map((e, i) => {
    return `${i + 1} - ${e.code} - ${e.description}`;
  });
  return selectionListFormat.join('\n');
}

export function NotionProductSelection(data: PriceListRestructuredData[], selectedIndex: string) {
  selectedIndex = selectedIndex.trim();
  const asNumber = +selectedIndex - 1;
  const isNumberCheck = isValidNumber(asNumber);
  if (!isNumberCheck || asNumber < 0 || data.length < asNumber) {
    return null;
  }
  const selectedData = data[asNumber];
  if (!selectedData) {
    return null;
  }
  return selectedData;
}

export function isValidNumber(num: unknown): num is number {
  return typeof num === 'number' && !Number.isNaN(num) && Number.isFinite(num);
}
// export function
