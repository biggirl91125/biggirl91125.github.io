hexo generate
cp -R public/* .deploy/biggirl91125.github.io
cd .deploy/biggirl91125.github.io
git add .
git ci -m "update"
git push origin master
