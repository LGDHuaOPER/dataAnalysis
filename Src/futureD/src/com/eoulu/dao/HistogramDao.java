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

import com.eoulu.util.DataBaseUtil;

/**
 * @author mengdi
 *
 * 
 */
public class HistogramDao {
	
	private DataBaseUtil db = new DataBaseUtil();
	/*
	public List<Double> getHistogramRange(Connection conn,String waferIdStr,String paramName){
		List<Double> ls = null;
		String sql = "select max(upper_limit),min(lower_limit) from dm_wafer_parameter where wafer_id in ("+waferIdStr+") and parameter_name='"+paramName+"'";
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
	
	public List<Double> getHistogramRangeByColumn(Connection conn,String waferIdStr,String column){
		List<Double> ls = null;
		String sql = "select max("+column+"),min("+column+") from dm_wafer_coordinate_data where wafer_id in ("+waferIdStr+")";
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
	
	public String getParameterColumn(Connection conn,String waferIdStr,String paramName){
		String sql = "select parameter_column from dm_wafer_parameter where wafer_id in ("+waferIdStr+") and parameter_name='"+paramName+"'  and parameter_name not in (select custom_parameter parameter_name from dm_marker_calculation where wafer_id in ("+waferIdStr+"))";
		Object result = db.queryList(conn, sql, null);
		return result==null?"":result.toString();
	}
	*/
	public String getColumn(Connection conn,int waferId,String paramName){
		String sql = "select parameter_column from dm_wafer_parameter where wafer_id=? and parameter_name=?";
		Object result = db.queryResult(conn, sql, new Object[]{waferId,paramName});
		return result==null?"":result.toString();
	}
	
	
	public int getQuantity(Connection conn,int waferId,String condition){
		String sql = "select count(*) from dm_wafer_coordinate_data where wafer_id=? and (bin=1 or bin=255) " + condition;
		Object result = db.queryResult(conn, sql, new Object[]{waferId});
		return result == null?0:Integer.parseInt(result.toString());
	}

}
