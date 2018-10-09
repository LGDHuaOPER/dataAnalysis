/**
 * 
 */
package com.eoulu.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;


/**
 * @author mengdi
 *
 * 
 */
public class CurveDao {

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
	
	
	public String insertCurveData(Connection conn,List<Object[]> list,String column,String str){
		String sql = "insert into dm_curve_data (curve_parameter_id,wafer_id"+column+") values (?,?"+str+")";
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
	
}
