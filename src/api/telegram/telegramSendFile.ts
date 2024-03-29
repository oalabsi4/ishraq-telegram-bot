import { fileName } from '@utils/fileName.js';
import path from 'path';
import type { Context } from 'telegraf';
import type { Update } from 'telegraf/types';

export async function sendTelegramFile(ctx: Context<Update>, propName: string, caption: string) {
  const filePath = path.join('exported_data', `${fileName(propName)}.xlsx`);
  console.log(filePath);
  await ctx.sendDocument(
    {
      source: filePath,
      filename: `${fileName(propName)}.xlsx`,
    },
    { caption: caption }
  );
}
