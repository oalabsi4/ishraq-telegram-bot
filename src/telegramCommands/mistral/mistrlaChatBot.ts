import type { Scenetype } from '@/types.js';
import { getMessageAndResponse } from './getMessageAndResponse.js';

export function telegramMistral(scene: Scenetype) {
  scene.enter(getMessageAndResponse);
}
