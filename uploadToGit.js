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
const getShellOption = (cwd) => ({ cwd: cwd, shell: 'C:/Program Files/Git/bin/sh.exe', windowsHide: true, silent: false })
const getRawMediaLink = (gitSSH, ID) => {
  const regexGit = /@(.*?)----|:(.*?).git/gm
  const [host, gitOwner_gitName] = regexMatchContent(regexGit, gitSSH).filter(a => a && !(/\@|(\.git)+/.test(a))).join('/')
  if (host === 'github.com') {
    return `https://${host}/${gitOwner_gitName}/raw/${ID}/index.m3u8`
  }
  return 'MISS FORMAT' + host + gitOwner_gitName
}
/*********************************************************************************************************************/
const renderUploadMediaToGit = ({ cwd, gitSSH, mp3Path }) => {
  const mp3SplitPath   = mp3Path.split('/')
  const mp3FileName    = mp3SplitPath.pop()
  const Mp3Folder      = mp3SplitPath.pop()
  const currentTime    = (new Date()).valueOf().toString()
  const ID = md5(mp3FileName + currentTime) /** cũng là folder Name chứa git */
  const newCwd = path.join(cwd, ID)
  var res = { code: false }

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
        res = { url: getRawMediaLink(gitSSH, ID), code: true }
      }
    }
  }
  shell.exec(`rm -rf ${ID}`, getShellOption(cwd))
  return res
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