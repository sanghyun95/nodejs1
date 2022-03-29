const { query } = require('express');
var express = require('express');
var router = express.Router();
var db=require('../db');
/*시설물 관리 페이지 */
router.get('/', function(req, res, next) {
  res.render('index', { title: '스타일관리',pageName:'style.ejs' });
});

//시설물 목록
router.get('/list',function(req,res){
  var sql='select * from tbl_style';
  db.get().query(sql, function(err,rows){
    res.send(rows);
  })
})

//캠핑장별 스타일
router.get('/camp', function(req,res){
  var cid=req.query.cid;
  var sql='select * from view_style where cid=?';
  db.get().query(sql, [cid], function(err,rows){
    res.send(rows);
  })

})
//캠핑장별 시설물
router.get('/camp', function(req,res){
  var cid=req.query.cid;
  var sql='select * from view_facility where cid=?';
  db.get().query(sql, [cid], function(err,rows){
    res.send(rows);
  })

})

//DB에 캠핑장별 스타일 등록
router.post('/camp/insert',function(req,res){
  var cid=req.body.cid;
  var sid=req.body.sid;
  var sql='insert into tbl_camp_style(cid,sid) values(?,?)';
  db.get().query(sql,[cid,sid],function(err,rows){
    res.sendStatus(200);
  })

})

////DB에 캠핑장별 스타일 삭제
router.post('/camp/delete',function(req,res){
  var cid=req.body.cid;
  var sid=req.body.sid;
  var sql='delete from tbl_camp_style where cid=? and sid=?';
  db.get().query(sql,[cid,sid],function(err,rows){
    res.sendStatus(200);
  })

})
module.exports = router;
