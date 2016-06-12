var express = require('express');
var app = express();

var bodyParser = require('body-parser');
//app.use(bodyParser.urlencoded());
var urlencod=bodyParser.urlencoded();

app.use('/', express.static(__dirname + '/www'));


/**
*session
*/
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser());
app.use(session({
  secret: '12345',
  name: 'name',
  cookie: {maxAge: 60000},
  resave: false,
  saveUninitialized: true,
}));
//----------------------------------------------------

var mysql  = require('mysql');  //调用MySQL模块
var connection = mysql.createConnection({
  host : 'localhost',       //主机
  user : 'root',               //MySQL认证用户名
  password : 'huangzifeng1993',        //MySQL认证用户密码
  port : '3306',            //端口号
  database : 'news-app',
  charset : 'utf8mb4'
});

var server = app.listen(8081, function () {
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


//接收客户端注册信息
app.post('/register', function (req, res) {
	console.log("register");
   var post = '';     //定义了一个post变量，用于暂存请求体的信息
    req.on('data', function(chunk){    //通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
        post += chunk;
    });
    req.on('end', function(){    //在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
		console.log(post);//post是json格式
		var account=JSON.parse(post).account;
        var password=JSON.parse(post).password;
        var name=JSON.parse(post).name;
		//查数据库
		checkSignUser(res,account,password,name);
    });
})

//接收客户端登录信息
app.post('/login', function (req, res) {
    // var account=req.body.account;
    // var password=req.body.password;
    //查数据库
   var post = '';     //定义了一个post变量，用于暂存请求体的信息
    req.on('data', function(chunk){    //通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
        post += chunk;
    });
    req.on('end', function(){    //在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
    console.log(post);//post是json格式
    var account=JSON.parse(post).account;
    var password=JSON.parse(post).password;
    //查数据库
    checkLoginUser(req,res,account,password);
    });
	// checkLoginUser(req,res,account,password);
})

//插入一条新用户信息
function insertUser(account,password,name){
	var  userAddSql = 'INSERT INTO user(id,account,pswd,name,avatar) VALUES(0,?,?,?,?)';
	var  userAddSql_Params = [account,password,name,'img/default-user.png'];
	//插入
	connection.query(userAddSql,userAddSql_Params,function (err, result) {
	if(err){
	 console.log('[INSERT ERROR] - ',err.message);
	 return;
	}

	console.log('--------------------------INSERT----------------------------');
	//console.log('INSERT ID:',result.insertId);
	console.log('INSERT ID:',result);
	console.log('-----------------------------------------------------------------\n\n');
	});
	// connection.end();
}

//解决方案----将判断放到回调函数里面-------------------------------------------------------------------------------------------------------

//查询账号是否已注册
function checkSignUser(res,account,password,name){
	var  userGetSql = "SELECT * FROM user where account='"+account+"'";//这种方式不好，容易受到注入式攻击----------------------
	console.log(userGetSql);
    connection.query(userGetSql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
		  res.send("error");
		  return;
        }
		if(result.length==0){
			insertUser(account,password,name);
			res.send("success");
		}
		else{
			res.send("error");
		}
		 console.log('--------------------------SELECT----------------------------');
		  for(var i = 0; i < result.length; i++)
		  {
			  console.log("%d\t%s\t%s", result[i].id, result[i].name, result[i].account);
		  }
		  console.log('-----------------------------------------------------------------\n\n');
	});
}

//查询登录信息是否正确
function checkLoginUser(req,res,account,password){
	var  userGetSql = "SELECT * FROM user where account='"+account+"' and pswd='"+password+"'";//这种方式不好，容易受到注入式攻击----------------------
	console.log(userGetSql);
    connection.query(userGetSql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
   		    res.redirect("http://192.168.191.1:8081/login.html");
        // res.send("error");
		    return;
        }
		if(result.length==0){
			//res.redirect("http://localhost:8002/www/login.html");
			// var data="<html><script>alert('fail');window.location.href='http://192.168.191.1:8081/login.html'</script><div></div></html>";
			// res.writeHead(200, {"Content-Type": "text/html"});//注意这里
			// res.write(data);
			res.send("error");
		}
		else{
			var cookieContent= [result[0].id,result[0].name,result[0].account];
      req.session.userid = result[0].id;
      req.session.account = result[0].account;
			// var htmlpage="<html><script>window.location.href='http://192.168.191.1:8081/#/tab/dash'</script><div></div></html>";
      // Set-Cookie可以去掉
			// res.writeHead(200, {'Set-Cookie': cookieContent,"Content-Type": "text/html"});//注意这里
			// res.write(htmlpage);
			res.send(cookieContent);
		}
		 console.log('--------------------------SELECT----------------------------');
		  for(var i = 0; i < result.length; i++)
		  {
			  console.log("%d\t%s\t%s", result[i].id, result[i].name, result[i].account);
		  }
		  console.log('-----------------------------------------------------------------\n\n');
	});
}
//插入到collect中
function InsertCollectMsg(res,userid,pbid){
	var  userGetSql = "SELECT * FROM collect where pbid='"+pbid+"'";//这种方式不好，容易受到注入式攻击----------------------
	console.log(userGetSql);
    connection.query(userGetSql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
		  res.send("error");
		  return;
        }
		else if(result.length==0){
			var userAddSql = 'INSERT INTO collect(id,userid,pbid) VALUES(0,?,?)';
			var userAddSql_Params = [userid,pbid];
			console.log(userAddSql_Params);
			connection.query(userAddSql,userAddSql_Params,function (err, result) {
			  if(err){
			  console.log('[INSERT ERROR] - ',err.message);
			  return;
			}
		});
		}
		// else{
		// 	var name = result[0].name;
		// 	var avatar = result[0].avatar;
		// 	var sendTime = new Date().Format("yyyy-MM-dd hh:mm:ss");//yyyy-MM-dd HH:mm:ss
		// 	console.log(sendTime);
		// 	var userAddSql = 'INSERT INTO publishmsg(id,userid,name,avatar,msg,img,count,sendTime) VALUES(0,?,?,?,?,?,?,?)';
		// 	var userAddSql_Params = [userid,name,avatar,msg,img,'0',sendTime];
		// 	//插入
		// 	console.log(userAddSql);
		// 	console.log(sendTime);
		// 	connection.query(userAddSql,userAddSql_Params,function (err, result) {
		// 	if(err){
		// 	 console.log('[INSERT ERROR] - ',err.message);
		// 	 return;
		// 	}
		// });
	 // }
  });
}
//插入发布的信息到publishmsg中
function InsertPublishMsg(res,userid,account,msg,img){
	var  userGetSql = "SELECT * FROM user where account='"+account+"'";//这种方式不好，容易受到注入式攻击----------------------
	console.log(userGetSql);
    connection.query(userGetSql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
		  res.send("error");
		  return;
        }
		if(result.length==0){
			res.send("error");
		}
		else{
			var name = result[0].name;
			var avatar = result[0].avatar;
			var sendTime = new Date().Format("yyyy-MM-dd hh:mm:ss");//yyyy-MM-dd HH:mm:ss
			console.log(sendTime);
			var userAddSql = 'INSERT INTO publishmsg(id,userid,name,avatar,msg,img,count,sendTime) VALUES(0,?,?,?,?,?,?,?)';
			var userAddSql_Params = [userid,name,avatar,msg,img,'0',sendTime];
			//插入
			console.log(userAddSql);
			console.log(sendTime);
			connection.query(userAddSql,userAddSql_Params,function (err, result) {
			if(err){
			 console.log('[INSERT ERROR] - ',err.message);
			 return;
			}
		});
	 }
  });
}

//接收用户个人信息
app.post('/userInfo',function (req, res) {
	var userid=req.session.userid;
  console.log('userid0:',userid);
	if(userid==null){
	userid=readCookiesAndWriteSession(req);
	}
	console.log("userid1:",userid);
	console.log(req.headers.cookie);
    var userGetSql = "SELECT * FROM user WHERE id='"+userid+"'";
    console.log(userGetSql);
    connection.query(userGetSql,function (err, result) {
    	if(err){
		console.log('[SELECT ERROR]- ',err.message);
		res.send("error");
	    return;
       }
       else {
       	console.log("userInfo :"+result);
       	res.send(result);
       }
    })
})

//接收客户端登录信息
app.get('/getIndex', function (req, res) {
  var userid = req.session.userid;
	// var userid=readCookiesAndWriteSession(req);
	console.log("getIndex:"+userid);
	//var userid=1;//当前登录用户的主键

	//获取好友id
	var userGetSql = "SELECT * FROM friendlist WHERE uid="+userid+" AND valid=1";
	console.log(userGetSql);
    connection.query(userGetSql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
		  res.send("error");
		  return;
        }
        var ids="";
		for(var i = 0; i < result.length; i++)
		{
			ids+=result[i].fid+",";
		}
		var Sql2 = "SELECT * FROM friendlist WHERE fid="+userid+" AND valid=1";
		connection.query(Sql2,function (err, result) {
			if(err){
	          console.log('[SELECT ERROR] - ',err.message);
			  res.send("error");
			  return;
	        }
			for(var i = 0; i < result.length; i++)
			{
				ids+=result[i].uid+",";
			}

			ids+=userid;
			console.log(ids);

			//查询发布内容
			var Sql3 = "SELECT * FROM publishmsg WHERE userid IN ("+ids+") ORDER BY sendTime desc";
			// var Sql3 = "SELECT * FROM publishmsg WHERE id IN ("+ids+") userid IN ("+userid+") ORDER BY sendTime desc";
			connection.query(Sql3,function (err, result) {
				if(err){
		          console.log('[SELECT ERROR] - ',err.message);
				  res.send("error");
				  return;
		        }
		        var array=new Array();
		        for(var i = 0; i < result.length; i++)
				{
					var item=new Object();
					item.id=result[i].id;
					item.count=result[i].count;
					item.avatar=result[i].avatar;
					item.name=result[i].name;
					//item.msg=result[i].msg;
					item.msg=replaceUrl(result[i].msg);
					console.log(item.msg);
					item.sendTime=result[i].sendTime;
					item.img=result[i].img.split(",");
					array.push(item);
				}
				console.log(array);
				res.send(array);
			});
		 });
	});
})

//接收收藏的内容信息
app.get('/getCollect', function (req, res) {
	var userid=req.session.userid;
	if(userid==null){
		userid=readCookiesAndWriteSession(req);
	}
	console.log("getCollect:"+userid);
	//获取collect中的userid
	var userGetSql = "SELECT * FROM collect where userid='"+userid+"'";
	console.log(userGetSql);
	var array=new Array();
    connection.query(userGetSql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
		  res.send("error");
		  return;
        }
        else {
        	if(result.length<=0){
        		res.send(array);
        		return;
        	}
        	var instring="";
        	for (var i = 0;i<result.length;i++) {
                instring+=result[i].pbid+",";
                // console.log("pbids"+pbids);
        	}
        	instring=instring.substring(0,instring.length-1);//去掉最后的逗号
        	console.log("pbids"+instring);
        	var Sql2 = "SELECT * FROM publishmsg where id in ("+instring+") ORDER BY sendTime desc";
		    connection.query(Sql2,function (err, result) {
		    	if(err){
		          console.log('[SELECT ERROR] - ',err.message);
				  res.send("error");
				  return;
		        }
		        else{
		        	for(var i = 0; i < result.length; i++){
		            		var item=new Object();
							item.id=result[i].id;
							item.count=result[i].count;
							item.avatar=result[i].avatar;
							item.name=result[i].name;
							// item.msg=result[i].msg;
              item.msg = replaceUrl(result[i].msg);
              console.log(item.msg);
							item.sendTime=result[i].sendTime;
							item.img=result[i].img.split(",");
							array.push(item);
		            }
		            console.log("array1:",array);
		            res.send(array);
		            return;
		        }
		    });
        }
	});
})

//接收分享的内容信息
app.get('/getMyShare',function(req, res) {
  var userid=req.session.userid;
  if(userid==null){
    userid=readCookiesAndWriteSession(req);
  }
  console.log("getMyShare:"+userid);
  //获取publishmsg中的userid
  var userGetSql = "SELECT * FROM publishmsg where userid='"+userid+"'ORDER BY sendTime desc";
  console.log(userGetSql);
  var array = new Array();
  connection.query(userGetSql,function (err, result) {
    if(err){
      console.log('[SELECT ERROR] - ',err.message);
  res.send("error");
  return;
    }
    else {
      if(result.length<=0){
        res.send(array);
        return;
      }
      for(var i = 0; i < result.length; i++){
        var item=new Object();
        item.id=result[i].id;
        item.count=result[i].count;
        item.avatar=result[i].avatar;
        item.name=result[i].name;
        // item.msg=result[i].msg;
        item.msg = replaceUrl(result[i].msg);
        console.log(item.msg);
        item.sendTime=result[i].sendTime;
        item.img=result[i].img.split(",");
        array.push(item);
      }
      console.log("array2:",array);
      res.send(array);
      return;
     }
});
})
//删除分享的内容
app.post('/delShare',function(req, res) {
  var post = '';     //定义了一个post变量，用于暂存请求体的信息
  req.on('data', function(chunk){    //通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
      post += chunk;
  });
  req.on('end', function(){    //在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
  console.log(post);//post是json格式
  var pbid=JSON.parse(post).pbid;
  var shareDelSql = "DELETE FROM publishmsg WHERE id = '"+pbid+"'";
  connection.query(shareDelSql, function(err,result) {
  if(err){
    console.log('[SELECT ERROR] - ',err.message);
    res.send("error");
    return;
      }
  else {
    console.log("delete success!");
    res.send();
  }
    })
  });
})

//接收发布的文字信息
app.post('/getMsg', function(req, res) {
	var userid=req.session.userid;
	if(userid==null){
		userid=readCookiesAndWriteSession(req);
	}
	//var userid = 1;
	var account = req.session.useraccount;
	console.log("getMsg");
    var post = '';     //定义了一个post变量，用于暂存请求体的信息
    req.on('data', function(chunk){    //通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
        post += chunk;
    });
    req.on('end', function(){    //在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
		console.log(post);//post是json格式
		var msg=JSON.parse(post).msg;
		var img=JSON.parse(post).img;
		console.log(img);
		// if(img!="" && null!=img){
		// 	img=img.replace(/\//g,"_");//将所有/变成_
		// }
        console.log(img);
        //插入到收藏数据表中
        InsertPublishMsg(res,userid,account,msg,img)
        res.send("success");
        return;
    });
})

//接收发布的图片信息
var multipart = require('connect-multiparty');
var fs = require('fs');
var multipartMiddleware = multipart();

app.post('/upload', multipartMiddleware,function(req, res, next){
	var userid=req.session.userid;
	if(userid==null){
		userid=readCookiesAndWriteSession(req);
	}
	var profile_image = req.files.file;
    var tmp_path = profile_image.path;  //此处为页面图片存放的地址，在C盘的临时文件夹temp下。
    console.log(req.files);
     //图片重命名：时间戳+发布人id+图片类型
   	//var imgtype=profile_image.name.substring(profile_image.name.lastIndexOf("."),profile_image.name.length);
    //var path = './www/img/imgPublish/'+Date.now()+userid+imgtype;
    var newname=profile_image.name.replace(/\//g,"_");
    var path='./www/img/imgPublish/'+newname;
    var is = fs.createReadStream(tmp_path);
    var os = fs.createWriteStream(path);
    is.pipe(os);
    is.on('end',function() {
		console.log("end");
        fs.unlinkSync(tmp_path);
		res.send("done");
    });
})

//收藏发布的内容
app.post('/insertCollect',function (req, res) {
	var userid=req.session.userid;
	if(userid==null){
		userid=readCookiesAndWriteSession(req);
	}
	var account = req.session.useraccount;
    var post = '';     //定义了一个post变量，用于暂存请求体的信息
    req.on('data', function(chunk){    //通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
        post += chunk;
    });
    req.on('end', function(){    //在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
		console.log(post);//post是json格式
		var pbid=JSON.parse(post).pbid;
		console.log(pbid);
        InsertCollectMsg(res,userid,pbid);
        res.send("success");
        return;
    });
})

//获取评论
app.post('/getComment', function (req, res) {
	console.log("getComment");
    var post = '';     //定义了一个post变量，用于暂存请求体的信息
    req.on('data', function(chunk){    //通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
        post += chunk;
    });
    req.on('end', function(){    //在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
		console.log(post);//post是json格式
		var id=JSON.parse(post).id;
		console.log(id);
		var  userGetSql = "SELECT * FROM comment where pblid='"+id+"' order by comTime desc";
    	connection.query(userGetSql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
		  res.send("error");
		  return;
        }

        var comment=new Array();
        if(result.length>0){
        	var uids="(";
	        for(var i = 0; i < result.length; i++)
			{
				var item=new Object();
				item.pblid=result[i].pblid;
				item.content=result[i].content;
				item.comTime=result[i].comTime;
				item.userid=result[i].userid;
				uids+=result[i].userid+",";
				comment.push(item);
			}
			uids=uids.substring(0,uids.length-1)+")";
    		console.log(uids);
			var sql="SELECT * FROM USER WHERE id IN "+uids+" ORDER BY FIELD(id,"+uids.substring(1,uids.length);
			console.log(sql);
			connection.query(sql,function (err, result) {
	        if(err){
	          console.log('[SELECT ERROR] - ',err.message);
			  res.send("error");
			  return;
	        }

	        for(var j=0;j<comment.length;j++){
	        	for(var k=0;k<result.length;k++){
	        		if(comment[j].userid==result[k].id){
	        			comment[j].username=result[k].name;
	        			break;
	        		}
	        	}
	        }
	        console.log(comment);
			res.send(comment);
	    	});
        }
        else{
        	console.log(comment);
        	res.send(comment);
        }

		});
    });
})

app.post('/addComment', function (req, res) {
	var userid=req.session.userid;
  console.log('userid',userid);
	if(userid==null){
		userid=readCookiesAndWriteSession(req);
	}
	//var userid = 1;
	console.log("addComment");
    var post = '';     //定义了一个post变量，用于暂存请求体的信息
    req.on('data', function(chunk){    //通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
        post += chunk;
    });
    req.on('end', function(){    //在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
		console.log(post);
		var array=new Array();
		array=post.split("&&&&");
		if(array.length!=2){
			res.send("fail");
			return;
		}
		var id=(array[0].split("="))[1];
		var content=(array[1].split("="))[1];
		var time = new Date().Format("yyyy-MM-dd hh:mm:ss");
		var  sql = 'INSERT INTO comment(id,pblid,userid,content,comTime) VALUES(0,?,?,?,?)';
		var  Params = [id,userid,content,time];
			//插入
			connection.query(sql,Params,function (err, result) {
			if(err){
			 console.log('[INSERT ERROR] - ',err.message);
			 return;
			}

			//更新pblishmsg表
			var  Sql1 = "SELECT * FROM publishmsg where id='"+id+"'";
		    connection.query(Sql1,function (err, result) {
		        if(err){
		          console.log('[SELECT ERROR] - ',err.message);
				  res.send("error");
				  return;
		        }
				var count=result[0].count+1;
				//更新
				var Sql2 = 'UPDATE publishmsg SET count = ? WHERE id = ?';
				var Params2 = [count,id];
				//改 up
				connection.query(Sql2,Params2,function (err, result) {
					if(err){
					 console.log('[UPDATE ERROR] - ',err.message);
					 return;
					}
					res.send("success");
				});
			});
		});
    });
})

//发送聊天消息
app.post('/addMsg', function (req, res) {
	var userid=req.session.userid;
	if(userid==null){
		userid=readCookiesAndWriteSession(req);
	}
	console.log("addMsg:"+userid);
	//var userid = 1;
    var post = '';     //定义了一个post变量，用于暂存请求体的信息
    req.on('data', function(chunk){    //通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
        post += chunk;
    });
    req.on('end', function(){    //在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
		console.log(post);
		var msg=JSON.parse(post).msg;
		var receiveid=JSON.parse(post).receiveid;
		var time = new Date().Format("yyyy-MM-dd hh:mm:ss");
		var  sql = 'INSERT INTO chatmsg(id,sendid,msg,recid,stime) VALUES(0,?,?,?,?)';
		var  Params = [userid,msg,receiveid,time];
			//插入
			connection.query(sql,Params,function (err, result) {
			if(err){
			 console.log('[INSERT ERROR] - ',err.message);
			 res.send("fail");
			 return;
			}
			res.send("success");
		});
    });
})


//接收朋友通讯列表
app.post('/getFriendList',function (req, res) {
	var userid=req.session.userid;
	if(userid==null){
		userid=readCookiesAndWriteSession(req);
	}
	console.log("getFriendList"+userid);
	console.log(req.headers.cookie);
    //var userid=1;//当前登录用户的主键
	//获取好友id
	var userGetSql = "SELECT * FROM friendlist WHERE uid='"+userid+"' AND valid=1";
	console.log(userGetSql);
    connection.query(userGetSql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
		  res.send("error");
		  return;
        }
        var ids="";
		for(var i = 0; i < result.length; i++)
		{
			ids+=result[i].fid+",";
		}
		var Sql2 = "SELECT * FROM friendlist WHERE fid="+userid+" AND valid=1";
		connection.query(Sql2,function (err, result) {
			if(err){
	          console.log('[SELECT ERROR] - ',err.message);
			  res.send("error");
			  return;
	        }
			for(var i = 0; i < result.length; i++)
			{
				ids+=result[i].uid+",";
			}
			ids=ids.substring(0,ids.length-1);
        var Sql3 = "SELECT * FROM user WHERE id in ("+ids+")";
        connection.query(Sql3,function (err, result) {
				if(err){
		          console.log('[SELECT ERROR] - ',err.message);
				  res.send("error");
				  return;
		        }
		        var array=new Array();
		        for(var i = 0; i < result.length; i++)
				{
					var item=new Object();
					item.id=result[i].id;
					item.avatar=result[i].avatar;
					item.name=result[i].name;
					array.push(item);
				}
				console.log(array);
				res.send(array);
			});
		 });
	});
})

app.post('/getHistoryMsg', function (req, res) {
	//var userid=req.session.userid;
	//本来直接读上述的session即可，但是不知道为什么读不到，只能在下面再重新读cookies
	var userid;
	if(userid==null){
		userid=readCookiesAndWriteSession(req);
	}
	console.log("getHistoryMsg"+userid);
    var post = '';     //定义了一个post变量，用于暂存请求体的信息
    req.on('data', function(chunk){    //通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
        post += chunk;
    });
    req.on('end', function(){    //在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
		console.log(post);
		var friendId=JSON.parse(post).friendId;
		var  sql1 = 'SELECT * FROM chatmsg WHERE sendid='+userid +' AND recid='+friendId+' ORDER BY stime asc';
		connection.query(sql1,function (err, result) {
			if(err){
			 console.log('[Select ERROR] - ',err.message);
			 return;
			}
			console.log("done");
			var result1=result;
			var  sql2 = 'SELECT * FROM chatmsg WHERE sendid='+friendId +' AND recid='+userid+' ORDER BY stime asc';
		    connection.query(sql2,function (err, result) {
		        if(err){
		          console.log('[SELECT ERROR] - ',err.message);
				  res.send("error");
				  return;
		        }
		        //排序
		        var response=new Array();
		        var m=0,n=0;
		        while(m<result1.length || n<result.length){
		        	if(result1.length==m){
		        		for(var k=n;k<result.length;k++){
		        			response.push(result[k]);
		        		}
		        		break;
		        	}
		        	if(result.length==n){
		        		for(var k=m;k<result1.length;k++){
		        			response.push(result1[k]);
		        		}
		        		break;
		        	}
		        	if(result1[m].stime<result[n].stime){
						response.push(result1[m]);
						m++;
					}
					else{
						response.push(result[n]);
						n++;
					}
		        }
				res.send(response);
			});
		});
    });
})

app.post('/searchByAccount', function (req, res) {
	var userid;
	if(userid==null){
		userid=readCookiesAndWriteSession(req);
	}
    var post = '';     //定义了一个post变量，用于暂存请求体的信息
    req.on('data', function(chunk){    //通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
        post += chunk;
    });
    req.on('end', function(){    //在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
		console.log(post);
		var account=JSON.parse(post).account;
		var  sql1 = "SELECT * FROM user WHERE account='"+account +"'";

		connection.query(sql1,function (err, result) {
			if(err){
			 console.log('[Select ERROR] - ',err.message);
			 return;
			}
			if(result.length!=0){//判断是否已经是好友
				var friendid=result[0].id;
				var obj=new Array();obj.push(result[0]);
				console.log(obj);
				var  sql2 = "SELECT * FROM friendlist WHERE uid='"+userid+"' and fid='"+friendid+"' and valid=1";
				connection.query(sql2,function (err, result) {
					if(err){
					 console.log('[Select ERROR] - ',err.message);
					 return;
					}

					console.log(result);

					if(result.length>0){//已经是好友
						obj[0].pswd="friend";
						res.send(obj);
						return;
					}
					else{
						var  sql3 = "SELECT * FROM friendlist WHERE uid='"+friendid+"' and fid='"+userid+"' and valid=1";
						connection.query(sql3,function (err, result) {
							if(err){
							 console.log('[Select ERROR] - ',err.message);
							 return;
							}
						});
						if(result.length>0){//已经是好友
							obj[0].pswd="friend";
						}
						else{//还不是好友
							obj[0].pswd="notfriend";
						}
						res.send(obj);
						return;
					}
				});
			}
			else{//没有查到用户
				res.send(result);
			}

		});
    });
})

app.post('/addNewFriend', function (req, res) {
	var userid;
	if(userid==null){
		userid=readCookiesAndWriteSession(req);
	}
    var post = '';     //定义了一个post变量，用于暂存请求体的信息
    req.on('data', function(chunk){    //通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
        post += chunk;
    });
    req.on('end', function(){    //在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
		console.log(post);
		var friendid=JSON.parse(post).friendid;

		var  sql1 = "SELECT * FROM friendlist WHERE uid='"+userid+"' and fid='"+friendid+"'";
		connection.query(sql1,function (err, result) {
			if(err){
			 console.log('[Select ERROR] - ',err.message);
			 return;
			}
			if(result.length<=0){//没有主动添加过好友
				var  sql2 = "SELECT * FROM friendlist WHERE fid='"+userid+"' and uid='"+friendid+"'";
				connection.query(sql2,function (err, result) {
					if(err){
					 console.log('[Select ERROR] - ',err.message);
					 return;
					}
					if(result.length<=0){//对方也没有请求过添加自己为好友
						var  AddSql = 'INSERT INTO friendlist(id,uid,fid,valid) VALUES(0,?,?,?)';
						var  AddSql_Params = [userid,friendid,0];
						//插入
						connection.query(AddSql,AddSql_Params,function (err, result) {
						if(err){
						 console.log('[INSERT ERROR] - ',err.message);
						 return;
						}

						console.log('--------------------------INSERT----------------------------');
						//console.log('INSERT ID:',result.insertId);
						console.log('INSERT ID:',result);
						console.log('-----------------------------------------------------------------\n\n');
						});
						res.send("success");
					}
					else{//对方曾经请求添加过自己为好友
						if(result[0].valid==1){//已经是好友
							res.send("friend");
						}
						else{//还不是好友
							var  AddSql = 'INSERT INTO friendlist(id,uid,fid,valid) VALUES(0,?,?,?)';
							var  AddSql_Params = [userid,friendid,0];
							//插入
							connection.query(AddSql,AddSql_Params,function (err, result) {
							if(err){
							 console.log('[INSERT ERROR] - ',err.message);
							 return;
							}

							console.log('--------------------------INSERT----------------------------');
							//console.log('INSERT ID:',result.insertId);
							console.log('INSERT ID:',result);
							console.log('-----------------------------------------------------------------\n\n');
							});
							res.send("success");
						}
					}
				});
			}
			else{//主动添加过对方为好友
				if(result[0].valid==1){//已经是好友
					res.send("friend");
				}
				else{//还不是好友
					res.send("addEver");
				}
			}
		});
    });
})

//获取News
app.get('/getNews',function (req, res) {
	var userid=req.session.userid;
	if(userid==null){
		userid=readCookiesAndWriteSession(req);
	}

	var userGetSql = "SELECT * FROM friendlist WHERE fid='"+userid+"' AND valid=0";
	console.log(userGetSql);
    connection.query(userGetSql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
		  res.send("error");
		  return;
        }
        var ids="";
		for(var i = 0; i < result.length; i++)
		{
			ids+=result[i].uid+",";
		}
		ids=ids.substring(0,ids.length-1);

        var Sql3 = "SELECT * FROM user WHERE id in ("+ids+")";
        connection.query(Sql3,function (err, result) {
				if(err){
		          console.log('[SELECT ERROR] - ',err.message);
				  res.send("error");
				  return;
		        }
				res.send(result);
		});
	});
})

app.post('/dealAddFriend', function (req, res) {
	var userid;
	if(userid==null){
		userid=readCookiesAndWriteSession(req);
	}
    var post = '';     //定义了一个post变量，用于暂存请求体的信息
    req.on('data', function(chunk){    //通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
        post += chunk;
    });
    req.on('end', function(){    //在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
		console.log(post);
		var friendid=JSON.parse(post).friendid;


		var Sql2 = 'UPDATE friendlist SET valid = 1 WHERE fid = ? and uid= ?';
		var Params2 = [userid,friendid];
		//改 up
		connection.query(Sql2,Params2,function (err, result) {
			if(err){
			 console.log('[UPDATE ERROR] - ',err.message);
			 return;
			}
			var Sql3 = 'UPDATE friendlist SET valid = 1 WHERE fid = ? and uid= ?';
			var Params3 = [friendid,userid];
			//改 up
			connection.query(Sql3,Params3,function (err, result) {
				if(err){
				 console.log('[UPDATE ERROR] - ',err.message);
				 return;
				}
				res.send("success");
			});
		});
		/*
		var  sql1 = "SELECT * FROM friendlist WHERE uid='"+userid+"' and fid='"+friendid+"'";
		connection.query(sql1,function (err, result) {
			if(err){
			 console.log('[Select ERROR] - ',err.message);
			 return;
			}
			if(result.length<=0){//没有主动添加过好友
				var  sql2 = "SELECT * FROM friendlist WHERE fid='"+userid+"' and uid='"+friendid+"'";
				connection.query(sql2,function (err, result) {
					if(err){
					 console.log('[Select ERROR] - ',err.message);
					 return;
					}
					if(result.length<=0){//对方也没有请求过添加自己为好友
						var  AddSql = 'INSERT INTO friendlist(id,uid,fid,valid) VALUES(0,?,?,?)';
						var  AddSql_Params = [userid,friendid,0];
						//插入
						connection.query(AddSql,AddSql_Params,function (err, result) {
						if(err){
						 console.log('[INSERT ERROR] - ',err.message);
						 return;
						}

						console.log('--------------------------INSERT----------------------------');
						//console.log('INSERT ID:',result.insertId);
						console.log('INSERT ID:',result);
						console.log('-----------------------------------------------------------------\n\n');
						});
						res.send("success");
					}
					else{//对方曾经请求添加过自己为好友
						if(result[0].valid==1){//已经是好友
							res.send("friend");
						}
						else{//还不是好友
							var  AddSql = 'INSERT INTO friendlist(id,uid,fid,valid) VALUES(0,?,?,?)';
							var  AddSql_Params = [userid,friendid,0];
							//插入
							connection.query(AddSql,AddSql_Params,function (err, result) {
							if(err){
							 console.log('[INSERT ERROR] - ',err.message);
							 return;
							}

							console.log('--------------------------INSERT----------------------------');
							//console.log('INSERT ID:',result.insertId);
							console.log('INSERT ID:',result);
							console.log('-----------------------------------------------------------------\n\n');
							});
							res.send("success");
						}
					}
				});
			}
			else{//主动添加过对方为好友
				if(result[0].valid==1){//已经是好友
					res.send("friend");
				}
				else{//还不是好友
					res.send("addEver");
				}
			}
		});
	*/

    });
})


function readCookiesAndWriteSession(req){
	var userid;
	var useraccount;
	//var username,useraccount
	console.log("cookies",req.headers.cookie);
  console.log("cookies.split:",req.headers.cookie.split(';'));
    req.headers.cookie && req.headers.cookie.split(';').forEach(function( Cookie ) {
        var parts = Cookie.split('=');
        console.log(parts);
        console.log(parts[0]);
        console.log(parts[1]);
        if(parts[0].trim()=="userid"){
        	userid=parts[1];
        }

        // if(parts[0].trim()=="username"){
        // 	username=parts[1];
        // }
        if(parts[0].trim()=="useraccount"){
        	useraccount=parts[1];
        }

    });
    console.log("userid:",userid);
    console.log("useraccount:",useraccount);
	req.session.userid=userid;
	//req.session.username=username;
	req.session.useraccount=useraccount;
	return userid;
	return useraccount;
}



//时间格式化
Date.prototype.Format = function(fmt)
{ //author: meizz
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}

// app.get('/deal', function (req, res) {
// 	var str="分享链接";
// 	res.send(replaceUrl(str));
// })

//替换
function replaceUrl(s) {
   var strRegex = '((https|http)://)[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+';
   var regex=new RegExp(strRegex,"gi");
   var arr=s.match(regex);
   if(arr!=null){
   		for(var j=0;j<arr.length;j++){
			console.log('arr',arr[0]);
		}
   }
    return s.replace(regex,function(arr){return '<a href="'+arr+'" target="_blank">'+'网页链接'+'</a>';});
}
