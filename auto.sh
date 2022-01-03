if [ -d D:/YOUTUBE-NNT/$1 ] 
then
  eval "$(ssh-agent -s)"
  ssh-add ~/.ssh/nhuyk56
  ssh -T git@github.com
  git checkout -b main
  git checkout -b $1
  cp -r D:/YOUTUBE-NNT/$1 $1
  git add $1
  git commit -m $1
  git push
  # rm -rf $1
  git checkout -b main
else
  echo "Error: Directory /path/to/dir does not exists."
fi