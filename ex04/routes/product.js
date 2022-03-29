var express = require('express');
const res = require('express/lib/response');
var router = express.Router();

var db=require('../db');
/* 상품목록. */
router.get('/list', function(req, res, next) {
  var sql="select * from tbl_product order by code desc";
  db.get().query(sql, function(err, rows){
      res.send(rows);
  })
});
//상품등록페이지
router.get('/insert', function(req,res){
    var sql="select max(code) ncode from tbl_product";
    db.get().query(sql, function(err,rows){
        var maxCode=rows[0].ncode;
        var newCode='P' + (parseInt(maxCode.substr(1))+1);
        res.render('index',{title:'상품등록',
        pageName:'insert.ejs', newCode:newCode});
    });
   
});
//DB에 상품등록
router.post('/insert', function(req,res){
    var code=req.body.code;
    var name=req.body.name;
    var price=req.body.price;
    var company=req.body.company;
    var sql='insert into tbl_product(code,name,price,company) values(?,?,?,?)';
    db.get().query(sql, [code,name,price,company], function(err,rows){
        res.redirect('/');
    });
});

var moment=require('moment');
//상품정보읽기
router.get('/read/', function(req,res){
    var code=req.query.code;
    var today=moment(new Date()).format('YYYY-MM-DD');
    var sql='select * from tbl_product where code=?';
    db.get().query(sql, [code], function(err, rows){
        res.render('index', {title:'상품정보', pageName:`read.ejs`, vo:rows[0], today:today});
    })
})

//DB에서 상품정보 수정
router.post('/update', function(req,res){
    var code=req.body.code;
    var name=req.body.name;
    var price=req.body.price;
    var company=req.body.company;
    var sql='update tbl_product set name=?, price=?, company=? where code=?';
    db.get().query(sql, [name,price,company,code], function(err,rows){
        res.redirect('/');
    })
})

//DB에서 상품정보 삭제
router.post('/delete', function(req,res){
    var code=req.body.code;
    var sql='delete from tbl_product where code=?';
    db.get().query(sql,[code],function(err, rows){
        res.redirect('/');
    })
})
module.exports = router;