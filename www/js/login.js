angular.module('Login',[])

.controller('LoginCtrl',function ($scope,$http) {
	//注册
	$scope.sign = function() {
	 var data=
	 {
	 	name:$scope.name,
	 	account:$scope.account,
	 	password:$scope.password
	 };
	 $http({
      method : 'POST',
      url : 'http://192.168.191.1:8081/register',
      data:data,
      //params: {key: data},
      //data : {account : "xxx",password : "123"},
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' } // set the headers so angular passing info as form data (not request payload)
    })
    .success(function(res) {

    	if(res=="success"){
    		alert("注册成功");
    		// window.location.href="http://www.baidu.com";
    		document.getElementById("sign").style.display="none";
	      document.getElementById("login").style.display="block";
    	}
    	else if(res=="error"){
    		document.getElementById("err-sign").style.display="block";
    	}
    	else{
    		alert("服务器出错!");
    	}

	});
	}
	//登录
	$scope.login = function() {
		var data=
	 {
	 	account:$scope.account,
	 	password:$scope.password
	 };
	 $http({
      method : 'POST',
      url : 'http://192.168.191.1:8081/login',
      data:data,
      //params: {key: data},
      //data : {account : "xxx",password : "123"},
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' } // set the headers so angular passing info as form data (not request payload)
    })
    .success(function(res) {

    	if(res.length!=0&&res!="error"){
        var userid = "userid="+res[0];
        document.cookie = userid.toString();
        var username = "username="+res[1];
        document.cookie = username;
        var useraccount = "useraccount="+res[2];
        document.cookie = useraccount;
    		window.location.href="http://192.168.191.1:8081/#/tab/dash";
    	}
    	else if(res=="error"){
    		document.getElementById("err-login").style.display="block";
    	}
    	else{
    		alert("服务器出错!");
    	}
	});
	}

	//切换到注册页面
	$scope.toSign = function() {
    document.getElementById("toSign").style.display="none";
    document.getElementById("toLogin").style.display="block";
	  document.getElementById("sign").style.display="block";
	  document.getElementById("login").style.display="none";
	  document.getElementById("title").innerHTML="注册";
	}
	//切换到登录页面
	$scope.toLogin = function() {
    document.getElementById("toSign").style.display="block";
    document.getElementById("toLogin").style.display="none";
	  document.getElementById("sign").style.display="none";
	  document.getElementById("login").style.display="block";
	  document.getElementById("title").innerHTML="登录";
	}
})
