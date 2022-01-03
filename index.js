// const { exec } = require("child_process");

// exec("sh ./auto.sh 60-tot-me", {
//     env: { PATH: 'C:\\Program Files\\git\\usr\\bin' },
//     shell: 'C:\\Program Files\\git\\usr\\bin\\bash.exe'
//   }, (error, stdout, stderr) => {
//     if (error) {
//         console.log(`error: ${error.message}`);
//         return;
//     }
//     if (stderr) {
//         console.log(`stderr: ${stderr}`);
//         return;
//     }
//     console.log(`stdout: ${stdout}`);
// });

var shell = require('shelljs');

if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git');
  shell.exit(1);
}

// // Copy files to release dir
// shell.rm('-rf', 'out/Release');
// shell.cp('-R', 'stuff/', 'out/Release');

// // Replace macros in each .js file
// shell.cd('lib');
// shell.ls('*.js').forEach(function (file) {
//   shell.sed('-i', 'v0.1.2', 'v0.1.2', file);
//   shell.sed('-i', /^.*REMOVE_THIS_LINE.*$/, '', file);
//   shell.sed('-i', /.*REPLACE_LINE_WITH_MACRO.*\n/, shell.cat('macro.js'), file);
// });
// shell.cd('..');

// Run external tool synchronously
if (shell.exec('auto.sh 60-tot-me').code !== 0) {
  shell.echo('Error: Git commit failed');
  shell.exit(1);
}