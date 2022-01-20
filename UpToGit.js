const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
const md5 = require('md5')

/*********************************************************************************************************************/
const regexMatchContent = (regex, html) => {
  const res = []
  let m
  while ((m = regex.exec(html)) !== null) {
    if (m.index === regex.lastIndex) regex.lastIndex++
    m.forEach((match, groupIndex) => res.push(match))
  }
  return res
}
const getShellOption = (cwd) => ({ cwd: cwd, shell: 'C:/Program Files/Git/bin/sh.exe', windowsHide: true, silent: true })
const getRawMediaLink = (gitSSH, ID) => {
  const regexGit = /@(.*?)----|:(.*?).git/gm
  const [host, gitOwner_gitName] = regexMatchContent(regexGit, gitSSH).filter(a => a && !(/\@|(\.git)+/.test(a)))
  if (host === 'github.com') {
    return `https://${host}/${gitOwner_gitName}/raw/${ID}/index.m3u8`
  }
  return `[MissFormat][${host}]`
}
/*********************************************************************************************************************/
const renderUploadMediaToGit = ({ errorPath, outPath, outBkPath, mp3Path, cwd, gitSSH  }) => {
  const mp3SplitPath   = mp3Path.split('/')
  const mp3FileName    = mp3SplitPath.pop()
  const Mp3Folder      = mp3SplitPath.pop()
  const currentTime    = (new Date()).valueOf().toString()
  const ID = md5(mp3FileName + currentTime) /** cũng là folder Name chứa git */
  const newCwd = path.join(cwd, ID)
  var res = { code: false }

  /** Verify Git Host **/
  const url = getRawMediaLink(gitSSH, ID)
  if (url.includes('[MissFormat]')) {
    console.warn(url, mp3FileName)
    return
  }

  /** STATUS REPORT **/
  var times = 0
  const before = Date.now();
  const warnCLI = (mgs = '') => {
    const after = Date.now();
    console.warn(`________________________`)
    console.warn(`[${++times}/13]: ${mp3FileName}`, `(${(after - before) / 1000}s)`)
    console.warn(`[LOADING]:  ${mgs}`)
    return mgs
  }

  /** REMOVE FOLDER (ID) & MAKE FOLDER (ID) **/
  shell.exec(warnCLI(`rm -rf ${ID}`), getShellOption(cwd))
  const isMkdir = shell.exec(warnCLI(`mkdir ${ID}`), getShellOption(cwd))
  if (isMkdir.code === 0) {
    const processFile = shell.exec(warnCLI(`ffmpeg -i "${mp3Path}" -codec: copy -start_number 0 -hls_time 5 -hls_list_size 0 -f hls index.m3u8`), getShellOption(newCwd))
    if (processFile.code === 0) {
      /** Git Session */
      shell.exec(warnCLI(`git init`), getShellOption(newCwd))
      shell.exec(warnCLI(`git remote add origin ${gitSSH}`), getShellOption(newCwd))
      shell.exec(warnCLI(`git checkout -b ${ID}`), getShellOption(newCwd))
      shell.exec(warnCLI(`git add .`), getShellOption(newCwd))
      shell.exec(warnCLI(`git commit -m "${ID}"`), getShellOption(newCwd))
      const pushMessage = shell.exec(warnCLI(`git push --set-upstream origin ${ID}`), getShellOption(newCwd))
      /** verify File Online*/
      shell.exec(warnCLI(`rm -rf index.m3u8`), getShellOption(newCwd))
      const verifyFile = shell.exec(warnCLI(`git checkout index.m3u8`), getShellOption(newCwd))
      if (verifyFile.code === 0) {
        res = { url: getRawMediaLink(gitSSH, ID), code: true }
        fs.writeFileSync(outPath, getRawMediaLink(gitSSH, ID), {encoding: "utf8"})
        fs.writeFileSync(outBkPath, getRawMediaLink(gitSSH, ID), {encoding: "utf8"})
      } else {
        fs.writeFileSync(errorPath, JSON.stringify(pushMessage), {encoding: "utf8"})
      }
    }
  }
  shell.exec(warnCLI(`rm -rf ${ID}`), getShellOption(cwd))
  warnCLI(res.code ? '[SUCCESS]' : '[FAILED]')
  return JSON.stringify(res) /** OUTPUT */
}
/*********************************************************************************************************************/
const [errorPath, outPath, outBkPath, mp3Path, cwd, gitSSH] = process.argv[2] && process.argv[2].split('#') || ''
if (!( errorPath && outPath && outBkPath && mp3Path && cwd && gitSSH )) {
  console.log('Missing Paramater: errorPath, outPath, outBkPath, mp3Path, cwd, gitSSH')
} else {
  const res = renderUploadMediaToGit({ errorPath, outPath, outBkPath, mp3Path, cwd, gitSSH  })
  console.log(res)
}
