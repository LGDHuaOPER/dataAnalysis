var recycleStore=Object.create(null);function tableEllipsis(){var e=$("div.g_bodyin_bodyin_body>table"),t=e.find("th:visible").length,o=_.floor((e.innerWidth()-50)/(t-1));eouluGlobal.C_tableEllipsis({container:$("div.g_bodyin_bodyin_body>table"),widthArr:_.fill(_.fill(Array(t),o),50,0,1)})}function searchValShowRed(){$(".g_bodyin_bodyin_body tbody td:not(.not_search)").each(function(){var e=$(this).text(),t="<b style='color:red'>"+recycleStore.state.pageObj.searchVal+"</b>",o=e.replace(new RegExp(recycleStore.state.pageObj.searchVal,"g"),t);$(this).empty().html(o)})}function delStoreSelectItem(e){var t,o,a=e.value,n=e.delAll,r=store.get("futureDT2Online__"+recycleStore.state.userName+"__recycle__selectedItem")||[];!0===n?(t=r.length==$(".g_bodyin_bodyin_body tbody input[type='checkbox']:checked").length?(o=$(".g_bodyin_bodyin_body tbody input[type='checkbox']:checked").length==$(".g_bodyin_bodyin_body tbody input[type='checkbox']").length?$("body").data("currentpage")-1==0?1:$("body").data("currentpage")-1:$("body").data("currentpage"),recycleStore.state.pageObj.searchFlag?{currentPage:o,keyword:recycleStore.state.pageObj.searchVal}:{currentPage:o}):recycleStore.state.pageObj.searchFlag?{currentPage:1,keyword:recycleStore.state.pageObj.searchVal}:{currentPage:1},store.set("futureDT2Online__"+recycleStore.state.userName+"__recycle__selectedItem",[])):(_.pull(r,a),t=1==$(".g_bodyin_bodyin_body tbody>tr").length?(o=$("body").data("currentpage")-1==0?1:$("body").data("currentpage")-1,recycleStore.state.pageObj.searchFlag?{currentPage:o,keyword:recycleStore.state.pageObj.searchVal}:{currentPage:o}):recycleStore.state.pageObj.searchFlag?{currentPage:$("body").data("currentpage"),keyword:recycleStore.state.pageObj.searchVal}:{currentPage:$("body").data("currentpage")},store.set("futureDT2Online__"+recycleStore.state.userName+"__recycle__selectedItem",_.cloneDeep(r))),eouluGlobal.S_settingURLParam(t,!1,!1,!1)}recycleStore.state=Object.create(null),recycleStore.state.userName=null,recycleStore.state.pageObj={pageOption:null,currentPage:null,pageCount:null,searchFlag:!1,searchVal:""},recycleStore.state.authorityJQDomMap={"管理员":[$(".g_info_r .AdminOperat")],"恢复":[$(".g_bodyin_bodyin_tit_l>[data-iicon='glyphicon-share-alt']"),$(".operate_othertd [data-iicon='glyphicon-share-alt']")],"删除":[$(".g_bodyin_bodyin_tit_l>[data-iicon='glyphicon-remove']"),$(".operate_othertd [data-iicon='glyphicon-remove']")]},$(function(){eouluGlobal.C_pageAuthorityCommonHandler({authorityJQDomMap:_.cloneDeep(recycleStore.state.authorityJQDomMap)}),tableEllipsis(),recycleStore.state.pageObj.currentPage=_.toNumber($("body").data("currentpage")),recycleStore.state.pageObj.pageCount=_.toNumber($("body").data("totalcount")),recycleStore.state.pageObj.searchVal=_.trim($("#search_input").val()),recycleStore.state.pageObj.searchFlag=""!==recycleStore.state.pageObj.searchVal,recycleStore.state.pageObj.pageOption={limit:10,count:recycleStore.state.pageObj.pageCount,curr:recycleStore.state.pageObj.currentPage,ellipsis:!0,pageShow:2,hash:!1,callback:function(e){var t;(recycleStore.state.pageObj.searchFlag&&searchValShowRed(),e.isFirst)||(t=recycleStore.state.pageObj.searchFlag?{currentPage:e.curr,keyword:recycleStore.state.pageObj.searchVal}:{currentPage:e.curr},eouluGlobal.S_settingURLParam(t,!1,!1,!1))}},new Pagination("#pagelist",recycleStore.state.pageObj.pageOption),recycleStore.state.userName=$("body").data("curusername");var e=store.get("futureDT2Online__"+recycleStore.state.userName+"__recycle__selectedItem");_.isNil(e)&&(e=[]),_.forEach(e,function(e,t){$(".g_bodyin_bodyin_body tbody input[type='checkbox'][data-iid='"+_.toNumber(e)+"']").prop("checked",!0).parent().parent().addClass("warning")}),$("#checkAll").prop("checked",$(".g_bodyin_bodyin_body tbody input[type='checkbox']").length==$(".g_bodyin_bodyin_body tbody input[type='checkbox']:checked").length)}),$(window).on("resize",function(){tableEllipsis()}),$(document).on("mouseover",".g_bodyin_bodyin_body td",function(){$(this).addClass("warning"),$(this).parent().addClass("info")}).on("mouseout",".g_bodyin_bodyin_body td",function(){$(this).removeClass("warning"),$(this).parent().removeClass("info")}).on("click",".g_bodyin_bodyin_body td",function(){$(this).parent().toggleClass("warning info").find("[type='checkbox']").prop("checked",!$(this).parent().find("[type='checkbox']").prop("checked")).change()}).on("click",".g_bodyin_bodyin_body tbody [type='checkbox']",function(e){e.stopPropagation(),$(this).parent().parent().toggleClass("warning info")}).on("change",".g_bodyin_bodyin_body tbody [type='checkbox']",function(){var e=$(this).data("iid").toString(),t=store.get("futureDT2Online__"+recycleStore.state.userName+"__recycle__selectedItem");_.isNil(t)&&(t=[]),$(this).prop("checked")?t.push(e):_.pull(t,e),t=_.uniq(t),store.set("futureDT2Online__"+recycleStore.state.userName+"__recycle__selectedItem",t),$("#checkAll").prop("checked",$(".g_bodyin_bodyin_body tbody input[type='checkbox']").length==$(".g_bodyin_bodyin_body tbody input[type='checkbox']:checked").length)}),$("#checkAll").on({click:function(){var t=$(this),o=store.get("futureDT2Online__"+recycleStore.state.userName+"__recycle__selectedItem");_.isNil(o)&&(o=[]),$(".g_bodyin_bodyin_body tbody [type='checkbox']").each(function(){$(this).prop("checked",t.prop("checked"));var e=$(this).data("iid").toString();t.prop("checked")?($(this).parent().parent().removeClass("info").addClass("warning"),o.push(e)):($(this).parent().parent().removeClass("warning info"),_.pull(o,e))}),o=_.uniq(o),store.set("futureDT2Online__"+recycleStore.state.userName+"__recycle__selectedItem",o)}}),$("#jumpText").on("input propertychange",function(){$(this).val($(this).val().replace(/[^\d]/g,""))}),$("#jumpPage").on("click",function(){var e,t=Number($("#jumpText").val()),o=recycleStore.state.pageObj.currentPage,a=recycleStore.state.pageObj.pageCount;o==t||t<=0||a<t?$("#jumpText").val(""):(e=recycleStore.state.pageObj.searchFlag?{currentPage:t,keyword:recycleStore.state.pageObj.searchVal}:{currentPage:t},eouluGlobal.S_settingURLParam(e,!1,!1,!1))}),$("#search_input").on("input propertychange change",function(){$(this).val(_.trim($(this).val()))}).on("keyup",function(e){13==(e.keyCode||e.which||e.charCode)&&$(this).parent().parent().next().trigger("click")}),$("#search_button").on("click",function(){var e,t=_.trim($("#search_input").val());return e=_.isEmpty(t)?{currentPage:1}:{currentPage:1,keyword:t},eouluGlobal.S_settingURLParam(e,!1,!1,!1),!1}),$(".g_bodyin_bodyin_tit_r .form-control-feedback").click(function(){$(this).prev().children("input").val("")}),$(document).on("click",".operate_othertd [data-iicon='glyphicon-remove']",function(e){e.stopPropagation();var t=$(this);eouluGlobal.S_getSwalMixin()({title:"确定永久删除吗？",text:"删除后将无法恢复",type:"warning",showCancelButton:!0,confirmButtonText:"确定，删除！",cancelButtonText:"不，取消！",reverseButtons:!1}).then(function(e){e.value?$.ajax({type:"GET",url:"RecycleBinRemove",data:{waferId:t.data("iid")},dataType:"json"}).then(function(e){1==e?eouluGlobal.S_getSwalMixin()({title:"删除提示",text:"永久删除成功",type:"success",showConfirmButton:!1,timer:1800}).then(function(){delStoreSelectItem({value:t.data("iid").toString()})}):0==e?eouluGlobal.S_getSwalMixin()({title:"删除提示",text:"永久删除失败",type:"error",showConfirmButton:!1,timer:1700}):eouluGlobal.S_getSwalMixin()({title:"删除提示",text:e,type:"info",showConfirmButton:!1,timer:1700})}):e.dismiss==swal.DismissReason.backdrop||e.dismiss==swal.DismissReason.esc||(e.dismiss,swal.DismissReason.cancel)})}).on("click",".operate_othertd [data-iicon='glyphicon-share-alt']",function(e){e.stopPropagation();var t=$(this);eouluGlobal.S_getSwalMixin()({title:"确定恢复吗？",text:"将恢复至数据列表页面",type:"info",showCancelButton:!0,confirmButtonText:"确定，恢复！",cancelButtonText:"不，取消！",reverseButtons:!1}).then(function(e){e.value?$.ajax({type:"GET",url:"RecycleBinRecovery",data:{waferId:t.data("iid")},dataType:"json"}).then(function(e){1==e?eouluGlobal.S_getSwalMixin()({title:"恢复提示",text:"恢复成功",type:"success",showConfirmButton:!1,timer:1800}).then(function(){delStoreSelectItem({value:t.data("iid").toString()})}):0==e?eouluGlobal.S_getSwalMixin()({title:"恢复提示",text:"恢复失败",type:"error",showConfirmButton:!1,timer:1700}):eouluGlobal.S_getSwalMixin()({title:"恢复提示",text:e,type:"info",showConfirmButton:!1,timer:1700})}):e.dismiss==swal.DismissReason.backdrop||e.dismiss==swal.DismissReason.esc||(e.dismiss,swal.DismissReason.cancel)})}),$(".g_bodyin_bodyin_tit_l>[data-iicon='glyphicon-remove'], .g_bodyin_bodyin_tit_l>[data-iicon='glyphicon-share-alt']").click(function(){var t,e,o,a=store.get("futureDT2Online__"+recycleStore.state.userName+"__recycle__selectedItem");if(_.isNil(a)||_.isEmpty(a))return!1;$(this).is("[data-iicon='glyphicon-remove']")?(t="永久删除",e="删除后无法恢复",o="RecycleBinRemove"):$(this).is("[data-iicon='glyphicon-share-alt']")&&(t="恢复",e="恢复后可在数据列表找到",o="RecycleBinRecovery"),eouluGlobal.S_getSwalMixin()({title:"确定"+t+"吗？",text:"将"+t+"选中的"+a.length+"条数据，"+e,type:"warning",showCancelButton:!0,confirmButtonText:"是，"+t+"！",cancelButtonText:"否，取消！",reverseButtons:!1}).then(function(e){e.value?$.ajax({type:"GET",url:o,data:{waferId:_.join(a,",")},dataType:"json"}).then(function(e){1==e?eouluGlobal.S_getSwalMixin()({title:t+"提示",text:t+"成功",type:"success",showConfirmButton:!1,timer:1800}).then(function(){delStoreSelectItem({delAll:!0})}):0==e?eouluGlobal.S_getSwalMixin()({title:t+"提示",text:t+"失败",type:"error",showConfirmButton:!1,timer:1700}):eouluGlobal.S_getSwalMixin()({title:t+"提示",text:e,type:"info",showConfirmButton:!1,timer:1700})}):e.dismiss==swal.DismissReason.backdrop||e.dismiss==swal.DismissReason.esc||(e.dismiss,swal.DismissReason.cancel)})});