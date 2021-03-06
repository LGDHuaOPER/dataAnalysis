/**
 * 
 */
package com.eoulu.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
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
		Object result = db.queryResult(conn, sql, new Object[]{waferId,paramName});
		return result==null?"":result.toString();
	}
	
	public List<Double> getRangeByColumn(Connection conn,int waferId,String column){
		List<Double> ls = null;
		String sql = "select max("+column+"),min("+column+") from dm_wafer_coordinate_data where wafer_id=? and (bin=1 or bin=255)  and "+column+" is not null and "+column+"<= 9*power(10,30) and "+column+">= -9*power(10,30)";
		try {
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setInt(1, waferId);
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
	
	public  List<Map<String,Object>> getFunctionData(Connection conn,int waferId ,String column,boolean flag){
		String sql = "select STD("+column+") standard,avg("+column+") average,max("+column+") max,min("+column+")min,count(*) total  from dm_wafer_coordinate_data where wafer_id=? and (bin=1 or bin=255)";
		if(flag){
			sql = "select STD("+column+") standard,avg("+column+") average,max("+column+") max,min("+column+")min,count(*) total  from dm_wafer_subdie where wafer_id=? and (subdie_bin=1 or subdie_bin=255)";
		}
		return db.queryToList(conn, sql, new Object[]{waferId});
	}
	
	public int getCount(Connection conn,int waferId,String condition,boolean flag){
		String sql = "select count(*) total  from dm_wafer_coordinate_data where wafer_id=? and (bin=1 or bin=255) ";
		if(flag){
			sql = "select count(*) total  from dm_wafer_subdie where wafer_id=? and (subdie_bin=1 or subdie_bin=255) ";
		}
		sql += condition;
		Object result = DataBaseUtil.getInstance().queryResult(conn, sql, new Object[]{waferId});
	return result==null?0:Integer.parseInt(result.toString());
	}
	
	public List<String> getParamData(Connection conn,int waferId,String column){
		String sql = "select "+column+" from dm_wafer_coordinate_data where wafer_id=? and (bin=1 or bin=255) order by "+column;
		return db.queryList(conn, sql, new Object[]{waferId});
	}

}
