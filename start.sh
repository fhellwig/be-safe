#
echo "starting the application...."
cd /besafe

echo "hi brandt xxx-"
git clone https://github.com/brandtheisey/be-safe.git wwwroot/
cd wwwroot
npm install -g gulp
npm install

gulp app
nodejs server.js