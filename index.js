var shell = require('shelljs');
if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git');
  shell.exit(1);
}

const result = shell.exec('auto.sh D:/GCFA gcfa456')
if (result.code !== 0) {
  shell.echo('Error: Git commit failed');
  shell.exit(1);
}
console.log(result)