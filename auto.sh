if [ -d D:/YOUTUBE-NNT/$1 ] 
then
  echo 1
  eval "$(ssh-agent -s)"
  echo 2
  ssh-add ~/.ssh/nhuyk56
  echo 3
  ssh -T git@github.com
  echo 4
  git checkout main
  echo 5
  git checkout -b $1
  echo 6
  cp -r D:/YOUTUBE-NNT/$1 $1
  echo 7
  git add $1
  echo 8
  git commit -m $1
  echo 9
  git push -u origin $1
  echo 10
  git checkout main
  echo 11
else
  echo "Error: Directory /path/to/dir does not exists."
fi
read -p "Pause Time 5 seconds"