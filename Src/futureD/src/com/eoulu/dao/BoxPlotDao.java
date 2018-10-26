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
public class BoxPlotDao {
	private DataBaseUtil db = new DataBaseUtil();
	
	public  Map<String, Object> getBoxPlot(String param,String[] waferIdStr){
		String sql = "select parameter_column from dm_wafer_parameter where wafer_id=? and parameter_name=?",sql2 = "";
		PreparedStatement ps = null,ps2 = null;
		ResultSet rs = null,rs2 = null;
		String column = "";
		List<Double> ls = null;
		Map<String, Object> map = new HashMap<>();
		Connection conn = null;
		try {
			conn = db.getConnection();
			for(int i=0,length=waferIdStr.length;i<length;i++){
				column = "";
				ps = conn.prepareStatement(sql);
				ps.setInt(1, Integer.parseInt(waferIdStr[i]));
				ps.setString(2, param);
				rs = ps.executeQuery();
				while(rs.next()){
					column = rs.getString(1);
				}
				if(!"".equals(column)){
					sql2 = "select "+column+" from dm_wafer_coordinate_data where wafer_id=? and bin<>-1";
					ps2 = conn.prepareStatement(sql2);
					ps2.setInt(1,Integer.parseInt(waferIdStr[i]));
					rs2 = ps2.executeQuery();
					ls = new ArrayList<Double>();
					while(rs2.next()){
						ls.add(rs2.getDouble(1));
					}
					map.put(waferIdStr[i], ls);
				}
				
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return map;
	}
	
}
