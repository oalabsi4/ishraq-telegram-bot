import { createTrelloCard } from "@/api/trello/createTrelloCard.js";
import type { CTX } from "@/types.js";
import { cardData, fetchData } from "./cardData.js";
import Log from "@utils/logger.js";


export async function createCardFunction(ctx:CTX) {
    try {

       await  createTrelloCard(cardData,fetchData.color as "pink" | "yellow" | "lime" | "blue" | "black" | "orange" | "red" | "purple" | "sky" | "green")
    } catch (error) {
        Log.error('Error creating Trello card', 'createCardFunction');
        ctx.scene.leave()
    }
}