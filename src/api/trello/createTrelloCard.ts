import Log from '@utils/logger.js';
import axios from 'axios';
import type { TrelloCardProps } from './trelloTypes.js';

export async function createTrelloCard(data: TrelloCardProps) {
  const api = process.env.TRELLO_API_KEY;
  const token = process.env.TRELLO_API_TOKEN;

  const newCard = {
    name: data.name,
    desc: data.desc,
    pos: 'top',
    idList: data.idList,
    urlSource: data.urlSource,
    idMembers: data.idMembers,
    idLabels: data.idLabels,
    due: data.due,
  };

  try {
    await axios.post(`https://api.trello.com/1/cards?key=${api}&token=${token}`, newCard);
    Log.success('Trello card created successfully', 'createTrelloCard');
  } catch (error) {
    console.log(error);
    Log.error('Error creating Trello card', 'createTrelloCard');
    process.exit(1);
  }
}
