const express = require('express');
const { getWebHook, postWebHook } = require('./controller.facebook');

const router = express.Router();

router.get('/', getWebHook);
router.post('/', postWebHook);

module.exports = { router }