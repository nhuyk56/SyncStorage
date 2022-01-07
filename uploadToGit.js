const uploadToGit= (pathFileName, slugFileName) => {
  var fs = require('fs');
  var shell = require('shelljs');
  var md5 = require('md5');

  const shellOption = { shell: 'C:/Program Files/Git/bin/sh.exe', windowsHide: true, silent: true }
  // const pathFileName = 'D:/YOUTUBE-NNT/0YOUUTBE-bat-dau-ban-thuong-bay-cai-the-nhan-vat/107727-tap-26-chuong-598---chuong-624.ps1'
  // const slugFileName = '107727-tap-26-chuong-598---chuong-624'
  const brandFileName = md5(slugFileName)

  var res = { status: ['init'], code: false }
  const setStatus = (bool, step) => res.status.push(`${bool ? 'success' : 'failed'} ${step}`)
  if (!fs.existsSync(pathFileName)) {
    setStatus(false, '[NOT EXIST] ${pathFileName}')
    return res
  } else {
    res.isDirectory = fs.lstatSync(pathFileName).isDirectory()
    res.isFile = fs.lstatSync(pathFileName).isFile()
  }
  var ckBrFiName = shell.exec(`git checkout -b ${brandFileName}`, shellOption)
  setStatus(!ckBrFiName.code, 'ckBrFiName')
  if (ckBrFiName.code !== 0) {
    ckBrFiName = shell.exec(`git checkout ${brandFileName}`, shellOption)
    setStatus(!ckBrFiName.code, 'ckBrFiName')
    ckBrFiName.isExists = true
  }
  if (ckBrFiName.code === 0) {
    let isCurrentCorrectBrand = shell.exec('git status', shellOption).stdout.includes(`On branch ${brandFileName}`)
    setStatus(isCurrentCorrectBrand, 'isCurrentCorrectBrand')
    const isCopy = isCurrentCorrectBrand && shell.cp('-r', pathFileName, slugFileName).code === 0
    setStatus(isCopy, 'isCopy')

    const gitAddObject = isCopy && shell.exec(`git add ./${slugFileName}`, shellOption)
    const gitAddBlank = gitAddObject.code === 0 && gitAddObject.stdout === ''
    isGitAdd = gitAddObject.code === 0
    setStatus(isGitAdd, 'isGitAdd')

    const isGitCommit = isGitAdd && shell.exec(`git commit -m ${slugFileName}`, shellOption).code === 0
    setStatus(isGitCommit, 'isGitCommit')
    const isGitPush = isGitCommit && shell.exec(`eval "$(ssh-agent -s)"
                        ssh-add ~/.ssh/nhuyk56
                        echo 'pushpushpushpushpushpush'
                        git push -u origin ${brandFileName}
                        echo 'pushpushpushpushpushpush'
                        `, shellOption).code === 0
    setStatus(isGitPush, 'isGitPush')
    isCurrentCorrectBrand = (isGitPush || gitAddBlank) && shell.exec('git status', shellOption).stdout.includes(`On branch ${brandFileName}`)
    const hasValidateFile =  shell.exec(`git checkout ${slugFileName}`).code === 0
    setStatus(isCurrentCorrectBrand, 'isCurrentCorrectBrand')
    isCurrentCorrectBrand = isCurrentCorrectBrand && shell.exec('git checkout main', shellOption).code === 0
    setStatus(isCurrentCorrectBrand, 'isCurrentCorrectBrand')
    if (hasValidateFile) {
      console.warn('please move https://github.com/nhuyk56/SyncStorage/raw/ to ENV')
      res.url = `https://github.com/nhuyk56/SyncStorage/raw/${md5(slugFileName)}/${slugFileName}`
      res.code = true
    }
  }
  return res
}

const test = () => {
  var shell = require('shelljs');
  shell.exec(`git status`)
}

module.exports = {
  uploadToGit,
  test
}
// folder
// file
// result
// error
// fix
// multiple