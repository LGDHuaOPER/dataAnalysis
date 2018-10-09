var currentHref = window.location.href.split("/")[0]+"//"+window.location.href.split("/")[2]+"/"+window.location.href.split("/")[3]; //当前网址
$(".top").load(currentHref+"/common/top.html");

$('.dataList').click(function(){
	window.location.href=currentHref+"/DataList"
})
$('.engineringAnalysis').click(function(){
	window.location.href=currentHref+"/ProjectAnalysis";
})
$('.dataStatistics').click(function(){
	window.location.href="../futureD/DataStatistics";
})
$("#top_admin").text('${userName}');
$('.account').click(function(){
	var account = $(this).text();
	window.location.href="../AdminPage/admin.jsp";
})
$(document).on("click","#help",function(){
	window.open(currentHref+"/common/futureD数据管理系统使用手册.html"); 
});


//弹窗
function PromptBox(status,title,msg1,msg2,callback){
	$(".PromptBoxCover").show();
	$(".PromptBox #PromptBox_btn").remove();
	if(status =="success"){
		$(".icon_ok").attr("src","../common/img/yes1.png");
		$(".bigicon").attr("src","../common/img/right1.png");
	}
	else{
		$(".icon_ok").attr("src","../common/img/error.png");
		$(".bigicon").attr("src","../common/img/warn.png");
	}
	$(".PromptBox .msg_tit_cont").text(title);
	$(".PromptBox .msg1").text(msg1);
	$(".PromptBox .msg2").text(msg2);
	if(msg2 ==""){
		$(".PromptBox #PromptBox_btn").css("margin-top","30px");
		$(".PromptBox .msg1").css("margin-top","30px");
	}
	else{
		$(".PromptBox #PromptBox_btn").css("margin-top","20px");
		$(".PromptBox .msg1").css("margin-top","20px");
	}
	if (typeof (callback) == 'function') {
		var str = '<input type="button" id="PromptBox_btn" value="确定" />';
       $(".PromptBox").append(str);
       $(document).on("click",".PromptBox #PromptBox_btn",function(){
    	   callback();
        })
  	}
	else{
		var str = '<input type="button" id="PromptBox_btn" value="确定" />'
        $(".PromptBox").append(str)
        $(document).on("click",".PromptBox #PromptBox_btn",function(){
        	$(".PromptBox").hide();
        	$(".PromptBoxCover").hide();
        })
	}
	$(".PromptBox .icon_close").click(function(){
    	$(".PromptBox").hide();
    	$(".PromptBoxCover").hide();
    })
	$(".PromptBox").show();
}


$(document).on('click','.top_tool_li4',function(){	  	
	 function test() {
		 $.ajax({
		      type : 'GET',
		      url : "../Logon",
		      dataType : 'json',
		      success : function (data) {
		    	 window.location.replace(currentHref+"/Login/login.jsp");
		 		 event.returnValue=false;
		      },
		      error : function () {
		      }
		  });
    }
	 PromptBox("error","提示信息!","确定要退出吗？","",test);
});


$(document).on('click','.top_tool_li1',function(){		
	var showorhide = $(this).attr("flag");
	if(showorhide == "true"){
		$(".top_tool_li1 dl").show();
		$(this).attr("flag","false");
	}
	else{
		$(".top_tool_li1 dl").hide();
		$(this).attr("flag","true");
	}
});
$("body").not(".top_tool_li1").click(function(){		
	$(".top_tool_li1 dl").hide();
	$(".top_tool_li1").attr("flag","true");
});
