import Log from './logger.js';
import * as XLSX from 'xlsx';

export function createExcel(fileName: string, data: object[]) {
  try {
    const mappedData = (data as NotionDataForExport[]).map(e => {
      const content = {
        'رمز المنتج': e.productCode,
        'شرح الرمز': e.codeDescription,
        'تاريخ الاستلام': e.date,
        الشريك: e.partner,
        الوصف: e.itemTitle,
        النوع: e.itemType,
        العميل: e.client,
        العدد: e.itemCount,
        الصفحات: e.pageCount,
        المدة: e.minutes,
        'الموظف المنتج': e.employee,
        'سعر يدوي': e.manualPrice,
        السعر: e.autoPrice,
        المجموع: e.totalPrice,
        'رابط المنتج': e.productURL,
      };
      return content;
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mappedData);
    // Create a new workbook
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, fileName);
    Log.success('Excel file created successfully', 'createExcel');
  } catch (error) {
    console.log(error);
    Log.error('Error while creating excel file', 'createExcel');
    return;
  }
}

type NotionDataForExport = {
  productCode: string;
  codeDescription: string;
  date: string;
  minutes: number;
  partner: string;
  itemTitle: string;
  itemType: string;
  client: string;
  itemCount: number;
  pageCount: number;
  employee: string;
  manualPrice: number;
  autoPrice: number;
  totalPrice: number;
  productURL: string;
};
