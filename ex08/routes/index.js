var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '상품관리', pageName:'list.ejs' });
});

module.exports = router;
