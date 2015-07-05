echo "starting the application...."
cd /besafe
date -u
ls -al
date -u
echo "hi brandt xxx"
git fetch origin develop
git remote -v
git branch -a
git checkout develop
echo "hi brandt xxx"
#curl -sL https://deb.nodesource.com/setup | sudo bash -
#apt-get install nodejs npm
#npm install
date -u
gulp app
#npm start
nodejs server.js