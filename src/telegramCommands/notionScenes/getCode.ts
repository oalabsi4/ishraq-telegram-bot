import { NotionProductSelection, formatSelectionDataForTelegram } from "@/api/notion/fetchSelectPropValues.js";
import { dataToWrite } from "./collectedDataFromUser.js";

export async function displayCodeSelectionList(ctx:any) {
  const codeCHoiceList = formatSelectionDataForTelegram(dataToWrite.priceStructuredData);
  await ctx.reply(`type the number of the code you want:\n${codeCHoiceList}`);
}

export async function handleCodeSelection(ctx:any) {
    if (!ctx.message.text) {
      await ctx.reply('something went wrong');
      await ctx.scene.reenter();
      return;
    }
    const selectedRow = NotionProductSelection(dataToWrite.priceStructuredData, ctx.message.text);
    if (!selectedRow) {
      await ctx.reply('something went wrong');
      await ctx.scene.reenter();
      return;
    }
    dataToWrite.filteredResults = selectedRow;
    dataToWrite.productCode = selectedRow?.code;

    await ctx.scene.enter('getDate');
  }