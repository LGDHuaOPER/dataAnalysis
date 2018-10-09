/**
 * 
 */
package com.eoulu.dao.user;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;

import com.eoulu.entity.UserDO;
import com.eoulu.transfer.PageDTO;
import com.eoulu.util.DataBaseUtil;

/**
 * @author mengdi
 *
 * 
 */
public class UserDao {
	
	private static DataBaseUtil db = new DataBaseUtil();
	private static SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	private static Hashtable<String, String> table = new Hashtable<>();
	
	static{
		table.put("操作账户", "user_name");
		table.put("联系电话", "telephone");
		table.put("电子邮箱", "email");
	}

	/**
	 * 根据用户名获取密码
	 * @param userName
	 * @return
	 */
	public String getPassword(String userName){
		String sql = "select password from dm_user where user_name=?";
		Object result = db.queryResult(sql, new Object[]{userName});
		return result==null?"":result.toString();
	}
	
	/**
	 * 获取用户主键
	 * @param userName
	 * @return
	 */
	public String getUserId(String userName){
		String sql = "select user_id from dm_user where user_name=?";
		Object result = db.queryResult(sql, new Object[]{userName});
		return result==null?"":result.toString();
	}
	
	
	/**
	 * 获取上次登录时间
	 * @param userName
	 * @return
	 */
	public String getLastLogin(String userName){
		String sql = "select current_login from dm_user where user_name=?";
		Object result = db.queryResult(sql, new Object[]{userName});
		return result==null?"":result.toString();
	}
	
	/**
	 * 增加用户
	 * @param user
	 * @return
	 */
	public boolean insert(UserDO user){
		
		String sql = "insert into dm_user (user_name,password,sex,telephone,email,role_id,authority,gmt_create) value (?,?,?,?,?,?,'',?)";
		Object[] param = new Object[]{user.getUserName(),user.getPassword(),user.getSex(),user.getTelephone(),user.getEmail(),user.getRoleId(),df.format(new Date())};
		return db.operate(sql, param);
	}
	
	/**
	 * 修改用户信息
	 * @param user
	 * @return
	 */
	public boolean update(UserDO user){
		String sql = "update dm_user set user_name=?,password=?,sex=?,telephone=?,email=?,role_id=? where user_id=?";
		Object[] param = new Object[]{user.getUserName(),user.getPassword(),user.getSex(),user.getTelephone(),user.getEmail(),user.getRoleId(),user.getUserId()};
		return db.operate(sql, param);
	}
	
	/**
	 * 修改上次登录时间
	 * @param lastLogin
	 * @param userName
	 * @return
	 */
	public boolean update(String lastLogin,String userName){
		String sql = "update dm_user set last_login=? where user_name=?";
		Object[] param = new Object[]{lastLogin,userName};
		return db.operate(sql, param);
	}
	
	/**
	 * 更新本次登录时间
	 * @param currentLogin
	 * @param userName
	 * @return
	 */
	public boolean updateLoginDate(String currentLogin,String userName){
		String sql = "update dm_user set current_login=? where user_name=?";
		Object[] param = new Object[]{currentLogin,userName};
		return db.operate(sql, param);
	}
	
	/**
	 * 获取指定用户的权限
	 * @param userName
	 * @return
	 */
	public String getUserAuthority(String userName){
		String sql = "select authority from dm_user where user_name=?";
		Object result = db.queryResult(sql, new Object[]{userName}); 
		return result==null?"":result.toString();
	}
	
	public String getUserAuthority(int userId){
		String sql = "select authority from dm_user where user_id=?";
		Object result = db.queryResult(sql, new Object[]{userId}); 
		return result==null?"":result.toString();
	}
	
	/**
	 * 用户分页，模糊查询
	 * @param page
	 * @param parameter
	 * @param keyword
	 * @return
	 */
	public List<Map<String,Object>> listUserInfo(PageDTO page,String keyword){
		Object[] param = new Object[]{(page.getCurrentPage()-1)*page.getRow(),page.getCurrentPage()*page.getRow()};
		String sql = "select user_id,user_name,IFNULL(sex,'') sex,IFNULL(telephone,'') telephone,IFNULL(email,'') email,"
				+ "dm_role.role_name,left(gmt_create,10) gmt_create,left(last_login,10) last_login "
				+ "from dm_user left join dm_role on dm_user.role_id=dm_role.role_id ";
		if(!"".equals(keyword)){
			sql += "where  user_name like ?  or telephone like ? or email like ? ";
			param = new Object[]{"%"+keyword+"%","%"+keyword+"%","%"+keyword+"%",(page.getCurrentPage()-1)*page.getRow(),page.getCurrentPage()*page.getRow()};
		}
		sql += " order by user_id limit ?,?";
		System.out.println(sql);
		return db.queryToList(sql, param);
	}
	
	public int countUser(String keyword){
		Object[] param = null;
		String sql = "select count(*) from dm_user ";
		if(!"".equals(keyword)){
			sql += "where  user_name like ?  or telephone like ? or email like ? ";
			param = new Object[]{"%"+keyword+"%","%"+keyword+"%","%"+keyword+"%"};
		}
		Object result = db.queryResult(sql, param);
		return result==null?0:Integer.parseInt(result.toString());
	}
	
	/**
	 * 修改用户权限
	 * @param authority
	 * @param userId
	 * @return
	 */
	public boolean updateUserAuthority(String authority,int userId){
		String sql = "update dm_user set authority=? where user_id=?";
		Object[] param = new Object[]{authority,userId};
		return db.operate(sql, param);
	}
	
	/**
	 * 删除
	 * @param userId
	 * @return
	 */
	public boolean delete(int userId){
		String sql = "delete from dm_user where user_id=?";
		return db.operate(sql, new Object[]{userId});
	}
	/**
	 * 获取用户与用户主键
	 * @return
	 */
	public List<Map<String,Object>> getAllUser(){
		String sql = "select user_id,user_name from dm_user";
		return db.queryToList(sql, null);
	}
	
}
