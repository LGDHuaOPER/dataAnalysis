/**
 * 
 */
package com.eoulu.dao;

import java.math.BigDecimal;
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
		String sql = "insert into dm_smith_data (curve_type_id,wafer_id,frequency,real_part_s11,imaginary_part_s11,real_part_s12,imaginary_part_s12,real_part_s21,imaginary_part_s21,real_part_s22,imaginary_part_s22) values (?,?,?,?,?,?,?,?,?,?,?)";
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
	
	/**
	 * 参数S11
	 * @param curveTypeId
	 * @param graphStyle
	 * @return
	 */
	public List<Object[]> getSmithDataOfS11(int curveTypeId,String graphStyle){
		List<Object[]> list = new ArrayList<>();
		Double[] data = null;
		Connection conn = null;
		try {
			conn = db.getConnection();
			String sql = "select frequency,real_part_s11,imaginary_part_s11 from dm_smith_data where curve_type_id=?";
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setInt(1, curveTypeId);
			ResultSet rs = ps.executeQuery();
			switch (graphStyle) {
			case "Smith":
				while(rs.next()){
					data = new Double[]{rs.getDouble(1),rs.getDouble(2),rs.getDouble(3)};
					list.add(data);
				}
				break;

			case "Polar":
				while(rs.next()){
					data = new Double[]{rs.getDouble(1),rs.getDouble(2),rs.getDouble(3)};
					list.add(data);
				}
				
				break;
			case "XYOfPhase":
				while(rs.next()){
					data = new Double[]{rs.getDouble(1),Math.toDegrees(Math.atan(rs.getDouble(3)/rs.getDouble(2)))};
					list.add(data);
				}
				break;
				
			case "XYOfMagnitude":
				while(rs.next()){
					data = new Double[]{rs.getDouble(1),Math.sqrt(Math.pow(rs.getDouble(2), 2)+Math.pow(rs.getDouble(3), 2))};
					list.add(data);
				}
				break;
			case "XYdBOfMagnitude":
				while(rs.next()){
					data = new Double[]{rs.getDouble(1),-20*Math.log10(rs.getDouble(2))};
					list.add(data);
				}	
				break;
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
	
	public static void main(String[] args) {
		System.out.println();
	}
	/**
	 * 参数S12
	 * @param curveTypeId
	 * @param graphStyle
	 * @return
	 */
	public List<Object[]> getSmithDataOfS12(int curveTypeId,String graphStyle){
		List<Object[]> list = new ArrayList<>();
		Double[] data = null;
		Connection conn = null;
		try {
			conn = db.getConnection();
			String sql = "select frequency,real_part_s12,imaginary_part_s12 from dm_smith_data where curve_type_id=?";
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setInt(1, curveTypeId);
			ResultSet rs = ps.executeQuery();
			switch (graphStyle) {
			case "Smith":
				while(rs.next()){
					data = new Double[]{rs.getDouble(1),rs.getDouble(2),rs.getDouble(3)};
					list.add(data);
				}
				break;

			case "Polar":
				while(rs.next()){
					data = new Double[]{rs.getDouble(1),rs.getDouble(2),rs.getDouble(3)};
					list.add(data);
				}
				
				break;
			case "XYOfPhase":
				while(rs.next()){
					data = new Double[]{rs.getDouble(1),Math.toDegrees(Math.atan(rs.getDouble(3)/rs.getDouble(2)))};
					list.add(data);
				}
				break;
				
			case "XYOfMagnitude":
				while(rs.next()){
					data = new Double[]{rs.getDouble(1),Math.sqrt(Math.pow(rs.getDouble(2), 2)+Math.pow(rs.getDouble(3), 2))};
					list.add(data);
				}
				break;
			case "XYdBOfMagnitude":
				while(rs.next()){
					data = new Double[]{rs.getDouble(1),-20*Math.log10(rs.getDouble(2))};
					list.add(data);
				}	
				break;
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
	/**
	 * 参数S21
	 * @param curveTypeId
	 * @param graphStyle
	 * @return
	 */
	public List<Object[]> getSmithDataOfS21(int curveTypeId,String graphStyle){
		List<Object[]> list = new ArrayList<>();
		Double[] data = null;
		Connection conn = null;
		try {
			conn = db.getConnection();
			String sql = "select frequency,real_part_s21,imaginary_part_s21 from dm_smith_data where curve_type_id=?";
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setInt(1, curveTypeId);
			ResultSet rs = ps.executeQuery();
			switch (graphStyle) {
			case "Smith":
				while(rs.next()){
					data = new Double[]{rs.getDouble(1),rs.getDouble(2),rs.getDouble(3)};
					list.add(data);
				}
				break;

			case "Polar":
				while(rs.next()){
					data = new Double[]{rs.getDouble(1),rs.getDouble(2),rs.getDouble(3)};
					list.add(data);
				}
				
				break;
			case "XYOfPhase":
				while(rs.next()){
					data = new Double[]{rs.getDouble(1),Math.toDegrees(Math.atan(rs.getDouble(3)/rs.getDouble(2)))};
					list.add(data);
				}
				break;
				
			case "XYOfMagnitude":
				while(rs.next()){
					data = new Double[]{rs.getDouble(1),Math.sqrt(Math.pow(rs.getDouble(2), 2)+Math.pow(rs.getDouble(3), 2))};
					list.add(data);
				}
				break;
			case "XYdBOfMagnitude":
				while(rs.next()){
					data = new Double[]{rs.getDouble(1),-20*Math.log10(rs.getDouble(2))};
					list.add(data);
				}	
				break;
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
	
	/**
	 * 参数S22
	 * @param curveTypeId
	 * @param graphStyle
	 * @return
	 */
	public List<Object[]> getSmithDataOfS22(int curveTypeId,String graphStyle){
		List<Object[]> list = new ArrayList<>();
		Double[] data = null;
		Connection conn = null;
		try {
			conn = db.getConnection();
			String sql = "select frequency,real_part_s22,imaginary_part_s22 from dm_smith_data where curve_type_id=?";
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setInt(1, curveTypeId);
			ResultSet rs = ps.executeQuery();
			switch (graphStyle) {
			case "Smith":
				while(rs.next()){
					data = new Double[]{rs.getDouble(1),rs.getDouble(2),rs.getDouble(3)};
					list.add(data);
				}
				break;

			case "Polar":
				while(rs.next()){
					data = new Double[]{rs.getDouble(1),rs.getDouble(2),rs.getDouble(3)};
					list.add(data);
				}
				
				break;
			case "XYOfPhase":
				while(rs.next()){
					data = new Double[]{rs.getDouble(1),Math.toDegrees(Math.atan(rs.getDouble(3)/rs.getDouble(2)))};
					list.add(data);
				}
				break;
				
			case "XYOfMagnitude":
				while(rs.next()){
					data = new Double[]{rs.getDouble(1),Math.sqrt(Math.pow(rs.getDouble(2), 2)+Math.pow(rs.getDouble(3), 2))};
					list.add(data);
				}
				break;
			case "XYdBOfMagnitude":
				while(rs.next()){
					data = new Double[]{rs.getDouble(1),-20*Math.log10(rs.getDouble(2))};
					list.add(data);
				}	
				break;
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
	
	
	/**
	 * 获取marker的Smith曲线数据
	 * 纵轴为-20lg实部
	 * @param curveTypeId 
	 * @param parameter
	 * @return
	 */
	public List<Double[]> getSmithData(Connection conn,int curveTypeId, String parameter) {
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
		String sql = "select frequency "+condition+" from curve_smith_data where curve_parameter_id=?";
		List<Double[]> list = new ArrayList<>();
		Double[] att = null;
		double x=0,y = 0,z=0;
		try {
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setInt(1, curveTypeId);
			ResultSet rs = ps.executeQuery();
			while(rs.next()){
				x = new BigDecimal(rs.getDouble(1)).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
				y = Math.log10(rs.getDouble(2))*(-20);
				y = new BigDecimal(y).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
				att = new Double[]{x,y};
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
	
	public List<Map<String,Object>> getMarkerSmithData(Connection conn,int curveTypeId, String parameter){
		String condition = "";
		switch (parameter) {
		case "S11":
			condition = ",format(-20*log10(real_part_s11),2) y  ";
			break;

		case "S12":
			condition =  ",format(-20*log10(real_part_s12),2) y  ";
			break;
		case "S21":
			condition =  ",format(-20*log10(real_part_s21),2) y  ";
			break;
		case "S22":
			condition =  ",format(-20*log10(real_part_s22),2) y  ";
			break;
		}
		String sql = "select frequency x"+condition+" from dm_smith_data where curve_type_id=?  order by frequency";
		return db.queryToList(conn, sql, new Object[]{curveTypeId});
	}
	
	public boolean insertMarkerData(List<Object[]> ls){
		String sql = "insert into dm_marker_data (wafer_id,module,marker_name,point_x,point_y) values (?,?,?,?,?)";
		return db.insertBatch(sql, ls);
	}
	/**
	 * 打个marker存一次
	 * @param param
	 * @return
	 */
	public boolean insertMarker(Connection conn,Object[] param){
		String sql = "insert into dm_marker_data (wafer_id,curve_type_id,module,marker_name,point_x,point_y,location_key) value (?,?,?,?,?,?,?)";
		return db.operate(conn,sql, param);
	}
	
	public int getMarkerId(Object[] param){
		String sql  = "select marker_id calculationId from dm_marker_data where wafer_id=? and curve_type_id=? and module=?  and marker_name=?";
		Object result = db.queryResult(sql, param);
		return result==null?0:Integer.parseInt(result.toString());
	}
	
	public boolean updateMarker(Connection conn,Object[] param){
		String sql = "update dm_marker_data set marker_name=?,location_key=? where marker_name=? and  wafer_id=?";
		return db.operate(conn,sql, param);
	}
	
	
	public boolean deleteMarker(Object[] param){
		String sql = "delete from dm_marker_data where marker_name=? and  wafer_id=?";
		return db.operate(sql, param);
	}
	
	public boolean deleteMarkerById(Connection conn,int curveTypeId){
		String sql = "delete from dm_marker_data where curve_type_id=?";
		return db.operate(sql, new Object[]{curveTypeId});
	}
	
	public List<Map<String,Object>> getMarkerByTypeId(Connection conn,int curveTypeId){
		String sql = "select marker_name,point_x,point_y,location_key,marker_id  from dm_marker_data where  curve_type_id=?";
		return db.queryToList(conn,sql, new Object[]{curveTypeId});
	}
	
	public boolean getMarkerExsit(Connection conn,int curveTypeId){
		String sql = "select marker_name  from dm_marker_data where  curve_type_id=?";
		List<String> ls = db.queryList(conn, sql, new Object[]{curveTypeId});
		return ls.size()>0?true:false;
	}
	
	public String getTypeIdStr(Connection conn,int coordinateId){
		String sql = "select curve_type_id from dm_curve_type where coordinate_id=?";
		List<String> ls = db.queryList(conn, sql, new Object[]{coordinateId});
		String result = "";
		for(String str:ls){
			result += ","+str;
		}
		result = result.substring(1);
		return result;
	}
	
	public Map<String,List<String>> getAllMarker(Connection conn,String typeIdStr){
		String sql = "select marker_name,point_x,point_y from dm_marker_data where  curve_type_id in ("+typeIdStr+")";
		Map<String,List<String>> result = new HashMap<>();
		List<String> ls = null;
		try {
			PreparedStatement ps = conn.prepareStatement(sql);
			ResultSet rs = ps.executeQuery();
			while(rs.next()){
				ls = new ArrayList<>();
				ls.add(rs.getString(2));
				ls.add(rs.getString(3));
				result.put(rs.getString(1), ls);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return result;
	}
	
	/**
	 * S2P文件的最大Y值与最小Y值
	 * @param conn
	 * @param curveTypeId
	 * @param sParameter
	 * @return
	 */
	public List<String> getMaxAndMin(Connection conn,int curveTypeId,String sParameter){
		String condition = "";
		switch (sParameter) {
		case "S11":
			condition = "format(-20*log10(real_part_s11),2)  ";
			break;

		case "S12":
			condition = "format(-20*log10(real_part_s12),2)  ";
			break;
		case "S21":
			condition = "format(-20*log10(real_part_s21),2)  ";
			break;
		case "S22":
			condition = "format(-20*log10(real_part_s22),2)  ";
			break;
		}
		String sql = "select max("+condition+") max,min("+condition+") min from dm_smith_data where curve_type_id=?";
		return db.queryList(conn, sql, new Object[]{curveTypeId});
	}
	
	/**
	 * 以Y为基准，判断与曲线是否有交点
	 * @param conn
	 * @param markerY
	 * @param curveTypeId 
	 * @param sParameter
	 * @param str  判断条件 大于等于最大值或小于等于最小值
	 * @return
	 */
	public boolean  getIntersection(Connection conn,double markerY,int curveTypeId,String sParameter,String str){
		
		String sql = "select frequency from dm_smith_data where curve_type_id=? and "+str+"?";
		List<Map<String,Object>> ls = db.queryToList(conn, sql, new Object[]{curveTypeId,markerY});
		return ls.size()>0?true:false;
	}
	
	/**
	 * 每个marker点以X为基准定位
	 * 
	 * @param conn
	 * @param markerX
	 * @param curveTypeId
	 * @param sParameter
	 * @param markerName
	 * @return
	 */
	public Map<String, Object> getMarkerPointByX(Connection conn, double markerX, int curveTypeId, String sParameter,
			String markerName) {
		Map<String, Object> result = new HashMap<>();
		String condition = "";
		double pointY = 0;
		switch (sParameter) {
		case "S11":
			condition = ",(-20*log10(real_part_s11)) y ";
			break;

		case "S12":
			condition = ",(-20*log10(real_part_s12)) y ";
			break;
		case "S21":
			condition = ",(-20*log10(real_part_s21)) y ";
			break;
		case "S22":
			condition = ",(-20*log10(real_part_s22)) y ";
			break;
		}
		String sql = "select frequency x" + condition
				+ " dvalue from dm_smith_data where curve_type_id=? and frequency=? ";
		try {
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setInt(1, curveTypeId);
			ps.setString(2, markerX+"");
			ResultSet rs = ps.executeQuery();
			String[] att = null;
			while (rs.next()) {
				pointY = rs.getDouble(2);
				att = new String[]{markerX+"",pointY+""};
			}

			if(result.size()==0){
				att = new String[]{"NaN","NaN"};
			}
			result.put(markerName, att);
		} catch (SQLException e) {
			e.printStackTrace();
		}

		return result;

	}
	
	
	public boolean insertMarkerCalculation(List<Object[]> ls){
		String sql = "insert into dm_marker_data (wafer_id,module,custom_parameter,calculate_formula,calculation_result) values (?,?,?,?,?)";
		return db.insertBatch(sql, ls);
	}
	/**
	 * 提交一次存一次
	 * @param param
	 * @return
	 */
	public boolean insertMarkerCalculation(Connection conn,Object[] param){
		String sql = "insert into dm_marker_data (wafer_id,module,custom_parameter,user_formula,calculate_formula,calculation_result) value (?,?,?,?,?,?)";
		return db.operate(conn,sql, param);
	}
	
	public int getCalculationId(Object[] param){
		String sql  = "select marker_id calculationId from dm_marker_calculation where wafer_id=? and module=? and custom_parameter=?";
		Object result = db.queryResult(sql, param);
		return result==null?0:Integer.parseInt(result.toString());
	}
	
	public boolean updateCalculation(Connection conn,Object[] param ){
		String sql = "update dm_marker_calculation set custom_parameter=?,user_formula=?,calculate_formula=?,calculation_result=? where marker_id=?";
		return db.operate(conn, sql,param);
	}
	
	public List<Map<String,Object>> getCalculation(int waferId,String module){
		String sql = "select custom_parameter,calculation_result,calculate_formula,user_formula from dm_marker_calculation where wafer_id=? and module=?";
		return db.queryToList(sql, new Object[]{waferId});
	}
	
	public List<Map<String,Object>> getCalculation(Connection conn,int waferId,String module){
		String sql = "select custom_parameter,calculate_formula from dm_marker_calculation where wafer_id=? and module=?";
		return db.queryToList(conn,sql, new Object[]{waferId});
	}
	
	/**
	 * 获取对应文件的位置
	 * @param conn
	 * @param coordinateId
	 * @param curveTypeId
	 * @return
	 */
	public int getRowNumber(Connection conn,int coordinateId,int curveTypeId){
		String sql = "select c.rowno from "
				+ "(select dm_curve_type.curve_type_id ,(@rowno:=@rowno+1) as rowno from dm_curve_type,(select (@rowno:=0)) b "
				+ "where coordinate_id=? and curve_file_type=1 order  by curve_type_id)c where c.curve_type_id=?";
		Object[] param = new Object[]{coordinateId,curveTypeId};
		Object result = db.queryResult(conn, sql,param);
		return result==null?0:Integer.parseInt(result.toString());
		
	}
	/**
	 * 获取对应位置的文件，曲线类型主键
	 * 用于更新marker
	 * @param conn
	 * @param coordinateId
	 * @param rowNO
	 * @return
	 */
	public int getCurveTypeId(Connection conn,int coordinateId,int rowNO){
		String sql = "select c.curve_type_id from "
				+ "(select dm_curve_type.curve_type_id ,(@rowno:=@rowno+1) as rowno from dm_curve_type,(select (@rowno:=0)) b "
				+ "where coordinate_id=? and curve_file_type=1 order  by curve_type_id)c where c.rowno=?";
		Object[] param = new Object[]{coordinateId,rowNO};
		Object result = db.queryResult(conn, sql,param);
		return result==null?0:Integer.parseInt(result.toString());
		
	}
	
	public List<Map<String,Object>> getMarker(Connection conn,int coordinateId){
	String sql = "select marker_name,point_x,point_y from dm_marker_data where curve_type_id in (select curve_type_id from dm_curve_type where coordinate_id=?)";
		return db.queryToList(conn, sql, new Object[]{coordinateId});
	}
	
	public String getFormula(Connection conn,int calculationId){
		String sql = " select  calculate_formula from dm_marker_calculation where marker_id=? ";
		Object result = db.queryResult(conn, sql,new Object[]{calculationId});
		return result==null?"":result.toString();
	}
	
	
}
