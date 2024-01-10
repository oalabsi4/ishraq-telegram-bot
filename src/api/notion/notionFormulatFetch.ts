import { Client } from '@notionhq/client';
import { NotionRes } from 'src/types.js';
import Log from '@utils/logger.js';

export const stringFormulasKeys: StringFormulasKeys = {
  tableHelper: 'دليل استعمال الجدول',
  partner: 'الشريك',
  metric: 'metric',
  codeDescription: 'شرح الرمز',
  type : 'النوع'
};
type StringFormulasKeys = {
  tableHelper: 'دليل استعمال الجدول';
  partner: 'الشريك';
  metric: 'metric';
  codeDescription: 'شرح الرمز';
  type : 'النوع';
};


/**
 * Fetches string formula values for a given property name.
 *
 * @param propertyName - The name of the property whose string formula values are to be fetched.
 * @return  - A promise that resolves to an array of string formula values.
 */
export async function fetchStringFormulaValues(propertyName: (typeof stringFormulasKeys)[keyof typeof stringFormulasKeys]) {
  const notion = new Client({
    auth: process.env.notionToken, // ?? answers.NotionToken,
  });

  const notionDB = await notion.databases.query({
    database_id: process.env.dataBaseId,
    filter: {
      and: [
        {
          formula: {
            string: {
              is_not_empty: true,
            },
          },
          property: propertyName,
          type: 'formula',
        },
      ],
    },
  });

  const results = notionDB.results as NotionRes[];
  try {
      const valueArray = results.map(item => item.properties[propertyName].formula.string);
      Log.success(`Data fetched successfully for ${propertyName}`, 'fetchStringFormulaValues');
      return valueArray
  } catch (error) {
    Log.error(`Error while fetching data for:${propertyName} `, 'fetchStringFormulaValues');
    console.log(error)
    process.exit(1);
  }
}




