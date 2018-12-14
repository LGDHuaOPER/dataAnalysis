/**
 * 
 */
package com.eoulu.dao;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import com.eoulu.entity.WaferDO;
import com.eoulu.transfer.PageDTO;
import com.eoulu.util.DataBaseUtil;

/**
 * @author mengdi
 *
 * 
 */
public class WaferDao{

	/**
	 * 数据列表分页,模糊查询
	 * @param page
	 * @return
	 */
	public List<Map<String,Object>> listWafer(PageDTO page,String keyword,String Parameter,int deleteStatus){
		String sql = "select wafer_id,product_category,wafer_number,device_number,lot_number,qualified_rate,left(test_end_date,10)test_end_date,dm_user.user_name test_operator,description,data_format,die_type from dm_wafer "
				+ "left join dm_user on dm_user.user_id=dm_wafer.test_operator "
				+ "where delete_status="+deleteStatus;
		Object[] param = new Object[]{(page.getCurrentPage()-1)*page.getRow(),page.getRow()};
		if(!"".equals(keyword)){
			sql += "  and ( device_number like binary ? or lot_number like binary ? or wafer_number like binary ? or qualified_rate like binary  ? or test_end_date like binary  ? or dm_user.user_name like binary ? or description like binary ? or die_type like binary ? ) ";
			param = new Object[]{"%"+keyword +"%","%"+keyword +"%","%"+keyword +"%","%"+keyword +"%","%"+keyword +"%","%"+keyword +"%","%"+keyword +"%","%"+keyword +"%",(page.getCurrentPage()-1)*page.getRow(),page.getRow()};
		}
		sql += "  order by gmt_modified desc limit ?,? ";
		
		return DataBaseUtil.getInstance().queryToList(sql, param);
	}
	/**
	 * 数据总数，模糊查询
	 * @param keyword
	 * @return
	 */
	public int countWafer(String keyword,String Parameter,int deleteStatus){
		String sql = "select count(*) from dm_wafer   "
				+ "left join dm_user on dm_user.user_id=dm_wafer.test_operator "
				+ " where delete_status="+deleteStatus;
		Object[] param = null;
		if(!"".equals(keyword)){
			if(!"".equals(keyword)){
				sql += "  and ( device_number like binary ? or lot_number like binary ? or wafer_number like binary ? or qualified_rate like binary  ? or test_end_date like binary  ? or dm_user.user_name like binary ? or description like binary ? or die_type like binary ? ) ";
				param = new Object[]{"%"+keyword +"%","%"+keyword +"%","%"+keyword +"%",keyword,keyword,"%"+keyword +"%","%"+keyword +"%","%"+keyword +"%"};
			}
		}
		Object result = DataBaseUtil.getInstance().queryResult(sql, param);
		return result==null?0:Integer.parseInt(result.toString());
	}
	
	public boolean getWafer(String fileName,String editTime){
		String sql = "select wafer_number from dm_wafer where wafer_file_name=? and gmt_create=?";
		return DataBaseUtil.getInstance().queryResult(sql, new Object[]{fileName,editTime})==null?false:true;
	}
	
	public int getWaferID(Connection conn,String waferNumber,String dieType){
		String sql = "select wafer_id from dm_wafer where wafer_number=? and die_type=? and delete_status=0";
		Object[] param = new Object[]{waferNumber,dieType};		
		Object result = DataBaseUtil.getInstance().queryResult(conn,sql, param);
		return result==null?0:Integer.parseInt(result.toString());
	}
	
	public int getMaxWaferID(Connection conn,String waferNumber){
		String sql = "select max(wafer_id) wafer_id from dm_wafer where wafer_number=? and delete_status=0";
		Object[] param = new Object[]{waferNumber};		
		Object result = DataBaseUtil.getInstance().queryResult(conn,sql, param);
		return result==null?0:Integer.parseInt(result.toString());
	}
	
	
	/**
	 * 晶圆添加
	 * @param conn
	 * @param wafer
	 * @return
	 */
	public String insert(Connection conn,WaferDO wafer){
		String sql = "insert into dm_wafer (wafer_number,die_type,device_number,lot_number,product_category,wafer_file_name,qualified_rate,"
				+ "test_start_date,test_end_date,test_operator,archive_user,description,total_test_quantity,data_format,gmt_create,gmt_modified,delete_status) "
				+ "value (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,0)";
		Object[] param = new Object[16];
		param[0] = wafer.getWaferNumber();
		param[1] = wafer.getDieType();
		param[2] = wafer.getDeviceNumber();
		param[3] = wafer.getLotNumber();
		param[4] = wafer.getProductCategory();
		param[5] = wafer.getFileName();
		param[6] = wafer.getQualifiedRate();
		param[7] = wafer.getTestStartDate();
		param[8] = wafer.getTestEndDate();
		param[9] = wafer.getTestOperator();
		param[10] = wafer.getArchiveUser();
		param[11] = wafer.getDescription();
		param[12] = wafer.getTotalTestQuantity();
		param[13] = wafer.getDataFormat();
		param[14] = wafer.getGmtCreate();
		param[15] = wafer.getGmtModified();
//		param[16] = wafer.getLastModified();
		String flag = DataBaseUtil.getInstance().operate(conn, sql, param)?"success":"晶圆添加失败！";
		return flag;
	}
	
	
	public static Map<String,Object> getFile(){
		Map<String,Object> map = new HashMap<>();
		String sql = "select  wafer_file_name,ifnull(max(file_last_modified),'') file_last_modified from dm_wafer where delete_status=0 group by wafer_file_name";
		DataBaseUtil db = DataBaseUtil.getInstance();
		Connection conn = db.getConnection();
		PreparedStatement ps;
		try {
			ps = conn.prepareStatement(sql);
			ResultSet rs = ps.executeQuery();
			while(rs.next()){
				map.put(rs.getString(1), rs.getString(2));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}finally{
			db.close(conn);
		}
		return map;
	}
	
	/**
	 * 修改良率
	 * @param conn
	 * @param yield
	 * @param waferId
	 * @return
	 */
	public boolean updateYield(Connection conn,double yield,int waferId){
		String sql = "update dm_wafer set qualified_rate=? where wafer_id=?";
		return DataBaseUtil.getInstance().operate(conn, sql, new Object[]{yield,waferId});
	}
	
	/**
	 * 修改晶圆信息
	 * @param wafer
	 * @return
	 */
	public boolean update(WaferDO wafer){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String sql = "update dm_wafer set product_category=?,test_operator=?,test_end_date=?,description=?,gmt_modified=? where wafer_id=?";
		Object[] param = new Object[]{wafer.getProductCategory(),wafer.getTestOperator(),wafer.getTestEndDate(),wafer.getDescription(),df.format(new Date()),wafer.getWaferId()};
		return DataBaseUtil.getInstance().operate(sql, param);
	}
	/**
	 * 更改删除状态
	 * @param waferId
	 * @return
	 */
	public boolean remove(String waferId,int deleteStatus){
		if("".equals(waferId)){
			return false;
		}
		String sql = "update dm_wafer set delete_status="+deleteStatus+" where wafer_id in ("+waferId+") ";
		return DataBaseUtil.getInstance().operate(sql, null);
	}
	
	public boolean remove(Connection conn,int waferId,int deleteStatus){
		String sql = "update dm_wafer set delete_status="+deleteStatus+" where wafer_id in ("+waferId+") ";
		return DataBaseUtil.getInstance().operate(conn,sql, null);
	}
	
	public boolean delete(Connection conn,int waferId){
		String sql = "delete from dm_wafer where wafer_id=?";
		return DataBaseUtil.getInstance().operate(conn, sql, new Object[]{waferId});
	}
	/**
	 * 删除垃圾数据
	 * @param conn
	 * @return
	 */
	public boolean delete(Connection conn){
		String sql = "delete from dm_wafer where delete_status=2";
		return DataBaseUtil.getInstance().operate(conn, sql, null);
	}
	
	public List<String> getJunkWaferId(Connection conn){
		String sql = "select wafer_id from dm_wafer where delete_status=2";
		List<String> ls = DataBaseUtil.getInstance().queryList(conn, sql, null);
		return ls;
	}
	
	/**
	 * 获取所有产品类别
	 * @return
	 */
	public List<Map<String,Object>> getProductCategory(){
		String sql = "select DISTINCT product_category from dm_wafer";
		return DataBaseUtil.getInstance().queryToList(sql, null);
	}
	
	public String getWaferNO(Connection conn,int waferId){
		String sql = "select wafer_number from dm_wafer where wafer_id=?";
		Object result = DataBaseUtil.getInstance().queryResult(conn,sql, new Object[]{waferId});
		return result==null?"":result.toString();
		
	}
	public String getWaferNO( int waferId){
		String sql = "select wafer_number from dm_wafer where wafer_id=?";
		Object result = DataBaseUtil.getInstance().queryResult(sql, new Object[]{waferId});
		return result==null?"":result.toString();
		
	}
	public List<Map<String,Object>> getSecondaryInfo(Connection conn,String waferNO){
		String sql = "select computer_name,tester,total_test_time from dm_wafer_secondary_info where wafer_number=?";
		return DataBaseUtil.getInstance().queryToList(conn, sql, new Object[]{waferNO});
	}
	public String insertSecondaryInfo(Connection conn,Object[] param){
		String sql = "insert into dm_wafer_secondary_info (wafer_number,computer_name,tester,total_test_time) value (?,?,?,?)";
		PreparedStatement ps = null;
		String flag = "";
		try {
			ps = conn.prepareStatement(sql);
			ps.setObject(1, param[0]);
			ps.setObject(2, param[1]);
			ps.setObject(3, param[2]);
			ps.setObject(4, param[3]);
			int row = ps.executeUpdate();
			flag = row>0?"success":"晶圆次要信息添加失败！";
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return flag;
	}
	
	public String updateSecondaryInfo(Connection conn,Object[] param){
		String sql = "update dm_wafer_secondary_info set computer_name=?,tester=?,total_test_time=? where wafer_number=?";
		PreparedStatement ps = null;
		String flag = "";
		try {
			ps = conn.prepareStatement(sql);
			ps.setObject(1, param[1]);
			ps.setObject(2, param[2]);
			ps.setObject(3, param[3]);
			ps.setObject(4, param[0]);
			int row = ps.executeUpdate();
			flag = row>0?"success":"晶圆次要信息添加失败！";
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return flag;
	}
	
	public boolean  getSecondaryExsit(Connection conn,String waferNO){
		String sql = "select wafer_number from dm_wafer_secondary_info where wafer_number=?";
		Object result = DataBaseUtil.getInstance().queryResult(conn, sql, new Object[]{waferNO});
		return result==null?false:true;
	}

	/**
	 * 判断晶圆是否存在
	 * @param conn
	 * @param waferid
	 * @return
	 * @throws SQLException
	 */
	public  boolean queryWaferinfo(Connection conn,String waferid) throws SQLException{
		boolean flag=false;
		PreparedStatement psm=null;
		ResultSet rs=null;
		String sql="select wafer_number from dm_wafer where wafer_number=?";
		psm=conn.prepareStatement(sql);
		psm.setString(1, waferid);
		rs=psm.executeQuery();
		if(rs.next()){
			flag=true;
		}
		return flag;
	}
	/**
	 * 判断晶圆是否存在（4个条件）
	 * @param waferNO
	 * @param lot
	 * @param device
	 * @param dieType
	 * @return
	 */
	public  int queryWaferinfo(String waferNO,String lot,String device,String dieType){
		String sql="select wafer_id from dm_wafer where wafer_number=? and lot_number=? and device_number=? and die_type=?";
		Object result = DataBaseUtil.getInstance().queryResult(sql, new Object[]{waferNO,lot,device,dieType});
		return result==null?0:Integer.parseInt(result.toString());
	}
	public  int queryWaferinfo(Connection conn,String waferNO,String lot,String device,String dieType){
		String sql="select wafer_id from dm_wafer where wafer_number=? and lot_number=? and device_number=? and die_type=? and delete_status<>2";
		Object result = DataBaseUtil.getInstance().queryResult(conn,sql, new Object[]{waferNO,lot,device,dieType});
		return result==null?0:Integer.parseInt(result.toString());
	}
	
	
	public  boolean queryWaferinfo(String waferNO){
		String sql="select wafer_number from dm_wafer where wafer_number=?";
		return DataBaseUtil.getInstance().queryResult(sql, new Object[]{waferNO})==null?false:true;
	}
	
	
	public Map<String,Object> getFile(Connection conn,int waferId){
		String sql =" select wafer_file_name,wafer_number from dm_wafer where wafer_id=?";
		List<Map<String,Object>> result = DataBaseUtil.getInstance().queryToList(conn,sql, new Object[]{waferId});
		return result.size()>0?result.get(0):null;
	}
	
	public List<Map<String,Object>> getWaferData(Connection conn,int waferId,String column,String dieType,boolean flag){
		String sql = "";
		if(flag){
			sql= "select "+("".equals(dieType)?"":"concat('"+dieType+"','') type,")
					+"dm_wafer_coordinate_data.die_number,subdie_number,subdie_bin bin,subdie_alphabet location,subdie_x x,subdie_y y"+column
					+" from dm_wafer_coordinate_data left join dm_wafer_subdie on dm_wafer_coordinate_data.coordinate_id=dm_wafer_subdie.coordinate_id "
					+ " where dm_wafer_subdie.wafer_id=? and (subdie_bin=1 or subdie_bin=255) order by dm_wafer_coordinate_data.die_number+0,subdie_number";
		}else{
			sql= "select "+("".equals(dieType)?"":"concat('"+dieType+"','') type,")+"die_number,bin,alphabetic_coordinate location,x_coordinate x,y_coordinate y"+column+" from dm_wafer_coordinate_data where wafer_id=? and (bin=1 or bin=255) order by die_number+0";	
		}

		return DataBaseUtil.getInstance().queryToList(conn, sql, new Object[]{waferId});
	}
	
	public List<Map<String,Object>> getWaferData(Connection conn,int waferId,String column,boolean flag){
		
		String sql = "select if(alphabetic_coordinate='',concat(x_coordinate,',',y_coordinate),alphabetic_coordinate) location"+column+",bin from dm_wafer_coordinate_data where wafer_id=? and (bin=1 or bin=255) order by die_number";
		if(flag){
			sql = "select if(subdie_alphabet='',concat(subdie_x,',',subdie_y),subdie_alphabet) location"+column+",subdie_bin bin from dm_wafer_subdie where wafer_id=? and (subdie_bin=1 or subdie_bin=255) order by subdie_number";
		}
		return DataBaseUtil.getInstance().queryToList(conn, sql, new Object[]{waferId});
	}
	
	public String getDieType(Connection conn,int waferId){
		String sql = "select die_type from dm_wafer where wafer_id=?";
		Object result = DataBaseUtil.getInstance().queryResult(conn, sql, new Object[]{waferId});
		return result==null?"":result.toString();
		
	}
	
	/**
	 * 每个参数的合格率
	 * @param conn
	 * @param waferId
	 * @param upper
	 * @param lower
	 * @param column
	 * @return
	 */
	public double getYieldPerParameter(Connection conn,int waferId,String upper,String lower,String column){

		String sql = "select "+column+" from dm_wafer_coordinate_data where wafer_id=? and (bin=1 or bin=255)";
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
	
	public double getYield(Connection conn,int waferId){
		String sql = "select qualified_rate from dm_wafer where wafer_id="+waferId;
		Object result = DataBaseUtil.getInstance().queryResult(conn, sql, null);
		return result==null?0:Double.parseDouble(result.toString());
	}
	
	public List<Map<String,Object>> getSecondary(Connection conn,int waferId){
		String sql = "select ifnull(wafer_file_name,'') wafer_file_name,ifnull(computer_name,'')computer_name,ifnull(tester,'')tester,"
				+ "ifnull(test_start_date,'')test_start_date,ifnull(test_end_date,'')test_end_date, ifnull(total_test_time,'')total_test_time,"
				+ "ifnull(device_number,'')device_number,ifnull(lot_number,'')lot_number,"
				+ "dm_wafer.wafer_number,die_type from dm_wafer left join dm_wafer_secondary_info on dm_wafer.wafer_number=dm_wafer_secondary_info.wafer_number"
				+ " where wafer_id=?";
		return DataBaseUtil.getInstance().queryToList(conn,sql, new Object[]{waferId});
		
	}
	
	
	public List<Map<String,Object>> getYieldById(Connection conn,int waferId) {
		String sql = "select (select count(*) from dm_wafer_coordinate_data where wafer_id=? and bin=1)/count(*) yield,count(*) quantity from dm_wafer_coordinate_data where wafer_id=? and (bin=1 or bin=255)";
		return DataBaseUtil.getInstance().queryToList(conn,sql, new Object[]{waferId,waferId});

	}
	
	/**
	 * 判断该条晶圆是否是含有被测试的Die，含有则能够绘图
	 * @param waferId
	 * @return
	 */
	public boolean getMapFlag(int waferId){
		String sql = "select count(*) from dm_wafer_coordinate_data where wafer_id=? and (bin=1 or bin=255)";
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
	
	
}
