eval "$(ssh-agent -s)"
ssh-add ~/.ssh/nhuyk56
ssh -T git@github.com
git checkout main
git checkout -b $1
cp -r D:/YOUTUBE-NNT/$1 $1
git add $1
git commit -m $1
git push -u origin $1
git checkout main