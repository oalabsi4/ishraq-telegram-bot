#!/usr/bin/env node

import env from 'dotenv';
import gradient from 'gradient-string';
import { telegram } from './api/telegram.js';
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
   await telegram()

}

app(); // 🚀 Start the app.
 