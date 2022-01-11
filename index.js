var { uploadToGit, mp3ToHls } = require('./uploadToGit.js');
const u2g = () => {
  const pathFileName = 'C:/Users/YNN/Desktop/SyncStorage/case/dai-nguy-doc-sach-nguoi-tap-1.mp3'
  const slugFileName = 'dai-nguy-doc-sach-nguoi-tap-4'
  const envFolder = 'C:/Users/YNN/Downloads'
  const gitSource = 'git@alias-git-storage:nhuyk56/SyncStorage1.git'
  const data = uploadToGit({
    envFolder,
    gitSource,
    pathFileName,
    slugFileName
  })
  console.log(data)
}
u2g()

/*
  mkdir {folderName}
  @todo: copy file/ make hsl file/...
  git init
  git remote add origin {git@alias-git-storage:nhuyk56/SyncStorage1.git}
  git checkout -b {newBrandName}
  git add .
  git commit -m "{newBrandName}"
  git push --set-upstream origin {newBrandName}
  @todo: verify để sure file đã lên github
*/
