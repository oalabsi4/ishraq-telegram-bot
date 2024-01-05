import inquirer from 'inquirer';

export default async function askForPrompt() {
  type answersT = { prompt: string };

  // ❔ Ask for user input.
  const { prompt } = await inquirer.prompt<answersT>([
    {
      type: 'input',
      name: 'prompt',
      message: 'What do you wanna do with the data?:',
    },
  ]);

  return prompt;
}
