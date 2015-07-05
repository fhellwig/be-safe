#
echo "starting the application...."
cd /besafe

echo "hi brandt xxx-"
ls -R / | awk '
/:$/&&f{s=$0;f=0}
/:$/&&!f{sub(/:$/,"");s=$0;f=1;next}
NF&&f{ print s"/"$0 }'
git clone https://github.com/brandtheisey/be-safe.git wwwroot/
cd wwwroot
npm install -g gulp
npm install

gulp app
nodejs server.js