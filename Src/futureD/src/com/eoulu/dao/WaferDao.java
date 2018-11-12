/**
 * 
 */
package com.eoulu.dao;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.eoulu.entity.WaferDO;
import com.eoulu.transfer.PageDTO;
import com.eoulu.util.DataBaseUtil;

/**
 * @author mengdi
 *
 * 
 */
public class WaferDao {

	private static DataBaseUtil db = new DataBaseUtil();
	private SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	/**
	 * 数据列表分页,模糊查询
	 * @param page
	 * @return
	 */
	public List<Map<String,Object>> listWafer(PageDTO page,String keyword,String Parameter,int deleteStatus){
		String sql = "select wafer_id,wafer_number,device_number,lot_number,qualified_rate,left(test_end_date,10)test_end_date,dm_user.user_name test_operator,description from dm_wafer "
				+ "left join dm_user on dm_user.user_id=dm_wafer.test_operator "
				+ "where delete_status="+deleteStatus;
		Object[] param = new Object[]{(page.getCurrentPage()-1)*page.getRow(),page.getRow()};
		if(!"".equals(keyword)){
			sql += "  and ( device_number like ? or lot_number like ? or wafer_number like ? or qualified_rate=? or test_end_date=? or dm_user.user_name like ? or description like ? ) ";
			param = new Object[]{"%"+keyword +"%","%"+keyword +"%","%"+keyword +"%",keyword,keyword,"%"+keyword +"%","%"+keyword +"%",(page.getCurrentPage()-1)*page.getRow(),page.getRow()};
		}
		sql += "  order by gmt_modified desc limit ?,? ";
		
		return db.queryToList(sql, param);
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
				sql += "  and ( device_number like ? or lot_number like ? or wafer_number like ? or qualified_rate=? or test_end_date=? or dm_user.user_name like ? or description like ? ) ";
				param = new Object[]{"%"+keyword +"%","%"+keyword +"%","%"+keyword +"%",keyword,keyword,"%"+keyword +"%","%"+keyword +"%"};
			}
		}
		Object result = db.queryResult(sql, param);
		return result==null?0:Integer.parseInt(result.toString());
	}
	
	public boolean getWafer(String fileName,String editTime){
		String sql = "select wafer_number from dm_wafer where wafer_file_name=? and gmt_create=?";
		return db.queryResult(sql, new Object[]{fileName,editTime})==null?false:true;
	}
	
	public int getWaferID(Connection conn,String waferNumber,String dieType){
		String sql = "select wafer_id from dm_wafer where wafer_number=? and die_type=? and delete_status=0";
		Object[] param = new Object[]{waferNumber,dieType};		
		Object result = db.queryResult(conn,sql, param);
		return result==null?0:Integer.parseInt(result.toString());
	}
	
	public int getMaxWaferID(Connection conn,String waferNumber){
		String sql = "select max(wafer_id) wafer_id from dm_wafer where wafer_number=? and delete_status=0";
		Object[] param = new Object[]{waferNumber};		
		Object result = db.queryResult(conn,sql, param);
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
		PreparedStatement ps = null;
		String flag = "";
		try {
			ps = conn.prepareStatement(sql);
			ps.setObject(1, wafer.getWaferNumber());
			ps.setObject(2, wafer.getDieType());
			ps.setObject(3, wafer.getDeviceNumber());
			ps.setObject(4, wafer.getLotNumber());
			ps.setObject(5, wafer.getProductCategory());
			ps.setObject(6, wafer.getFileName());
			ps.setObject(7, wafer.getQualifiedRate());
			ps.setObject(8, wafer.getTestStartDate());
			ps.setObject(9, wafer.getTestEndDate());
			ps.setObject(10, wafer.getTestOperator());
			ps.setObject(11, wafer.getArchiveUser());
			ps.setObject(12, wafer.getDescription());
			ps.setObject(13, wafer.getTotalTestQuantity());
			ps.setObject(14, wafer.getDataFormat());
			ps.setObject(15, wafer.getGmtCreate());
			ps.setObject(16, wafer.getGmtModified());
			int row = ps.executeUpdate();
			flag = row>0?"success":"晶圆添加失败！";
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return flag;
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
		return db.operate(conn, sql, new Object[]{yield,waferId});
	}
	
	/**
	 * 修改晶圆信息
	 * @param wafer
	 * @return
	 */
	public boolean update(WaferDO wafer){
		String sql = "update dm_wafer set product_category=?,test_operator=?,test_end_date=?,description=?,gmt_modified=? where wafer_id=?";
		Object[] param = new Object[]{wafer.getProductCategory(),wafer.getTestOperator(),wafer.getTestEndDate(),wafer.getDescription(),df.format(new Date()),wafer.getWaferId()};
		return db.operate(sql, param);
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
		return db.operate(sql, null);
	}
	
	public boolean remove(Connection conn,int waferId,int deleteStatus){
		String sql = "update dm_wafer set delete_status="+deleteStatus+" where wafer_id in ("+waferId+") ";
		return db.operate(conn,sql, null);
	}
	
	public boolean delete(Connection conn,int waferId){
		String sql = "delete from dm_wafer where wafer_id=?";
		return db.operate(conn, sql, new Object[]{waferId});
	}
	/**
	 * 删除垃圾数据
	 * @param conn
	 * @return
	 */
	public boolean delete(Connection conn){
		String sql = "delete from dm_wafer where delete_status=2";
		return db.operate(conn, sql, null);
	}
	
	public List<String> getJunkWaferId(Connection conn){
		List<String> ls = new ArrayList<>();
		String sql = "select wafer_id from dm_wafer where delete_status=2";
		try {
			PreparedStatement ps = conn.prepareStatement(sql);
			ResultSet rs = ps.executeQuery();
			while(rs.next()){
				ls.add(rs.getString(1));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ls;
	}
	
	/**
	 * 获取所有产品类别
	 * @return
	 */
	public List<Map<String,Object>> getProductCategory(){
		String sql = "select DISTINCT product_category from dm_wafer";
		return db.queryToList(sql, null);
	}
	
	public String getWaferNO(int waferId){
		String sql = "select wafer_number from dm_wafer where wafer_id=?";
		Object result = db.queryResult(sql, new Object[]{waferId});
		return result==null?"":result.toString();
		
	}
	public List<Map<String,Object>> getSecondaryInfo(Connection conn,String waferNO){
		String sql = "select computer_name,tester,total_test_time from dm_wafer_secondary_info where wafer_number=?";
		return db.queryToList(conn, sql, new Object[]{waferNO});
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
		Object result = db.queryResult(conn, sql, new Object[]{waferNO});
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
		Object result = db.queryResult(sql, new Object[]{waferNO,lot,device,dieType});
		return result==null?0:Integer.parseInt(result.toString());
	}
	public  int queryWaferinfo(Connection conn,String waferNO,String lot,String device,String dieType){
		String sql="select wafer_id from dm_wafer where wafer_number=? and lot_number=? and device_number=? and die_type=? and delete_status<>2";
		Object result = db.queryResult(conn,sql, new Object[]{waferNO,lot,device,dieType});
		return result==null?0:Integer.parseInt(result.toString());
	}
	
	
	public  boolean queryWaferinfo(String waferNO){
		String sql="select wafer_number from dm_wafer where wafer_number=?";
		return db.queryResult(sql, new Object[]{waferNO})==null?false:true;
	}
	
	
	public Map<String,Object> getFile(Connection conn,int waferId){
		String sql =" select wafer_file_name,wafer_number from dm_wafer where wafer_id=?";
		List<Map<String,Object>> result = db.queryToList(conn,sql, new Object[]{waferId});
		return result.size()>0?result.get(0):null;
	}
	
	public List<Map<String,Object>> getWaferData(Connection conn,int waferId,String column,String dieType){
		String sql = "select "+("".equals(dieType)?"":"concat('"+dieType+"','') die_type,")+"die_number,bin,alphabetic_coordinate location"+column+" from dm_wafer_coordinate_data where wafer_id=? and bin<>-1 order by die_number+0";
		return db.queryToList(conn, sql, new Object[]{waferId});
	}
	
	public List<Map<String,Object>> getWaferData(Connection conn,int waferId,String column){
		String sql = "select alphabetic_coordinate location"+column+",bin from dm_wafer_coordinate_data where wafer_id=? and bin<>-1 order by die_number";
		return db.queryToList(conn, sql, new Object[]{waferId});
	}
	
	public String getDieType(Connection conn,int waferId){
		String sql = "select die_type from dm_wafer where wafer_id=?";
		Object result = db.queryResult(conn, sql, new Object[]{waferId});
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
		String sql = "select "+column+" from dm_wafer_coordinate_data where wafer_id=? and bin<>-1";
		double yield = 0;
		try {
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setInt(1, waferId);
			ResultSet rs = ps.executeQuery();
			int count = 0,qualified = 0;
			while(rs.next()){
				count++;
				if("".equals(upper) || rs.getDouble(1)<=Double.parseDouble(upper) || "".equals(lower) || rs.getDouble(1)>=Double.parseDouble(lower)){
					qualified++;
				}
				
			}
			yield = new BigDecimal((double)qualified/count).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return yield;
	}
	
	public List<Map<String,Object>> getSecondary(Connection conn,int waferId){
		String sql = "select ifnull(wafer_file_name,'') wafer_file_name,ifnull(computer_name,'')computer_name,ifnull(tester,'')tester,"
				+ "ifnull(test_start_date,'')test_start_date,ifnull(test_end_date,'')test_end_date, ifnull(total_test_time,'')total_test_time,"
				+ "ifnull(device_number,'')device_number,ifnull(lot_number,'')lot_number,"
				+ "dm_wafer.wafer_number,die_type from dm_wafer left join dm_wafer_secondary_info on dm_wafer.wafer_number=dm_wafer_secondary_info.wafer_number"
				+ " where wafer_id=?";
		return db.queryToList(conn,sql, new Object[]{waferId});
		
	}
	
	
	public List<Map<String,Object>> getYieldById(Connection conn,int waferId) {
		String sql = "select (select count(*) from dm_wafer_coordinate_data where wafer_id=? and bin=1)/count(*) yield,count(*) quantity from dm_wafer_coordinate_data where wafer_id=? and bin<>-1";
		return db.queryToList(conn,sql, new Object[]{waferId,waferId});

	}
	
	
	
}
