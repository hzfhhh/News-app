function submitComment(id){
	var content= document.getElementById("addcomment"+id).value;//评论的内容
	if(trim(content)==""){
		//alert("请填写评论");
		document.getElementById("addcomment"+id).value="";
		return;
	}
    var xmlHttp = null;
	if (window.ActiveXObject) {                                                       
    	xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");                                  
	} else if (window.XMLHttpRequest) {                                                     
   		xmlHttp = new XMLHttpRequest();                                                  
	}
	var data="id="+id+"&&&&content="+content;
	if (xmlHttp) {
		xmlHttp.open("POST", "http://localhost:8081/addComment", true);
		xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xmlHttp.send(data);
		xmlHttp.onreadystatechange = function () {
			if (xmlHttp.readyState == 4) {
				if (xmlHttp.status == 200) {
					if(xmlHttp.responseText=="success"){
						var div = document.createElement("ion-item");
						// 装载html字符串
						div.className="comment-item";
						div.innerHTML ='<span class="critic">我：</span><span class="content">'+content+'</span>';
						document.getElementById("addcomment"+id).value="";
						//var html='<ion-item class="comment-item"><span class="critic">我</span><span class="content">'+content+'</span></ion-item>';
    					document.getElementById("content"+id).appendChild(div);      

    					//评论数+1
    					document.getElementById("count"+id).innerHTML=parseInt(document.getElementById("count"+id).innerHTML)+1; 
					}
					else{
						alert("参数有误");
					}
					
				} else {
					alert("error");
				}
				
			}
		};
	}

 }


	function trim(str){
		return str.replace(/(^\s*)|(\s*$)/g,"");
	}