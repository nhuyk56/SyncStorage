var { uploadToGit } = require('./uploadToGit.js');
const u2g = () => {
  const pathFileName = 'D:/YOUTUBE-NNT/0YOUUTBE-bat-dau-ban-thuong-bay-cai-the-nhan-vat/107727-tap-27-chuong-625---chuong-650.ps1'
  const slugFileName = 'd107727-tap-26-chuong-598---chuong-624'
  const data = uploadToGit(pathFileName, slugFileName)
  console.log(data)
}

u2g()