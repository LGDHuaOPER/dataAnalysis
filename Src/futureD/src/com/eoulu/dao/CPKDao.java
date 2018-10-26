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
public class CPKDao {

	private DataBaseUtil db = new DataBaseUtil();
	
	public List<Map<String,Object>> getLimit(Connection conn,String paramName,int waferId){
		String sql="select upper_limit,lower_limit from dm_wafer_parameter where wafer_id=? and parameter_name=?";
		return db.queryToList(conn, sql, new Object[]{waferId,paramName});
	}
	
	public int getCount(Connection conn,String column,int waferId){
		String sql = "select count(*) from dm_wafer_coordinate_data where wafer_id=? and "+column+" is not null and "+column+" < 9E30 and bin <>-1";
		Object result = db.queryResult(conn,sql, new Object[]{waferId});
		return result==null?0:Integer.parseInt(result.toString());
	}
	
	public List<Map<String, List<Double>>> getData(Connection conn, String column, int waferId) {
		int count = getCount(conn, column, waferId);
		int length = length(count);
		List<Map<String,List<Double>>> list = new ArrayList<Map<String,List<Double>>>();
		try {
			for (int i = 0; i < length; i++) {
				String sql1 = "select avg(" + column + ") from dm_wafer_coordinate_data where wafer_id=? and " + column
						+ " is not null and " + column + " < 9E30 and bin <>-1 limit ?,?";
				PreparedStatement ps1;
				ps1 = conn.prepareStatement(sql1);
				ps1.setInt(1, waferId);
				ps1.setInt(2, length<2?0:i*length);
				ps1.setInt(3, length<2?1:count/20);
				ResultSet rs1 = ps1.executeQuery();
				List<Double> avg = new ArrayList<Double>();
				while (rs1.next()) {
					avg.add(rs1.getDouble(1));
				}
				String sql2 = "select avg(" + column + ") from dm_wafer_coordinate_data where wafer_id=? and " + column
						+ " is not null and " + column + " < 9E30 and bin <>-1 limit ?,?";
				PreparedStatement ps2 = conn.prepareStatement(sql2);
				ps2.setInt(1, waferId);
				ps2.setInt(2, length<2?0:i*length);
				ps2.setInt(3, length<2?1:count/20);
				ResultSet rs2 = ps2.executeQuery();
				List<Double> datas = new ArrayList<Double>();
				while (rs2.next()) {
					datas.add(rs2.getDouble(1));
				}
				Map<String, List<Double>> map = new HashMap<String, List<Double>>();
				map.put("avg", avg);
				map.put("datas", datas);
				list.add(map);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return list;
	}
	
	public int length(int num){
		if(num<20){
			return 1;
		}
		int length=num/20;
		return length;
		
	}
	
	public List<String> getParameter(int waferId){
		String sql = "select parameter_name from dm_wafer_parameter where wafer_id=? ";
		return db.queryList(sql, new Object[]{waferId});
	}
	
}
