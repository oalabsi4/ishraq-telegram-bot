import { Client } from '@notionhq/client';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints.js';
import Log from '@utils/logger.js';
import { NotionRes } from '../../types.js';
import { stringFormulasKeys } from './notionFormulaFetch.js';
import { mappingNotionData } from '@utils/notionDataFormat.js';
import { createExcel } from '@utils/Json2cvs.js';
import path from 'path';
import { fileName } from '@utils/fileName.js';

/**
 * Filters a string Formula property based on various conditions.
 *Export the filtered data to an Excel file.
 *
 * 
 * @param propName - The name of the property.
 * @param propValue - The value to filter.
 * @param dateStatement - The type of date statement e.g. 'on_or_after'.
 * @param date - The date string e.g. '2024-01-01'.
 */
export async function notionStringFormulaFilter(
    propName: (typeof stringFormulasKeys)[keyof typeof stringFormulasKeys],
    propValue: string,
    dateStatement?: 'past_month' | 'past_year' | 'this_week' | 'past_week' | 'on_or_after' | 'on_or_before' | 'after' | 'before',
    date?: string
  ) {
    // Filter based on property value if no date statement is provided
    if (!dateStatement) {
      await notionFormulaNoDateFilter(propName, propValue);
    }
  
    // Filter based on property value and date statement if date statement is one of the predefined types
    if (dateStatement && ['past_month', 'past_year', 'this_week', 'past_week'].includes(dateStatement)) {
      await notionFormulaFilterWithDate(
        propName,
        propValue,
        dateStatement as 'past_month' | 'past_year' | 'this_week' | 'past_week'
      );
    }
  
    // Filter based on property value, date statement, and date if date statement is one of the predefined types
    if (dateStatement && date && ['on_or_after', 'on_or_before', 'after', 'before'].includes(dateStatement)) {
      await notionFormulaFilterWithDateString(
        propName,
        propValue,
        dateStatement as 'on_or_after' | 'on_or_before' | 'after' | 'before',
        date
      );
    }
  }


/**
 * Queries the Notion database using a formula with no date filter.
 * Export the filtered data to an Excel file.
 * 
 * 
 * @param propName - The name of the property (formula) to filter on.
 * @param propValue - The value to match in the formula.
 */
export async function notionFormulaNoDateFilter(
  propName: (typeof stringFormulasKeys)[keyof typeof stringFormulasKeys],
  propValue: string
) {
  // Create a new Notion client
  const notion = new Client({
    auth: process.env.notionToken,
  });

  // Query the database using the formula and property filter
  const data: QueryDatabaseResponse = await notion.databases.query({
    database_id: process.env.dataBaseId,
    filter: {
      and: [
        {
          formula: {
            string: {
              equals: propValue,
            },
          },
          property: propName,
          type: 'formula',
        },
      ],
    },
  });

  try {
    // Map the Notion data to a more usable format
    const results = await mappingNotionData(data.results as NotionRes[]);
    
    // Log success message
    Log.success('Data fetched successfully', 'notionFormulaNoDateFilter');
    
    // Create an Excel file with the mapped data
    const filePath = path.join('exported_data', `${fileName(propName)}.xlsx`);
    createExcel(filePath, results);
  } catch (error) {
    // Log error message and exit the process
    Log.error('Error fetching data:', 'notionFormulaNoDateFilter');
    console.log(error);
    process.exit(1);
  }
}
/**
 * Filter Notion database using a formula and date statement.
 * Export the filtered data to an Excel file.
 *
 * @param propName - The name of the property to filter on.
 * @param propValue - The value of the property to filter on.
 * @param dateStatement - The date statement to use for filtering.
 * @param date - The date value to filter on.
 */
export async function notionFormulaFilterWithDateString(
    propName: string,
    propValue: string,
    dateStatement: 'on_or_after' | 'on_or_before' | 'after' | 'before',
    date: string
  ) {
    // Create a new Notion client instance
    const notion = new Client({
      auth: process.env.notionToken,
    });
  
    // Query the Notion database
    const data: QueryDatabaseResponse = await notion.databases.query({
      database_id: process.env.dataBaseId,
      filter: {
        and: [
          {
            formula: {
              string: {
                equals: propValue,
              },
            },
            property: propName,
            type: 'formula',
          },
          {
            property: 'تاريخ الاستلام',
            date: {
              [dateStatement as 'on_or_after']: date,
            },
          },
        ],
      },
    });
  
    try {
      // Map and process the fetched data
      const results = await mappingNotionData(data.results as NotionRes[]);
      Log.success('Data fetched successfully', 'notionFormulaFilterWithDateString');
  
      // Create the file path for the exported Excel file
      const filePath = path.join('exported_data', `${fileName(propName)}.xlsx`);
  
      // Create the Excel file with the filtered data
      createExcel(filePath, results);
    } catch (error) {
      Log.error(`Error fetching data: ${propName}-${propValue} - date: ${date} `, 'notionFormulaFilterWithDateString');
      console.log(error);
      process.exit(1);
    }
  }

/**
 * Filters data in a Notion database based on a given property name, property value, and date statement.
 * Generates an Excel file with the filtered data.
 *
 * @param propName - The name of the property to filter by.
 * @param propValue - The value of the property to filter by.
 * @param dateStatement - The date statement to filter by ('past_month', 'past_year', 'this_week', 'past_week').
 */
export async function notionFormulaFilterWithDate(
    propName: string,
    propValue: string,
    dateStatement: 'past_month' | 'past_year' | 'this_week' | 'past_week'
  ) {
    // Log filter type and property name
    Log.info(`Filter type is with data but no date string`, 'notionSelectPropDateStatement');
  
    // Create a Notion client
    const notion = new Client({
      auth: process.env.notionToken,
    });
  
    // Query the Notion database
    const data: QueryDatabaseResponse = await notion.databases.query({
      database_id: process.env.dataBaseId,
      filter: {
        and: [
          {
            // Filter by formula property
            formula: {
              string: {
                equals: propValue,
              },
            },
            property: propName,
            type: 'formula',
          },
          {
            // Filter by date property
            property: 'تاريخ الاستلام',
            date: {
              [dateStatement as 'past_year']: {},
            },
          },
        ],
      },
    });
  
    try {
      // Map the Notion data to a desired format
      const results = await mappingNotionData(data.results as NotionRes[]);
      // Log success message
      Log.success('Data fetched successfully', 'notionFormulaFilterWithDate');
      // Generate Excel file with the filtered data
      const filePath = path.join('exported_data', `${fileName(propName)}.xlsx`);
      createExcel(filePath, results);
    } catch (error) {
      // Log error message and exit with code 1
      Log.error(`Error fetching data: ${propName}-${propValue} - date: ${dateStatement} `, 'notionFormulaFilterWithDate');
      console.log(error);
      process.exit(1);
    }
  }