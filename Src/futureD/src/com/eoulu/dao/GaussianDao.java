/**
 * 
 */
package com.eoulu.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.eoulu.transfer.FunctionUtil;
import com.eoulu.util.DataBaseUtil;

/**
 * @author mengdi
 *
 * 
 */
public class GaussianDao {
	
	private  DataBaseUtil db =  new DataBaseUtil();
	
	public String getParameterColumn(Connection conn,int waferId,String paramName){
		String sql = "select parameter_column from dm_wafer_parameter where wafer_id=? and parameter_name=? ";
		Object result = db.queryList(conn, sql, null);
		return result==null?"":result.toString();
	}
	
	public List<Double> getRangeByColumn(Connection conn,int waferId,String column){
		List<Double> ls = null;
		String sql = "select max("+column+"),min("+column+") from dm_wafer_coordinate_data where wafer_id=?";
		try {
			PreparedStatement ps = conn.prepareStatement(sql);
			ResultSet rs = ps.executeQuery();
			while(rs.next()){
				ls = new ArrayList<>();
				ls.add(rs.getDouble(1));
				ls.add(rs.getDouble(2));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ls;
	}
	
	public  List<Map<String,Object>> getFunctionData(Connection conn,int waferId ,String column){
		String sql = "select STD("+column+") standard,avg("+column+") average from dm_wafer_coordinate_data where wafer_id=?";
		return db.queryToList(conn, sql, new Object[]{waferId});
	}
	
	
	public List<String> getParamData(Connection conn,int waferId,String column){
		String sql = "select "+column+" from dm_wafer_coordinate_data where wafer_id=? order by "+column;
		return db.queryList(conn, sql, new Object[]{waferId});
	}

}
