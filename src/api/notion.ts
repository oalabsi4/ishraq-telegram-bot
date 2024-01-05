import { Client } from '@notionhq/client';
import type { NotionRes } from '../types.js';
import askForNotionToken from '../commands/askforTokens.js';

/**
 * Retrieves data from the Notion database.
 *
 * @return  An array of NotionRes objects representing the data retrieved from the Notion database.
 */
export async function fetchNotionData() {
  const answers = await askForNotionToken();
  const notion = new Client({
    auth: process.env.notionToken ?? answers.NotionToken,
  });

  const notionDB = await notion.databases.query({
    database_id: process.env.dataBaseId ?? answers.askForDatabaseId,
  });
  return notionDB.results as NotionRes[];
}
