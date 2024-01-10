import { Message } from 'telegraf/types';

type RequestsArray = {
  resolve: (message: Message.TextMessage) => void;
  reject: (erro: string) => void;
  id: number;
};
const Requests: RequestsArray[] = [];
export function awaitReply(id: number) {
  const promise = new Promise((resolve, reject) => {
    Requests.push({
      resolve,
      reject,
      id,
    });
  });
  console.log(Requests);
  setTimeout(() => {
    for (let i = 0; i < Requests.length; i++) {
      const request = Requests[i];
      if (request.id !== id) continue;
      request.reject('timeout');
      Requests.splice(i, 1);
    }
  }, 10000);

  return promise as Promise<Message.TextMessage>;
}

export async function checkForRequests(message: Message.TextMessage) {
  const messageId = message.reply_to_message?.message_id;

  for (let i = 0; i < Requests.length; i++) {
    const request = Requests[i];
    if (request.id !== messageId) continue;
    console.log(request);
    request.resolve(message);
    Requests.splice(i, 1);
  }
}
