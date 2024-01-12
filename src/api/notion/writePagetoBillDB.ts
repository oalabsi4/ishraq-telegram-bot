import { Client } from '@notionhq/client';

export async function writePageToBillDB(
  DBid: string,
  RelationPageID: string,
  relationName: 'KMK-PRICING' | 'NO-PARTNER' | 'QYAM-PRICING',
  code: string,
  date: string,
  description: string,
  client: string,
  count: number,
  employee: string,
  URL: string,
  manualPrice?: number,
  duration?: string,
  pages?: number
) {
  const notion = new Client({
    auth: process.env.notionToken,
  });
  const response = await notion.pages.create({
    parent: {
      type: 'database_id',
      database_id: DBid,
    },
    properties: {
      ['رمز المنتج']: {
        select: {
          name: code,
        },
      },
      ['تاريخ الاستلام']: {
        date: {
          start: date,
        },
      },
      ['الوصف']: {
        title: [
          {
            text: {
              content: description,
            },
          },
        ],
      },
      ['العميل']: {
        select: {
          name: client,
        },
      },
      ['العدد']: {
        number: count,
      },
      ['المدة']: {
        rich_text: [
          {
            text: {
              content: duration ?? '',
            },
          },
        ],
      },
      ['الصفحات']: {
        number: pages ?? null,
      },
      ['رابط المنتج']: {
        url: URL,
      },
      ['سعر يدوي']: {
        number: manualPrice ?? null,
      },
      ['الموظف المنتج']: {
        select: {
          name: employee,
        },
      },
      [relationName]: {
        relation: [
          {
            id: RelationPageID,
          },
        ],
      },
    },
  });
  console.log(response);
}
