var router = require('express').Router();

require('./apis/subscribe')(router);
require('./apis/reports')(router);
require('./apis/drugs')(router);
require('./apis/version')(router);
require('./apis/carousel')(router);
require('./apis/request')(router);

module.exports = router;
