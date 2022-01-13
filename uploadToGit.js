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
const renderUploadMediaToGit = ({ cwd, gitSSH, mp3Path }) => {
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
    throw new Error(url, mp3FileName)
  }

  /** STATUS REPORT **/
  var times = 0
  console.time('PROCESS')
  const statusReport = (mgs = '') => {
    console.timeLog('PROCESS', `[${++times}/13]${mgs}: ${mp3FileName} `)
    return ''
  }

  /** REMOVE FOLDER (ID) & MAKE FOLDER (ID) **/
  shell.exec(statusReport() + `rm -rf ${ID}`, getShellOption(cwd))
  const isMkdir = shell.exec(statusReport() + `mkdir ${ID}`, getShellOption(cwd))
  if (isMkdir.code === 0) {
    const processFile = shell.exec(statusReport() + `ffmpeg -i "${mp3Path}" -codec: copy -start_number 0 -hls_time 5 -hls_list_size 0 -f hls index.m3u8`, getShellOption(newCwd))
    if (processFile.code === 0) {
      /** Git Session */
      shell.exec(statusReport() + `git init`, getShellOption(newCwd))
      shell.exec(statusReport() + `git remote add origin ${gitSSH}`, getShellOption(newCwd))
      shell.exec(statusReport() + `git checkout -b ${ID}`, getShellOption(newCwd))
      shell.exec(statusReport() + `git add .`, getShellOption(newCwd))
      shell.exec(statusReport() + `git commit -m "${ID}"`, getShellOption(newCwd))
      shell.exec(statusReport() + `git push --set-upstream origin ${ID}`, getShellOption(newCwd))
      /** verify File Online*/
      shell.exec(statusReport() + `rm -rf index.m3u8`, getShellOption(newCwd))
      const verifyFile = shell.exec(statusReport() + `git checkout index.m3u8`, getShellOption(newCwd))
      if (verifyFile.code === 0) {
        res = { url: getRawMediaLink(gitSSH, ID), code: true }
      }
    }
  }
  shell.exec(statusReport() + `rm -rf ${ID}`, getShellOption(cwd))
  statusReport(res.code ? '[SUCCESS]' : '[FAILED]')
  console.timeEnd('PROCESS')
  return res
}

module.exports = {  renderUploadMediaToGit }