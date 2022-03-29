var express = require('express');
var router = express.Router();

var db = require('../db');
/* 상품목록 JSON Data */
router.get('/list', function(req, res, next) {
    var page=req.query.page;
    var start=(page-1)*4;
    
    //전체 데이터 갯수
    var sql='select count(*) total from tbl_product';
    db.get().query(sql, function(err,rows){
        var total=rows[0].total;
        
        sql=`select *,format(price,0) fprice from tbl_product order by code desc limit ${start},4`;
        db.get().query(sql, function(err, rows){
            res.send({rows:rows, total:total});
    });
    });
});


//상품등록페이지
router.get('/insert', function(req, res){
    var sql='select max(code) mcode from tbl_product';
    db.get().query(sql,function(err,rows){
       var mcode=rows[0].mcode;
       var code='P' + (parseInt(mcode.substr(1))+1);
       res.render('index', {title: '상품등록', code:code, pageName:'insert.ejs'});
    });
   
});


//파일 업로드
var multer=require('multer');
var path='./public/upload';
var upload=multer({
    storage:multer.diskStorage({
        destination:(req,res,done)=>{
            done(null, path);
        },
        filename:(req, file, done)=>{
            done(null, Date.now()+ '_'+file.originalname);
        }
    })
});

//DB에 상품등록
router.post('/insert', upload.single('image'),function(req, res){
    var code=req.body.code;
    var price=req.body.price;
    var name=req.body.name;
    var image=req.file.filename;
    var sql='insert into tbl_product(code,price,name,image) value(?,?,?,?)';
    db.get().query(sql,[code,price,name,image], function(err,rows){
        res.redirect('/');
    });
});


//상품정보 페이지이동
router.get('/read',function(req,res){
    var code=req.query.code;
    var sql='select * from tbl_product where code=?';
    db.get().query(sql,[code],function(err,rows){
        res.render('index',{title:'상품정보', vo:rows[0], pageName:'read.ejs'});
    })
})

//DB에 상품정보 수정
var fs=require('fs');//파일 삭제를 위한 함수
router.post('/update',upload.single('image'), function(req,res){
    var code=req.body.code;
    var name=req.body.name;
    var price=req.body.price;
    var image=req.body.oldImage;
    if(req.file!=null){ //이미지가 바뀐경우
        image=req.file.filename;
        //기존 이미지가 있으면 삭제
        if(req.body.oldImage!=''){
            fs.unlink(path + '/' + req.body.oldImage, function(err){
                if(err) throw err;
            });
        }
    }
    var sql='update tbl_product set name=?,price=?,image=? where code=?';
    db.get().query(sql, [name,price,image,code], function(err,rows){
        res.redirect('/');
    });
});


//DB에서 상품정보 삭제
router.get('/delete', function(req,res){
    var code=req.query.code;
    var image=req.query.image;
    var sql='delete from tbl_product where code=?';
    db.get().query(sql, [code], function(err,rows){
        //기존 이미지가 있으면 삭제
        if(image!=''){
            fs.unlink(path+ '/' + image, function(err){
                if(err) throw err;
                
            });
            
        }
        res.redirect('/');
    });
});
module.exports = router;
