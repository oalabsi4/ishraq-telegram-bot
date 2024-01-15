import type { Message } from 'telegraf/types';

type RequestsArray = {
  resolve: (message: Message.TextMessage) => void;
  reject: (erro: string) => void;
  id: number;
};
const Requests: RequestsArray[] = [];
export function awaitReply(id: number, timeOut = 10000) {
  const promise = new Promise((resolve, reject) => {
    Requests.push({
      resolve,
      reject,
      id,
    });
  });
  setTimeout(() => {
    for (let i = 0; i < Requests.length; i++) {
      const request = Requests[i];
      if (request.id !== id) continue;
      request.reject('timeout');
      Requests.splice(i, 1);
    }
  }, timeOut);

  return promise as Promise<Message.TextMessage>;
}

export function checkForRequests(message: Message.TextMessage) {
  const messageId = message.reply_to_message?.message_id;

  for (let i = 0; i < Requests.length; i++) {
    const request = Requests[i];
    if (request.id !== messageId) continue;
    request.resolve(message);
    Requests.splice(i, 1);
  }
}
