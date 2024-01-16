import { Client } from '@notionhq/client';
import type { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints.js';
import { createExcel } from '@utils/Json2cvs.js';
import path from 'path';
import type { NotionRes, TeleggramInlineKeyboard } from '../../types.js';
import Log from '@utils/logger.js';
import { mappingNotionData } from '@utils/notionDataFormat.js';
import { fileName } from '@utils/fileName.js';

/**
 * Retrieves data from the Notion database.
 *
 * @return  An array of NotionRes objects representing the data retrieved from the Notion database.
 */
export async function fetchNotionData<T = NotionRes>(dataBaseId: string) {
  // const answers = await askForNotionToken();
  const notion = new Client({
    auth: process.env.notionToken, // ?? answers.NotionToken,
  });

  const notionDB = await notion.databases.query({
    database_id: dataBaseId, // ?? answers.askForDatabaseId,
  });
  return notionDB.results as T[];
}

/**
 * Generates a Notion property array based on the specified type.
 *
 * @param type - The type of Notion property array to generate. Valid values are: 'clients', 'partners', 'employees'.
 * @return  The generated Notion property array.
 */
export async function exportNotionSelectPropertyValues(type: 'clients' | 'partners' | 'employees', array = false) {
  const rows = await fetchNotionData(process.env.dataBaseId);

  try {
    const notionPropertyArray = rows.map(e => {
      const propertyValue =
        type === 'clients' && e.properties['العميل'].select !== null && e.properties['العميل'].select.name !== ''
          ? e.properties['العميل'].select.name
          : type === 'partners' && e.properties['الشريك'].formula.string !== '' && e.properties['الشريك'].formula.string !== null
          ? e.properties['الشريك'].formula.string
          : type === 'employees' &&
            e.properties['الموظف المنتج'].select !== null &&
            e.properties['الموظف المنتج'].select.name !== ''
          ? e.properties['الموظف المنتج'].select.name
          : 'NO_DATA';
      return propertyValue;
    });

    const uniquePropertySet = new Set(notionPropertyArray);
    const uniquePropertyArray = Array.from(uniquePropertySet).filter(
      value => uniquePropertySet.has(value) && value !== 'NO_DATA'
    );

    const notionProperty: TeleggramInlineKeyboard = uniquePropertyArray.map(e => {
      return [{ text: e, callback_data: e }];
    });
    notionProperty.push([{ text: 'back', callback_data: 'back_to_main_export' }]);
    return array ? uniquePropertyArray : notionProperty;
  } catch (error) {
    console.log(error);
    if (!array)
      return [[{ text: 'No_data', callback_data: 'NO_DATA' }], [{ text: 'back', callback_data: 'back_to_main_export' }]];
    else return [[{ text: 'back', callback_data: 'cancel' }]];
  }
}

/**
 * Retrieves data from Notion database based on the provided property name and value for a Select property without date.
 *
 * @param propertyName - The name of the property to filter the data by.
 * @param propertyValue - The value of the property to filter the data by.
 * @return  - generates and xlsx file based on the filtered data.
 */
export async function notionSelectPropNoDate(propertyName: string, propertyValue: string) {
  const notion = new Client({
    auth: process.env.notionToken,
  });

  Log.info(`filter type is without data`, 'NotionSelectPropNoDate');
  const data: QueryDatabaseResponse = await notion.databases.query({
    database_id: process.env.dataBaseId,
    filter: {
      property: propertyName,
      select: {
        equals: propertyValue,
      },
    },
  });
  const results = await mappingNotionData(data.results as NotionRes[]);
  Log.success('Data fetched successfully', 'NotionSelectPropNoDate');
  const filePath = path.join('exported_data', `${fileName(propertyName)}.xlsx`);
  createExcel(filePath, results);
}

/**
 * Retrieves data from Notion database based on the provided property name and value for a Select property with date statement.
 *
 * @param  propertyName - the name of the property
 * @param  propertyValue - the value of the property
 * @param dateStatement - the date statement ex: 'past_month', 'past_year', 'this_week', 'past_week'
 * @return  - generates and xlsx file based on the filtered data.
 */
export async function notionSelectPropDateStatement(
  propertyName: string,
  propertyValue: string,
  dateStatement: 'past_month' | 'past_year' | 'this_week' | 'past_week'
) {
  Log.info(`filter type is with data but no date string`, 'notionSelectPropDateStatement');
  const notion = new Client({
    auth: process.env.notionToken,
  });

  const data: QueryDatabaseResponse = await notion.databases.query({
    database_id: process.env.dataBaseId,
    filter: {
      and: [
        {
          property: propertyName,
          select: {
            equals: propertyValue,
          },
        },
        {
          property: 'تاريخ الاستلام',
          date: {
            [dateStatement as 'past_year']: {},
          },
        },
      ],
    },
  });
  const results = await mappingNotionData(data.results as NotionRes[]);
  Log.success('Data fetched successfully', 'notionSelectPropDateStatement');
  const filePath = path.join('exported_data', `${fileName(propertyName)}.xlsx`);
  createExcel(filePath, results);
}

/**
 * Retrieves data from Notion database based on the provided property name and value for a Select property with date statement and date string.
 *
 * @param  propertyname - The name of the property to filter on.
 * @param  propertyValue - The value of the property to filter on.
 * @param  dateString - The date string ex 2024-01-01.
 * @param dateStatement - The date statement ex: 'on_or_after', 'on_or_before', 'after', 'before'
 * @return  - generates and xlsx file based on the filtered data.
 */
export async function notionSelectPropDateString(
  propertyname: string,
  propertyValue: string,
  dateString: string,
  dateStatement: 'on_or_after' | 'on_or_before' | 'after' | 'before' | 'equals'
) {
  const notion = new Client({
    auth: process.env.notionToken,
  });

  const data: QueryDatabaseResponse = await notion.databases.query({
    database_id: process.env.dataBaseId,
    filter: {
      and: [
        {
          property: propertyname,
          select: {
            equals: propertyValue,
          },
        },
        {
          property: 'تاريخ الاستلام',
          date: {
            [dateStatement as 'on_or_after']: dateString,
          },
        },
      ],
    },
  });
  const results = await mappingNotionData(data.results as NotionRes[]);
  Log.success('Data fetched successfully', 'notionSelectPropDateString');
  const filePath = path.join('exported_data', `${fileName(propertyname)}.xlsx`);
  createExcel(filePath, results);
}
