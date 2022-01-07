const uploadToGit= ({ envFolder, gitSource, pathFileName, slugFileName }) => {
  var gitPath = gitSource.replace('.git', '').replace('git@github.com:', 'https://github.com/')
  var gitFolder = gitPath.split('/').pop()
  var fs = require('fs');
  var path = require('path');
  var shell = require('shelljs');
  var md5 = require('md5');

  const shellOption = { cwd: envFolder, shell: 'C:/Program Files/Git/bin/sh.exe', windowsHide: true, silent: true }
  // const pathFileName = 'D:/YOUTUBE-NNT/0YOUUTBE-bat-dau-ban-thuong-bay-cai-the-nhan-vat/107727-tap-26-chuong-598---chuong-624.ps1'
  // const slugFileName = '107727-tap-26-chuong-598---chuong-624'
  const brandFileName = md5(slugFileName)

  var res = { status: {}, code: false }
  const setStatus = (bool, step) => {
    if (!Array.isArray(res.status[step])) {
      res.status[step] = []
    }
    res.status[step].push(bool)
    // console.log(step, bool)
  }
  if (!fs.existsSync(pathFileName)) {
    setStatus(false, '[NOT EXIST] ${pathFileName}')
    return res
  } else {
    res.isDirectory = fs.lstatSync(pathFileName).isDirectory()
    res.isFile = fs.lstatSync(pathFileName).isFile()
  }
  shell.exec(`rm -rf ${gitFolder}`, shellOption)
  const isGitClone = shell.exec(`
                          eval "$(ssh-agent -s)"
                          ssh-add ~/.ssh/nhuyk56
                          ssh -T git@github.com
                          git clone ${gitSource}`, shellOption).code === 0
  setStatus(isGitClone, 'isGitClone')
  if (isGitClone) {
    shellOption.cwd = path.join(envFolder, gitFolder)
  }
  var ckBrFiName = isGitClone && shell.exec(`git checkout -b ${brandFileName}`, shellOption)
  setStatus(!ckBrFiName.code, 'ckBrFiName')
  if (ckBrFiName.code !== 0) {
    ckBrFiName = shell.exec(`git checkout ${brandFileName}`, shellOption)
    setStatus(!ckBrFiName.code, 'ckBrFiName')
    ckBrFiName.isExists = true
  }
  if (ckBrFiName.code === 0) {
    let isCurrentCorrectBrand = shell.exec('git status', shellOption).stdout.includes(`On branch ${brandFileName}`)
    setStatus(isCurrentCorrectBrand, 'isCurrentCorrectBrand')
    const isCopy = isCurrentCorrectBrand && shell.exec(`cp -r ${pathFileName} ${slugFileName}`, shellOption).code === 0
    setStatus(isCopy, 'isCopy')

    const gitAddObject = isCopy && shell.exec(`git add ./${slugFileName}`, shellOption)
    const gitAddBlank = gitAddObject.code === 0 && gitAddObject.stdout === ''
    isGitAdd = gitAddObject.code === 0
    setStatus(isGitAdd, 'isGitAdd')

    const isGitCommit = isGitAdd && shell.exec(`git commit -m ${slugFileName}`, shellOption).code === 0
    setStatus(isGitCommit, 'isGitCommit')
    const isGitPush = isGitCommit && shell.exec(`eval "$(ssh-agent -s)"
                        ssh-add ~/.ssh/nhuyk56
                        ssh -T git@github.com
                        echo '<------------------------------------------------------------------------------------------------------------>'
                        git push -u origin ${brandFileName}
                        echo '<------------------------------------------------------------------------------------------------------------>'
                        `, shellOption).code === 0
    setStatus(isGitPush, 'isGitPush')
    isCurrentCorrectBrand = (isGitPush || gitAddBlank) && shell.exec('git status', shellOption).stdout.includes(`On branch ${brandFileName}`)
    const hasValidateFile =  shell.exec(`git checkout ${slugFileName}`, shellOption).code === 0
    setStatus(isCurrentCorrectBrand, 'isCurrentCorrectBrand')
    isCurrentCorrectBrand = isCurrentCorrectBrand && shell.exec('git checkout main', shellOption).code === 0
    setStatus(isCurrentCorrectBrand, 'isCurrentCorrectBrand')
    if (hasValidateFile) {
      res.url = `${gitPath}/raw/${md5(slugFileName)}/${slugFileName}`
      res.code = true
    }
  }
  if (isGitClone) {
    shellOption.cwd = envFolder
  }
  const isRemoveFolder = isGitClone && shell.exec(`rm -rf ${gitFolder}`, shellOption).code === 0
  setStatus(isRemoveFolder, 'isRemoveFolder')
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