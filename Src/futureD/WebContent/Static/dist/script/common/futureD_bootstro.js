var futureD_bootstro_ipage=$("body").data("curpage");function futureD_bootstro_start(){bootstro.start(".bootstro",{nextButton:'<button type="button" class="btn btn-primary btn-xs bootstro-next-btn">下一步 <span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span></button>',prevButton:'<button type="button" class="btn btn-primary btn-xs bootstro-prev-btn"><span class="glyphicon glyphicon-arrow-left" aria-hidden="true"></span> 上一步</button>',finishButton:'<button type="button" class="btn btn-success btn-xs bootstro-finish-btn"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> 完成</button>',onComplete:function(t){swal({position:"center",type:"success",title:"页面引导完成提示",text:"您完成了总计"+(t.idx+1)+"个页面引导步骤，现在开始使用页面吧！",animation:!1,customClass:"animated zoomIn",showConfirmButton:!1,timer:2e3}).then(function(t){t.dismiss!=swal.DismissReason.backdrop&&t.dismiss!=swal.DismissReason.esc&&t.dismiss!=swal.DismissReason.timer||store.set("futureD_bootstro_"+futureD_bootstro_ipage,"finish")})},onExit:function(t){if(t.idx+1==t.count)return!1;swal({position:"center",type:"info",title:"页面引导退出提示",text:"您在第"+(t.idx+1)+"步退出了页面引导，可以点击帮助再次查看！",animation:!1,customClass:"animated zoomIn",showConfirmButton:!1,timer:2e3}).then(function(t){t.dismiss!=swal.DismissReason.backdrop&&t.dismiss!=swal.DismissReason.esc&&t.dismiss!=swal.DismissReason.timer||store.set("futureD_bootstro_"+futureD_bootstro_ipage,"exit")})},onStep:function(t){}})}$(function(){if(_.isNil(futureD_bootstro_ipage))return!1;var t=store.get("futureD_bootstro_"+futureD_bootstro_ipage);if("finish"==t||"exit"==t)return!1;futureD_bootstro_start()}),$(".g_info .glyphicon-question-sign").click(function(){$("div.bootstro-backdrop").remove(),futureD_bootstro_start()});