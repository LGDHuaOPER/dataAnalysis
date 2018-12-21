/**
 * 
 */
package com.eoulu.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.eoulu.entity.MapParameterDO;
import com.eoulu.util.DataBaseUtil;


/**
 * @author mengdi
 *
 * 
 */
public class ParameterDao {

	private static DataBaseUtil db = new DataBaseUtil();
	
	/**
	 * 晶圆参数添加
	 * @param conn
	 * @param list
	 * @return
	 */
	public static String insertParameter(Connection conn,List<Object[]> list,int waferId){
		String sql = "insert into dm_wafer_parameter (wafer_id,parameter_name,parameter_unit,parameter_column,upper_limit,lower_limit) values (?,?,?,?,?,?)";
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
			flag = "晶圆参数添加失败！";
		}
		return flag;
		
	}
	/**
	 * 单条添加参数
	 * @param conn
	 * @param param
	 * @return
	 */
	public static String insertParameter(Connection conn,Object[] param){
		String sql = "insert into dm_wafer_parameter (wafer_id,parameter_name,parameter_unit,parameter_column,upper_limit,lower_limit) value (?,?,?,?,?,?)";
		return db.operate(conn, sql, param)?"success":"晶圆参数添加失败！";
		
	}
	/**
	 * 单条添加参数
	 * @param conn
	 * @param param
	 * @return
	 */
	public static String insertExcelParameter(Connection conn,Object[] param){
		String sql = "insert into dm_wafer_parameter (wafer_id,parameter_name,parameter_unit,parameter_column) value (?,?,?,?)";
		return db.operate(conn, sql, param)?"success":"晶圆参数添加失败！";
		
	}
	
	/**
	 * 上下限
	 * @param waferId  晶圆表主键
	 * @param conn
	 * @return
	 */
	public List<Map<String, Double>> getUpperAndLowerLimit(int waferId,Connection conn) {
		String sql = "select upper_limit,lower_limit from dm_wafer_parameter where wafer_id=? order by parameter_column asc";
		PreparedStatement ps;
		List<Map<String, Double>> list = new ArrayList<Map<String, Double>>();
		try {
			ps = conn.prepareStatement(sql);
			ps.setInt(1,waferId);
			ResultSet rs = ps.executeQuery();
			while(rs.next()){
				Map<String,Double> map = new HashMap<String,Double>();
				map.put("upper",rs.getDouble("upper_limit"));
				map.put("lower",rs.getDouble("lower_limit"));
				list.add(map);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return list;
	}
	
	public Map<String,Object> getLimit(int waferId,String parameter,Connection conn){
		String sql = "select upper_limit,lower_limit from dm_wafer_parameter where wafer_id=? and parameter_name=?";
		PreparedStatement ps;
		Map<String, Object> map = new HashMap();
		try {
			ps = conn.prepareStatement(sql);
			ps.setInt(1,waferId);
			ps.setString(2, parameter);
			ResultSet rs = ps.executeQuery();
			while(rs.next()){
				map.put("upper",rs.getDouble("upper_limit"));
				map.put("lower",rs.getDouble("lower_limit"));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return map;
	}
	
	/**
	 * 晶圆的WaferMap参数暂时只取目前需要的存至数据库
	 * @param conn
	 * @param map
	 * @return
	 */
	public String insertMapParameter(Connection conn,MapParameterDO map){
		String sql = "insert into dm_wafer_map_parameter (diameter,cutting_edge_length,die_x_max,die_y_max,direction_x,direction_y,set_coor_x,set_coor_y,set_coor_die_x,set_coor_die_y,stand_coor_die_x,stand_coor_die_y,wafer_number) value (?,?,?,?,?,?,?,?,?,?,?,?,?)";
		String flag = "success";
		Object[] param = new Object[]{map.getDiameter(),map.getCuttingEdgeLength(),map.getDieXMax(),map.getDieYMax(),map.getDirectionX(),map.getDirectionY(),map.getSetCoorX(),map.getSetCoorY(),map.getSetCoorDieX(), map.getSetCoorDieY(),map.getStandCoorDieX(),map.getStandCoorDieY(),map.getWaferNumber()};
		flag = db.operate(conn,sql, param)?flag:"晶圆的Map参数添加失败！";
		return flag;
	}
	
	public String updateMapParameter(Connection conn ,MapParameterDO map){
		String sql = "update dm_wafer_map_parameter set diameter=?,cutting_edge_length=?,die_x_max=?,die_y_max=?,direction_x=?,direction_y=?,set_coor_x=?,set_coor_y=?,set_coor_die_x=?,set_coor_die_y=?,stand_coor_die_x=?,stand_coor_die_y=?  where wafer_number=?";
		Object[] param = new Object[]{map.getDiameter(),map.getCuttingEdgeLength(),map.getDieXMax(),map.getDieYMax(),map.getDirectionX(),map.getDirectionY(),map.getSetCoorX(),map.getSetCoorY(),map.getSetCoorDieX(), map.getSetCoorDieY(),map.getStandCoorDieX(),map.getStandCoorDieY(),map.getWaferNumber()};
		String flag = "success";
		flag = db.operate(conn,sql, param)?flag:"晶圆的Map参数添加失败！";
		return flag;
	}
	
	public boolean getMapParameter(Connection conn,String waferNO){
		String sql = "select wafer_number from dm_wafer_map_parameter where wafer_number=? ";
		Object result = db.queryResult(conn, sql,new Object[]{waferNO});
		return result==null?false:true;
		
	}
	
	/**
	 * 获取绘制晶圆图的参数
	 * @param conn
	 * @param waferId
	 * @return
	 */
	public  List<String> getEightParameter(Connection conn,String waferNO)
	{
		List<String> Parameter=new ArrayList<>();
		String DirectionX=null,DirectionY=null,SetCoorX=null,SetCoorY=null,StandCoorDieX=null,StandCoorDieY = null ;
		int SetCoorDieX=0,SetCoorDieY=0;
		double Diameter=0,DieSizeX=0,DieSizeY = 0,FlatLength = 0;
		try {
			String sql="select direction_x,direction_y,set_coor_x,set_coor_y,set_coor_die_x,set_coor_die_y,stand_coor_die_x,stand_coor_die_y,diameter,die_x_max,die_y_max,cutting_edge_length from dm_wafer_map_parameter where wafer_number='"+waferNO+"'";
			PreparedStatement psm = conn.prepareStatement(sql);
			ResultSet rs = psm.executeQuery(sql);
			while(rs.next()){
				DirectionX=rs.getString(1);
				DirectionY=rs.getString(2);
				SetCoorX=rs.getString(3);
				SetCoorY=rs.getString(4);
				SetCoorDieX=rs.getInt(5);
				SetCoorDieY=rs.getInt(6);
				StandCoorDieX=rs.getString(7);
				StandCoorDieY=rs.getString(8);
				Diameter=rs.getDouble(9);
				DieSizeX=rs.getDouble(10);
				DieSizeY=rs.getDouble(11);
				FlatLength=rs.getDouble(12);
				break;
			}
			if(rs!=null){
				rs.close();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		Parameter.add(DirectionX);
		Parameter.add(DirectionY);
		Parameter.add(SetCoorX);
		Parameter.add(SetCoorY);
		Parameter.add(String.valueOf(SetCoorDieX));
		Parameter.add(String.valueOf(SetCoorDieY));
		Parameter.add(StandCoorDieX);
		Parameter.add(StandCoorDieY);
		Parameter.add(String.valueOf(Diameter));
		Parameter.add(String.valueOf(DieSizeX));
		Parameter.add(String.valueOf(DieSizeY));
		Parameter.add(String.valueOf(FlatLength));
		return Parameter;
	}
	
	
	public static List<String> getEightParameter(String waferNumber){
		String	sql = "select direction_x,direction_y,set_coor_x,set_coor_y,set_coor_die_x,set_coor_die_y,stand_coor_die_x,stand_coor_die_y,diameter,die_x_max,die_y_max,cutting_edge_length from dm_wafer_map_parameter where wafer_id=0 and wafer_number='"+waferNumber+"'";
	
		List<String> Parameter=new ArrayList<>();
		String DirectionX=null,DirectionY=null,SetCoorX=null,SetCoorY=null,StandCoorDieX=null,StandCoorDieY = null ;
		int SetCoorDieX=0,SetCoorDieY=0;
		double Diameter=0,DieSizeX=0,DieSizeY = 0,FlatLength = 0;
		Connection conn = db.getConnection();
		try {
			
			PreparedStatement psm = conn.prepareStatement(sql);
			ResultSet rs = psm.executeQuery(sql);
			while(rs.next()){
				DirectionX=rs.getString(1);
				DirectionY=rs.getString(2);
				SetCoorX=rs.getString(3);
				SetCoorY=rs.getString(4);
				SetCoorDieX=rs.getInt(5);
				SetCoorDieY=rs.getInt(6);
				StandCoorDieX=rs.getString(7);
				StandCoorDieY=rs.getString(8);
				Diameter=rs.getDouble(9);
				DieSizeX=rs.getDouble(10);
				DieSizeY=rs.getDouble(11);
				FlatLength=rs.getDouble(12);
				break;
			}
			if(rs!=null){
				rs.close();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		Parameter.add(DirectionX);
		Parameter.add(DirectionY);
		Parameter.add(SetCoorX);
		Parameter.add(SetCoorY);
		Parameter.add(String.valueOf(SetCoorDieX));
		Parameter.add(String.valueOf(SetCoorDieY));
		Parameter.add(StandCoorDieX);
		Parameter.add(StandCoorDieY);
		Parameter.add(String.valueOf(Diameter));
		Parameter.add(String.valueOf(DieSizeX));
		Parameter.add(String.valueOf(DieSizeY));
		Parameter.add(String.valueOf(FlatLength));
		return Parameter;
	}
	
	public boolean delete(Connection conn,int waferId){
		String sql = "delete from dm_wafer_parameter where wafer_id=?";
		return db.operate(conn, sql, new Object[]{waferId});
	}
	/**
	 * 参数是否存在
	 * @param param
	 * @return
	 */
	public boolean getParameterExsit(Object[] param){
		String sql = "select parameter_name from dm_wafer_parameter where wafer_id=? and parameter_name=?";
		List<Map<String, Object>> ls = db.queryToList(sql, param);
		return ls.size()>0?true:false;
	}
	public boolean getSubdieParameterExsit(Object[] param){
		String sql = "select subdie_parameter from dm_wafer_subdie_parameter where wafer_id=? and subdie_parameter=?";
		List<Map<String, Object>> ls = db.queryToList(sql, param);
		return ls.size()>0?true:false;
	}
	
	/**
	 * 获取晶圆的最大参数字段值C_max
	 * @param param
	 * @return
	 */
	public String getMaxColumn(Connection conn,Object[] param){
		String sql = "select parameter_column from dm_wafer_parameter where wafer_id=? order by substring(parameter_column,2)+0 desc limit 0,1";
		Object result = db.queryResult(conn,sql, param);
		return result==null?"":result.toString();
	}
	/**
	 * subdie最大参数列
	 * @param conn
	 * @param param
	 * @return
	 */
	
	public String getSubdieMaxColumn(Connection conn,Object[] param){
		String sql = "select subdie_column from dm_wafer_subdie_parameter where wafer_id=? order by substring(subdie_column,2)+0 desc limit 0,1";
		Object result = db.queryResult(conn,sql, param);
		return result==null?"":result.toString();
	}
	/**
	 * 添加自定义参数
	 * @param param
	 * @return
	 */
	public boolean insertCustomParameter(Connection conn,Object[] param){
		String sql = "insert into dm_wafer_parameter (wafer_id,parameter_name,parameter_column) values (?,?,?)";
		return db.operate(conn,sql, param);
	}
	/**
	 * 添加subdie自定义参数
	 * @param conn
	 * @param param
	 * @return
	 */
	
	public boolean insertSubdieCustomParameter(Connection conn,Object[] param){
		String sql = "insert into dm_wafer_subdie_parameter (wafer_id,subdie_parameter,subdie_column) values (?,?,?)";
		return db.operate(conn,sql, param);
	}
	
	
	public String getColumnByName(Connection conn,String paramName,int waferId){
		String sql = "select parameter_column from dm_wafer_parameter where wafer_id=? and parameter_name=? ";
		Object[] param = new Object[]{waferId,paramName};
		Object result = db.queryResult(conn, sql, param);
		return result==null?"":result.toString();
	}
	
	public String getSubdieColumn(Connection conn,String paramName,int waferId){
		String sql = "select subdie_column from dm_wafer_subdie_parameter where wafer_id=? and subdie_parameter=? ";
		Object[] param = new Object[]{waferId,paramName};
		Object result = db.queryResult(conn, sql, param);
		return result==null?"":result.toString();
		
	}
	
	public boolean updateParamName(Connection conn,String oldParam,int waferId,String customParam){
		String sql = "update dm_wafer_parameter set parameter_name=?  where wafer_id=? and parameter_name=? ";
		Object[] param = new Object[]{customParam,waferId,oldParam};
		System.out.println(Arrays.toString(param));
		return db.operate(conn,sql, param);
	}
	
	public boolean updateSubdieParamName(Connection conn,String oldParam,int waferId,String customParam){
		String sql = "update dm_wafer_subdie_parameter set subdie_parameter=?  where wafer_id=? and subdie_parameter=? ";
		Object[] param = new Object[]{customParam,waferId,oldParam};
		System.out.println(Arrays.toString(param));
		return db.operate(conn,sql, param);
	}
	/**
	 * 取晶圆参数
	 * @param conn
	 * @param waferId
	 * @return
	 */
	public List<String> getWaferParameter(Connection conn,int waferId){
		String sql = "select parameter_name from dm_wafer_parameter where wafer_id=?";
		return db.queryList(conn,sql, new Object[]{waferId});
	}

	/**
	 * 取晶圆参数，不包含自定义参数
	 * @param conn
	 * @param waferId
	 * @return
	 */
	public List<String> getParameterNoCustom(Connection conn,int waferId){
		String sql = "select parameter_name from dm_wafer_parameter where wafer_id=? and parameter_name not in (select custom_parameter parameter_name from dm_marker_calculation where wafer_id=?) ";
		return db.queryList(conn,sql, new Object[]{waferId,waferId});
	}
	
	public List<Map<String,Object>> getMapInfo(Connection conn,String waferNO){
		String sql = "select direction_x directionX,direction_y directionY,die_x_max dieSizeX,die_y_max dieSizeY,diameter,cutting_edge_length flatLength from dm_wafer_map_parameter where wafer_number=?";
		return db.queryToList(sql, new Object[]{waferNO});
		
	}
	
	public Map<String,Object> getWaferDataParameter(Connection conn,int waferId,boolean flag){
		String sql = "select concat(parameter_name,'(',parameter_unit,')') parameter,parameter_column,ifnull(upper_limit,'') upper_limit,ifnull(lower_limit,'') lower_limit"
				+ " from dm_wafer_parameter where wafer_id=?  order by parameter_column ";
		Map<String,Object> result = new HashMap<>();
		List<String> paramList = new ArrayList<>(), upperList = new ArrayList<>(),lowerList = new ArrayList<>();
		String column = "";
		try {
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setInt(1, waferId);
			ResultSet rs = ps.executeQuery();
			while(rs.next()){
				paramList.add(rs.getString(1));
				upperList.add(rs.getString(3));
				lowerList.add(rs.getString(4));
				if(flag){
					column += ",ifnull(dm_wafer_subdie."+rs.getString(2)+",'')" +rs.getString(2);
					continue;
				}
				column += ",ifnull("+rs.getString(2)+",'')" +rs.getString(2);
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
		result.put("paramList", paramList);
		result.put("upperList", upperList);
		result.put("lowerList", lowerList);
		result.put("column", column);
		return result;
	}
	
	
}
