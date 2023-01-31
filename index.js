var shell = require('shelljs');
var md5 = require('md5');
if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git');
  shell.exit(1);
}

const pathFileName = 'D:/YOUTUBE-NNT/50-xuyen-thu-yeu-nam-phu/106455-tap-1-chuong-1---chuong-21.ps1'
const slugFileName = '106455-tap-1-chuong-1---chuong-21.ps1'

// shell.exec('ssh-add %USERPROFILE%/.ssh/nhuyk56')
// shell.exec('ssh -T git@github.com')
// shell.exec('git checkout main')
// shell.exec(`git checkout ${slugFileName}`)
// shell.exec(`git checkout -b ${slugFileName}`)
// shell.exec('git status')
// shell.cp('-r', pathFileName, slugFileName)
// shell.exec(`git add ${slugFileName}`)
// shell.exec(`git commit -m ${slugFileName}`)
// shell.exec(`git push -u origin ${slugFileName}`)
// shell.exec('git status')
// shell.exec('git checkout main')

const result = shell.exec(`auto.sh ${md5(slugFileName)} ${pathFileName} ${slugFileName}`)
if (result.code !== 0) {
  shell.echo('Error: Git commit failed');
  shell.exit(1);
}
console.log(`https://github.com/nhuyk56/SyncStorage/raw/${md5(slugFileName)}/${slugFileName}`)



// folder
// file
// result
// error
// fix
// multiple1