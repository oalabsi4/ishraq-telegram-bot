#!/usr/bin/env node

import gradient from 'gradient-string';
import env from 'dotenv';
import { fetchNotionData } from './api/notion.js';
import { RestructuredData } from './types.js';
env.config();
// ? 👇 title text gradient colors. for more colors see: `https://cssgradient.io/gradient-backgrounds`
const coolGradient = gradient([
  { color: '#FA8BFF', pos: 0 },
  { color: '#2BD2FF', pos: 0.5 },
  { color: '#2BFF88', pos: 1 },
]);

// ? `https://www.kammerl.de/ascii/AsciiSignature.php` 👈 to convert your app's title to ASCII art.
// ? `https://codebeautify.org/javascript-escape-unescape` 👈 escape your title's string for JavaScript.
console.log(
  coolGradient(
    "        _     _             _       __      _   _             \n  /\\/\\ (_)___| |_ _ __ __ _| |   /\\ \\ \\___ | |_(_) ___  _ __  \n /    \\| / __| __| '__/ _` | |  /  \\/ / _ \\| __| |/ _ \\| '_ \\ \n/ /\\/\\ \\ \\__ \\ |_| | | (_| | | / /\\  / (_) | |_| | (_) | | | |\n\\/    \\/_|___/\\__|_|  \\__,_|_| \\_\\ \\/ \\___/ \\__|_|\\___/|_| |_|\n                                                              \n"
  )
);

// 👇 your expected arguments, used for autocomplete and validation.
// const arguments_shape = z
//   .object({
//     fullName: z.string().optional(), // --full-name="string string"
//     age: z.number().optional(), // --age=number
//     help: z.boolean().optional().default(false), // --help=boolean or just --help
//     h: z.boolean().optional().default(false), // -h
//     args: z.array(z.string()).optional(), // positional arguments E.g "C:\Program Files (x86)"
//   })
// !throw an error on extra keys
// .strict();

async function app() {
  // await mistral('tel me a joke')
  // const Loading = progress('Fetching data from Notion database ...');
  let notionData: RestructuredData[];
  try {
    const rows = await fetchNotionData();
    notionData = rows.map(e => ({
      productCode: e.properties['رمز المنتج'].select.name,
      codeDescription: e.properties['شرح الرمز'].formula.string,
      date: e.properties['تاريخ الاستلام'].date.start,
      minutes: e.properties.minutes.formula.number || 0,
      partner: e.properties['الشريك'].formula.string,
      itemTitle: e.properties['الوصف'].title[0].plain_text,
      itemType: e.properties['النوع'].formula.string,
      cient: e.properties['العميل'].select.name,
      itemCount: e.properties['العدد'].number,
      pageCount: e.properties['الصفحات'].number || 0,
      employee: e.properties['الموظف المنتج'].select.name,
      manualPrice: e.properties['سعر يدوي'].number,
      autoPrice: e.properties['السعر'].formula.number,
      totalPrice: e.properties['المجموع'].formula.number,
      productURL: e.properties['رابط المنتج'].url,
    }));

    console.log(notionData);
  } catch (error) {
    // Loading.error('ERROR: fetching data from notion');
    console.log(error);
    process.exit(1);
  }

  // Loading.stop();

  // const looping = true;

  // while (looping) {
  //   const userPrompt = await askForPrompt();
  //   Loading.start('Proccessing data in Mistral ai');
  //   try {
  //     const prompt = `${userPrompt} ${descriptions.join('\n')}`;
  //     Loading.success(await mistral(prompt));
  //   } catch (error) {
  //     Loading.error('ERROR: Prosessing data in Mistral ai');
  //     console.log(error);
  //     process.exit(1);
  //   }
  // }
}

app(); // 🚀 Start the app.
