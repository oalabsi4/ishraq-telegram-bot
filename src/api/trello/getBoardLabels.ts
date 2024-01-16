import axios from 'axios';
import type { BoardLabelsResponseType } from './trelloTypes.js';
import Log from '@utils/logger.js';

export async function getBoardLabels(boardId: string) {
  const api = process.env.TRELLO_API_KEY;
  const token = process.env.TRELLO_API_TOKEN;
  try {
    const response = await axios.get(`https://api.trello.com/1/boards/${boardId}/labels?key=${api}&token=${token}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    const data = response.data as BoardLabelsResponseType;
    const usefulData = data.map(e => {
      return { name: e.name, id: e.id };
    });
    Log.success('Board labels fetched successfully', 'getBoardLabels');
    return usefulData;
  } catch (error) {
    console.log(error);
    Log.error('Error getting board labels:', 'getBoardLabels');
    process.exit(1);
  }
}
