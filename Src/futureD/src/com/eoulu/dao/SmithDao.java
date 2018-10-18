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
	
	
	public Map<String,List<Double[]>> getSmithData(int curveTypeId){
		Map<String,List<Double[]>> map = new HashMap<>();
		List<Double[]> listS11 = new ArrayList<>();
		List<Double[]> listS12 = new ArrayList<>();
		List<Double[]> listS21 = new ArrayList<>();
		List<Double[]> listS22 = new ArrayList<>();
		Double[] dataS11 = null;
		Double[] dataS12 = null;
		Double[] dataS21 = null;
		Double[] dataS22 = null;
		Connection conn = null;
		try {
			conn = db.getConnection();
			String sql = "select fequency,real_part_s11,imaginary_part_s11,real_part_s12,imaginary_part_s12,real_part_s21,imaginary_part_s21,real_part_s22,imaginary_part_s22 from curve_smith_data where curve_parameter_id=?";
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setInt(1, curveTypeId);
			ResultSet rs = ps.executeQuery();
			while(rs.next()){
				dataS11 = new Double[]{rs.getDouble(1),rs.getDouble(2),rs.getDouble(3)};
				dataS12 = new Double[]{rs.getDouble(1),rs.getDouble(4),rs.getDouble(5)};
				dataS21 = new Double[]{rs.getDouble(1),rs.getDouble(6),rs.getDouble(7)};
				dataS22 = new Double[]{rs.getDouble(1),rs.getDouble(8),rs.getDouble(9)};
				listS11.add(dataS11);
				listS12.add(dataS12);
				listS21.add(dataS21);
				listS22.add(dataS22);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}finally {
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		map.put("S11", listS11);
		map.put("S12", listS12);
		map.put("S21", listS21);
		map.put("S22", listS22);
		return map;
	}
	
	/**
	 * 获取marker的Smith曲线数据
	 * 纵轴为-20lg实部
	 * @param curveTypeId 
	 * @param parameter
	 * @return
	 */
	public List<Double[]> getSmithData(int curveTypeId, String parameter) {
		String condition = "";
		switch (parameter) {
		case "S11":
			condition = ",real_part_s11,imaginary_part_s11 ";
			break;

		case "S12":
			condition = ",real_part_s12,imaginary_part_s12 ";
			break;
		case "S21":
			condition = ",real_part_s21,imaginary_part_s21 ";
			break;
		case "S22":
			condition = ",real_part_s22,imaginary_part_s22 ";
			break;
		}
		String sql = "select fequency "+condition+" from curve_smith_data where curve_parameter_id=?";
		List<Double[]> list = new ArrayList<>();
		Double[] att = null;
		Connection conn = null;
		try {
			conn = db.getConnection();
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setInt(1, curveTypeId);
			ResultSet rs = ps.executeQuery();
			while(rs.next()){
				att = new Double[]{rs.getDouble(1),Math.log10(rs.getDouble(2))*(-20)};
				list.add(att);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}finally {
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return list;
	}
	
	public boolean insertMarkerData(List<Object[]> ls){
		String sql = "insert into dm_marker_data (wafer_id,module,s_parameter,marker_name,point_x,point_y) values (?,?,?,?,?,?)";
		return db.insertBatch(sql, ls);
	}
	
	public boolean insertMarkerCalculation(List<Object[]> ls){
		String sql = "insert into dm_marker_data (wafer_id,module,s_parameter,custom_parameter,calculate_formula,calculation_result) values (?,?,?,?,?,?)";
		return db.insertBatch(sql, ls);
	}
	
}
