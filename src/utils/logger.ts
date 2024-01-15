import chalk from 'chalk';

export default function Log(...args: unknown[]) {
  console.log(args);
}
function format(title: string, text: string, trace: string, color: 'red' | 'yellow' | 'green' | 'cyan') {
  const textLength = 100 - text.length < 0 ? 3 : 100 - text.length;

  if (trace) {
    const traceFormat = trace ? chalk.dim('<' + trace + '>') : '';
    console.log(title, chalk[color](text), chalk.dim('.'.repeat(textLength)), traceFormat);
    return;
  }
  console.log(title, chalk[color](text));
}
Log.warn = function (text: string, trace = '') {
  const title = chalk.bold.yellow.inverse('   WARNING   ');
  format(title, text, trace, 'yellow');
};
Log.error = function (text: string, trace = '') {
  const title = chalk.bold.red.inverse('   ERROR     ');
  format(title, text, trace, 'red');
};
Log.success = function (text: string, trace = '') {
  const title = chalk.bold.green.inverse('   SUCCESS   ');
  format(title, text, trace, 'green');
};

Log.info = function (text: string, trace = '') {
  const title = chalk.bold.blue.inverse('   INFO      ');
  format(title, text, trace, 'cyan');
};

// Log.warn('ay kalam ay kalam ay kalam ay kalam', 'ay kalam');
// Log.success('ay kalam ay kalam ay kalam', 'ay kalam');
// Log.error('ay kalam ay kalam', 'ay kalam');
// Log.info('ay kalam', 'ay kalam');
