import { TrelloClient } from 'trello.js';

export  const trelloClient = new TrelloClient({
    key: process.env.TrelloApiToken,
    token: process.env.TrelloSecret,
    baseRequestConfig: {

    }
  });
export const Boards = {
    VideoBoard : "60e6a69b5343fc3d2b82d5ff",
    DesignBoard:"60e6b8d80634d977dddcbe58"
}
  export async function getBoardsIds() {
    const actions = await trelloClient.cards.createCard({
        idList: "620b63c83140a206c402aa6b",
        name: "testing trello API please ignore :)",
        pos: "top",
        desc: "testing trello API please ignore :)",
        due: "2024-12-1",
        idMembers: ["5d87458d56517b36b7279165"],
        
    })
    console.log(actions.url)
  }