/**
 * 
 */
package com.eoulu.dao.user;

import java.util.List;
import java.util.Map;

import com.eoulu.util.DataBaseUtil;

/**
 * @author mengdi
 *
 * 
 */
public class RoleDao {
	private static DataBaseUtil db = new DataBaseUtil();
	
	/**
	 * 获取角色
	 * @param role
	 * @return
	 */
	public int getRoleId(String role){
		String sql = "select role_id from dm_role where role_name=?";
		Object result = db.queryResult(sql, new Object[]{role});
		return result==null?0:(int) result;
	}
	
	/**
	 * 增加角色
	 * @param role
	 * @return
	 */
	public boolean insert(String role){
		String sql = "insert into dm_role (role_name) value (?)";
		return db.operate(sql, new Object[]{role});
	}
	
	/**
	 * 获取所有角色
	 * @return
	 */
	public List<Map<String,Object>> listRole(){
		String sql ="select role_id,role_name from dm_role ";
		return db.queryToList(sql, null);
	}
	
	/**
	 * 获取当前用户的角色
	 * @param userName
	 * @return
	 */
	public String getRoleName(int userId){
		String sql = "select dm_role.role_name from dm_user left join dm_role on dm_user.role_id=dm_role.role_id where user_id=?";
		Object[] param = new Object[]{userId};
		Object result = db.queryResult(sql, param);
		return result==null?"":result.toString();
	}
	
	public int getRoleId(int userId){
		String sql =  "select role_id from dm_user where user_id="+userId;
		Object result = db.queryResult(sql, null);
		return result==null?0:Integer.parseInt(result.toString());
	}
}
