/**
 * 
 */
package com.eoulu.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import org.apache.catalina.tribes.util.Arrays;

import com.eoulu.util.DataBaseUtil;

/**
 * @author mengdi
 *
 * 
 */
public class CoordinateDao {

	private static DataBaseUtil db = new DataBaseUtil();
	
	/**
	 * 添加晶圆的die坐标数据
	 * @param conn
	 * @param list
	 * @param column
	 * @param str
	 * @return
	 */
	public String insertCoordinate(Connection conn,List<Object[]> list,String column,String str){
		String sql = "insert into dm_wafer_coordinate_data (wafer_id,alphabetic_coordinate,x_coordinate,y_coordinate,die_number,bin,test_time"+column+") values (?,?,?,?,?,?,?"+str+") ";
		PreparedStatement ps;
		String flag = "success";
		String id = "0";
		try {
			ps = conn.prepareStatement(sql);
			if(list!=null){
				int interval = 10000;
				Object[] params = null;
				for(int i=0,size=list.size();i<size;i++){
					params = list.get(i);
					for(int j=0,length=params.length;j<length;j++){
						if(i==0){
							id = params[0].toString();
						}
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
			flag = "晶圆die数据添加失败！";
		}
		return flag;
	}
	
	/**
	 * 添加新Excel输出参数数据
	 * @param conn
	 * @param paramColumn
	 * @param valueColumn
	 * @param ls
	 * @param waferId
	 * @return
	 */
	public String insertNewExcelCoordinate(Connection conn,String paramColumn,String valueColumn,List<Object> ls,int waferId){
		String sql = "insert into dm_wafer_coordinate_data (wafer_id,die_number"+paramColumn+") values (?,?"+valueColumn+")";
		String status = "";
		try {
			PreparedStatement ps = conn.prepareStatement(sql);
			String value = "";
			for(int i=0;i<ls.size();i++){
				List<Object> rowdata = (List<Object>) ls.get(i);
				ps.setInt(1, waferId);
				ps.setString(2, rowdata.get(0).toString());
				for(int j=1;j<rowdata.size();j++){
					value = (rowdata.get(j)==null || rowdata.get(j).toString().trim().equals(""))?"0":rowdata.get(j).toString();
					ps.setDouble(2+j, Double.parseDouble(value));
				}
				ps.addBatch();
			}
			int[] counts = ps.executeBatch();
			status = counts.length>0?"":"晶圆数据添加失败！";
		} catch (SQLException e) {
			e.printStackTrace();
			status = "晶圆数据添加失败！";
		}
		return status;
	}
	
	/**
	 * TXT输出参数数据
	 * @param conn
	 * @param paramColumn
	 * @param valueColumn
	 * @param ls
	 * @param waferId
	 * @return
	 */
	public String insertTxtCoordinate(Connection conn,String paramColumn,String valueColumn,List<Object> ls,int waferId){
		String sql = "insert into dm_wafer_coordinate_data (wafer_id,die_number,device"+paramColumn+",bin_data) values (?,?,?"+valueColumn+",?)";
		String status = "";
		try {
			PreparedStatement ps = conn.prepareStatement(sql);
			String value = "";
			for(int i=0,size=ls.size();i<size;i++){
				List<Object> rowdata = (List<Object>) ls.get(i);
				ps.setInt(1, waferId);
				ps.setString(2, (i+1)+"");
				ps.setString(3, rowdata.get(0).toString());
				for(int j=1,length=rowdata.size();j<length;j++){
					if(j==length-1){
						value = (rowdata.get(j)==null || rowdata.get(j).toString().trim().equals(""))?"-1":rowdata.get(j).toString();
						ps.setInt(3+j, Integer.parseInt(value));
					}else{
						value = (rowdata.get(j)==null || rowdata.get(j).toString().trim().equals(""))?"0":rowdata.get(j).toString();
						if(value.endsWith("h") || value.endsWith("H")){
							ps.setString(3+j, value);
						}else{
							ps.setDouble(3+j, Double.parseDouble(value));
						}
						
					}
					
				}
				ps.addBatch();
			}
			int[] counts = ps.executeBatch();
			status = counts.length>0?"":"晶圆数据添加失败！";
		} catch (SQLException e) {
			e.printStackTrace();
			status = "晶圆数据添加失败！";
		}
		return status;
	}
	
	/**
	 * 博达微坐标数据添加
	 * @param conn
	 * @param ls
	 * @return
	 */
	public String insertPMSCoordinate(Connection conn,List<Object[]> ls){
		String sql = "insert into dm_wafer_coordinate_data (wafer_id,alphabetic_coordinate,x_coordinate,y_coordinate,bin,die_number,test_time) values (?,?,?,?,?,?,?)";
		String status = db.insertBatch(conn, sql, ls)?"success":"添加失败！";
		return status;
	}
	
	/**
	 * 添加subdie
	 * @param conn
	 * @param list
	 * @return
	 */
	public String insertSubdie(Connection conn,List<Object[]> list){
		String sql = "insert into dm_wafer_subdie (coordinate_id,subdie_number,subdie_name,wafer_id) values (?,?,?,?)";
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
			flag = "晶圆subdie数据添加失败！";
		}
		return flag;
	}
	
	public String insertSubdie(Connection conn,Object[] param){
		String sql = "insert into dm_wafer_subdie (coordinate_id,subdie_number,subdie_name) values (?,?,?)";
		return db.operate(conn, sql, param)?"success":"添加失败！";
	}
	
	/**
	 * 根据晶圆编号与die编号获取Coordinate主键
	 * @param conn
	 * @param waferNumber
	 * @param dieNumber
	 * @return
	 */
	public Map<String,Object> getCoordinate(Connection conn,int waferId,String dieNumber){
		String sql = "select coordinate_id from dm_wafer_coordinate_data where die_number=? and wafer_id=?";
		Object[] param = new Object[]{dieNumber,waferId};
		List<Map<String,Object>> ls = db.queryToList(conn, sql, param);
		return ls.size()>0?ls.get(0):null;
	}
	/**
	 * 根据晶圆主键、坐标获取Coordinate主键
	 * @param conn
	 * @param waferId
	 * @param dieX
	 * @param dieY
	 * @return
	 */
	public int getCoordinateId(Connection conn,int waferId,String dieX,String dieY){
		String sql = "select coordinate_id from dm_wafer_coordinate_data  where wafer_id=? and x_coordinate=? and y_coordinate=?";
		Object[] param = new Object[]{waferId,dieX,dieY};
		Object result = db.queryResult(conn, sql, param);
		return result==null?0:Integer.parseInt(result.toString());
	}
	
	/**
	 * Subdie主键
	 * @param conn
	 * @param coordinateId
	 * @param subdieNumber
	 * @return
	 */
	public int  getSubdieId(Connection conn,int coordinateId,int subdieNumber,String subdieName){
		String sql = "select subdie_id from dm_wafer_subdie where coordinate_id=? and subdie_number=?";
		Object[] param = new Object[]{coordinateId,subdieNumber};
		if(!"".equals(subdieName)){
			sql = "select subdie_id from dm_wafer_subdie where coordinate_id=? and subdie_name=?";
			param = new Object[]{coordinateId,subdieName};
		}
		Object result = db.queryResult(conn, sql, param);
		return result==null?0:Integer.parseInt(result.toString());
	}
	
	public boolean delete(Connection conn,int waferId){
		String sql = "delete from dm_wafer_coordinate_data where wafer_id=?";
		return db.operate(conn, sql, new Object[]{waferId});
	}
	
	public boolean deleteSubdie(Connection conn,int waferId){
		String sql = "delete from dm_wafer_subdie where wafer_id=?";
		return db.operate(conn, sql, new Object[]{waferId});
	}
	
	
}
