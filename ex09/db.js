var mysql=require('mysql');
var conn;
exports.connect=function(){ //app.js에서 Database 연결!
    conn=mysql.createPool({
        connectionLimit:100,
        host:'localhost',
        user:'shop',
        password:'pass',
        database:'shopdb'
    });
}

//개체 가져오기
exports.get=function(){
    return conn;
};