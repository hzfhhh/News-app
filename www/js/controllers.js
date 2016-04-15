angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http, friends) {
  $http({
      method : 'GET',
      url : 'http://192.168.191.1:8081/getIndex',
      //headers : { 'Content-Type': 'application/x-www-form-urlencoded' } // set the headers so angular passing info as form data (not request payload)
    })
   .success(function(res) {
      $scope.chats = res;
    });
  setTimeout(function(){$scope.user = friends.getuserInfo()},100);
    $scope.myVar = true;
    $scope.collect = function (id) {
      var data = {
        pbid: id
      };
      $http({
        method : 'POST',
        url : 'http://192.168.191.1:8081/insertCollect',
        data:data,
      });
    }
    $scope.toggle = function (id) {
     //$scope.myVar = !$scope.myVar;
     if(document.getElementById("comment"+id).style.display=="none"){
        document.getElementById("comment"+id).style.display="block";
     }
     else{
         document.getElementById("comment"+id).style.display="none";
     }
     if(document.getElementById("count"+id).innerHTML!="0"){
        $http({
          method : 'POST',
          url : 'http://192.168.191.1:8081/getComment',
          data : {id:id},
          headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        .success(function(res) {
          var content="<div id='content"+id+"' >";
          if(res.length>0){
            for(var i=0;i<res.length;i++){
               content+='<ion-item class="comment-item"><span class="critic">'+res[i].username+"："+'</span><span class="content">'+res[i].content+'</span></ion-item>';
            }
            content+="</div>";
          }
        content+='<input id="addcomment'+id+'" class="commentText" type="text" name="addcomment" placeholder="输入你的评论" /><button class="submitbtn button button-positive" onclick="submitComment('+id+')" >提交</button>';
        document.getElementById("comment"+id).innerHTML=content;
        console.log(res);
        });
     }
     else{
        var content="<div id='content"+id+"' ></div>";
        content+='<input id="addcomment'+id+'" class="commentText" type="text" name="addcomment" placeholder="输入你的评论" require/><input class="submitbtn button button-positive" onclick="submitComment('+id+')" type="button" value="提交" />';
        document.getElementById("comment"+id).innerHTML=content;
     }
  }
})


.controller('PublishCtrl',function($scope, $stateParams,FileUploader,$http){
  $scope.send = function () {
  //发送
  var imgarray='';
  var ImgClass = document.getElementsByTagName("strong");
  for(var i=0;i<ImgClass.length;i++){
    if(ImgClass[i]==""){
      imgarray='';
    } else {
          imgarray+='img/imgPublish/'+ImgClass[i].innerHTML+",";
    }

  }
  var data = {
    msg : document.getElementById("msg").value,
    img: imgarray
  };
  console.log(data.msg);
    $http({
      method : 'POST',
      url : 'http://192.168.191.1:8081/getMsg',
      data : data,
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(res) {
      console.log("success");
    });
    uploader.uploadAll();
    window.location.href = "http://192.168.191.1:8081/#/tab/dash";
    //document.getElementById("upload-all").click();
  }
  //添加图片
  $scope.toInput = function () {
  document.getElementById("upLoad").click();
  }
  //表情包
   $scope.emoji = function () {
    document.getElementById('emoji').addEventListener('click', function(e) {
            var emojiwrapper = document.getElementById('emojiWrapper');
            emojiwrapper.style.display = 'block';
            e.stopPropagation();
        }, false);
        document.body.addEventListener('click', function(e) {
            var emojiwrapper = document.getElementById('emojiWrapper');
            if (e.target != emojiwrapper) {
                emojiwrapper.style.display = 'none';
            };
        });
        document.getElementById('emojiWrapper').addEventListener('click', function(e) {
            var target = e.target;
            if (target.nodeName.toLowerCase() == 'img') {
                var messageInput = document.getElementById('messageInput');
                messageInput.focus();
                messageInput.value = messageInput.value + '[emoji:' + target.title + ']';
            };
        }, false);
         var emojiContainer = document.getElementById('emojiWrapper'),
            docFragment = document.createDocumentFragment();
        for (var i = 20; i > 0; i--) {
            var emojiItem = document.createElement('img');
            emojiItem.src = 'img/emoji/' + i + '.gif';
            emojiItem.title = i;
            docFragment.appendChild(emojiItem);
        };
        emojiContainer.appendChild(docFragment);
  };
  //上传图片
      var uploader = $scope.uploader = new FileUploader({
            url: 'http://192.168.191.1:8081/upload'
            //url:'upload.php'
        });
      uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        // CALLBACKS
        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.log($scope);
            console.info('onSuccessItem', fileItem, response, status, headers);
            //window.location.href="http://127.0.0.1:8088/msg?msg=123456";
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };
        console.info('uploader', uploader);

})

.controller('ChatsCtrl', function($scope,$http,$stateParams,friends) {
   $http({
      method : 'POST',
      url : 'http://192.168.191.1:8081/getFriendList'
    })
    .success(function(res) {
      $scope.friends = res;
    });
    $scope.friend = friends.get($stateParams.friendId);
    $scope.user=friends.getuserInfo();
    console.log("userinfo:"+friends.getuserInfo());
})

.controller('ChatDetailCtrl', function($http,$scope, $stateParams, friends) {
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
  var friend=friends.get($stateParams.friendId);
  $scope.friend = friend;
  console.log(friends.getuserInfo()[1]);
  var myInfo=friends.getuserInfo()[0];

  $scope.sendMsg=function(friendid){
    var msg=document.getElementById('msgContent').value;
    var time=new Date().Format("yyyy-MM-dd hh:mm:ss");
    console.log(msg);
    //if(msg=="")
     $http({
      method : 'POST',
      data:{msg:msg,
        receiveid:friendid},
      url : 'http://192.168.191.1:8081/addMsg',
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(res) {
      if(res=="success"){
        var div = document.createElement("div");
            // 装载html字符串
            div.innerHTML ='<div>'+
            '<img src="'+myInfo.avatar+'" style="width: 50px; height: 50px;border-radius :50%;">'+
            '<p class="msgitem">'+
            '</span><span>'+msg+'</span><p class="stime">'+time+'</p></p></div>';
            document.getElementById("msgContent").value="";
            document.getElementById("msgItems").appendChild(div);
          }
      else{
        alert("fail");
      }
    });

  }

  //查询历史消息
  $http({
      method : 'POST',
      data:{
        friendId:$stateParams.friendId
      },
      url : 'http://192.168.191.1:8081/getHistoryMsg',
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .success(function(res) {
      console.log("control get history msg :"+res);
      var result=new Array();
      var oneItem;
      for(var i=0;i<res.length;i++){
        oneItem=new Object();
        if(res[i].sendid==$stateParams.friendId){//该信息由对方发送
          oneItem.name=friend.name;
          oneItem.avatar=friend.avatar;
        }
        else{
          oneItem.name="我";
          oneItem.avatar=myInfo.avatar;
        }
        oneItem.msg=res[i].msg;
        oneItem.stime=res[i].stime;

        result.push(oneItem);
      }
      $scope.Msg=result;
    });



  $scope.emoji = function () {
  	document.getElementById('emoji').addEventListener('click', function(e) {
            var emojiwrapper = document.getElementById('emojiWrapper');
            emojiwrapper.style.display = 'block';
            e.stopPropagation();
        }, false);
        document.body.addEventListener('click', function(e) {
            var emojiwrapper = document.getElementById('emojiWrapper');
            if (e.target != emojiwrapper) {
                emojiwrapper.style.display = 'none';
            };
        });
        document.getElementById('emojiWrapper').addEventListener('click', function(e) {
            var target = e.target;
            if (target.nodeName.toLowerCase() == 'img') {
                var messageInput = document.getElementById('messageInput');
                messageInput.focus();
                messageInput.value = messageInput.value + '[emoji:' + target.title + ']';
            };
        }, false);
         var emojiContainer = document.getElementById('emojiWrapper'),
            docFragment = document.createDocumentFragment();
        for (var i = 20; i > 0; i--) {
            var emojiItem = document.createElement('img');
            emojiItem.src = 'img/emoji/' + i + '.gif';
            emojiItem.title = i;
            docFragment.appendChild(emojiItem);
        };
        emojiContainer.appendChild(docFragment);
  };
$scope.emojiW = function () {
	var emojiWrapper = document.getElementById("emojiWrapper");
	if (event.target ==emojiWrapper)
	{
		document.getElementById("emojiWrapper").style.display = 'none';
	}
};
$scope.initialEmoji = function() {
     var emojiContainer = document.getElementById('emojiWrapper'),
         docFragment = document.createDocumentFragment();
     for (var i = 69; i > 0; i--) {
         var emojiItem = document.createElement('img');
         emojiItem.src = 'img/emoji/' + i + '.gif';
         emojiItem.title = i;
         docFragment.appendChild(emojiItem);
     };
     emojiContainer.appendChild(docFragment);
   }

})
//个人信息管理
.controller('AccountCtrl', function($scope,friends) {
  setTimeout(function(){$scope.user = friends.getuserInfo()},100);
})

//收藏页面
.controller('CollectCtrl', function($scope, $http) {
  $http({
      method : 'GET',
      url : 'http://192.168.191.1:8081/getCollect',
      //headers : { 'Content-Type': 'application/x-www-form-urlencoded' } // set the headers so angular passing info as form data (not request payload)
    })
   .success(function(res) {
      $scope.chats = res;
      console.log(res);
    });
    $scope.myVar = true;
    $scope.toggle = function (id) {
     //$scope.myVar = !$scope.myVar;
     if(document.getElementById("comment"+id).style.display=="none"){
        document.getElementById("comment"+id).style.display="block";
     }
     else{
         document.getElementById("comment"+id).style.display="none";
     }
     if(document.getElementById("count"+id).innerHTML!="0"){
        $http({
          method : 'POST',
          url : 'http://192.168.191.1:8081/getComment',
          data : {id:id},
          headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        .success(function(res) {
          var content="<div id='content"+id+"' >";
          if(res.length>0){
            for(var i=0;i<res.length;i++){
               content+='<ion-item class="comment-item"><span class="critic">'+res[i].username+"："+'</span><span class="content">'+res[i].content+'</span></ion-item>';
            }
            content+="</div>";
          }
        content+='<input id="addcomment'+id+'" class="commentText" type="text" name="addcomment" placeholder="输入你的评论" /><button class="submitbtn button button-positive" onclick="submitComment('+id+')" >提交</button>';
        document.getElementById("comment"+id).innerHTML=content;
        console.log(res);
        });
     }
     else{
        var content="<div id='content"+id+"' ></div>";
        content+='<input id="addcomment'+id+'" class="commentText" type="text" name="addcomment" placeholder="输入你的评论" require/><input class="submitbtn button button-positive" onclick="submitComment('+id+')" type="button" value="提交" />';
        document.getElementById("comment"+id).innerHTML=content;
     }
  }
})



//请求添加好友页面
.controller('AddNewFriendCtrl', function($scope, $http) {
  console.log(document.getElementById("flag"));
  $scope.search = function () {
    var value=document.getElementById("account").value;
    if(trim(value)==""){
      alert("请输入账号");
      document.getElementById("account").value="";
      return;
    }

    $http({
      method : 'POST',
      data:{
        account:value
      },
      url : 'http://192.168.191.1:8081/searchByAccount',
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' } // set the headers so angular passing info as form data (not request payload)
    })
   .success(function(res) {
      if(res.length==0){
        alert("没有查找到该用户");
      }
      else{
         $scope.newFriend=res;
         /*
         if(res[0].pswd=="friend"){
            document.getElementById("flag").innerHTML="已添加";
         }
         else{
           document.getElementById("flag").innerHTML="添加好友";
         }
         */
         console.log(res);
      }
    });
  };


   $scope.addFriend= function (friendid) {
       $http({
        method : 'POST',
        data:{
          friendid:friendid
        },
        url : 'http://192.168.191.1:8081/addNewFriend',
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' } // set the headers so angular passing info as form data (not request payload)
      })
     .success(function(res) {
        if(res=="success"){
          alert("正在等待对方确认");
        }
        else if(res=="addEver"){
          alert("过去已请求添加，请耐心等待对方确认");
        }
        else if(res=="friend"){
          alert("你们已经是好友了");
        }
        console.log(res);
      });
   };


})

//处理好友添加请求
.controller('MyNewsCtrl', function($scope, $http) {
    $http({
    method : 'GET',
    url : 'http://192.168.191.1:8081/getNews'
    })
   .success(function(res) {
      console.log(res);
      $scope.newFriend=res;
    });

  $scope.dealResult = function (res,friendid,flag) {
    if(flag=="refuse"){
      res.splice(res.indexOf(friendid),1);
      return;
    }

    $http({
      method : 'POST',
      data:{
        friendid:friendid
      },
      url : 'http://192.168.191.1:8081/dealAddFriend',
      headers : { 'Content-Type': 'application/x-www-form-urlencoded' } // set the headers so angular passing info as form data (not request payload)
    })
   .success(function(res) {
      if(res=="success")
        alert("添加成功");
    });
  };

});
