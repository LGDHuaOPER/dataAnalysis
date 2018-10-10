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
		System.out.println("column:"+column);
		System.out.println("str:"+str);
		String sql = "insert into dm_wafer_coordinate_data (wafer_id,alphabetic_coordinate,x_coordinate,y_coordinate,die_number,bin,test_time"+column+") values (?,?,?,?,?,?,?"+str+") ";
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
			flag = "晶圆die数据添加失败！";
		}
		return flag;
	}
	
	
	public String insertSubdie(Connection conn,List<Object[]> list){
		String sql = "insert into dm_wafer_subdie (coordinate_id,subdie_number,subdie_name) values (?,?,?)";
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
	
	
}
