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
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.eoulu.transfer.SubdieDO;
import com.eoulu.transfer.WaferMapDTO;
import com.eoulu.util.DataBaseUtil;

/**
 * @author mengdi
 *
 * 
 */
public class SubdieDao {

	public String insertSubdie(Connection conn,List<Object[]> list,String column,String columnStr){
		String sql = "insert into dm_wafer_subdie (wafer_id,subdie_alphabet,subdie_x,subdie_y,subdie_number,subdie_bin,test_time,coordinate_id"+column+") values (?,?,?,?,?,?,?,?"+columnStr+")";
		String flag = "success";
		try {
			PreparedStatement ps = conn.prepareStatement(sql);
			if(list!=null){
				int interval = 10000;
				Object[] params = null;
				int[] result = null;
				
				for(int i=0,size=list.size();i<size;i++){
					params = list.get(i);
					
					for(int j=0,length=params.length;j<length;j++){
						ps.setObject(j+1, params[j]);
					}
					ps.addBatch();
					if((i+1)%interval==0){
						result = ps.executeBatch();
					}
				}
				if(list.size()%interval>0){
					result = ps.executeBatch();
				}
				flag = result.length>0 ? flag : "subdie存储失败！" ;
			}
		} catch (SQLException e) {
			e.printStackTrace();
			flag = "subdie存储出错！";
		}
		return flag;
	}
	
	
	public String insertSubdieConfig(Connection conn,List<Object[]> list){
		String sql = "insert into dm_wafer_subdie_config (subdie_number,offset_x,offset_y,subdie_size_x,subdie_size_y,wafer_number) values (?,?,?,?,?,?)";
		String flag = "success";
		try {
			PreparedStatement ps = conn.prepareStatement(sql);
			if(list!=null){
				int interval = 10000;
				Object[] params = null;
				int[] result = null;
				for(int i=0,size=list.size();i<size;i++){
					params = list.get(i);
					
					for(int j=0,length=params.length;j<length;j++){
						ps.setObject(j+1, params[j]);
					}
					ps.addBatch();
					if((i+1)%interval==0){
						result = ps.executeBatch();
					}
				}
				if(list.size()%interval>0){
					result = ps.executeBatch();
				}
				flag = result.length>0 ? flag : "subdie配置信息存储失败！" ;
			}
		} catch (SQLException e) {
			e.printStackTrace();
			flag = "subdie配置信息存储出错！";
		}
		return flag;
		
	}
	
	/*
	public String insertSubdieParameter(Connection conn,List<Object[]> list,int waferId){
		String sql  = "insert into dm_wafer_subdie_parameter (wafer_id,subdie_parameter,subdie_unit,subdie_column,subdie_upper_limit,subdie_lower_limit) values (?,?,?,?,?,?)";
		String status = "success";
		try {
			PreparedStatement ps = conn.prepareStatement(sql);
			if(list!=null){
				int interval = 10000;
				Object[] params = null;
				int[] result = null;
				for(int i=0,size=list.size();i<size;i++){
					params = list.get(i);
					ps.setObject(1, waferId);
					for(int j=0,length=params.length;j<length;j++){
						ps.setObject(j+2, params[j]);
					}
					ps.addBatch();
					if((i+1)%interval==0){
						result = ps.executeBatch();
					}
				}
				if(list.size()%interval>0){
					result = ps.executeBatch();
				}
				status = result.length>0 ? status : "subdie参数存储失败！" ;
			}
		} catch (SQLException e) {
			e.printStackTrace();
			status = "subdie参数存储出错！" ;
		}
		return status;
		
	}
	
	
	public List<Map<String, Double>> getUpperAndLowerLimit(int waferId,Connection conn) {
		String sql = "select subdie_upper_limit,subdie_lower_limit from dm_wafer_subdie_parameter where wafer_id=? order by subdie_column asc";
		PreparedStatement ps;
		List<Map<String, Double>> list = new ArrayList<Map<String, Double>>();
		try {
			ps = conn.prepareStatement(sql);
			ps.setInt(1,waferId);
			ResultSet rs = ps.executeQuery();
			while(rs.next()){
				Map<String,Double> map = new HashMap<String,Double>();
				map.put("upper",rs.getDouble("subdie_upper_limit"));
				map.put("lower",rs.getDouble("subdie_lower_limit"));
				list.add(map);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return list;
	}
	
	public String getColumnByName(Connection conn,String paramName,int waferId){
		String sql = "select subdie_column from dm_wafer_subdie_parameter where wafer_id=? and subdie_parameter=? ";
		Object[] param = new Object[]{waferId,paramName};
		Object result = DataBaseUtil.getInstance().queryResult(conn, sql, param);
		return result==null?"":result.toString();
	}
	
	public List<String> getParameterNoCustom(Connection conn,int waferId){
		String sql = "select subdie_parameter from dm_wafer_subdie_parameter where wafer_id=? and subdie_parameter not in (select custom_parameter subdie_parameter from dm_marker_calculation where wafer_id=?) ";
		return DataBaseUtil.getInstance().queryList(conn,sql, new Object[]{waferId,waferId});
	}*/
	
	public double getYield(Connection conn,int waferId){
		String sql = "select (select count(*) from dm_wafer_subdie where wafer_id=? and subdie_bin=1)/count(*) yield from dm_wafer_subdie where wafer_id=? and (subdie_bin=1 or subdie_bin=255)";
		Object result = DataBaseUtil.getInstance().queryResult(conn, sql, new Object[]{waferId,waferId});
		return result==null?0:Double.parseDouble(result.toString());
	}

	
	public SubdieDO getTotalYield(Connection conn,int waferId){
		SubdieDO subdie = new SubdieDO();
		subdie.setParameter("Total Yield");
		String sql = "select subdie_x,subdie_y,subdie_bin,coordinate_id,subdie_number from dm_wafer_subdie where  wafer_id=?  order by coordinate_id";
		try {
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setInt(1, waferId);
			Map<String,Object> map = new HashMap<>(),temp = null;
			int num=0,qualified=0;
			ResultSet rs = ps.executeQuery();
			while(rs.next()){
				temp = new HashMap<>();
				if(rs.getInt(3)!=-1 && rs.getInt(3)!=5000) {
					num++;
					if(rs.getInt(3)==1) {
						qualified++;
					}
					
				}
				temp.put("subdieBin", rs.getInt(3));
				temp.put("coordinateId", rs.getInt(4));
				temp.put("subdieNO", rs.getInt(5));
				map.put(rs.getInt(1)+":"+rs.getInt(2), temp);
			}
			subdie.setCurrentSubdieList(map);
			subdie.setQualify(qualified);
			subdie.setUnqulify(num-qualified);
			if(num == 0 || qualified == 0){
				subdie.setYield("0.0%");
			}else{
				subdie.setYield(new BigDecimal((double)qualified/num*100).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue()+"%");
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return subdie;
	}
	
	public Map<String,Object> getOtherSubdie(Connection conn,int waferId,String waferNO,String device,String lot){
		String sql = "select subdie_x,subdie_y,subdie_bin,coordinate_id,subdie_number from dm_wafer_subdie where wafer_id in (select wafer_id from dm_wafer where wafer_number=?  and wafer_id<>? and delete_status<>2 and device_number=? and lot_number=?) order by coordinate_id ";
		Map<String,Object> result = new HashMap<>(),temp = null;
		PreparedStatement ps;
		try {
			ps = conn.prepareStatement(sql);
			ps.setString(1, waferNO);
			ps.setInt(2, waferId);
			ps.setString(3, device);
			ps.setString(4, lot);
			ResultSet rs = ps.executeQuery();
			while(rs.next()){
				temp = new HashMap<>();
				if(rs.getInt(3) == -1){
					temp.put("subdieBin", rs.getInt(3));
				}else{
					temp.put("subdieBin", 5001);
				}
				temp.put("coordinateId", rs.getInt(4));
				temp.put("subdieNO", rs.getInt(5));
				result.put(rs.getInt(1)+":"+rs.getInt(2), temp);
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return result;
	}
	
	public SubdieDO getPerParameter(Connection conn,int waferId,String column,String parameter,double upper,double lower) {
		SubdieDO subdie = new SubdieDO();
		subdie.setParameter(parameter);
		String sql  = "select subdie_x,subdie_y,subdie_bin,coordinate_id,subdie_number,"+column+" from dm_wafer_subdie where wafer_id=?  order by coordinate_id";
		Map<String,Object> result = new HashMap<>(),temp = null;
		PreparedStatement ps;
		try {
			ps = conn.prepareStatement(sql);
			ps.setInt(1, waferId);
			ResultSet rs = ps.executeQuery();
			int num=0,qualified=0;
			while(rs.next()){
				temp = new HashMap<>();
				int bin = rs.getInt(3);//
				if(rs.getInt(3)!=-1 && rs.getInt(3)!=5000) {
					num++;
					if(rs.getDouble(6)>=lower&&rs.getDouble(6)<=upper){
						bin=1;
						qualified++;
					}else {
						bin=255;
					}
				}
				temp.put("subdieBin", bin);
				temp.put("coordinateId", rs.getInt(4));
				temp.put("subdieNO", rs.getInt(5));
				result.put(rs.getInt(1)+":"+rs.getInt(2), temp);
			}
			subdie.setCurrentSubdieList(result);
			subdie.setQualify(qualified);
			subdie.setUnqulify(num-qualified);
			if(num == 0 || qualified == 0){
				subdie.setYield("0.0%");
			}else{
				subdie.setYield(new BigDecimal((double)qualified/num*100).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue()+"%");
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return subdie;
	}
	
	/**
	 * 色阶晶圆
	 * @param conn
	 * @param waferId
	 * @param column
	 * @param parameter
	 * @param upper
	 * @param lower
	 * @return
	 */
	public SubdieDO getColorMap(Connection conn,int waferId,String column,String parameter,double upper,double lower) {
		SubdieDO subdie = new SubdieDO();
		subdie.setParameter(parameter);
		String condition = " abs("+column+") ",percent="";
		double interval = Math.abs(upper-lower),multipleMax = upper+interval,multipleMin = lower-interval;
		String sql  = "select subdie_x,subdie_y,subdie_bin,coordinate_id,subdie_number,"+column+","
				+ "(case when "+column+">"+multipleMax+" then '+100%' "
				+ "when "+column+" > "+upper+" and "+column+" <= "+multipleMax+" then concat('+',round(abs("+condition+"-abs("+upper+"))/"+interval+"*100,2),'%') "
				+ "when "+column+" between "+lower+" and "+upper+" then concat(round(abs("+condition+"-abs("+lower+"))/"+interval+"*100,2),'','%') "
				+ "when "+column+" > "+multipleMin+" and "+column+" <= "+lower+" then concat('-',round(abs("+condition+"-abs("+lower+"))/"+interval+"*100,2),'%')  "
				+ "else '-100%' end ) percent "
				+ " from dm_wafer_subdie where wafer_id=?  order by "+column+" desc";
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
				percent = rs.getString(7);
				colorMap = new HashMap<>();
				if(rs.getInt(3)!=-1 && rs.getInt(3)!=5000) {
					num++;
					if(rs.getDouble(6)>=lower&&rs.getDouble(6)<=upper){
						bin=1;
						qualified++;
					}else {
						bin=255;
					}
					colorMap.put("percent", percent);
				}
				colorMap.put("subdieBin", bin);
				colorMap.put("coordinateId", rs.getInt(4));
				colorMap.put("subdieNO", rs.getInt(5));
				result.put(rs.getInt(1)+":"+rs.getInt(2), colorMap);
			}
			subdie.setCurrentSubdieList(result);
			subdie.setQualify(qualified);
			subdie.setUnqulify(num-qualified);
			if(num == 0 || qualified == 0){
				subdie.setYield("0.0%");
			}else{
				subdie.setYield(new BigDecimal((double)qualified/num*100).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue()+"%");
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return subdie;
		
	}
	
	
	/**
	 * 矢量Map
	 * @param conn
	 * @param waferId
	 * @param subdieName
	 * @param deviceGroup
	 * @return
	 */
	public SubdieDO getVectorMap(Connection conn,int waferId,String subdieName,String deviceGroup) {
		SubdieDO subdie = new SubdieDO();
		subdie.setParameter("Total Yield");
		String sql = "select subdie_x,subdie_y,subdie_bin,coordinate_id,subdie_number from dm_wafer_subdie where wafer_id=? ";
		if(!"".equals(subdieName)){
			sql += " and subdie_number=? ";
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
				ps.setInt(index, Integer.parseInt(subdieName));
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
				temp.put("subdieBin", rs.getInt(3));
				temp.put("coordinateId", rs.getInt(4));
				temp.put("subdieNO", rs.getInt(5));
				map.put(rs.getInt(1)+":"+rs.getInt(2), temp);
			}
			subdie.setCurrentSubdieList(map);
			subdie.setQualify(qualified);
			subdie.setUnqulify(num-qualified);
			if(num == 0 || qualified == 0){
				subdie.setYield("0.0%");
			}else{
				subdie.setYield(new BigDecimal((double)qualified/num*100).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue()+"%");
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return subdie;
	}

	
	public Map<Object,Object> getSubdieConfig(Connection conn,String waferNO,String str){
		String sql = "select subdie_number,offset_x,offset_y,subdie_size_x,subdie_size_y from dm_wafer_subdie_config where wafer_number=? ";
		if(!"".equals(str)){
			sql += " and subdie_number in ("+str+")";
		}
		Map<Object,Object> result = new HashMap<>();
		try {
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setString(1, waferNO);
			ResultSet rs = ps.executeQuery();
			while(rs.next()){
				result.put(rs.getInt(1), new Double[]{rs.getDouble(2),rs.getDouble(3),rs.getDouble(4),rs.getDouble(5)});
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return result;
	}
	
	public List<String> getSubdieNO(Connection conn,String waferNO,String device,String lot){
		String sql = "select distinct subdie_number from dm_wafer_subdie where wafer_id in (select wafer_id from dm_wafer where wafer_number=? and delete_status<>2 and device_number=? and lot_number=?)";
		List<String> ls = DataBaseUtil.getInstance().queryList(conn, sql, new Object[]{waferNO,device,lot});
		return ls;
	}
	
	public static boolean getSubdieExist(Connection conn,int waferId){
		String sql = "select subdie_flag from dm_wafer where wafer_id=?";
		Object result = null;
		if(conn == null){
			result = DataBaseUtil.getInstance().queryResult( sql, new Object[]{waferId});
		}else{
			result = DataBaseUtil.getInstance().queryResult(conn, sql, new Object[]{waferId});
		}
		int flag = 0;
		if(result != null){
			flag = Integer.parseInt(result.toString());
		}
				
		return flag==1?true:false;
	}
	
	/**
	 * 判断该条晶圆的Subdie是否能绘图
	 * @param waferId
	 * @return
	 */
	public boolean getMapFlag(int waferId){
		String sql = "select count(*) from dm_wafer_subdie where wafer_id=? and (subdie_bin=1 or subdie_bin=255)";
		Object result = DataBaseUtil.getInstance().queryResult(sql, new Object[]{waferId});
		int count = result == null?0:Integer.parseInt(result.toString());
		String sql2 = "select count(*) from dm_curve_type where wafer_id=?";
		result = DataBaseUtil.getInstance().queryResult(sql2, new Object[]{waferId});
		int curve = result == null?0:Integer.parseInt(result.toString());
		if(count == 0 && curve==0 ){
			return false;
		}
		return true;
	}
	
	
	
	public double getYieldPerParameter(Connection conn,int waferId,String upper,String lower,String column){
		
		String sql = "select "+column+" from dm_wafer_subdie where wafer_id=? and (subdie_bin=1 or subdie_bin=255)";
		double yield = 0;
		try {
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setInt(1, waferId);
			ResultSet rs = ps.executeQuery();
			int count = 0,qualified = 0;
			while(rs.next()){
				count++;
				if("".equals(upper) || "".equals(lower) || (rs.getDouble(1)<=Double.parseDouble(upper) && rs.getDouble(1)>=Double.parseDouble(lower))){
					qualified++;
				}
				
			}
			if(count == 0){
				return 0;
			}
			yield = new BigDecimal((double)qualified/count).setScale(4, BigDecimal.ROUND_HALF_UP).doubleValue();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return yield;
	}
	/**
	 * 直方图的频次
	 * @param conn
	 * @param waferId
	 * @param condition
	 * @return
	 */
	public int getQuantity(Connection conn,int waferId,String condition){
		String sql = "select count(*) from dm_wafer_subdie where wafer_id=? and (subdie_bin=1 or subdie_bin=255) " + condition;
		Object result = DataBaseUtil.getInstance().queryResult(conn, sql, new Object[]{waferId});
		return result == null?0:Integer.parseInt(result.toString());
	}
	
	/**
	 * 高斯分布中位数
	 * @param conn
	 * @param waferId
	 * @param left
	 * @param right
	 * @param column
	 * @return
	 */
	public String getMedian(Connection conn,int waferId,double left ,double right,String column){
		String sql = "select a."+column+" from "
				+ " (select  "+column+",@rownum:=@rownum + 1 AS  num from (select @rownum:=0)r,dm_wafer_subdie where wafer_id=? and "+column+" between ? and ? order by "+column+") a "
				+ "where a.num=(select (count(*)+1)div 2 from dm_wafer_subdie where wafer_id=? and "+column+" between ? and ? )";
		Object result = DataBaseUtil.getInstance().queryResult(conn, sql, new Object[]{waferId,left,right,waferId,left,right});
		return result==null?"":result.toString();
	}
	
	public List<Map<String,Object>> getYieldById(Connection conn,int waferId) {
		String sql = "select (select count(*) from dm_wafer_subdie where wafer_id=? and subdie_bin=1)/count(*) yield,count(*) quantity from dm_wafer_subdie where wafer_id=? and (subdie_bin=1 or subdie_bin=255)";
		return DataBaseUtil.getInstance().queryToList(conn,sql, new Object[]{waferId,waferId});

	}
}
