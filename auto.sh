eval "$(ssh-agent -s)"
ssh-add ~/.ssh/nhuyk56
ssh -T git@github.com
git checkout main
git checkout $1
git checkout -b $1
echo '------------------------------'
git status
echo '------------------------------'
# cp -r $1 $1
# $1 path local
# $1 slugFileName.xyz
# /slugFileName.xyz/slugFileName.xyz
cp $2 $3
git add $3
git commit -m $3
git push -u origin $1
echo '------------------------------'
git status
echo '------------------------------'
git checkout main
read -p "Pause Time 5 seconds"