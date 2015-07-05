#
cd /tmp
echo "starting the application...."
cd besafe
echo "hi brandt xxx"
git fetch origin develop
git remote -v
git branch -a
git checkout develop
echo "hi brandt xxx"
date -u
gulp app
nodejs server.js