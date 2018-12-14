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

import com.eoulu.transfer.ObjectTable;
import com.eoulu.util.DataBaseUtil;

/**
 * @author mengdi
 *
 * 
 */
public class BoxPlotDao {
	
	public  Map<String, Object> getBoxPlot(String param,String[] waferIdStr){
		WaferDao waferDao = (WaferDao) ObjectTable.getObject("WaferDao");
		SubdieDao subdieDao = (SubdieDao) ObjectTable.getObject("SubdieDao");
		String sql = "select parameter_column from dm_wafer_parameter where wafer_id=? and parameter_name=?",sql2 = "";
		PreparedStatement ps = null,ps2 = null;
		ResultSet rs = null,rs2 = null;
		String column ,waferNO;
		int waferId;
		boolean flag = false;
		List<Double> ls = null;
		Map<String, Object> map = new HashMap<>();
		DataBaseUtil db =  DataBaseUtil.getInstance();
		Connection conn = null;
		try {
			conn = db.getConnection();
			for(int i=0,length=waferIdStr.length;i<length;i++){
				column = "";
				waferId = Integer.parseInt(waferIdStr[i]);
				ps = conn.prepareStatement(sql);
				ps.setInt(1,waferId );
				ps.setString(2, param);
				rs = ps.executeQuery();
				while(rs.next()){
					column = rs.getString(1);
				}
				if(!"".equals(column)){
					waferNO = waferDao.getWaferNO(conn, waferId);
					flag = subdieDao.getSubdieExist(conn, waferNO);
					if(flag){
						sql2 = "select "+column+" from dm_wafer_subdie where wafer_id=? and  (subdie_bin=1 or subdie_bin=255)";
					}else{
						sql2 = "select "+column+" from dm_wafer_coordinate_data where wafer_id=? and  (bin=1 or bin=255)";
					}
					
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
		}finally{
			db.close(conn);
		}
		
		return map;
	}
	
}
