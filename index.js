var { uploadToGit } = require('./uploadToGit.js');
const u2g = () => {
  const pathFileName = 'D:/SyncAudioStorage/GroupsTxt/3fb8f41fd5409f6a94013eea51debbf0.txt'
  const slugFileName = 'warning1.txt'
  const envFolder = 'C:/Users/YNN/Downloads'
  const gitSource = 'git@github.com:nhuyk56/SyncStorage1.git'
  const data = uploadToGit({
    envFolder,
    gitSource,
    pathFileName,
    slugFileName
  })
  console.log(data)
}

u2g()