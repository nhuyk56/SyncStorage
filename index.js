var { renderUploadMediaToGit, mp3ToHls } = require('./uploadToGit.js');
const u2g = () => {
  const mp3Path = 'C:/Users/YNN/Desktop/SyncStorage/case/dai-nguy-doc-sach-nguoi-tap-1.mp3'
  const cwd = 'C:/Users/YNN/AppData/Local/Temp'
  const gitSSH = 'git@github.com----nhuyk56:nhuyk56/SyncStorage1.git'
  const data = renderUploadMediaToGit({ cwd, gitSSH, mp3Path })
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

  remove Folder, make folder
  process file/ copy file
  git process
  verify file has been upload
  remove Folder
*/
