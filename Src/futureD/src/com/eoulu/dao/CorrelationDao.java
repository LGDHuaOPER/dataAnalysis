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
public class CorrelationDao {

	
	public Map<String,Object> getCorrelation(int waferId, String paramX, String paramY, Double minX, Double maxX,
			Double minY, Double maxY){
		Connection conn = new DataBaseUtil().getConnection();
		Map<String, Object> map = new HashMap<String, Object>();
		List<Double> XList = new ArrayList<Double>();
		List<Double> YList = new ArrayList<Double>();
		String columnX =  new GaussianDao().getParameterColumn(conn, waferId, paramX);
		String columnY =  new GaussianDao().getParameterColumn(conn, waferId, paramY);
		String sql = "select "+columnX+","+columnY+" from dm_wafer_coordinate_data where wafer_id=?";
		PreparedStatement ps;
		try {
			ps = conn.prepareStatement(sql);
			ps.setInt(1, waferId);
			ResultSet rs = ps.executeQuery();
			while(rs.next()){
				if(((minX==null||rs.getDouble(1)>=minX)&&(maxX==null||rs.getDouble(1)<=maxX))
						&&(minY==null||rs.getDouble(2)>=minY)&&(maxY==null||rs.getDouble(2)<=maxY)) {
					XList.add(rs.getDouble(1));
					YList.add(rs.getDouble(2));
				}
			}
			map.put("X", XList);
			map.put("Y", YList);
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return map;
	}
	
	
}
