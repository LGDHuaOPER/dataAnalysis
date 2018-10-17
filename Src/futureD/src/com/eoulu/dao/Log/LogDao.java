/**
 * 
 */
package com.eoulu.dao.Log;

import java.util.List;
import java.util.Map;

import com.eoulu.transfer.PageDTO;
import com.eoulu.util.DataBaseUtil;

/**
 * @author mengdi
 *
 * 
 */
public class LogDao {

	private static DataBaseUtil db = new DataBaseUtil();
	
	
	/**
	 * 添加日志
	 * @param param
	 * @return
	 */
	public boolean insertLog(Object[] param){
		String sql = "insert into dm_log (user_name,page,description,gmt_create,ip_address,location) value (?,?,?,?,?,?)";
		return db.operate(sql, param);
	}
	
	/**
	 * 日志分页
	 * @param page
	 * @return
	 */
	public List<Map<String,Object>> listLog(PageDTO page,String keyword){
		String sql = "select log_id,user_name,page,description,substring_index(gmt_create,' ',1) operate_date,substring_index(gmt_create,' ',-1) operate_time,ip_address,location "
				+ " from dm_log ";
		Object[] param = new Object[]{(page.getCurrentPage()-1)*page.getRow(),page.getCurrentPage()*page.getRow()};
		if(!"".equals(keyword)){
			sql += " where user_name like ? or  page like ? or description like ? or location like ?";
			param = new Object[]{"%"+keyword+"%","%"+keyword+"%","%"+keyword+"%","%"+keyword+"%",(page.getCurrentPage()-1)*page.getRow(),page.getCurrentPage()*page.getRow()};
		}
		sql += "  order by gmt_create desc limit ?,?";
		return db.queryToList(sql,param );
	}
	
	/**
	 * 日志总数量
	 * @return
	 */
	public int countLog(String keyword){
		String sql = "select count(*) from dm_log";
		Object[] param = null;
		if(!"".equals(keyword)){
			sql += " where user_name like ? or  page like ? or description like ? or location like ?";
			param = new Object[]{"%"+keyword+"%","%"+keyword+"%","%"+keyword+"%","%"+keyword+"%"};
		}
		Object result = db.queryResult(sql, param);
		return result==null?0:Integer.parseInt(result.toString());
	}
	/**
	 * 导出的日志
	 * @return
	 */
	public List<Map<String,Object>> listLog(String logIdStr){
		String sql = "select user_name,page,description,substring_index(gmt_create,' ',1) operate_date,substring_index(gmt_create,' ',-1) operate_time,ip_address,location "
				+ " from dm_log ";
		if(!"".equals(logIdStr)){
			sql += " where log_id in ("+logIdStr+") ";
		}
		sql += " order by gmt_create desc ";
		return db.queryToList(sql, null);
	}
	/**
	 * 删除
	 */
	public void delete(){
		String sql = "delete from dm_log where gmt_create<date_sub(sysdate(),interval 30 day)";
		boolean flag = db.operate(sql, null);
		System.out.println("delete result:"+flag);
	}
	
	
	
}
