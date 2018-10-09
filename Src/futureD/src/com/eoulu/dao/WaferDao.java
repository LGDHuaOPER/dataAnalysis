/**
 * 
 */
package com.eoulu.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
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
	/**
	 * 数据列表分页,模糊查询
	 * @param page
	 * @return
	 */
	public List<Map<String,Object>> listWafer(PageDTO page,String keyword,String Parameter){
		String sql = "select wafer_id,wafer_number,product_category,lot_number,qualified_rate,left(test_end_date,10)test_end_date,dm_user.user_name test_operator,description from dm_wafer "
				+ "left join dm_user on dm_user.user_id=dm_wafer.test_operator "
				+ "where delete_status=0 ";
		Object[] param = new Object[]{(page.getCurrentPage()-1)*page.getRow(),page.getRow()};
		if(!"".equals(keyword)){
			sql += " and (";
			String[] params = Parameter.split(",");
			param = new Object[params.length+2];
			for(int i=0;i<params.length;i++) {
				sql+=params[i]+" like ? ";	
				if(i==params.length-1) {
					sql+=") ";
				}else {
					sql+="or ";
				}
				param[i]="%"+keyword+"%";
			}
			param[params.length] = (page.getCurrentPage()-1)*page.getRow();
			param[params.length+1]=page.getRow();
		}
		sql += "  order by gmt_modified desc limit ?,? ";
		
		return db.queryToList(sql, param);
	}
	/**
	 * 数据总数，模糊查询
	 * @param keyword
	 * @return
	 */
	public int countWafer(String keyword,String Parameter){
		String sql = "select count(*) from dm_wafer where delete_status=0  ";
		Object[] param = null;
		if(!"".equals(keyword)){
			sql += " and (";
			String[] params = Parameter.split(",");
			param = new Object[params.length];
			for(int i=0;i<params.length;i++) {
				sql+=params[i]+" like ? ";	
				if(i==params.length-1) {
					sql+=") ";
				}else {
					sql+="or ";
				}
				param[i]="%"+keyword+"%";
			}
		}
		Object result = db.queryResult(sql, param);
		return result==null?0:Integer.parseInt(result.toString());
	}
	
	public int getWaferID(Connection conn,String waferNumber,String dieType){
		String sql = "select wafer_id from dm_wafer where wafer_number=? and die_type=?";
		Object[] param = new Object[]{waferNumber,dieType};		
		Object result = db.queryResult(sql, param);
		return result==null?0:Integer.parseInt(result.toString());
	}
	
	public int getMaxWaferID(Connection conn,String waferNumber){
		String sql = "select max(wafer_id) wafer_id from dm_wafer where wafer_number=?";
		Object[] param = new Object[]{waferNumber};		
		Object result = db.queryResult(sql, param);
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
				+ "test_start_date,test_end_date,test_operator,archive_user,description,delete_status,total_test_quantity,data_format,gmt_create,gmt_modified) "
				+ "value (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
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
			ps.setObject(13, wafer.getDeleteStatus());
			ps.setObject(14, wafer.getTotalTestQuantity());
			ps.setObject(15, wafer.getDataFormat());
			ps.setObject(16, wafer.getGmtCreate());
			ps.setObject(17, wafer.getGmtModified());
			int row = ps.executeUpdate();
			flag = row>0?"success":"晶圆添加失败！";
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return flag;
	}
	
	/**
	 * 修改晶圆信息
	 * @param wafer
	 * @return
	 */
	public boolean update(WaferDO wafer){
		String sql = "update dm_wafer set product_category=?,test_operator=?,test_end_date=?,description=? where wafer_id=?";
		Object[] param = new Object[]{wafer.getProductCategory(),wafer.getTestOperator(),wafer.getTestEndDate(),wafer.getDescription(),wafer.getWaferId()};
		return db.operate(sql, param);
	}
	/**
	 * 更改删除状态
	 * @param waferId
	 * @return
	 */
	public boolean remove(String waferId){
		if("".equals(waferId)){
			return false;
		}
		String sql = "update dm_wafer set delete_status=1 where wafer_id in ("+waferId+") ";
		return db.operate(sql, null);
	}
	
	/**
	 * 获取所有产品类别
	 * @return
	 */
	public List<Map<String,Object>> getProductCategory(){
		String sql = "select DISTINCT product_category from dm_wafer";
		return db.queryToList(sql, null);
	}
	
	
	public String insertSecondaryInfo(Connection conn,Object[] param){
		String sql = "insert into dm_wafer_secondary_info (wafer_id,computer_name,tester) value (?,?,?)";
		PreparedStatement ps = null;
		String flag = "";
		try {
			ps = conn.prepareStatement(sql);
			ps.setObject(1, param[0]);
			ps.setObject(2, param[1]);
			ps.setObject(3, param[2]);
			int row = ps.executeUpdate();
			flag = row>0?"success":"晶圆次要信息添加失败！";
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return flag;
	}

	/**
	 * 判断晶圆是否存在
	 * @param conn2
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
	
	
	public String getDeviceSerialID(Connection conn,String device) throws SQLException{	
		String DeviceSerialID="";
		PreparedStatement psm=null;
		ResultSet rs=null;
		String sql="select DeviceSerialID from producinfotdef where DeviceID=?";
		psm=conn.prepareStatement(sql);
		psm.setString(1, device);
		rs=psm.executeQuery();
		while(rs.next()){
			DeviceSerialID=rs.getString(1);
			break;
		}
		return DeviceSerialID;
	}
	
}
