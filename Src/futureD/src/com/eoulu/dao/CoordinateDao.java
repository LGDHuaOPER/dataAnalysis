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

import org.apache.catalina.tribes.util.Arrays;

import com.eoulu.transfer.WaferMapDTO;
import com.eoulu.util.DataBaseUtil;
import com.google.gson.Gson;

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
	public String insertCoordinate(Connection conn,List<Object[]> list,String column,String str,int waferId){
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
					ps.setObject(1, waferId);
					for(int j=0,length=params.length;j<length;j++){
						ps.setObject(j+2, params[j]);
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
	
	public String insertCoordinate(Connection conn,List<Object[]> list,String column,String str){
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
			flag = "晶圆die数据存储失败！";
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
	
	public String saveSubdie(Connection conn,Object[] param){
		String sql = "insert into dm_wafer_subdie (coordinate_id,subdie_number,subdie_name,wafer_id) values (?,?,?,?)";
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
	
	/**
	 * 更新die对应的自定义参数结果数据
	 * @param param
	 * @param column
	 * @return
	 */
	public boolean updateDieParamByMarker(Connection conn,Object[] param,String column){
		String sql = "update dm_wafer_coordinate_data set "+column+"=? where coordinate_id=?";
		return db.operate(conn,sql, param);
	}
	
	/**
	 * 横坐标最大、最小
	 * 纵坐标最大、最小
	 * @param conn
	 * @param waferNO
	 * @return
	 */
	public List<Map<String, Object>> getCoordinateRange(Connection conn, String waferNO) {
		String sql = "select min(x_coordinate) minX,max(x_coordinate) maxX,min(y_coordinate) minY,max(y_coordinate) maxY from dm_wafer_coordinate_data where wafer_id in (select wafer_id from dm_wafer where wafer_number=?)";
		return db.queryToList(conn, sql, new Object[] {waferNO});

	}
	
	public WaferMapDTO getAllParameter(Connection conn,int waferId) {
		WaferMapDTO wafer = new WaferMapDTO();
		wafer.setParameter("Total Yield");
		String sql = "select x_coordinate,y_coordinate,bin from dm_wafer_coordinate_data where wafer_id=?";
		try {
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setInt(1, waferId);
			Map<String,Object> map = new HashMap<>();
			int num=0,qualified=0;
			ResultSet rs = ps.executeQuery();
			while(rs.next()){
				if(rs.getInt(3)!=-1 && rs.getInt(3)!=5000) {
					num++;
					if(rs.getInt(3)==1) {
						qualified++;
					}
					
				}
				map.put(rs.getInt(1)+":"+rs.getInt(2), rs.getInt(3));
			}
			wafer.setCurrentDieList(map);
			wafer.setQualify(qualified);
			wafer.setUnqulify(num-qualified);
			if(num == 0 || qualified == 0){
				wafer.setYield("0.0%");
			}else{
				wafer.setYield(new BigDecimal((double)qualified/num*100).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue()+"%");
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return wafer;
	}
	
	
	public Map<String,Object> getOtherDie(Connection conn,int waferId,String waferNO){
		String sql = "select x_coordinate,y_coordinate,bin from dm_wafer_coordinate_data where wafer_id in (select wafer_id from dm_wafer where wafer_number=?  and wafer_id<>? and delete_status=0) ";
		Map<String,Object> result = new HashMap<>();
		PreparedStatement ps;
		try {
			ps = conn.prepareStatement(sql);
			ps.setString(1, waferNO);
			ps.setInt(2, waferId);
			ResultSet rs = ps.executeQuery();
			while(rs.next()){
				if(rs.getInt(3) == -1){
					result.put(rs.getInt(1)+":"+rs.getInt(2), rs.getInt(3));
				}else{
					result.put(rs.getInt(1)+":"+rs.getInt(2), 5001);
				}
				
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return result;
	}
	
	
	public WaferMapDTO getPerParameter(Connection conn,int waferId,String column,String parameter,double uppper,double lower) {
		WaferMapDTO wafer = new WaferMapDTO();
		wafer.setParameter(parameter);
		String sql  = "select x_coordinate,y_coordinate,bin,"+column+" from dm_wafer_coordinate_data where wafer_id=? order by "+column+" desc";
		Map<String,Object> result = new HashMap<>();
		PreparedStatement ps;
		try {
			ps = conn.prepareStatement(sql);
			ps.setInt(1, waferId);
			ResultSet rs = ps.executeQuery();
			int num=0,qualified=0;
			while(rs.next()){
				int bin = rs.getInt(3);//
				if(rs.getInt(3)!=-1 && rs.getInt(3)!=5000) {
					num++;
					if(rs.getDouble(4)>=lower&&rs.getDouble(4)<=uppper){
						bin=1;
						qualified++;
					}else {
						bin=255;
					}
				}
				result.put(rs.getInt(1)+":"+rs.getInt(2), bin);
			}
			wafer.setCurrentDieList(result);
			wafer.setQualify(qualified);
			wafer.setUnqulify(num-qualified);
			if(num == 0 || qualified == 0){
				wafer.setYield("0.0%");
			}else{
				wafer.setYield(new BigDecimal((double)qualified/num*100).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue()+"%");
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return wafer;
		
	}
	
	public double getYield(Connection conn,int waferId){
		String sql = "select (select count(*) from dm_wafer_coordinate_data where wafer_id=? and bin=1)/count(*) yield from dm_wafer_coordinate_data where wafer_id=? and (bin=1 or bin=255)";
		Object result = db.queryResult(conn, sql, new Object[]{waferId,waferId});
		return result==null?0:Double.parseDouble(result.toString());
	}
	
	public WaferMapDTO getColorMap(Connection conn,int waferId,String column,String parameter,double upper,double lower) {
		WaferMapDTO wafer = new WaferMapDTO();
		wafer.setParameter(parameter);
		String condition = " abs("+column+") ",percent="";
		double interval = Math.abs(upper-lower),multipleMax = upper+interval,multipleMin = lower-interval;
		String sql  = "select x_coordinate,y_coordinate,bin,"+column+","
				+ "(case when "+column+">"+multipleMax+" then '+100%' "
				+ "when "+column+" > "+upper+" and "+column+" <= "+multipleMax+" then concat('+',round(abs("+condition+"-abs("+upper+"))/"+interval+"*100,2),'%') "
				+ "when "+column+" between "+lower+" and "+upper+" then concat(round(abs("+condition+"-abs("+lower+"))/"+interval+"*100,2),'','%') "
				+ "when "+column+" > "+multipleMin+" and "+column+" <= "+lower+" then concat('-',round(abs("+condition+"-abs("+lower+"))/"+interval+"*100,2),'%')  "
				+ "else '-100%' end ) percent "
				+ " from dm_wafer_coordinate_data where wafer_id=?  order by "+column+" desc";
		Map<String,Object> result = new HashMap<>();
		Map<String,Object> colorMap = new HashMap<>();
		PreparedStatement ps;
		try {
			ps = conn.prepareStatement(sql);
			ps.setInt(1, waferId);
			ResultSet rs = ps.executeQuery();
			int num=0,qualified=0;
			
			while(rs.next()){
				int bin = rs.getInt(3);//
				percent = rs.getString(5);
				colorMap = new HashMap<>();
				if(rs.getInt(3)!=-1 && rs.getInt(3)!=5000) {
					num++;
					if(rs.getDouble(4)>=lower&&rs.getDouble(4)<=upper){
						bin=1;
						qualified++;
					}else {
						bin=255;
					}
					colorMap.put("percent", percent);
				}
				colorMap.put("bin", bin);
				result.put(rs.getInt(1)+":"+rs.getInt(2), colorMap);
			}
			wafer.setCurrentDieList(result);
			wafer.setQualify(qualified);
			wafer.setUnqulify(num-qualified);
			if(num == 0 || qualified == 0){
				wafer.setYield("0.0%");
			}else{
				wafer.setYield(new BigDecimal((double)qualified/num*100).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue()+"%");
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return wafer;
		
	}
	
	/**
	 * 求中位数
	 * @param conn
	 * @param waferId
	 * @param left
	 * @param right
	 * @return
	 */
	public String getMedian(Connection conn,int waferId,double left ,double right,String column){
		String sql = "select a."+column+" from "
				+ " (select  "+column+",@rownum:=@rownum + 1 AS  num from (select @rownum:=0)r,dm_wafer_coordinate_data where wafer_id=? and "+column+" between ? and ? order by "+column+") a "
				+ "where a.num=(select (count(*)+1)div 2 from dm_wafer_coordinate_data where wafer_id=? and "+column+" between ? and ? )";
		Object result = db.queryResult(conn, sql, new Object[]{waferId,left,right,waferId,left,right});
		return result==null?"":result.toString();
	}
	
	/**
	 * 矢量map
	 * @param conn
	 * @param waferId
	 * @param subdieName
	 * @param deviceGroup
	 * @return
	 */
	public WaferMapDTO getVectorMap(Connection conn,int waferId,String subdieName,String deviceGroup) {
		WaferMapDTO wafer = new WaferMapDTO();
		wafer.setParameter("All");
		String sql = "select x_coordinate,y_coordinate,bin,coordinate_id from dm_wafer_coordinate_data where wafer_id=? ";
		if(!"".equals(subdieName)){
			sql += " and coordinate_id in (select distinct coordinate_id from dm_wafer_subdie where subdie_name=?) ";
		}
		if(!"".equals(deviceGroup)){
			sql += " and coordinate_id in (select distinct coordinate_id from dm_curve_type where device_group=?) ";
		}
		try {
			int index = 1;
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setInt(index, waferId);
			if(!"".equals(subdieName)){
				index++;
				ps.setString(index, subdieName);
			}
			if(!"".equals(deviceGroup)){
				index++;
				ps.setString(index, deviceGroup);
			}
			Map<String,Object> map = new HashMap<>(),temp=null;
			int num=0,qualified=0;
			ResultSet rs = ps.executeQuery();
			while(rs.next()){
				if(rs.getInt(3)!=-1) {
					num++;
					if(rs.getInt(3)==1) {
						qualified++;
					}
					
				}
				temp = new HashMap<>();
				temp.put("bin", rs.getInt(3));
				temp.put("coordinateId", rs.getInt(4));
				map.put(rs.getInt(1)+":"+rs.getInt(2), temp);
			}
			wafer.setCurrentDieList(map);
			wafer.setQualify(qualified);
			wafer.setUnqulify(num-qualified);
			if(num == 0 || qualified == 0){
				wafer.setYield("0.0%");
			}else{
				wafer.setYield(new BigDecimal((double)qualified/num*100).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue()+"%");
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return wafer;
	}
	
	public List<String> getSubdie(int waferId){
		String sql = "select distinct subdie_name from dm_wafer_subdie where wafer_id="+waferId;
		return db.queryList(sql, null);
	}
	
	
}
