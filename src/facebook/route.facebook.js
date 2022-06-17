const express = require('express');
const routerCon = require('./controller.facebook');
const router = express.Router();

router.get('/', (req, res) => routerCon.getWebHook(res, req));
router.post('/',(req, res) => routerCon.postWebHook(res, req))

module.exports = router