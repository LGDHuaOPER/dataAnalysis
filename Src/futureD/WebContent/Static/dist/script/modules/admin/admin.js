var adminSwalMixin=swal.mixin({confirmButtonClass:"btn btn-success",cancelButtonClass:"btn btn-danger",buttonsStyling:!0,animation:!1,customClass:"animated zoomIn"}),adminState=new Object;function staffSubmitBtn(t,e){0==$(".staff_"+e+"_r_bodyin div.row>div:nth-child(3)>.glyphicon-info-sign").length?$(".staff_"+e+"_r_foot>.btn-primary").prop("disabled",!1):1==$(".staff_"+e+"_r_bodyin div.row>div:nth-child(3)>.glyphicon-info-sign").length&&t.parent().next().children(".glyphicon-info-sign").length?$(".staff_"+e+"_r_foot>.btn-primary").prop("disabled",!1):$(".staff_"+e+"_r_foot>.btn-primary").prop("disabled",!0)}function adminRender(n,t,e){var a;if(adminState.staffPageObj.currentPage=n,t?(a=futuredGlobal.S_getAdmin_staff(),store.set("futureDT2__userDB",a)):a=store.get("futureDT2__userDB"),a){var i=[];_.forOwn(a,function(t){i.push(t)});var r=_.chunk(i,10),o="";null==r[n-1]?adminSwalMixin({title:"异常",text:"mock数据失败！无数据",type:"error",showConfirmButton:!1,timer:2e3}):_.forEach(r[n-1],function(a,t,e){var i=_.find(adminState.adminRoleMap,function(t,e){return e==a.role_id.value});o+='<tr><td class="not_search"><input type="checkbox" data-ivalue="'+a.user_id.value+'" data-iname="'+a.user_name.value+'"></td><td data-itext="'+(10*(n-1)+t+1)+'">'+(10*(n-1)+t+1)+'</td><td class="td__user_name" title="'+a.user_name.value+'" data-itext="'+a.user_name.value+'" data-ivalue="'+a.user_name.value+'">'+a.user_name.value+'</td><td class="td__sex" title="'+a.sex.value+'" data-itext="'+a.sex.value+'" data-ivalue="'+a.sex.value+'">'+a.sex.value+'</td><td class="td__telephone" title="'+a.telephone.value+'" data-itext="'+a.telephone.value+'" data-ivalue="'+a.telephone.value+'">'+a.telephone.value+'</td><td class="td__email" title="'+a.email.value+'" data-itext="'+a.email.value+'" data-ivalue="'+a.email.value+'">'+a.email.value+'</td><td class="td__role_id" data-ivalue="'+a.role_id.value+'" title="'+i+'" data-itext="'+i+'">'+i+'</td><td class="td__password not_search" data-ivalue="'+a.password.value+'">'+a.password.value+'</td><td class="td__authority not_search" data-ivalue="'+a.authority.value+'"></td><td class="td__operate not_search"><span class="glyphicon glyphicon-edit" aria-hidden="true" title="修改" data-ivalue="'+a.user_id.value+'" data-iname="'+a.user_name.value+'"></span><span class="glyphicon glyphicon-user" aria-hidden="true" title="授权" data-ivalue="'+a.user_id.value+'" data-iname="'+a.user_name.value+'"></span><span class="glyphicon glyphicon-trash" aria-hidden="true" title="删除" data-ivalue="'+a.user_id.value+'" data-iname="'+a.user_name.value+'"></span></td></tr>'}),$(".staffManage_body tbody").empty().append(o),adminState.staffPageObj.pageCount=r.length,adminState.staffPageObj.itemLength=i.length,1==e&&(_.forEach(adminState.staffSellectObj.selectItem,function(t){$(".staffManage_body tbody .td__user_name[title='"+String(t)+"']").siblings("td:eq(0)").children("input").prop("checked",!0).parent().parent().addClass("warning").removeClass("info")}),$("#checkAll").prop("checked",adminState.staffPageObj.itemLength==adminState.staffSellectObj.selectItem.length),adminState.staffSellectObj.selectAll=$("#checkAll").prop("checked"))}else adminSwalMixin({title:"异常",text:"mock数据失败！请登录",type:"error",showConfirmButton:!1,timer:2e3}),adminState.staffPageObj.currentPage=0,adminState.staffPageObj.pageCount=0,adminState.staffPageObj.itemLength=0,window.location.assign("login.html")}function operateRendaer(i){var t=_.cloneDeep(adminState.operateChunkArr[i-1]),n="";_.forEach(t,function(t,e,a){n+='<tr><td class="not_search"><input type="checkbox" data-ivalue="'+t.log_id.value+'"></td><td data-itext="'+(10*(i-1)+e+1)+'">'+(10*(i-1)+e+1)+'</td><td title="'+t.user_name.value+'" data-itext="'+t.user_name.value+'">'+t.user_name.value+'</td><td title="'+t.page.value+'" data-itext="'+t.page.value+'">'+t.page.value+'</td><td title="'+t.description.value+'" data-itext="'+t.description.value+'">'+t.description.value+'</td><td title="'+t.gmt_create.value+'" data-itext="'+t.gmt_create.value+'">'+t.gmt_create.value+'</td><td title="'+t.ip_address.value+'" data-itext="'+t.ip_address.value+'">'+t.ip_address.value+'</td><td title="'+t.location.value+'" data-itext="'+t.location.value+'">'+t.location.value+"</td></tr>"}),$(".operaDailyLog_body tbody").empty().append(n)}adminState.futureDT2__session=store.get("futureDT2__session"),adminState.staffUpdateUser="",adminState.staffAuthorityUser="",adminState.adminRoleMap={1:"成员",2:"管理员",3:"超级管理员"},adminState.staffPageObj={selector:null,pageOption:null,currentPage:null,pageCount:null,itemLength:1},adminState.staffHasSearch=!1,adminState.staffSellectObj={selectAll:!1,selectItem:[]},adminState.operatePageObj={selector:null,pageOption:null,currentPage:null,pageCount:null,itemLength:1},adminState.operateHasSearch=!1,adminState.operateSellectObj={selectAll:!1,selectItem:[]},adminState.hasRequestData=!1,adminState.operatePageArr=["管理员","数据列表","工程分析","数据统计"],adminState.operateDescriptionArr=["添加","修改","删除","查询"],adminState.cityIpMap={"北京":{ip:"123.125.71.73",inde:0},"上海":{ip:"114.80.166.240",inde:1},"天津":{ip:"125.39.9.34",inde:2},"重庆":{ip:"106.95.255.253",inde:3},"苏州":{ip:"58.192.191.255",inde:4},"成都":{ip:"218.89.23.4",inde:5}},adminState.operateChunkArr=[],adminState.authorityRender=!1,$(function(){adminRender(1,!1),adminState.staffPageObj.selector="#pagelist",adminState.staffPageObj.pageOption={limit:10,count:adminState.staffPageObj.itemLength,curr:1,ellipsis:!0,pageShow:2,hash:!1,callback:function(t){adminState.staffPageObj.currentPage=t.curr,t.isFirst||(adminRender(t.curr,!1),adminState.staffHasSearch&&$("#search_button").trigger("click"),$(".staffManage_body tbody .td__user_name").each(function(){-1<_.indexOf(adminState.staffSellectObj.selectItem,$(this).attr("title").toString())&&$(this).siblings("td:eq(0)").children("input").prop("checked",!0).parent().parent().addClass("warning").removeClass("info")}))}},new Pagination(adminState.staffPageObj.selector,adminState.staffPageObj.pageOption),$("#jumpText").on("input propertychange",function(){$(this).val($(this).val().replace(/[^\d]/g,""))}),$("#jumpPage").on("click",function(){var t=Number($("#jumpText").val()),e=Number(adminState.staffPageObj.currentPage),a=Number(adminState.staffPageObj.pageCount);e==t||t<=0||a<t?$("#jumpText").val(""):(adminState.staffPageObj.pageOption.curr=t,new Pagination(adminState.staffPageObj.selector,adminState.staffPageObj.pageOption),adminRender(t,!1),adminState.staffHasSearch&&$("#search_button").trigger("click"))}),$(".staffManage_tit_l>.glyphicon-refresh").click(function(){adminRender(1,!0)}),$(".staffManage_tit_l .glyphicon-trash").click(function(){var i=store.get("futureDT2__userDB");if(!i)return adminSwalMixin({title:"异常",text:"mock数据失败！请登录",type:"error",showConfirmButton:!1,timer:2e3}),window.location.assign("login.html"),!1;if(0==adminState.staffSellectObj.selectItem.length)return swal({position:"center",type:"info",title:"未选中数据！",showConfirmButton:!1,timer:1500,animation:!1,customClass:"animated zoomIn"}),!1;var t=adminState.futureDT2__session;if(_.isNil(t))return adminSwalMixin({title:"异常",text:"删除数据失败！请登录",type:"error",showConfirmButton:!1,timer:2e3}),window.location.assign("login.html"),!1;adminState.staffSellectObj.selectItem.map(function(t,e,a){if("3"==i[t].role_id.value)return adminSwalMixin({title:"异常",text:"超级管理员不能被删除！",type:"error",showConfirmButton:!1,timer:2e3}),!1}),adminSwalMixin({title:"确定删除吗？",text:"删除后该用户不再存在，点击刷新按钮可以重置数据！",type:"warning",showCancelButton:!0,confirmButtonText:"确定，删除！",cancelButtonText:"不，取消！",reverseButtons:!1}).then(function(t){if(t.value){var e=adminState.staffSellectObj.selectItem,a=1;adminState.staffSellectObj.selectAll&&(a=0),_.forEach(e,function(t){delete i[t],store.set("futureDT2__userDB",_.cloneDeep(i))}),adminRender(a,!1),adminState.staffHasSearch&&$("#search_button").trigger("click"),adminState.staffPageObj.pageOption.count=adminState.staffPageObj.itemLength,adminState.staffPageObj.pageOption.curr=a,new Pagination(adminState.staffPageObj.selector,adminState.staffPageObj.pageOption),adminState.staffSellectObj.selectItem=[],adminState.staffSellectObj.selectAll&&($("#checkAll").prop("checked",!1),adminState.staffSellectObj.selectAll=!1),adminSwalMixin({title:"删除成功！",text:"被选中的记录已经删除",type:"success",showConfirmButton:!1,timer:1800})}else t.dismiss===swal.DismissReason.cancel&&adminSwalMixin({title:"取消了！",text:"不作处理",type:"error",showConfirmButton:!1,timer:1800})})}),$(document).on("click",".staffManage_body tbody td.not_search .glyphicon.glyphicon-trash",function(t){t.stopPropagation();var n=$(this);if(3==n.parent().siblings(".td__role_id").data("ivalue"))return adminSwalMixin({title:"异常",text:"超级管理员不能被删除",type:"error",showConfirmButton:!1,timer:2e3}),!1;var e=adminState.futureDT2__session;return _.isNil(e)?(adminSwalMixin({title:"异常",text:"删除数据失败！请登录",type:"error",showConfirmButton:!1,timer:2e3}),window.location.assign("login.html"),!1):n.parent().siblings(".td__role_id").data("ivalue")>e.data.role_id.value?(adminSwalMixin({title:"异常",text:"权限不足，您删除不了角色等级大于您的用户",type:"error",showConfirmButton:!1,timer:2e3}),!1):void adminSwalMixin({title:"确定删除吗？",text:"删除后该用户不再存在，点击刷新按钮可以重置数据！",type:"warning",showCancelButton:!0,confirmButtonText:"确定，删除！",cancelButtonText:"不，取消！",reverseButtons:!1}).then(function(t){if(t.value){var e;e=adminState.staffPageObj.currentPage<adminState.staffPageObj.pageCount?adminState.staffPageObj.currentPage:adminState.staffPageObj.itemLength%10!=1?adminState.staffPageObj.currentPage:adminState.staffPageObj.currentPage-1;var a=n.data("iname").toString(),i=store.get("futureDT2__userDB");if(!i)return adminSwalMixin({title:"异常",text:"mock数据失败！请登录",type:"error",showConfirmButton:!1,timer:2e3}),window.location.assign("login.html"),!1;delete i[a],store.set("futureDT2__userDB",_.cloneDeep(i)),adminRender(e,!1,!0),adminState.staffHasSearch&&$("#search_button").trigger("click"),adminState.staffPageObj.pageOption.count=adminState.staffPageObj.itemLength,adminState.staffPageObj.pageOption.curr=e,new Pagination(adminState.staffPageObj.selector,adminState.staffPageObj.pageOption),_.pull(adminState.staffSellectObj.selectItem,a),adminSwalMixin({title:"删除成功！",text:"被选中的记录已经删除",type:"success",showConfirmButton:!1,timer:1800})}else t.dismiss===swal.DismissReason.cancel&&adminSwalMixin({title:"取消了！",text:"不作处理",type:"error",showConfirmButton:!1,timer:1800})})}),$(document).on("click",".staffManage_body tbody td.not_search .glyphicon.glyphicon-edit",function(t){t.stopPropagation();var e=$(this),a=e.parent();3==e.parent().siblings(".td__role_id").data("ivalue")?$(".staff_update #staff_update_role_id option[value='3']").prop({selected:!0,disabled:!1}).parent().attr("readonly","readonly").prop("disabled",!0):($(".staff_update #staff_update_role_id option[value='请选择用户角色']").prop({selected:!0}).parent().removeAttr("readonly").prop("disabled",!1),$(".staff_update #staff_update_role_id option[value='3']").prop("disabled",!0));var i=adminState.futureDT2__session;return _.isNil(i)?(adminSwalMixin({title:"异常",text:"修改数据失败！请登录",type:"error",showConfirmButton:!1,timer:2e3}),window.location.assign("login.html"),!1):e.parent().siblings(".td__role_id").data("ivalue")>i.data.role_id.value?(adminSwalMixin({title:"异常",text:"权限不足，您修改不了超级管理员",type:"error",showConfirmButton:!1,timer:2e3}),!1):($("[id^='staff_update_']").each(function(){if($(this).is("#staff_update_password2"))return!0;var t=$(this).attr("id").replace("staff_update_","td__"),e=a.siblings("."+t).data("ivalue");_.isNil(e)&&(e=""),$(this).val(e.toString()),$(this).is("#staff_update_user_name")&&(adminState.staffUpdateUser=e.toString())}),$(".futureDT2_bg_cover, .staff_update").slideDown(250),void $(".staff_update_l, .staff_update_r").height($(".staff_update").height()))}),$(".staff_update_r_foot .btn-warning").click(function(){$(".futureDT2_bg_cover, .staff_update").slideUp(250),adminState.staffUpdateUser=""})}),$(document).on("mouseover",".staffManage_body td",function(){$(this).addClass("warning"),$(this).parent().addClass("info")}).on("mouseout",".staffManage_body td",function(){$(this).removeClass("warning"),$(this).parent().removeClass("info")}).on("click",".staffManage_body td",function(){$(this).parent().toggleClass("warning info").find("[type='checkbox']").prop("checked",!$(this).parent().find("[type='checkbox']").prop("checked")).change()}).on("click",".staffManage_body tbody [type='checkbox']",function(t){t.stopPropagation(),$(this).parent().parent().toggleClass("warning info")}).on("change",".staffManage_body tbody [type='checkbox']",function(){var t=$(this).data("iname").toString();$(this).prop("checked")?adminState.staffSellectObj.selectItem.push(t):_.pull(adminState.staffSellectObj.selectItem,t),adminState.staffSellectObj.selectItem=_.uniq(adminState.staffSellectObj.selectItem),$("#checkAll").prop("checked",adminState.staffPageObj.itemLength==adminState.staffSellectObj.selectItem.length),adminState.staffSellectObj.selectAll=$("#checkAll").prop("checked")}),$("#checkAll").on({click:function(){var t=$(this);$(".staffManage_body tbody [type='checkbox']").each(function(){$(this).prop("checked",t.prop("checked")),t.prop("checked")?$(this).parent().parent().removeClass("info").addClass("warning"):$(this).parent().parent().removeClass("warning info")}),adminState.staffSellectObj.selectAll=t.prop("checked"),t.prop("checked")?(adminState.staffSellectObj.selectItem=[],_.forOwn(store.get("futureDT2__userDB"),function(t,e,a){adminState.staffSellectObj.selectItem.push(e.toString())})):adminState.staffSellectObj.selectItem=[]}}),$(".staffManage_tit_r_in .form-control-feedback").click(function(){$(this).prev().children("input").val("")}),$("#search_button").on("click",function(){var i=$("#search_input").val().trim();return $(".staffManage_body tbody td:not(.not_search)").each(function(){var t=_.isNil($(this).data("itext"))?"":$(this).data("itext");$(this).empty().text(t)}),""==i?adminState.staffHasSearch=!1:($(".staffManage_body tbody td:not(.not_search)").each(function(){var t=$(this).text(),e="<b style='color:red'>"+i+"</b>",a=t.replace(new RegExp(i,"g"),e);$(this).empty().html(a)}),!(adminState.staffHasSearch=!0))}),$("#search_input").on("input propertychange change",function(){""!=$(this).val().trim()?$(this).parent().parent().next().removeClass("btn-default").addClass("btn-primary").prop("disabled",!1):($(this).val(""),$(this).parent().parent().next().removeClass("btn-primary").addClass("btn-default").prop("disabled",!0))}).on("keyup",function(t){13==(t.keyCode||t.which||t.charCode)&&""!=$(this).val().trim()&&$(this).parent().parent().next().trigger("click")}),$(".staffManage_tit_l>.glyphicon-remove-circle").click(function(){$(".futureDT2_bg_cover, .staff_addition").slideDown(250),$(".staff_addition_l, .staff_addition_r").height($(".staff_addition").height())}),$(".staff_addition_r_foot .btn-warning").click(function(){$(".futureDT2_bg_cover, .staff_addition").slideUp(250)}),$(".isRequired").on("input propertychange change",function(){var t,e,a=$(this);$(this).parents(".staff_addition").length?e="addition":$(this).parents(".staff_update").length&&(e="update"),""===$(this).val().trim()||null==$(this).val()?(t='<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>',$(".staff_"+e+"_r_foot>.btn-primary").prop("disabled",!0)):$(this).is("#staff_"+e+"_password2")&&$("#staff_"+e+"_password").val()!=$("#staff_"+e+"_password2").val()?(t='<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> 两次输入不一致',$(".staff_"+e+"_r_foot>.btn-primary").prop("disabled",!0)):(t='<span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span>',staffSubmitBtn(a,e)),$(this).parent().next().empty().append(t)}),$("#staff_addition_telephone, #staff_update_telephone").on("input propertychange change",function(){var t,e;if($(this).parents(".staff_addition").length?t="addition":$(this).parents(".staff_update").length&&(t="update"),""==$(this).val())return staffSubmitBtn($(this),t),$(this).parent().next().empty(),!1;var a=new RegExp(eouluGlobal.S_getRegExpList("mobile").newRegExp),i=new RegExp(eouluGlobal.S_getRegExpList("telephone").newRegExp);a.test($(this).val())||i.test($(this).val())?(e='<span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span>',staffSubmitBtn($(this),t)):(e='<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>',$(".staff_"+t+"_r_foot>.btn-primary").prop("disabled",!0));$(this).parent().next().empty().append(e)}),$("#staff_addition_email, #staff_update_email").on("input propertychange change",function(){var t,e;if($(this).parents(".staff_addition").length?t="addition":$(this).parents(".staff_update").length&&(t="update"),""==$(this).val())return staffSubmitBtn($(this),t),$(this).parent().next().empty(),!1;new RegExp(eouluGlobal.S_getRegExpList("email").newRegExp).test($(this).val())?(e='<span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span>',staffSubmitBtn($(this),t)):(e='<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>',$(".staff_"+t+"_r_foot>.btn-primary").prop("disabled",!0));$(this).parent().next().empty().append(e)}),$("#staff_addition_user_name").on("input propertychange change",function(){var a=$("#staff_addition_user_name").val().trim();if(""==a)return t='<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>',$(".staff_addition_r_foot>.btn-primary").prop("disabled",!0),$(this).parent().next().empty().append(t),!1;var t,e=store.get("futureDT2__userDB");(_.isEmpty(e)||_.isNil(e))&&(e=futuredGlobal.S_getAdmin_staff()),_.isNil(_.find(e,function(t,e){return e==a}))?(t='<span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span>',staffSubmitBtn($(this),"addition")):(t='<span class="glyphicon glyphicon-info-sign" aria-hidden="true">用户名已存在</span>',$(".staff_addition_r_foot>.btn-primary").prop("disabled",!0)),$(this).parent().next().empty().append(t)}),$("#staff_update_user_name").on("input propertychange change",function(){var t=$("#staff_update_user_name").val().trim();if(""==t)return str='<span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>',$(".staff_update_r_foot>.btn-primary").prop("disabled",!0),$(this).parent().next().empty().append(str),!1;var e=store.get("futureDT2__userDB");(_.isEmpty(e)||_.isNil(e))&&(e=futuredGlobal.S_getAdmin_staff());var a=[];_.forOwn(e,function(t,e){e!=adminState.staffUpdateUser&&a.push(e)}),-1<_.indexOf(a,t)?(str='<span class="glyphicon glyphicon-info-sign" aria-hidden="true">用户名已存在</span>',$(".staff_update_r_foot>.btn-primary").prop("disabled",!0)):(str='<span class="glyphicon glyphicon-ok-sign" aria-hidden="true"></span>',staffSubmitBtn($(this),"update")),$(this).parent().next().empty().append(str)}),$(".row .has-feedback .form-control-feedback").click(function(){$(this).is(".glyphicon-eye-open")?$(this).prev().attr("type","text"):$(this).is(".glyphicon-eye-close")&&$(this).prev().attr("type","password"),$(this).toggleClass("glyphicon-eye-open glyphicon-eye-close")}),$(".staff_addition_r_foot>.btn-primary").click(function(){var e,a=$("#staff_addition_user_name").val().trim(),t=store.get("futureDT2__userDB");if((_.isEmpty(t)||_.isNil(t))&&(t=futuredGlobal.S_getAdmin_staff()),_.forOwn(t,function(t){return e=t,!1}),!_.isNil(_.find(t,function(t,e){return e==a})))return adminSwalMixin({title:"添加成员异常",text:"该成员已存在！请更改",type:"error",showConfirmButton:!1,timer:2500}),!1;var i=Number(_.last(_.sortBy(t,function(t){return t.user_id.value})).user_id.value)+1,n=_.cloneDeep(e);n.user_name.value=a,n.user_id.value=i,n.telephone.value=$("#staff_addition_telephone").val().trim(),n.sex.value=$("#staff_addition_sex").val().trim(),n.role_id.value=$("#staff_addition_role_id").val().trim(),n.password.value=$("#staff_addition_password").val().trim(),n.last_login.value=null,n.gmt_create.value=moment().format("YYYY-MM-DD HH:mm:ss"),n.email.value=$("#staff_addition_email").val().trim(),n.current_login.value=null,n.authority.value=[];var r={};r[a]=n,store.set("futureDT2__userDB",_.assign(t,r)),adminSwalMixin({title:"添加成员成功",text:"成员已添加，现在可以使用该账户登录了",type:"success",showConfirmButton:!1,timer:2500}),$(".staff_addition_r_foot .btn-warning").trigger("click"),setTimeout(function(){window.location.reload()},2e3)}),$(".staff_update_r_foot>.btn-primary").click(function(){var t=$("#staff_update_user_name").val().trim(),e=store.get("futureDT2__userDB");(_.isEmpty(e)||_.isNil(e))&&(e=futuredGlobal.S_getAdmin_staff());var a=_.find(e,function(t,e){return e==adminState.staffUpdateUser}),i=[];if(_.forOwn(e,function(t,e){e!=adminState.staffUpdateUser&&i.push(e)}),-1<_.indexOf(i,t))return adminSwalMixin({title:"修改成员异常",text:"您修改了用户名，修改后的用户名重复！请更改",type:"error",showConfirmButton:!1,timer:2500}),!1;delete e[adminState.staffUpdateUser];var n=Number(_.last(_.sortBy(e,function(t){return t.user_id.value})).user_id.value)+1,r=_.cloneDeep(a);r.user_name.value=t,r.user_id.value=n,r.telephone.value=$("#staff_update_telephone").val().trim(),r.sex.value=$("#staff_update_sex").val().trim(),r.role_id.value=$("#staff_update_role_id").val().trim(),r.password.value=$("#staff_update_password").val().trim(),r.email.value=$("#staff_update_email").val().trim();var o={};if(o[t]=r,store.set("futureDT2__userDB",_.assign(e,o)),adminState.futureDT2__session.data.user_name.value==adminState.staffUpdateUser){var s={};s.expires=adminState.futureDT2__session.expires,s.data=r,store.set("futureDT2__session",s)}adminSwalMixin({title:"修改成员成功",text:"成员已修改，现在可以使用该账户登录了",type:"success",showConfirmButton:!1,timer:2500}),$(".staff_update_r_foot .btn-warning").trigger("click"),setTimeout(function(){window.location.reload()},2e3)}),$('a[data-toggle="tab"]').on("shown.bs.tab",function(t){if($(".g_info .glyphicon-question-sign").show(),"operaDailyLog"==$(t.target).parent().data("iclassify")&&($(".g_info .glyphicon-question-sign").hide(),!adminState.hasRequestData)){var e=store.get("futureDT2__userDB");if(_.isEmpty(e)||_.isNil(e))return adminSwalMixin({title:"异常",text:"Mock数据失败！请登录",type:"error",showConfirmButton:!1,timer:2e3}),window.location.assign("login.html"),!1;var a=[],r=[];_.forOwn(e,function(t,e,a){r.push(e)});var o=store.get("futureDT2__admin__operation");_.isNil(o)?(o=futuredGlobal.S_getAdmin_operation(),_.times(63,function(i){var t=_.cloneDeep(o[0]),n=String(i+1);_.forOwn(t,function(t,e,a){if(null===t.detail)a[e].value=_.padEnd(t.value,t.value.length+n.length,n);else switch(t.detail){case"user_name":a[e].value=r[i%r.length];break;case"page":a[e].value=adminState.operatePageArr[i%adminState.operatePageArr.length];break;case"description":a[e].value=adminState.operateDescriptionArr[i%adminState.operateDescriptionArr.length]+n;break;case"time":a[e].value=moment().add(Number(n),"days").format("YYYY-MM-DD HH:mm:ss");break;case"ip_address":a[e].value=_.find(adminState.cityIpMap,function(t,e){return t.inde==i%6}).ip;break;default:a[e].value=_.findKey(adminState.cityIpMap,function(t,e){return t.inde==i%6})}}),a.push(t)}),store.set("futureDT2__admin__operation",_.cloneDeep(a))):a=o,adminState.operateChunkArr=_.chunk(a,10),adminState.operatePageObj.pageCount=adminState.operateChunkArr.length,adminState.operatePageObj.itemLength=a.length;var i=1;0==adminState.operatePageObj.pageCount&&(i=0),operateRendaer(adminState.operatePageObj.currentPage=i),adminState.operatePageObj.selector="#pagelist2",adminState.operatePageObj.pageOption={limit:10,count:adminState.operatePageObj.itemLength,curr:1,ellipsis:!0,pageShow:2,hash:!1,callback:function(t){adminState.operatePageObj.currentPage=t.curr,t.isFirst||(operateRendaer(t.curr),adminState.operateHasSearch&&$("#search_button2").trigger("click"),$(".operaDailyLog_body tbody [type='checkbox']").each(function(){-1<_.indexOf(adminState.operateSellectObj.selectItem,$(this).data("ivalue").toString())&&$(this).prop("checked",!0).parent().parent().addClass("warning").removeClass("info")}))}},new Pagination(adminState.operatePageObj.selector,adminState.operatePageObj.pageOption),adminState.hasRequestData=!0}}),$("#jumpText2").on("input propertychange",function(){$(this).val($(this).val().replace(/[^\d]/g,""))}),$("#jumpPage2").on("click",function(){var t=Number($("#jumpText2").val()),e=Number(adminState.operatePageObj.currentPage),a=Number(adminState.operatePageObj.pageCount);e==t||t<=0||a<t?$("#jumpText2").val(""):(adminState.operatePageObj.pageOption.curr=t,new Pagination(adminState.operatePageObj.selector,adminState.operatePageObj.pageOption),operateRendaer(t),adminState.operateHasSearch&&$("#search_button2").trigger("click"))}),$("#search_button2").on("click",function(){var i=$("#search_input2").val().trim();return""==i?($(".operaDailyLog_body tbody td:not(.not_search)").each(function(){var t=_.isNil($(this).data("itext"))?"":$(this).data("itext");$(this).empty().text(t)}),adminState.operateHasSearch=!1):($(".operaDailyLog_body tbody td:not(.not_search)").each(function(){var t=$(this).text(),e="<b style='color:red'>"+i+"</b>",a=t.replace(new RegExp(i,"g"),e);$(this).empty().html(a)}),!(adminState.operateHasSearch=!0))}),$(".operaDailyLog_tit_r .form-control-feedback").click(function(){$(this).prev().children("input").val(""),$(this).parent().next().removeClass("btn-default").addClass("btn-primary").prop("disabled",!1)}),$("#search_input2").on("input propertychange change",function(){""!=$(this).val().trim()?$(this).parent().parent().next().removeClass("btn-default").addClass("btn-primary").prop("disabled",!1):($(this).val(""),$(this).parent().parent().next().removeClass("btn-primary").addClass("btn-default").prop("disabled",!0))}).on("keyup",function(t){13==(t.keyCode||t.which||t.charCode)&&""!=$(this).val().trim()&&$(this).parent().parent().next().trigger("click")}),$("button.export_current").click(function(){window.open("../static/admin_export_current.xlsx")}),$("button.export_select").click(function(){adminState.operateSellectObj.selectAll?window.open("../static/admin_export_select_all.xlsx"):window.open("../static/admin_export_select_one.xlsx")}),$(document).on("mouseover",".operaDailyLog_body td",function(){$(this).addClass("warning"),$(this).parent().addClass("info")}).on("mouseout",".operaDailyLog_body td",function(){$(this).removeClass("warning"),$(this).parent().removeClass("info")}).on("click",".operaDailyLog_body td",function(){$(this).parent().toggleClass("warning info").find("[type='checkbox']").prop("checked",!$(this).parent().find("[type='checkbox']").prop("checked")).change()}).on("click",".operaDailyLog_body tbody [type='checkbox']",function(t){t.stopPropagation(),$(this).parent().parent().toggleClass("warning info")}).on("change",".operaDailyLog_body tbody [type='checkbox']",function(){var t=$(this).data("ivalue").toString();$(this).prop("checked")?adminState.operateSellectObj.selectItem.push(t):_.pull(adminState.operateSellectObj.selectItem,t),adminState.operateSellectObj.selectItem=_.uniq(adminState.operateSellectObj.selectItem),$("#checkAll2").prop("checked",adminState.operatePageObj.itemLength==adminState.operateSellectObj.selectItem.length),adminState.operateSellectObj.selectAll=$("#checkAll2").prop("checked"),0==adminState.operateSellectObj.selectItem.length?$("button.export_select").prop("disabled",!0):$("button.export_select").prop("disabled",!1)}),$("#checkAll2").on({click:function(){var t=$(this);$(".operaDailyLog_body tbody [type='checkbox']").each(function(){$(this).prop("checked",t.prop("checked")),t.prop("checked")?$(this).parent().parent().removeClass("info").addClass("warning"):$(this).parent().parent().removeClass("warning info")}),adminState.operateSellectObj.selectAll=t.prop("checked"),t.prop("checked")?(adminState.operateSellectObj.selectItem=[],_.forEach(store.get("futureDT2__admin__operation"),function(t,e,a){adminState.operateSellectObj.selectItem.push(t.log_id.value.toString())})):adminState.operateSellectObj.selectItem=[],$("button.export_select").prop("disabled",!t.prop("checked"))}}),$(document).on("click",".staffManage_body tbody td.not_search .glyphicon.glyphicon-user",function(t){t.stopPropagation();var e=$(this),a=adminState.futureDT2__session;if(_.isNil(a))return adminSwalMixin({title:"异常",text:"修改数据失败！请登录",type:"error",showConfirmButton:!1,timer:2e3}),window.location.assign("login.html"),!1;if(e.parent().siblings(".td__role_id").data("ivalue")>a.data.role_id.value)return adminSwalMixin({title:"异常",text:"权限不足，您修改不了角色等级比你高的",type:"error",showConfirmButton:!1,timer:2e3}),!1;3==e.parent().siblings(".td__role_id").data("ivalue")?$(".staff_authority_r_foot>.btn-primary").prop("disabled",!0):$(".staff_authority_r_foot>.btn-primary").prop("disabled",!1),$(".futureDT2_bg_cover, .staff_authority").slideDown(250);var i=e.parent();adminState.staffAuthorityUser=i.siblings(".td__user_name").data("ivalue").toString();var n=i.siblings(".td__authority").data("ivalue");if(!adminState.authorityRender){var r="";_.forOwn(futuredGlobal.S_getAdmin_authorityMap(),function(t,e,a){r+='<tr><td><span><input type="checkbox">'+e+"</span></td><td>",_.forEach(t,function(t,e,a){r+='<span><input type="checkbox" data-ivalue="'+t.authority_id+'">'+t.authority_name+"</span>"}),r+="</td></tr>"}),$(".staff_authority_r_bodyin tbody").empty().append(r),adminState.authorityRender=!0}$(".staff_authority_r_tit").text("详细信息 - "+adminState.staffAuthorityUser),$(".staff_authority_r_bodyin tbody span>input").each(function(){$(this).prop("checked",!1)}),_.forEach(n,function(t){$(".staff_authority_r_bodyin tbody td:nth-child(2) span>input[data-ivalue='"+t+"']").prop("checked",!0)}),$(".staff_authority_r_bodyin tbody tr").each(function(){$(this).children("td:eq(0)").find("input").prop("checked",$(this).children("td:eq(1)").find("input").length==$(this).children("td:eq(1)").find("input").filter(":checked").length)}),$(".staff_authority_l, .staff_authority_r").height($(".staff_authority").height())}),$(".staff_authority_r_foot .btn-warning").click(function(){$(".futureDT2_bg_cover, .staff_authority").slideUp(250),adminState.staffAuthorityUser=""}),$(document).on("change",".staff_authority_r_bodyin tbody td:nth-child(1) span>input",function(){$(this).parent().parent().next().find("input").prop("checked",$(this).prop("checked"))}),$(document).on("change",".staff_authority_r_bodyin tbody td:nth-child(2) span>input",function(){$(this).parent().parent().prev().find("input").prop("checked",$(this).parent().parent().find("input").length==$(this).parent().parent().find("input").filter(":checked").length)}),$(".staff_authority_r_foot .btn-primary").click(function(){var t=store.get("futureDT2__userDB");if(_.isEmpty(t)||_.isNil(t))adminSwalMixin({title:"异常",text:"mock数据失败！请登录",type:"error",showConfirmButton:!1,timer:2e3}),window.location.assign("login.html");else{var e=[];$(".staff_authority_r_bodyin tbody td:nth-child(2) span>input:checked").each(function(){e.push($(this).data("ivalue"))}),t[adminState.staffAuthorityUser].authority.value=e,store.set("futureDT2__userDB",_.cloneDeep(t)),adminSwalMixin({title:"授权成功！",text:"已经对"+adminState.staffAuthorityUser+"进行了授权，数据已更新",type:"success",showConfirmButton:!1,timer:2e3}),$(".staff_authority_r_foot .btn-warning").trigger("click"),adminState.staffPageObj.pageOption.curr=adminState.staffPageObj.currentPage,new Pagination(adminState.staffPageObj.selector,adminState.staffPageObj.pageOption),adminRender(adminState.staffPageObj.currentPage,!1),adminState.staffHasSearch&&$("#search_button").trigger("click")}});