/**
 * 
 */
package com.eoulu.dao.user;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.eoulu.util.DataBaseUtil;

/**
 * @author mengdi
 *
 * 
 */
public class AuthorityDao {

	
	/**
	 * 获取页面的权限值
	 * @return
	 */
	public List<Map<String,Object>> listAuthority(String page){
		String sql = "select authority_id from dm_authority where page=?";
		return DataBaseUtil.getInstance().queryToList(sql, new Object[]{page});
	}
	
	/**
	 * 获取权限页面
	 * @return
	 */
	public List<Map<String,Object>> getAuthorityPage(){
		String sql = "select distinct page from dm_authority ";
		return DataBaseUtil.getInstance().queryToList(sql, null);
	}
	/**
	 * 当前用户的权限
	 * @param userAuthority
	 * @return
	 */
	public List<Map<String,Object>> getAuthority(String userAuthority){
		if("".equals(userAuthority)){
			return null;
		}
		String sql = "select authority_name,authority_id,authority_url from dm_authority where authority_id in ("+userAuthority+")";
		return DataBaseUtil.getInstance().queryToList(sql, null);
	}
	
	/**
	 * 获取所有权限
	 * @return
	 */
	public List<Map<String,Object>> listAuthority(){
		String sql = "select authority_name,authority_url from dm_authority";
		return DataBaseUtil.getInstance().queryToList(sql, null);
	}
	
	public List<String> getAuthorityUrl(){
		
		String sql = "select authority_url from dm_authority";
		return   DataBaseUtil.getInstance().queryList(sql, null);
		
	}
	
}
