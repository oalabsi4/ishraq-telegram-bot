import { getBoardMembers } from "@/api/trello/getBoardMembers.js";
import { Boards } from "@/api/trello/trello.js";
import type { TrelloCardProps } from "@/api/trello/trelloTypes.js";

export const boardChoices = Object.values(Boards).map((e)=>{
    return `${e.boardId}-${e.lists.id}`
})

export const fetchData = {
    BoardId:'',
    membersId:['null'],
    color:''
}
export const cardData:TrelloCardProps = {
    desc:'',
    name:'',
    idList:'',
    urlSource:'',
    idMembers:[],
    idLabels:[],
    due:''

}
const cacheClearTime = 60 * 60 * 1000;

 const createCardCache :CreateCardCache = {
    boardMembers: { data: null, time: 0 ,id:''},

}


export const dataFromTrello = {
    async getBoardMembers() {
        if (!createCardCache.boardMembers.data || Date.now() - createCardCache.boardMembers.time > cacheClearTime || createCardCache.boardMembers.id !== fetchData.BoardId) {
          createCardCache.boardMembers.data =fetchData.BoardId.length> 3 ? await getBoardMembers(fetchData.BoardId):[{name:'No members',id:'No members'}]
          createCardCache.boardMembers.time =fetchData.BoardId.length> 3 ? Date.now() : cacheClearTime+1
          createCardCache.boardMembers.id =fetchData.BoardId
          return createCardCache.boardMembers.data;
        }
        return createCardCache.boardMembers.data; 
    },
}




type CreateCardCache = {
    boardMembers:{
        data: {name:string,id:string}[] | null
        time: number
        id:string
    },
}