var express = require('express');
var app = express();

var multipart = require('connect-multiparty');
var fs = require('fs');
var multipartMiddleware = multipart();

var server = app.listen(8088, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为", host, port)
})
//------------------------------------------------------
//解决跨域问题
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    //res.header("Content-Type", "application/json;charset=utf-8");//-------------------------------------这里规定了必须返回json格式的响应------------------------------
    next();
});

//接收用户个人信息
app.post('/upload', multipartMiddleware,function(req, res, next){
    console.log("he");
	var profile_image = req.files.file;
     var tmp_path = profile_image.path;  //此处为页面图片存放的地址，在C盘的临时文件夹temp下。   
     console.log(req.files);
	var path = './' + profile_image.name;  //此处'./url'为上传的图片希望存放的地址.可以为绝对地址
	//跨域传递文件
            var is = fs.createReadStream(tmp_path);
            var os = fs.createWriteStream(path);
                is.pipe(os);
                is.on('end',function() {
			console.log("end");
                    fs.unlinkSync(tmp_path);
res.send("done");
                });
})

//接收用户个人信息
app.get('/msg',function(req, res){
	
    console.log("getmsg");
	res.send("msg");
})
