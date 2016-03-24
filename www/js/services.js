angular.module('starter.services', [])

.factory('friends', function($http) {
  // Might use a resource here that returns a JSON array
  var friends;
  console.log("try");
  $http({
      method : 'POST',
      url : 'http://localhost:8081/getFriendList'
    })
    .success(function(res) {
      console.log("success");
      friends = res;
    });

    var userInfo;
    $http({
        method : 'POST',
        url : 'http://localhost:8081/userInfo',
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' } // set the headers so angular passing info as form data (not request payload)
      })
      .success(function(res) {
        userInfo=res;
       // console.log("userInfo:"+userInfo);
    });

  return {
    all: function() {
      //return userInfo;
      return friends;
    },
    // remove: function(chat) {
    //   userInfo.splice(userInfo.indexOf(chat), 1);
    // },
    get: function(friendId) {
      if(friends!=null){
          for (var i = 0; i < friends.length; i++) {
            if (friends[i].id === parseInt(friendId)) {
              return friends[i];
            }
        }
      }
      return null;
    },
    getuserInfo:function(){
      return userInfo;
    },
    // get: function(chatId) {
    //   for (var i = 0; i < chats.length; i++) {
    //     if (chats[i].id === parseInt(chatId)) {
    //       return chats[i];
    //     }
    //   }
    //   return null;
    // }
  };
});

 