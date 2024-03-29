import { Client } from '@notionhq/client';
import type { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints.js';
import { createExcel } from '@utils/createExcel.js';
import Log from '@utils/logger.js';
import { mappingNotionData } from '@utils/notionDataFormat.js';
import path from 'path';
import type { NotionRes } from '../../types.js';
import { fileName } from '@utils/fileName.js';

/**
 * Retrieves data from Notion database based on the provided property name and value for a DATE property with date statement and date string.
 *
 * @param propertyName - the name of the property
 * @param  propertyValue - the date to be filtered ex: '2024-01-01'
 * @param  dateStatement - the statement for the date ex: 'on_or_after' | 'on_or_before' | 'after' | 'before'
 * @return  - generates and xlsx file based on the filtered data.
 */
export async function notionDatePropFilterString(
  propertyName: string,
  propertyValue: string,
  dateStatement: 'on_or_after' | 'on_or_before' | 'after' | 'before' | 'equals'
) {
  const notion = new Client({
    auth: process.env.notionToken,
  });
  // Log.info(`filter type is without data`, 'NotionSelectPropNoDate');
  const data: QueryDatabaseResponse = await notion.databases.query({
    database_id: process.env.dataBaseId,
    filter: {
      property: propertyName,
      date: {
        [dateStatement as 'on_or_before']: propertyValue,
      },
    },
  });
  const results = mappingNotionData(data.results as NotionRes[]);
  Log.success('Data fetched successfully', 'NotionSelectPropNoDate');
  const filePath = path.join('exported_data', `${fileName(propertyName)}.xlsx`);
  createExcel(filePath, results);
}

/**
 * Retrieves data from Notion database based on the provided property name and value for a DATE property with date statement.
 *
 * @param propertyName - the name of the property
 * @param  dateStatement - the statement for the date ex: 'past_month' | 'past_year' | 'this_week' | 'past_week'
 * @return  - generates and xlsx file based on the filtered data.
 */
export async function notionDatePropFilterStatement(
  propertyName: string,
  dateStatement: 'past_month' | 'past_year' | 'this_week' | 'past_week'
) {
  const notion = new Client({
    auth: process.env.notionToken,
  });
  // Log.info(`filter type is without data`, 'NotionSelectPropNoDate');
  const data: QueryDatabaseResponse = await notion.databases.query({
    database_id: process.env.dataBaseId,
    filter: {
      property: propertyName,
      date: {
        [dateStatement as 'past_year']: {},
      },
    },
  });
  const results = await mappingNotionData(data.results as NotionRes[]);
  Log.success('Data fetched successfully', 'NotionSelectPropNoDate');
  const filePath = path.join('exported_data', `${fileName(propertyName)}.xlsx`);
  createExcel(filePath, results);
}
