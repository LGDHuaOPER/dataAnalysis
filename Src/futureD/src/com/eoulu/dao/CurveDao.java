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
		List<Map<String,Object>> ls = db.queryToList(sql, new Object[]{waferId});
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
		String sql = "select curve_file_name,curve_type_id,coordinate_id,subdie_id,subdie_flag from dm_curve_type left join dm_wafer on"
				+ " dm_curve_type.wafer_id = dm_wafer.wafer_id where dm_curve_type.wafer_id=? and curve_file_type=1 order by curve_type_id";
		List<String[]> ls = new ArrayList<>();
		String[] att = null;
		PreparedStatement ps;
		try {
			ps = conn.prepareStatement(sql);
			ps.setInt(1, waferId);
			ResultSet rs = ps.executeQuery();
			while(rs.next()){
				att = new String[]{rs.getString(1),rs.getString(2),rs.getString(3),rs.getString(4),rs.getString(5)};
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
	
	public List<Integer> getCoordinateId(Connection conn,int waferId){
		List<Integer> ls = new ArrayList<>();
		String sql = "select distinct coordinate_id from dm_curve_type  where wafer_id=?";
		try {
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setInt(1, waferId);
			ResultSet rs = ps.executeQuery();
			while(rs.next()){
				ls.add(rs.getInt(1));
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ls;
	}
	
	public List<Integer> getSubdieId(Connection conn,int waferId){
		List<Integer> ls = new ArrayList<>();
		String sql = "select distinct subdie_id from dm_curve_type  where wafer_id=?";
		try {
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setInt(1, waferId);
			ResultSet rs = ps.executeQuery();
			while(rs.next()){
				ls.add(rs.getInt(1));
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ls;
	}
	
	public List<String> getDeviceGroup(int waferId){
		String sql = "select distinct device_group from dm_curve_type where wafer_id="+waferId;
		return db.queryList(sql, null);
	}
	/**
	 * 曲线筛选
	 * @param coordinateId
	 * @param subdieName
	 * @param deviceGroup
	 * @return
	 */
	public List<Map<String, Object>> getCurveType(Connection conn,int coordinateId, String subdieName, String deviceGroup) {
		String sql = "select curve_type_id,curve_type,curve_file_type from dm_curve_type where coordinate_id=? ";
		Object[] param = new Object[]{coordinateId};
		if (!"".equals(subdieName) && !"".equals(deviceGroup)){
			sql += " and device_group=?  and  subdie_id in (select subdie_id from dm_wafer_subdie where subdie_number=?) ";
			param = new Object[]{coordinateId,deviceGroup,subdieName};
		}else
		if (!"".equals(deviceGroup)) {
			sql += " and device_group=? ";
			param = new Object[]{coordinateId,deviceGroup};
		}else
		if (!"".equals(subdieName)) {
			sql += " and  subdie_id in (select subdie_id from dm_wafer_subdie where subdie_number=?) ";
			param = new Object[]{coordinateId,subdieName};
		}
		
		System.out.println("SQL==="+sql);
		return db.queryToList(conn,sql, param);
	}
	
	public Map<String,Object> getCurveColumn(Connection conn,int curvTypeId){
		String sql = "select curve_parameter,ifnull(curve_unit,''),curve_column from dm_curve_parameter where curve_type_id=? order by curve_column";
		List<String> paramList = new ArrayList<>();
		String column = "";
		PreparedStatement ps;
		try {
			ps = conn.prepareStatement(sql);
			ps.setInt(1, curvTypeId);
			ResultSet rs = ps.executeQuery();
			while(rs.next()){
				if("".equals(rs.getString(2))){
					paramList.add(rs.getString(1));
				}else{
					paramList.add(rs.getString(1)+"("+rs.getString(2)+")");
				}
				column += ","+rs.getString(3);
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		Map<String,Object> map = new HashMap<>();
		map.put("paramList", paramList);
		map.put("column", column.substring(column.indexOf(",")));
		return map;
	}
	
	public List<Object[]> getCurveData(Connection conn,int curveTypeId,String column){
		
		String[] att = column.split(",");
		int count = att.length;
		if(count == 0){
			return null;
		}
		String sql = "select "+column+" from dm_curve_data where curve_type_id=?";
		PreparedStatement ps;
		List<Object[]> result = new ArrayList<>();
		try {
			ps = conn.prepareStatement(sql);
			ps.setInt(1, curveTypeId);
			ResultSet rs = ps.executeQuery();
			List<Double> ls = new ArrayList<>();
			List<Double> ls2 = new ArrayList<>();
			List<Double> ls3 = new ArrayList<>();
			while(rs.next()){
				ls.add(rs.getDouble(1));
				if(count>1){
					ls2.add(rs.getDouble(2));
				}
				if(count >2){
					ls3.add(rs.getDouble(3));
				}
			}
			result.add(ls.toArray());
			if(ls2.size()>0){
				result.add(ls2.toArray());
			}
			if(ls3.size()>0){
				result.add(ls3.toArray());
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return result;
	}
	
}
