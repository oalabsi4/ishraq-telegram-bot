#!/usr/bin/env node

import { CONSTANTS } from '@utils/cli-utils.js';
import env from 'dotenv';
import gradient from 'gradient-string';
import path from 'path';
import { telegram } from './api/telegram/telegram.js';

env.config({
  path: path.join(CONSTANTS.projectRoot, '.env'),
});
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
    `\n __   ______   __  __   ______   ______   ______       ______   ______   ______ \n/\\ \\ /\\  ___\\ /\\ \\_\\ \\ /\\  == \\ /\\  __ \\ /\\  __ \\     /\\  == \\ /\\  __ \\ /\\__  _\\\n\\ \\ \\\\ \\___  \\\\ \\  __ \\\\ \\  __< \\ \\  __ \\\\ \\ \\/\\_\\    \\ \\  __< \\ \\ \\/\\ \\\\/_/\\ \\/\n \\ \\_\\\\/\\_____\\\\ \\_\\ \\_\\\\ \\_\\ \\_\\\\ \\_\\ \\_\\\\ \\___\\_\\    \\ \\_____\\\\ \\_____\\  \\ \\_\\\n  \\/_/ \\/_____/ \\/_/\\/_/ \\/_/ /_/ \\/_/\\/_/ \\/___/_/     \\/_____/ \\/_____/   \\/_/\n                                                                                `
  )
);

function app() {
  telegram();
}

app(); // 🚀 Start the app.
