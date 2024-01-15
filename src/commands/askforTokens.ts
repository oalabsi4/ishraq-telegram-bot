import inquirer from 'inquirer';

export default async function askForNotionToken() {
  type answersT = { NotionToken: string; askForDatabaseId: string };

  // ❔ Ask for user input.
  const answers = await inquirer.prompt<answersT>([
    {
      type: 'input',
      name: 'NotionToken',
      message: 'What is your Notion api token:',
    },
    {
      type: 'input',
      name: 'askForDatabaseId',
      message: 'What is your database id:',
    },
  ]);

  return answers;
}
