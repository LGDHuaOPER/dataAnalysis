/**
 * 
 */
package com.eoulu.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import com.eoulu.util.DataBaseUtil;

/**
 * @author mengdi
 *
 * 
 */
public class SmithDao {

	private DataBaseUtil db = new DataBaseUtil();
	/**
	 * 添加Smith数据
	 * @param conn
	 * @param list
	 * @return
	 */
	public String insertSmithData(Connection conn,List<Object[]> list){
		String sql = "insert into dm_smith_data (curve_type_id,wafer_id,fequency,real_part_s11,imaginary_part_s11,real_part_s12,imaginary_part_s12,real_part_s21,imaginary_part_s21,real_part_s22,imaginary_part_s22) values (?,?,?,?,?,?,?,?,?,?,?)";
		PreparedStatement ps;
		String flag = "success";
		try {
			ps = conn.prepareStatement(sql);
			if(list!=null){
				int interval = 10000;
				Object[] params = null;
				for(int i=0,size=list.size();i<size;i++){
					params = list.get(i);
					for(int j=0,length=params.length;j<length;j++){
						ps.setObject(j+1, params[j]);
					}
					ps.addBatch();
					if((i+1)%interval==0){
						ps.executeBatch();
					}
				}
				if(list.size()%interval>0){
					ps.executeBatch();
				}
			}
		} catch (SQLException e) {
			e.printStackTrace();
			flag = "曲线数据添加失败！";
		}
		return flag;
	}
	
	public boolean deleteSmithData(Connection conn,int waferId){
		String sql = "delete from dm_smith_data where wafer_id=?";
		return db.operate(conn, sql, new Object[]{waferId});
	}
	
	public boolean deleteMarker(Connection conn,int waferId){
		String sql = "delete from dm_marker_data where wafer_id=?";
		return db.operate(conn, sql, new Object[]{waferId});
	}
	
	
	public boolean deleteMarkerCalculation(Connection conn,int waferId){
		String sql = "delete from dm_marker_calculation where wafer_id=?";
		return db.operate(conn, sql, new Object[]{waferId});
	}
	
	
}
