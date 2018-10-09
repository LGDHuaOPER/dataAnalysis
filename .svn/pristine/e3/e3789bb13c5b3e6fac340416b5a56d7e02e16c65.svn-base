(function(){
	$.Response_Load = {
		// 加载前方法，可在有大量DOM操作之前调用，ajax里可在beforeSend里调用
		Before: function (title,message,speed){
			LoadGropOpen(title,message);
			if(speed==""||speed==null||speed==undefined){
				alertGroupOpen(".eoulu-response-load-bg",".eoulu-response-load",200);
			}else{
				alertGroupOpen(".eoulu-response-load-bg",".eoulu-response-load",speed);
			}
			
			$(window).on("resize",function(){
				alertResponse(".eoulu-response-load",250,355);
			});
		},
		// 加载期间方法，一般在有大量DOM操作并有ajax请求的beforeSend里调用
		Loading: function (message){
			LoadAlterText(message);
		},
		// 加载后方法，ajax里可在complete里调用
		After: function (message,speed,callback){
			LoadGropClose(message,speed);
			callback();
		}
	};

	var LoadGropOpen = function (title,message){
		if($(".eoulu-response-load").length == 0){
			var _html = "";
			_html += '<div class="eoulu-response-load-bg" style="display:none"></div><div class="eoulu-response-load" style="display:none"><div class="eoulu-response-load-tit">' + title + '</div><div class="eoulu-response-load-message"><img width="190" height="14"><p>'+message+'</p></div></div>';
			$("body").append(_html); 
			LoadGropCss();
		}else{
			$(".eoulu-response-load-tit").text(title);
			$(".eoulu-response-load-message p").text(message);
		}
	};

	var LoadGropCss = function (){
		// 背景巨幕样式
		$(".eoulu-response-load-bg").css({ 'width': '100%', 'height': '100%', 'z-index': '99998', 'position': 'fixed',
      'filter': 'Alpha(opacity=60)', 'background-color': 'rgba(10%,20%,30%,0.6)', 'top': '0', 'left': '0', 'opacity': '0.6'
    });
		// loading主体
		$(".eoulu-response-load").css({'position':'fixed','width':'355px','height':'190px','z-index':'99999','background-color':'rgba(255,255,255,0.9)','border-radius':'10px','font-family':'microsoft yahei'});
		alertResponse(".eoulu-response-load",250,355);
		// title
		$(".eoulu-response-load-tit").css({'height':'25px','line-height':'25px','font-size':'16px','color': '#FFF','padding': '2px 15px','background-color': '#3C4250','border-top-left-radius':'10px','border-top-right-radius':'10px'});
		$(".eoulu-response-load-message img").attr("src","common/img/load.gif");
		$(".eoulu-response-load-message img").css({'margin':'30px auto','width':'210px','height':'45px'});
		$(".eoulu-response-load-message").css({'margin':'5px auto','width':'350px','height':'165px','font-size':'16px','text-align':'center'});
		$(".eoulu-response-load-message p").css({'height': '30px', 'line-height': '30px','width':'350px','text-overflow':'ellipsis','white-space':'nowrap','overflow':'hidden','text-align':'center'});
	};

	var LoadAlterText = function (message){
		if($(".eoulu-response-load").length != 0){
			$(".eoulu-response-load-message p").text(message);
		}
	};

	var LoadGropClose = function (message,speed){
		if($(".eoulu-response-load").length != 0){
			$(".eoulu-response-load-message p").text(message);
			if(!speed){
				alertGroupDelayClose(".eoulu-response-load-bg",".eoulu-response-load",200);
			}else{
				alertGroupDelayClose(".eoulu-response-load-bg",".eoulu-response-load",speed);
				}
		}
	};
})();

 
    // 弹出框自适应
    function alertResponse(item,itemHeight,itemWidth) {
        // if ($(window).height() < itemHeight){
        //     $(item).css("top")
        // }
        var iH = Math.abs($(window).height() - itemHeight)/2;
        var iW = Math.abs($(window).width() - itemWidth)/2;
        $(item).css({"top":iH+"px","left":iW+"px"});
    }

    // 幕布与信息框
    function alertGroupOpen(bgItem,Item,speed) {
        $(bgItem).fadeIn(speed);
        $(Item).fadeIn(speed);
    }
    function alertGroupClose(bgItem,Item,speed) {
        $(bgItem).fadeOut(speed);
        $(Item).fadeOut(speed);
    }
    function alertGroupDelayClose(bgItem,Item,speed) {
        $(bgItem).delay(400).fadeOut(speed);
        $(Item).delay(450).fadeOut(speed);
    }

    function btnCanClick(aa) {
        return $(aa).attr("disabled",false).removeClass("btnDisabled");
    }

    function btnNotClick(aa) {
        return $(aa).attr("disabled","disabled").addClass("btnDisabled");
    }
