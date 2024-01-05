import { Client } from '@notionhq/client';
import type { NotionRes } from '../types.js';
import askForNotionToken from '../commands/askforTokens.js';

/**
 * Retrieves data from the Notion database.
 *
 * @return  An array of NotionRes objects representing the data retrieved from the Notion database.
 */
export async function fetchNotionData() {
  const notion = new Client({
    auth: process.env.notionToken ?? (await askForNotionToken()),
  });

  const notionDB = await notion.databases.query({
    database_id: process.env.dataBaseId,
  });
  return notionDB.results as NotionRes[];
}
