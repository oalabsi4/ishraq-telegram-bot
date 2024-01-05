import inquirer from 'inquirer';

export default async function askForNotionToken() {
  type answersT = { NotionToken: string };

  // ❔ Ask for user input.
  const { NotionToken } = await inquirer.prompt<answersT>([
    {
      type: 'input',
      name: 'NotionToken',
      message: 'What is your Notion api token:',
    },
  ]);

  return NotionToken;
}
