const express = require('express');
const category = require('../controllers/category');
const router = express.Router();

router.post('/', category.addSubcategory);

module.exports = router;
