/**
 * 
 */
package com.eoulu.dao;

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
public class YieldDao {

	private DataBaseUtil db = new DataBaseUtil();
	
	
	public Double getYieldPerParam(Connection conn,int waferId,String column,double left,double right){
		String sql = "select format(count(*)/(select count(*) from dm_wafer_coordinate_data where wafer_id=? and (bin=1 or bin=255)),2) yield from dm_wafer_coordinate_data where wafer_id=? and (bin=1 or bin=255) and "+column+" between ? and ?";
		Object result = db.queryResult(conn, sql, new Object[]{waferId,waferId,left,right});
		
		return result==null?Double.NaN:Double.parseDouble(result.toString());
	}
	
	
	public String getWaferNO(Connection conn,int waferId){
		String sql = "select wafer_number from dm_wafer where wafer_id=?";
		Object result = db.queryResult(conn,sql, new Object[]{waferId});
		return result==null?"":result.toString();
		
	}
	
	/**
	 * 上下限
	 * @param waferId  晶圆表主键
	 * @param conn
	 * @return
	 */
	public List<Double> getUpperAndLowerLimit(int waferId,String paramName,Connection conn) {
		String sql = "select upper_limit,lower_limit from dm_wafer_parameter where wafer_id=? and parameter_name=?";
		PreparedStatement ps;
		List< Double> list = new ArrayList<>();
		double left = Double.NaN,right = Double.NaN;
		try {
			ps = conn.prepareStatement(sql);
			ps.setInt(1,waferId);
			ps.setString(2, paramName);
			ResultSet rs = ps.executeQuery();
			while(rs.next()){
				left = rs.getDouble(2);
				right = rs.getDouble(1);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		list.add(left);
		list.add(right);
		return list;
	}
	
	public List<Map<String,Object>> getWaferYield(Connection conn,String waferIdStr){
		String sql  = "";
		return db.queryToList(conn, sql, new Object[]{waferIdStr});
	}
	
}
