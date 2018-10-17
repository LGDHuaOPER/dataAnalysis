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
public class CurveDao {
	
	private DataBaseUtil db = new DataBaseUtil();

	/**
	 * 曲线类型添加
	 * @return
	 */
	public String insertCurveType(Connection conn,Object[] param){
		String sql = "insert into dm_curve_type (wafer_id,coordinate_id,subdie_id,curve_type,device_group,curve_file_name,curve_file_type) value (?,?,?,?,?,?,?)";
		PreparedStatement ps = null;
		String flag = "";
		try {
			ps = conn.prepareStatement(sql);
			for(int i=0,length=param.length;i<length;i++){
				ps.setObject(i+1, param[i]);
			}
			int row = ps.executeUpdate();
			flag = row>0?"success":"晶圆次要信息添加失败！";
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return flag;
	}
	/**
	 * 曲线类型主键
	 * @param conn
	 * @param subdieId
	 * @param fileName
	 * @return
	 */
	public int  getCurveTypeId(Connection conn,int subdieId,String fileName){
		String sql = "select curve_type_id from dm_curve_type where subdie_id=? and curve_file_name=?";
		Object[] param = new Object[]{subdieId,fileName};
		Object result = db.queryResult(conn, sql, param);
		return result==null?0:Integer.parseInt(result.toString());
	}
	
	/**
	 * 曲线参数添加
	 * @param conn
	 * @param param
	 * @return
	 */
	public String insertCurveParameter(Connection conn,Object[] param){
		String sql = "insert into dm_curve_parameter (curve_type_id,curve_parameter,curve_unit,curve_column,wafer_id) value (?,?,?,?,?)";
		PreparedStatement ps = null;
		String flag = "";
		try {
			ps = conn.prepareStatement(sql);
			for(int i=0,length=param.length;i<length;i++){
				ps.setObject(i+1, param[i]);
			}
			int row = ps.executeUpdate();
			flag = row>0?"success":"晶圆次要信息添加失败！";
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return flag;
	}
	
	public String insertCurveParameter(Connection conn,List<Object[]> param){
		String sql = "insert into dm_curve_parameter (curve_type_id,curve_parameter,curve_unit,curve_column,wafer_id) values (?,?,?,?,?)";
		
		return db.insertBatch(conn, sql, param)?"success":"曲线添加失败！";
	}
	
	
	public String insertCurveData(Connection conn,List<Object[]> list,String column,String str){
		String sql = "insert into dm_curve_data (curve_type_id,wafer_id"+column+") values (?,?"+str+")";
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
	/**
	 * 博达微的曲线数据存储，目前只有x\y\p三个轴的数据
	 * @param conn
	 * @param list
	 * @return
	 */
	public String insertCurveData(Connection conn,List<Object[]> list){
		String sql = "insert into dm_curve_data (curve_type_id,wafer_id,C1,C2,C3) values (?,?,?,?,?)";
		String flag = "success";
		return db.insertBatch(conn, sql, list)?flag:"曲线添加失败！";
	}
	
	/**
	 * 晶圆数据与分析类别的匹配判断
	 * DC
	 * @param waferId
	 * @param count
	 * @return
	 */
	public boolean getAnalysisClassify(int waferId,int count){
		String sql = "select count(curve_type_id) col from dm_curve_parameter where wafer_id=? group by curve_type_id";
		List<Map<String,Object>> ls = db.queryToList(sql, new Object[]{waferId});
		boolean flag = false;
		Map<String,Object> map = null;
		for(int i=0,size=ls.size();i<size;i++){
			map = ls.get(i);
			if(Integer.parseInt(map.get("col").toString()) == count){
				flag = true;
				break;
			}
		}
		return flag;
	}
	/**
	 * 晶圆数据与分析类别的匹配判断
	 * SP2
	 * @param waferId
	 * @return
	 */
	public boolean getAnalysisClassify(int waferId){
		String sql = "select distinct wafer_id from dm_curve_type where wafer_id=? and curve_file_type=1";
		List<Map<String,Object>> ls = db.queryToList(sql, new Object[]{});
		return ls.size()>0? true:false;
	}
	
	public boolean deleteCurveType(Connection conn,int waferId){
		String sql = "delete from dm_curve_type where wafer_id=?";
		return db.operate(conn, sql, new Object[]{waferId});
	}
	public boolean deleteCurveParameter(Connection conn,int waferId){
		String sql = "delete from dm_curve_parameter where wafer_id=?";
		return db.operate(conn, sql, new Object[]{waferId});
	}
	public boolean deleteCurveData(Connection conn,int waferId){
		String sql = "delete from dm_curve_data where wafer_id=?";
		return db.operate(conn, sql, new Object[]{waferId});
	}
	
	
	public List<String[]> getCurvFile(Connection conn,int waferId){
		String sql = "select curve_file_name,curve_type_id from dm_curve_type where wafer_id=? and curve_file_type=1 order by curve_type_id";
		List<String[]> ls = new ArrayList<>();
		String[] att = null;
		PreparedStatement ps;
		try {
			ps = conn.prepareStatement(sql);
			ps.setInt(1, waferId);
			ResultSet rs = ps.executeQuery();
			while(rs.next()){
				att = new String[]{rs.getString(1),rs.getString(2)};
				ls.add(att);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ls;
		
	}
	
	public int getCurveTypeId(int waferId){
		String sql = "select  min(curve_type_id)curve_type_id from dm_curve_type where wafer_id=? and  curve_file_type=1 ";
		Object result = db.queryResult(sql, new Object[]{waferId});
		return result==null?0:Integer.parseInt(result.toString());
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
		}
		map.put("S11", listS11);
		map.put("S12", listS12);
		map.put("S21", listS21);
		map.put("S22", listS22);
		return map;
	}
	
	
}
