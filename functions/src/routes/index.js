const express = require('express');
const router = express.Router();

router.use('/group', require('./group'));
router.use('/member', require('./member'));
router.use('/category', require('./category'));

module.exports = router;
