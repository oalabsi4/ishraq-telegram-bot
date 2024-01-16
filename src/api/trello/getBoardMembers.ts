import axios from 'axios';
import type { BoardMembersResponseType } from './trelloTypes.js';
import Log from '@utils/logger.js';

export async function getBoardMembers(BoardId: string) {
  const api = process.env.TRELLO_API_KEY;
  const token = process.env.TRELLO_API_TOKEN;

  try {
    const response = await axios.get(`https://api.trello.com/1/boards/${BoardId}/members?key=${api}&token=${token}`, {
      headers: {
        Accept: 'application/json',
      },
    });
    const data = response.data as BoardMembersResponseType;
    const usefulData = data.map(e => {
      return { name: e.fullName, id: e.id };
    });
    Log.success('Board members fetched successfully', 'getBoardMembers');
    return usefulData;
  } catch (error) {
    console.log(error);
    Log.error('Error getting board members:', 'getBoardMembers');
    process.exit(1);
  }
}
