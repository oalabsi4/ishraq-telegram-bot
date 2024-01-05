export async function mistral(prompt: string) {
  const mistralToken = process.env.mistralToken;
  const mistralUrl = 'https://api.mistral.ai/v1/chat/completions';
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${mistralToken}`,
  };
  const data = {
    model: 'mistral-tiny',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  };
  const res = await fetch(mistralUrl, { headers, body: JSON.stringify(data), method: 'post' });
  const json = (await res.json()) as MistralResponse;
  return json.choices[0].message.content;
}

type Choices = {
  index: number;
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
};

type MistralResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Choices[];
};
