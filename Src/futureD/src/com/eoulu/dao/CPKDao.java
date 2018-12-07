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

	
	public List<Map<String,Object>> getLimit(Connection conn,String paramName,int waferId){
		String sql="select upper_limit,lower_limit from dm_wafer_parameter where wafer_id=? and parameter_name=?";
		return DataBaseUtil.getInstance().queryToList(conn, sql, new Object[]{waferId,paramName});
	}
	
	
	public List<Map<String, Object>> getData(Connection conn, String column, int waferId,int count) {
		int length = length(count),size= length==1?1:20;
		System.out.println("length:"+length);
		List<Double> datas = null;
		List<Map<String,Object>> list = new ArrayList<Map<String,Object>>();
		try {
			for (int i = 0; i < size; i++) {
				Map<String, Object> map = new HashMap<String,Object>();
				String sql1 = "select avg(" + column + ") from dm_wafer_coordinate_data where wafer_id=? and (bin=1 or bin=255) and " + column
						+ " is not null and " + column + " < 9E30 and bin <>-1 limit ?,?";
				PreparedStatement ps1;
				ps1 = conn.prepareStatement(sql1);
				ps1.setInt(1, waferId);
				ps1.setInt(2, length<2?0:i*length);
				ps1.setInt(3, length<2?1:count/20);
				ResultSet rs1 = ps1.executeQuery();
				while (rs1.next()) {
					map.put("avg", rs1.getDouble(1));
				}
				String sql2 = "select " + column + " from dm_wafer_coordinate_data where wafer_id=? and (bin=1 or bin=255)  and " + column
						+ " is not null and " + column + " < 9E30 and bin <>-1 limit ?,?";
				PreparedStatement ps2 = conn.prepareStatement(sql2);
				ps2.setInt(1, waferId);
				ps2.setInt(2, length<2?0:i*length);
				ps2.setInt(3, length<2?1:count/20);
				ResultSet rs2 = ps2.executeQuery();
				 datas = new ArrayList<Double>();
				while (rs2.next()) {
					datas.add(rs2.getDouble(1));
				}
				
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
		return DataBaseUtil.getInstance().queryList(sql, new Object[]{waferId});
	}
	
}
