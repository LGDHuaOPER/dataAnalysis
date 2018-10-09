
	$(function(){
		if( $("#username").val() != ""  && $("#psd").val() != ""){
			$(".sub").attr("disabled",false);
			$(".sub").addClass("newsubbg");
			$(".sub").css({"color": "#fff"});
			
		}
		//密码框小眼睛
		$(".psd_change").click(function(){
			var flag = $(this).attr("flag"); 
			if(flag == "show"){
				$(this).attr("flag","hide").attr("src","./image/hidepsd.png");
				$(this).prev().attr("type","text");
			}
			else{
				$(this).attr("flag","show").attr("src","./image/showpsd.png");
				$(this).prev().attr("type","password");
			}
		})
		//鼠标移开修改背景色
		$(".use-psd input").on("blur",function(){
			if($(this).val() != ""){
				$(this).css("box-shadow","0 0 0px 1000px white inset");
			}
			else{
				$(this).css("box-shadow","0 0 0px 1000px #f4f4f4 inset");
			}
		})
		$(".use-psd input").on("input propertychange",function(){
			if($("#username").val() != "" && $("#psd").val() != ""){
				$(".sub").attr("disabled",false);
				$(".sub").addClass("newsubbg");
				$(".sub").css({"color": "#fff"});
				
			}
			else{
				$(".sub").attr("disabled",true);
				$(".sub").removeClass("newsubbg");
				$(".sub").css({"background": "#f4f4f4","color": "#444444"});
				
			}
		})
		//登录
		$(".sub").click(function(){
			$(".sub").val("登录中...");
			$(".msgBox").hide();
			$(".login_contain .firstli").css("margin-top","45px");
			var username = $("#username").val();
			var psd = $("#psd").val();
			$.ajax({
			      type : 'GET',
			      url : '/futureD/Login',
			      data:{
						userName:username,
						password:psd
					},
			      dataType : 'json',
			      success : function (data) {
			    	  console.log(data)
			    	  if(data == "success"){
			    			var time =1;
			    			var timer =setInterval(function(){
			    				time--;
			    				if(time ==0){
			    					 window.location.href="../HomePage/home.jsp"
			    				}
			    			},1000)
			    	  }
			    	  else{
			    		  var time =1;
			    		  var timer1 =setTimeout(function(){
			    			  	time--;
			    				if(time ==0){
			    					 $(".msgBox").show();
									 $(".login_contain .firstli").css("margin-top","20px");
									 $(".msgBox_cont").text("用户名或密码不正确，请重新输入");
									 $(".sub").val("登录");
									 clearTimeout(timer1); 
			    				}
			    		  },500)
			    	  }
			      },
			      error : function () {
			      }
		    });
			
			
		})	
		/* $.ajax({
		      type : 'GET',
		      url : '../LoadVersion',
		      dataType : 'json',
		      success : function (data) {
		    	  var str = "版本号："+data;
		    	  $(".VersionBox").text(str)
		      },
		      error : function () {
		      }
		  });*/
	})