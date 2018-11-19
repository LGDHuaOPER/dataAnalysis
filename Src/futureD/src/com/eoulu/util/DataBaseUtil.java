/**
 * 
 */
package com.eoulu.util;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import com.mysql.jdbc.Driver;
import com.mysql.jdbc.Statement;


/**
 * @author mengdi
 *
 * 
 */
public class DataBaseUtil{
	
	
	private Connection conn = null;
	private static Properties prop = new Properties();
	private static String driver = null, url = null;
	static {
		try {
			prop.load(DataBaseUtil.class.getResourceAsStream("DB.properties"));
			String cKey = "1234567890123456";
			driver = prop.getProperty("driver");
			url = prop.getProperty("url");
			String user = prop.getProperty("user"),password = prop.getProperty("password");
			url = BaseEncrypt.Decrypt(url, cKey);
			prop.put("user", BaseEncrypt.Decrypt(user, cKey));
			prop.put("password", BaseEncrypt.Decrypt(password, cKey));
		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	
	private static class DataBaseSingle{
		private static DataBaseUtil db = new DataBaseUtil();
	}
	
	public static DataBaseUtil getInstance(){
		return DataBaseSingle.db;
	}
	
	
	public Connection getConnection(){
		try {
			Driver driver = new Driver();
			conn = driver.connect(url, prop);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return conn;
	}
	
	public void close(){
		if(conn!=null){
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
				throw new RuntimeException("关闭连接失败",e);
			}
		}
	}
	public void close(Connection conn2){
		if(conn2!=null){
			try {
				conn2.close();
			} catch (SQLException e) {
				e.printStackTrace();
				throw new RuntimeException("关闭连接失败",e);
			}
		}
	}
	
	/**
	 * 多条查询结果
	 * @param sql
	 * @param params
	 * @return
	 */
	public List<Map<String,Object>> queryToList(String sql,Object[] params){
		List<Map<String,Object>> list = new ArrayList<>();
		Connection conn = null;
		PreparedStatement ps = null;
		ResultSet rs = null;
		try {
			conn = getConnection();
			ps = conn.prepareStatement(sql);
			if(params!=null){
				for(int i=0;i<params.length;i++){
					ps.setObject(i+1, params[i]);
				}	
			}
				
			rs = ps.executeQuery();
			ResultSetMetaData result = rs.getMetaData();
			int columnCounts  =  result.getColumnCount();
			while(rs.next()){
				Map<String,Object> rowdata = new HashMap<>();
				for(int i=1;i<=columnCounts;i++){
					rowdata.put(result.getColumnLabel(i), rs.getString(i));
				}
				list.add(rowdata);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}finally {
			close();
		}
		return list;
	}
	
	public List<Map<String,Object>> queryToList(Connection conn,String sql,Object[] params){
		List<Map<String,Object>> list = new ArrayList<>();
		PreparedStatement ps = null;
		ResultSet rs = null;
		try {
			ps = conn.prepareStatement(sql);
			if(params!=null){
				for(int i=0;i<params.length;i++){
					ps.setObject(i+1, params[i]);
				}	
			}
				
			rs = ps.executeQuery();
			ResultSetMetaData result = rs.getMetaData();
			int columnCounts  =  result.getColumnCount();
			while(rs.next()){
				Map<String,Object> rowdata = new HashMap<>();
				for(int i=1;i<=columnCounts;i++){
					rowdata.put(result.getColumnLabel(i), rs.getString(i));
				}
				list.add(rowdata);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return list;
	}
	
	public List<String> queryList(String sql,Object[] params){
		List<String> list = new ArrayList<>();
		Connection conn = null;
		PreparedStatement ps = null;
		ResultSet rs = null;
		try {
			conn = getConnection();
			ps = conn.prepareStatement(sql);
			if(params!=null){
				for(int i=0;i<params.length;i++){
					ps.setObject(i+1, params[i]);
				}	
			}
				
			rs = ps.executeQuery();
			while(rs.next()){
				list.add(rs.getString(1));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}finally {
			close();
		}
		return list;
	}
	
	public List<String> queryList(Connection conn,String sql,Object[] params){
		List<String> list = new ArrayList<>();
		PreparedStatement ps = null;
		ResultSet rs = null;
		try {
			ps = conn.prepareStatement(sql);
			if(params!=null){
				for(int i=0;i<params.length;i++){
					ps.setObject(i+1, params[i]);
				}	
			}
				
			rs = ps.executeQuery();
			while(rs.next()){
				list.add(rs.getString(1));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return list;
	}
	
	
	/**
	 * 单一查询结果
	 * @param sql
	 * @param params
	 * @return
	 */
	public Object queryResult(String sql,Object[] params){
		Object result = null;
		Connection conn = null;
		PreparedStatement ps = null;
		ResultSet rs = null;
		try {
			conn = getConnection();
			ps = conn.prepareStatement(sql);
			if(params!=null){
				for(int i=0;i<params.length;i++){
					ps.setObject(i+1, params[i]);
				}	
			}
				
			rs = ps.executeQuery();
			while(rs.next()){
				result = rs.getObject(1);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}finally {
			close();
		}
		return result;
	}

	/**
	 * 单一查询结果
	 * @param sql
	 * @param params
	 * @return
	 */
	public Object queryResult(Connection conn,String sql,Object[] params){
		Object result = null;
		PreparedStatement ps = null;
		ResultSet rs = null;
		try {
			ps = conn.prepareStatement(sql);
			if(params!=null){
				for(int i=0;i<params.length;i++){
					ps.setObject(i+1, params[i]);
				}	
			}
				
			rs = ps.executeQuery();
			while(rs.next()){
				result = rs.getObject(1);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return result;
	}
	
	/**
	 * 添加/修改
	 * @param sql
	 * @param params
	 * @return
	 */
	public boolean operate(String sql,Object[] params){
		boolean flag = false;
		Connection conn = null;
		PreparedStatement ps = null;
		try {
			conn = getConnection();
			ps = conn.prepareStatement(sql);
			if(params!=null){
				for(int i=0;i<params.length;i++){
					ps.setObject(i+1, params[i]);
				}
			}
			int count = ps.executeUpdate();
			flag = count>0?true:false;
		} catch (SQLException e) {
			e.printStackTrace();
		}finally {
			close();
		}
		return flag;
	}
	
	/**
	 * 添加/修改
	 * @param sql
	 * @param params
	 * @return
	 */
	public boolean operate(Connection conn,String sql,Object[] params){
		boolean flag = false;
		PreparedStatement ps = null;
		try {
			ps = conn.prepareStatement(sql);
			if(params!=null){
				for(int i=0;i<params.length;i++){
					ps.setObject(i+1, params[i]);
				}
			}
			int count = ps.executeUpdate();
			flag = count>0?true:false;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return flag;
	}
	
	/**
	 * 批量添加
	 * @param sql
	 * @param params
	 * @return
	 */
	public boolean insertBatch(String sql,List<Object[]> list){
		boolean flag = false;
		Connection conn = null;
		PreparedStatement ps = null;
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String createTime = df.format(new Date());
		try {
			conn = getConnection();
			ps = conn.prepareStatement(sql);
			if(list!=null){
				int interval = 10000;
				Object[] params = null;
				for(int i=0,size=list.size();i<size;i++){
					params = list.get(i);
					for(int j=0,length=params.length;j<length;j++){
						ps.setObject(j+1, params[j]);
					}
					ps.setObject(params.length+1, createTime);
					ps.addBatch();
					if((i+1)%interval==0){
						ps.executeBatch();
					}
				}
				if(list.size()%interval>0){
					ps.executeBatch();
				}
			}
			flag = true;
		} catch (SQLException e) {
			e.printStackTrace();
			flag = false;
		}finally {
			close();
		}
		return flag;
	}
	
	/**
	 * 批量添加
	 * @param sql
	 * @param params
	 * @return
	 */
	public boolean insertBatch(Connection conn,String sql,List<Object[]> list){
		boolean flag = false;
		PreparedStatement ps = null;
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
			flag = true;
		} catch (SQLException e) {
			e.printStackTrace();
			flag = false;
		}
		return flag;
	}
	
	/**
	 * 获取刚插入记录的ID
	 * @param sql
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public Object insertGetId(Connection conn,String sql, Object[] params) throws Exception {  
		int paraCount = params.length;
		PreparedStatement pst = null;
		Object retId = null;
        try {  
           
            pst = (PreparedStatement) conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);  
            for(int i = 0; i<paraCount; i++){
				pst.setObject(i+1, params[i]);
			}
			 pst.executeUpdate();

			 ResultSet rs = pst.getGeneratedKeys();  
             
            if (rs.next()){  
                retId = rs.getObject(1);  
            }else{  
                throw new Exception("insert or generate keys failed..");  
           
            } 
          
        } catch (Exception e) {  
            e.printStackTrace(); 
        } 
        return retId;  
    }  

	public static void main(String[] args) {
		System.out.println(new DataBaseUtil().getConnection());
//		new DataBaseUtil().close();
	}
}
