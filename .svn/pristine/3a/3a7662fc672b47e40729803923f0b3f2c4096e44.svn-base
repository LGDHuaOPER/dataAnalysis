/*Function*/
function CloseBox(){
	$('.mask').fadeOut();
	$('.addMember_box').fadeOut();
	$('.editMember_box').fadeOut();
	$('.giveRight_box').fadeOut();
}
$('.breadSecond').click(function(){
	$('.adminContent2').fadeOut();
	$('.adminContent3').fadeOut();
	$('.adminContent1').fadeIn();
	$('.breadThird').html('');
})
/*成员管理***********************************************************************************/
$('.adminMember_bg').click(function(){
	//获取数据ajax
	
	
	$('.adminContent1').fadeOut();
	$('.adminContent3').fadeOut();
	$('.adminContent2').fadeIn();
	$('.breadThird').html('').html('/ 用户管理');
});
$('.addMember').click(function(){
	$('.mask').fadeIn();
	$('.addMember_box').fadeIn();
})

$('.tite_R').click(function(){
	CloseBox();
})
$('.add_Cancle').click(function(){
	CloseBox();
})
//增加成员
$(document).on('click','.add_OK',function(){
	var userName = $('.addMember_box .add_userName').val();
	var password = $('.addMember_box .add_password').val();
	var sex   = $('.add_userSex').find('option:checked').val();
	var roleId   = $('.add_userSex').find('option:checked').val();
	var telephone = $('.add_userPhone').val();
	var email = $('.add_userEmail').val();
	$.ajax({
		type:'post',
		url:'UserOperate',
		dataType:'json',
		data:{
			userName:userName,
			password:password,
			sex:sex,
			roleId:roleId,
			telephone:telephone,
			email:email
		},
		success:function(data){
			/*if(data == ''){

			}*/
		}
	})

})

//编辑修改成员
$('.edit').click(function(){
	var userId = $('.num_content').attr('userId');
	var userName = $('.account_content').text();
	var password = $('.account_content').text();
	var sex   = $('.sex_content').text();
	var roleId   = $('.part_content').text();
	var telephone = $('.phone_content').text();
	var email = $('.email_content').text();
	$('.editMemberBox_title').attr('userId',userId);
	$('.editMember_box').find('.edit_userName').val('').val(userName);
	$('.editMember_box').find('.edit_password').val('').val(password);
	$('.editMember_box').find('.edit_userSex').find('option[value="'+ sex +'"]').attr('selected',true);
	$('.editMember_box').find('.edit_userPart').find('option[value="'+ roleId +'"]').attr('selected',true);

	$('.editMember_box').find('.edit_userPhone').val('').val(telephone);
	$('.editMember_box').find('.edit_userEmail').val('').val(email);


	$('.mask').fadeIn();
	$('.editMember_box').fadeIn();
})
$(document).on('click','.edit_OK',function(){
	var userId = $('.editMemberBox_title').attr('userId');
	var userName = $('.addMember_box .add_userName').val();
	var password = $('.addMember_box .add_password').val();
	var sex   = $('.add_userSex').find('option:checked').val();
	var roleId   = $('.add_userSex').find('option:checked').val();
	var telephone = $('.add_userPhone').val();
	var email = $('.add_userEmail').val();
		$.ajax({
			type:'post',
			url:'UserOperate',
			dataType:'json',
			data:{
				userId:userId,
				userName:userName,
				password:password,
				sex:sex,
				roleId:roleId,
				telephone:telephone,
				email:email
			},
			success:function(data){
				
			}
		})
})

//授权
$('.right').click(function(){
	$('.mask').fadeIn();
	$('.giveRight_box').fadeIn();
})
$('.right_Cancle').click(function(){
	CloseBox();
})


/*日志*********************************************************************************************************************/
$('.adminRecord_bg').click(function(){
	
	/*数据获取*/
	/*$.ajax({
		type:'get',
		url:'/futureD/LogInfo',
		dataType:'json',
		data:{
			currentPage:1
		},
		success:function(data){
			console.log(data);
		},
		error:function(){

		}
	});*/
	$('.adminContent1').fadeOut();
	$('.adminContent2').fadeOut();
	$('.adminContent3').fadeIn();
	$('.breadThird').html('').html('/ 操作日志');
	
	
});

$('.edit_Cancle').click(function(){
	CloseBox();
})


/*跳页*/
/*$('.页码所在按钮class').click(function(){
	var currentPage = $(this).text();
	
	$.ajax({
		type:'get',
		url:'/futureD/LogInfo',
		dataType:'json',
		data:{
			currentPage:currentPage
		},
		success:function(data){
			console.log(data);
		},
		error:function(){

		}
	});
})*/


