const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/snippets', require('./snippets'));
router.use('/ai', require('./ai'));
router.use('/me', require('./me'));

module.exports = router;
