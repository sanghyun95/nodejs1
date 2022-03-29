var express = require('express');
var router = express.Router();

var db=require('../db');
/* address 목록  json 데이터 출력 */
router.get('/', function(req, res, next) {
  var sql='select * from tbl_address order by id desc';
  db.get().query(sql, function(err, rows){
      res.send(rows);
  })
});


//주소정보출력
router.get('/read', function(req, res, next) {
    var id=req.query.id;
    var sql="select * from tbl_address where id=?";
    db.get().query(sql,[id], function(err,rows){
      res.render('index', { title: '주소정보', pageName:'address_read.ejs',vo:rows[0] });
    });
    
  });

  //주소등록화면 출력
router.get('/insert', function(req, res, next) {
    res.render('index', { title: '주소등록', pageName:'address_insert.ejs' });
  });

//DB에 주소등록
router.post('/insert',function(req,res){
  var name=req.body.name;
  var tel=req.body.tel;
  var address=req.body.address;
  //console.log(`${name}\n${tel}\n${address}`); 터미널에 결과값보기
  var sql='insert into tbl_address(name,tel,address) values(?,?,?)';
  db.get().query(sql,[name,tel,address], function(err,result){
    res.redirect('/');
  });
});

//DB에 주소정보수정
router.post('/update', function(req,res){
  var id=req.body.id;
  var name=req.body.name;
  var tel=req.body.tel;
  var address=req.body.address;
  var sql="update tbl_address set name=?, tel=?,address=? where id=?";
  db.get().query(sql,[name,tel,address,id], function(err,result){
    res.redirect('/');//목록으로 이동
  });
});

//DB에 주소정보 삭제 
router.post('/delete', function(req,res){
  var id=req.body.id;
  var sql="delete from tbl_address where id=?";
  db.get().query(sql,[id], function(err,result){
    res.redirect('/'); //목록으로 이동
  })
});
module.exports = router;
