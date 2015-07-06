#
echo "starting the application set up...."
cd /besafe
echo "cleaning house..."
rm -rf wwwroot/
echo "getting most recent code..."
git clone -b develop https://github.com/brandtheisey/be-safe.git wwwroot/
cd wwwroot
npm install -g gulp
npm install

echo "ok here we go..."
gulp app
nodejs server.js