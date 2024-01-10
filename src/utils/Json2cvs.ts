import { writeFile } from 'fs/promises';
import json2csvAsync from 'json-2-csv';
import Log from './logger.js';

async function writeCSVFile(fileName: string, data: object[]) {
  const csvData = json2csvAsync.json2csv(data);
  await writeFile(fileName, csvData, 'utf8');
}

export const createExcel = async (fileName: string, dataToWrite: object[]) => {
  try {
    await writeCSVFile(fileName, dataToWrite);

    Log.success(`File ${fileName} created successfully.`, 'createExcel');
  } catch (error) {
    Log.error('Error creating Excel file:', 'createExcel');
    Log(error);
    process.exit(1);
  }
};
