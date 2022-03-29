var express = require('express');
const { render } = require('../app');
var router = express.Router();

var db= require('../db');

/* 상품목록 */
router.get('/list', function(req, res, next) {
  var page=req.query.page;
  var start=(page-1)*4;
  var sql='select count(*) total from tbl_jewelry';
  db.get().query(sql, function(err,rows){
    var total=rows[0].total;
    var sql='select *, format(price,0) fprice from tbl_jewelry order by code desc limit ?,4';
    db.get().query(sql,[start],function(err, rows){
      res.send({rows:rows, total:total});
  })

  });
  
});


//상품 등록 페이지
router.get('/insert', function(req, res){
  res.render('index', {title:'상품등록',pageName:'insert.ejs'});
})

//이미지 업로드
var multer= require('multer');
var Path = './public/images';
var upload= multer({
  storage: multer.diskStorage({
    destination: (req, file, done)=>{
      done(null, Path);
    },
    filename:(req,file,done)=>{
      done(null, Date.now()+'_'+file.originalname);
    },
  })
})

//상품등록
router.post('/insert',upload.single('image'), function(req,res){
  var title=req.body.title;
  var price=req.body.price;
  var image=req.file.filename;
  var sql='insert into tbl_jewelry(title,price,image) values(?,?,?)';
  db.get().query(sql, [title,price,image], function(err,rows){
    res.redirect('/');
  });
});

//상품정보페이지
router.get('/read', function(req,res){
  var code=req.query.code;
  var sql='select * from tbl_jewelry where code=?';
  db.get().query(sql,[code], function(err,rows){
    var vo=rows[0];
    res.render('index', {title: "상품정보", pageName:'read.ejs', vo:vo});
  })
})
var fs=require('fs');

//상품수정
router.post('/update',upload.single('image'), function(req,res){
  var code=req.body.code;
  var title=req.body.title;
  var price=req.body.price;
  var image=req.body.oldImage;

  //이미지가 바뀐경우
  if(req.file !=null){
    image=req.file.filename;
    fs.unlink(Path +"/"+ req.body.oldImage, function(err){
      if(err) throw err;
    });
  }

  var sql='update tbl_jewelry set title=?, price=?, image=? where code=?';
  db.get().query(sql,[title,price,image,code],function(err,rows){
    res.redirect('/');
  });
});
module.exports = router;