const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
const md5 = require('md5')
/*********************************************************************************************************************/
const getShellOption = (cwd) => ({ cwd: cwd, shell: 'C:/Program Files/Git/bin/sh.exe', windowsHide: true, silent: true })
const getRawLink = (gitSSH, ID) => {
  const gitSSHSplit = gitSSH.split(':').pop().replace('.git', '')
}

const getHttpsGit = sshGit => sshGit.replace('.git', '').replace('git@github.com:', 'https://github.com/')
const getGitFolder = gitPath => gitPath.split('/').pop()
const getFileName = (inputPath) => inputPath.split('/').pop()
/*********************************************************************************************************************/
const renderUploadMediaToGit = ({ cwd, gitSSH, mp3Path }) => {
  const mp3SplitPath   = mp3Path.split('/')
  const mp3FileName    = mp3SplitPath.pop()
  const Mp3Folder      = mp3SplitPath.pop()
  const currentTime    = (new Date()).valueOf().toString()
  const ID = md5(mp3FileName + currentTime) /** cũng là folder Name chứa git */
  const newCwd = path.join(cwd, ID)

  /** REMOVE FOLDER (ID) & MAKE FOLDER (ID) **/
  shell.exec(`rm -rf ${ID}`, getShellOption(cwd))
  const isMkdir = shell.exec(`mkdir ${ID}`, getShellOption(cwd))
  if (isMkdir.code === 0) {
    const processFile = shell.exec(`ffmpeg -i "${mp3Path}" -codec: copy -start_number 0 -hls_time 5 -hls_list_size 0 -f hls index.m3u8`, getShellOption(newCwd))
    if (processFile.code === 0) {
      /** Git Session */
      shell.exec(`git init`, getShellOption(newCwd))
      shell.exec(`git remote add origin ${gitSSH}`, getShellOption(newCwd))
      shell.exec(`git checkout -b ${ID}`, getShellOption(newCwd))
      shell.exec(`git add .`, getShellOption(newCwd))
      shell.exec(`git commit -m "${ID}"`, getShellOption(newCwd))
      shell.exec(`git push --set-upstream origin ${ID}`, getShellOption(newCwd))
      /** verify File Online*/
      shell.exec(`rm -rf index.m3u8`, getShellOption(newCwd))
      const verifyFile = shell.exec(`git checkout index.m3u8`, getShellOption(newCwd))
      if (verifyFile.code === 0) {
        return { url: `${gitPath}/raw/${md5(slugFileName)}/index.m3u8`, code: true }
      }
    }
  }  
  shell.exec(`rm -rf ${ID}`, getShellOption(cwd))


  // console.log({
  //   mp3SplitPath,
  //   mp3FileName,
  //   Mp3Folder,
  //   currentTime,
  //   ID
  // })

//   var gitPath = gitSource.replace('.git', '').replace('git@github.com:', 'https://github.com/')
//   if (gitSource.includes('git@')) {
//     const host = 'https://github.com/'
//     const gitId = gitSource.split(':').pop() // [git@alias-git-storage]:[nhuyk56/SyncStorage1.git] > nhuyk56/SyncStorage1.git
//       .replace('.git', '') // nhuyk56/SyncStorage1
//     gitPath = host + gitId
//   }
//   var gitFolder = gitPath.split('/').pop()
//   var fs = require('fs');
//   var path = require('path');
//   var shell = require('shelljs');
//   var md5 = require('md5');

//   const shellOption = { cwd: envFolder, shell: 'C:/Program Files/Git/bin/sh.exe', windowsHide: true, silent: false }
//   const brandMD5 = md5(slugFileName)

//   var res = { status: {}, code: false }
//   const setStatus = (bool, step) => {
//     if (!Array.isArray(res.status[step])) {
//       res.status[step] = []
//     }
//     res.status[step].push(bool)
//     console.log(step, bool)
//   }
//   if (!fs.existsSync(pathFileName)) {
//     setStatus(false, '[NOT EXIST] ${pathFileName}')
//     return res
//   } else {
//     res.isDirectory = fs.lstatSync(pathFileName).isDirectory()
//     res.isFile = fs.lstatSync(pathFileName).isFile()
//   }
//   shell.exec(`rm -rf ${gitFolder}`, shellOption)
//   const isGitClone = shell.exec(`git clone ${gitSource}`, shellOption).code === 0
//   setStatus(isGitClone, 'isGitClone')
//   if (isGitClone) {
//     shellOption.cwd = path.join(envFolder, gitFolder)
//   }
//   var ckBrFiName = isGitClone && shell.exec(`git checkout -b ${brandMD5}`, shellOption)
//   setStatus(!ckBrFiName.code, 'ckBrFiName')
//   if (ckBrFiName.code !== 0) {
//     ckBrFiName = shell.exec(`git checkout ${brandMD5}`, shellOption)
//     setStatus(!ckBrFiName.code, 'ckBrFiName')
//     ckBrFiName.isExists = true
//   }
//   if (ckBrFiName.code === 0) {
//     let isCurrentCorrectBrand = shell.exec('git status', shellOption).stdout.includes(`On branch ${brandMD5}`)
//     setStatus(isCurrentCorrectBrand, 'isCurrentCorrectBrand')
//     // const isCopy = isCurrentCorrectBrand && shell.exec(`cp -r ${pathFileName} ${slugFileName}`, shellOption).code === 0

// // #test
//     const isCopy = isCurrentCorrectBrand && shell.exec(`ffmpeg -i "${pathFileName}" -codec: copy -start_number 0 -hls_time 5 -hls_list_size 0 -f hls index.m3u8`, shellOption).code === 0
// // #test

//     setStatus(isCopy, 'isCopy')

//     const gitAddObject = isCopy && shell.exec(`git add .`, shellOption)
//     const gitAddBlank = gitAddObject.code === 0 && gitAddObject.stdout === ''
//     isGitAdd = gitAddObject.code === 0
//     setStatus(isGitAdd, 'isGitAdd')

//     const isGitCommit = isGitAdd && shell.exec(`git commit -m ${slugFileName}`, shellOption).code === 0
//     setStatus(isGitCommit, 'isGitCommit')
//     const isGitPush = isGitCommit && shell.exec(`git push -u origin ${brandMD5}`, shellOption).code === 0
//     setStatus(isGitPush, 'isGitPush')
//     isCurrentCorrectBrand = (isGitPush || gitAddBlank) && shell.exec('git status', shellOption).stdout.includes(`On branch ${brandMD5}`)
//     const hasValidateFile =  shell.exec(`git checkout index.m3u8`, shellOption).code === 0
//     setStatus(isCurrentCorrectBrand, 'isCurrentCorrectBrand')
//     isCurrentCorrectBrand = isCurrentCorrectBrand && shell.exec('git checkout main', shellOption).code === 0
//     setStatus(isCurrentCorrectBrand, 'isCurrentCorrectBrand')
//     if (hasValidateFile) {
//       res.url = `${gitPath}/raw/${md5(slugFileName)}/index.m3u8`
//       res.code = true
//     }
//   }
//   if (isGitClone) {
//     shellOption.cwd = envFolder
//   }
//   const isRemoveFolder = isGitClone && shell.exec(`rm -rf ${gitFolder}`, shellOption).code === 0
//   setStatus(isRemoveFolder, 'isRemoveFolder')
//   return res
}

const test = () => {
  var shell = require('shelljs');
  shell.exec(`git status`)
}

module.exports = {
  renderUploadMediaToGit,
  test
}
// folder
// file
// result
// error
// fix
// multiple
// ffmpeg -i dai-nguy-doc-sach-nguoi-tap-1.mp3 -profile:v baseline -level 3.0 -start_number 0 -hls_time 180 -hls_list_size 0 -f hls index.m3u
// ffmpeg -i dai-nguy-doc-sach-nguoi-tap-1.mp3 -codec: copy -start_number 0 -hls_time 5 -hls_list_size 0 -f hls index.m3u8