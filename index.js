var { uploadToGit, mp3ToHls } = require('./uploadToGit.js');
const u2g = () => {
  const pathFileName = 'C:/Users/YNN/Desktop/SyncStorage/case/dai-nguy-doc-sach-nguoi-tap-1.mp3'
  const slugFileName = 'dai-nguy-doc-sach-nguoi-tap-2'
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