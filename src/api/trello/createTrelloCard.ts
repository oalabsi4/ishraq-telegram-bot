import Log from '@utils/logger.js';
import axios from 'axios';
import type { TrelloCardProps } from './trelloTypes.js';

export async function createTrelloCard(data: TrelloCardProps, color:'pink'| 'yellow'| 'lime'| 'blue'| 'black'| 'orange'| 'red'| 'purple'| 'sky'| 'green') {
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
   const response =  await axios.post(`https://api.trello.com/1/cards?key=${api}&token=${token}`, newCard);
    Log.success('Trello card created successfully', 'createTrelloCard');
    const cardId = response.data.id
    await updateCardCover(cardId, color)
  } catch (error) {
    console.log(error);
    Log.error('Error creating Trello card', 'createTrelloCard');
    process.exit(1);
  }
}

export async function updateCardCover(cardId:string, color:'pink'| 'yellow'| 'lime'| 'blue'| 'black'| 'orange'| 'red'| 'purple'| 'sky'| 'green') {
  const api = process.env.TRELLO_API_KEY;
  const token = process.env.TRELLO_API_TOKEN;

  try {
    await axios.put(`https://api.trello.com/1/cards/${cardId}?key=${api}&token=${token}`,{
     cover: {color: color,
      brightness: 'light',
      url: '',
      idAttachment:'',
      size:'normal'}
    })
  } catch (error) {
    console.log(error)
  }
  
}