import type { NotionRes } from "src/types.js";
import Log from "./logger.js";



/**
 * Maps Notion data to exportable format.
 *
 * @param  data - The Notion data to be mapped.
 * @return  The mapped data in exportable format.
 */
export function mappingNotionData(data: NotionRes[]) {
    let dataForExport;
    try {
      dataForExport = data.map(e => ({
        productCode: e.properties['رمز المنتج'].select.name,
        codeDescription: e.properties['شرح الرمز'].formula.string,
        date: e.properties['تاريخ الاستلام'].date.start,
        minutes: e.properties.minutes.formula.number || 0,
        partner: e.properties['الشريك'].formula.string,
        itemTitle: e.properties['الوصف'].title[0].plain_text,
        itemType: e.properties['النوع'].formula.string,
        client: e.properties['العميل'].select.name,
        itemCount: e.properties['العدد'].number,
        pageCount: e.properties['الصفحات'].number || 0,
        employee: e.properties['الموظف المنتج'].select.name,
        manualPrice: e.properties['سعر يدوي'].number,
        autoPrice: e.properties['السعر'].formula.number,
        totalPrice: e.properties['المجموع'].formula.number,
        productURL: e.properties['رابط المنتج'].url,
      }));
    } catch (error) {
      Log.error('Error while mapping results to exportable data', 'mappingNotionData');
      Log(error);
      process.exit(1);
    }
    return dataForExport;
  }
  