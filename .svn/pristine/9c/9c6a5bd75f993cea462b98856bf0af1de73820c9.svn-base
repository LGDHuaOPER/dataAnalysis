/**
 * 
 */
package com.eoulu.service;

import java.util.Hashtable;
import java.util.List;
import java.util.Map;

import com.eoulu.entity.UserDO;
import com.eoulu.transfer.PageDTO;

/**
 * @author mengdi
 *
 * 
 */
public interface UserService {
	
	/**
	 * 获取密码
	 * @param userName
	 * @return
	 */
	 String getPassword(String userName);
	
	/**
	 * 用户分页，模糊查询
	 * @param page
	 * @param parameter
	 * @param keyword
	 * @return
	 */
	 List<Map<String,Object>> listUserByPage(PageDTO page,String keyword);
	
	/**
	 * 增加用户,用户名不能重复
	 * @param user
	 * @return
	 */
	 String saveUser(UserDO user);
	
	/**
	 * 用户修改
	 * @param user
	 * @return
	 */
	 boolean updateUser(UserDO user);
	
	/**
	 * 修改登录时间
	 * @param userName
	 */
	 void updateLoginDate(String userName,String currentLogin);
	 
	 /**
	  * 删除用户
	  * @param userName
	  * @return
	  */
	 boolean remove(int userId);
	 
	 /**
	  * 修改指定用户权限
	  * @param authority
	  * @param userId
	  * @return
	  */
	 boolean updateAuthority(String authority,int userId);
	 
	 /**
	  * 用户权限
	  * @param userName
	  * @return
	  */
	 List<String> getAuthority(String userName);
	 
	 /**
	  * 所有权限
	  * @return
	  */
	 Hashtable<String, Object> listAuthority(int userId);
	 /**
	  * 角色
	  * @param role
	  * @return
	  */
	 List<Map<String,Object>> getRole(String role);
	 
	 /**
	  * 用信息总数量
	  * @param parameter
	  * @param keyword
	  * @return
	  */
	 int countUser( String keyword);
	 
	 /**
	  * 获取所有角色
	  * @return
	  */
	 List<Map<String,Object>> listRole();
	 
	 /**
	  * 获取当前用户的角色
	  * @param userId
	  * @return
	  */
	 String getRoleName( int userId);
	
	 /**
	  * 获取用户主键
	  * @param userName
	  * @return
	  */
	 String getUserId(String userName);
	 /**
	  * 用户名
	  * @param userId
	  * @return
	  */
	 String getUserName(int userId);
	 
	 /**
	  * 用户修改密码
	  * @param password
	  * @param userName
	  * @return
	  */
	 boolean updatePassword(String password,String userName);

}
