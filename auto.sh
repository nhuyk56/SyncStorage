eval "$(ssh-agent -s)"
ssh-add ~/.ssh/nhuyk56
ssh -T git@github.com
git checkout main
git checkout $2
git checkout -b $2
echo '------------------------------'
git status
echo '------------------------------'
cp -r $1 $2
git add $2
git commit -m $2
git push -u origin $2
echo '------------------------------'
git status
echo '------------------------------'
git checkout main
read -p "Pause Time 5 seconds"