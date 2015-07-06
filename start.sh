#
echo "starting the application set up...."
cd /besafe

echo "cleaning house..."
rm -rf wwwroot/

echo "getting most recent code..."
git clone -b develop https://github.com/buchanan-edwards/be-safe.git wwwroot/

cd wwwroot
npm install

echo "ok here we go..."
nodejs server.js