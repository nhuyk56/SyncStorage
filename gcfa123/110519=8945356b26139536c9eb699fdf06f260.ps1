$mnv_id = "110519"
$mnvMd5 = "8945356b26139536c9eb699fdf06f260"
$truyenName = "Bắt Đầu Hoàng Triều Chi Chủ, Từ Chư Thiên Triệu Hoán Thần Ma"
$TapName = "Tập 14. Chương 316 -> Chương 342"
$tapTxtUrl = "D:\SyncAudioStorage\GroupsTxt\8945356b26139536c9eb699fdf06f260.txt"
# $temp = "D:\Temp"
$temp = $env:temp
$backup = "D:\SyncAudioStorage\GCFA"

$tapTxtName     = "$($temp)/$($mnv_id)=$($mnvMd5).txt";
$tapOggName     = "$($temp)/$($mnv_id)=$($mnvMd5).ogg";
$tapMp3Name     = "$($temp)/$($mnv_id)=$($mnvMd5).mp3";
$tapMp3NameImg  = "$($temp)/$($mnv_id)=$($mnvMd5).jpg";
$nnlPath        = "$($mnv_id)=$($mnvMd5).nnl"
$nnlBKPath      = "$backup/$($mnv_id)=$($mnvMd5).nnl"
$errorPath      = "$($mnv_id)=$($mnvMd5).error"
$qc = "Truyện được phát hành trên quép sai nằm nghe truyện chấm com."
if (Test-Path -Path $nnlPath) {
  echo "-----------------------FILE WAS EXC-----------------------";
} else {
  echo "-----------------------START-----------------------";
  # node "C:\Program Files (x86)\lib-youtube\myCurl.js" $tapTxtUrl $tapTxtName
  Copy-Item $tapTxtUrl $tapTxtName
  txt2audio -txt $tapTxtName -prefix "$($truyenName). $($TapName)" -suffix ". $($qc). Kết Chương"
  ffmpeg -i $tapOggName -b:a 40k -y $tapMp3Name
  mv $tapMp3Name $tapMp3NameImg
  echo "-----------------------UPLOADING-----------------------";
  echo "uploading:...";
  while(!$data) {
    $data = curl.exe -F "virtual_user=nnphotos" -F "x-file-name=$($mnvMd5)" -F "virtual_dir=$($mnv_id)" -F "file=@$($tapMp3NameImg)" 'https://res.nonolive.com/upload/file'
    $url= $($data | jq -r .body.url)
    $Utf8NoBomEncoding = New-Object System.Text.UTF8Encoding $False
    if ($url -Match "jpg") {
      [System.IO.File]::WriteAllLines($nnlPath, "https://nono-vpic-dl.akamaized.net/download/file/$($url)", $Utf8NoBomEncoding)
      [System.IO.File]::WriteAllLines($nnlBKPath, "https://nono-vpic-dl.akamaized.net/download/file/$($url)", $Utf8NoBomEncoding)
      echo "Upload success"
    } elseif ($data) {
      echo "Upload failed watch Log"
      [System.IO.File]::WriteAllLines($errorPath, $data, $Utf8NoBomEncoding)
    } else {
      echo "Upload failed try again"
    }
  }
  del "$($tapTxtName)*"
  del "$($tapOggName)*"
  del "$($tapMp3Name)*"
  del "$($tapMp3NameImg)*"
  echo "-----------------------END-----------------------";
}