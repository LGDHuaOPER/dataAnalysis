/**
 * 
 */
package com.eoulu.service.impl;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.eoulu.dao.CoordinateDao;
import com.eoulu.dao.ParameterDao;
import com.eoulu.dao.WaferDao;
import com.eoulu.dao.user.UserDao;
import com.eoulu.entity.UserDO;
import com.eoulu.entity.WaferDO;
import com.eoulu.service.FileParser;
import com.eoulu.service.WaferService;
import com.eoulu.transfer.IndexChange;
import com.eoulu.transfer.PageDTO;
import com.eoulu.util.DataBaseUtil;
import com.eoulu.util.Md5Util;




/**
 * @author mengdi
 *
 * 
 */
public class WaferServiceImpl implements WaferService{
	
	WaferDao dao = new WaferDao();
	ParameterDao parameterDao = new ParameterDao();
	CoordinateDao coordinate = new CoordinateDao();
	DataBaseUtil db = new DataBaseUtil();
	FileParser util = new FileParser();

	@Override
	public List<Map<String, Object>> listWafer(PageDTO page, String keyword,String Parameter) {
		return dao.listWafer(page, keyword,Parameter);
	}

	@Override
	public int countWafer(String keyword,String Parameter) {
		return dao.countWafer(keyword,Parameter);
	}

	@Override
	public boolean remove(String waferId) {
		return dao.remove(waferId);
	}

	@Override
	public boolean update(WaferDO wafer) {
		return dao.update(wafer);
	}

	@Override
	public List<Map<String, Object>> getAllUser() {
		return new UserDao().getAllUser();
	}

	@Override
	public List<Map<String,Object>> getProductCategory(){
		return dao.getProductCategory();
	}

	@Override
	public synchronized String saveZipData(Connection conn, String file, String productCategory, String testOperator,
			String description, String csvExcel,Map<String, Object> mapParameter, String dataFormat) {
		List<String> filelist = util.getFile(file);
		Map<String, Object> messageMap = util.getMessage(filelist, productCategory, testOperator);
		String status = (String) messageMap.get("status");
		String testStarTime = "";
		String testStopTime = "";
		String yield = "";
		String operator = "";
		String deviceID = "";
		String lotID = "";
		String waferID = "";
		String dateNowStr = "";
		int datanum = 0;// 数据信息开始的行数
		int testerWaferSerialIDnum = 0;
		int limitnum = 0;
		List<String> dieTypeList = null;
		if (status != null) {
			return status;
		} else {
			testStarTime = (String) messageMap.get("TestStarTime");
			testStopTime = (String) messageMap.get("TestStopTime");
			yield = (String) messageMap.get("Yield");
			operator = (String) messageMap.get("Operator");
			deviceID = (String) messageMap.get("DeviceID");
			lotID = (String) messageMap.get("LotID");
			waferID = (String) messageMap.get("WaferID");
			dateNowStr = (String) messageMap.get("dateNowStr");
			productCategory = (String) messageMap.get("productCatagory");
			testOperator = (String) messageMap.get("testOperator");
			datanum = (int) messageMap.get("datanum");
			testerWaferSerialIDnum = (int) messageMap.get("TesterWaferSerialIDnum");
			limitnum = (int) messageMap.get("Limitnum");
			dieTypeList = (List<String>) messageMap.get("dieTypeList");
		}

		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		try {
			conn.setAutoCommit(false);// 更改JDBC事务的默认提交方式
			//判断文件是否上传
			Map<Integer, Object> dietypeName = util.getDieTypeName(filelist,testerWaferSerialIDnum, limitnum);
			UserDao userDao = new UserDao();
			String archiveUser = userDao.getUserId(operator);
			if("".equals(archiveUser)){
				UserDO user = new UserDO();
				user.setUserName(operator);
				user.setTelephone("");
				user.setAuthority("");
				user.setPassword(Md5Util.md5("EOULU2018"));
				user.setRoleId(1);
				user.setSex("男");
				user.setEmail("");
				boolean flag = userDao.insert(user);
				if(flag){
					archiveUser = userDao.getUserId(operator);
				}
			}
			if(testOperator.equals(operator)){
				testOperator = archiveUser;
			}else{
				testOperator = userDao.getUserId(testOperator);
			}
			WaferDO wafer = new WaferDO();
			wafer.setWaferNumber(waferID);
			wafer.setDeviceNumber(deviceID);
			wafer.setLotNumber(lotID);
			wafer.setQualifiedRate(Double.parseDouble(yield));
			wafer.setTestStartDate(testStarTime);
			wafer.setTestEndDate(testStopTime);
			wafer.setArchiveUser(Integer.parseInt(archiveUser));
			wafer.setGmtModified(dateNowStr);
			wafer.setTestOperator(Integer.parseInt(testOperator));
			wafer.setDescription(description);
			wafer.setProductCategory(productCategory);
			wafer.setDataFormat(Integer.parseInt(dataFormat));
			wafer.setGmtCreate(df.format(new Date()));
			wafer.setFileName(csvExcel);
			wafer.setDeleteStatus(0);
			wafer.setTotalTestQuantity(0);
			Map<String, List<Object[]>> parameterList = util.getParameter(filelist, datanum, testerWaferSerialIDnum, limitnum, dieTypeList);
			status = saveWaferInfo(conn, dieTypeList, wafer, parameterList);
			if(!"success".equals(status)){
				conn.rollback();
				return status;
			}
			
			int waferId = dao.getMaxWaferID(conn, waferID);
			status = parameterDao.updateMapParameter(conn, waferId, waferID);
			if(!"success".equals(status)){
				conn.rollback();
				return status;
			}
			List<String> mapparameters=parameterDao.getEightParameter(conn,waferId);
			status = saveCoordinateData(conn, filelist, datanum, dietypeName, mapparameters, waferID);
			if(!"success".equals(status)){
				conn.rollback();
				return status;
			}	
				conn.commit();
				status="success";
		} catch (FileNotFoundException e) {
			e.printStackTrace();
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
		} catch (IOException e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
			try {
				conn.rollback();
			} catch (SQLException e1) {
				status="回滚失败";
			}
			status="重复数据";
		}catch(Exception e){
			e.printStackTrace();
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
		}finally {
			
		}
		
		return null;
	}
	
	/**
	 * 晶圆表与参数表的添加
	 * @param conn
	 * @param dieTypeList
	 * @param wafer
	 * @param parameterList
	 * @return
	 */
	public String saveWaferInfo(Connection conn, List<String> dieTypeList, WaferDO wafer,Map<String, List<Object[]>> parameterList) {
		String status = null;
		String dieType = "";
		try {
		for(int i=0,size=dieTypeList.size();i<size;i++){
			dieType = dieTypeList.get(i);
			wafer.setDieType(dieType);
			status = dao.insert(conn, wafer);
			if (!"success".equals(status)) {
				conn.rollback();
				break;
			}
			int waferId = dao.getWaferID(conn, wafer.getWaferNumber(), dieType);
			List<Object[]> list = parameterList.get(dieType);
			status = parameterDao.insertParameter(conn, list, waferId);
			if(!"success".equals(status)){
				conn.rollback();
				break;
			}
		}
		
		} catch (SQLException e) {
			
			e.printStackTrace();
		}
		return status;
	}
	
	public String saveCoordinateData(Connection conn,List<String> filelist,int datanum,Map<Integer, Object> dietypeName,List<String> mapparameters,String waferNumber) {
		String status=null;
		String diepos;//字母坐标
		int rows;
		String TestTime;
		StringBuilder sb=new StringBuilder();
		String dieType;
		String temp = "";
		int waferId = 0;
		List<Map<String, Double>> upperAndLowerLimit = null;
		List<Object[]> list = new ArrayList<>();
		Object[] obj = null;
		int index = 0;
		String column = "";
		String columnStr = "";
		try {
		for(int m=datanum;m<filelist.size();m++){
			index ++;
			String data[]=filelist.get(m).split(",");
			obj = new Object[data.length];
			if(data.length==0)  continue;
			if("".equals(data[3])){
				status="上传失败，文件中的DieType存在空值！";
				
					conn.rollback();
				
				return status;
			}
			else if(!dietypeName.containsKey(Integer.parseInt(data[3]))){
				dieType="DefaultType";
			}
			else{
				dieType=(String) dietypeName.get(Integer.parseInt(data[3]));
			}
			if(!temp.equals(dieType)){
				waferId = dao.getWaferID(conn, waferNumber, dieType);
				upperAndLowerLimit = parameterDao.getUpperAndLowerLimit(waferId, conn);
				temp = dieType;
			}
			
			if("".equals(data[0])){
				status="上传失败，文件中的DieX存在空值！";
				conn.rollback();
				return status;
			}
			if("".equals(data[1])){
				status="上传失败，文件中的DieY存在空值！";
				conn.rollback();
				return status;
			}
			if("".equals(data[2])){
				status="上传失败，文件中的Bin值存在空值！";
				conn.rollback();
				return status;
			}
			//设置默认值
			if("".equals(data[4])){
				data[4]="0";
			}
			if("".equals(data[5])){
				data[5]="0";
			}
			if(6>=data.length||"".equals(data[6])){
				TestTime="0";
			}else{
				TestTime=data[6];
			}
			diepos=IndexChange.DiePositionTrans(Integer.parseInt(data[0]),Integer.parseInt(data[1]), mapparameters.get(0), mapparameters.get(1), mapparameters.get(2), mapparameters.get(3), Integer.parseInt(mapparameters.get(4)), Integer.parseInt(mapparameters.get(5)), mapparameters.get(6), mapparameters.get(7));
			obj[0] = waferId;
			obj[1] = diepos;
			obj[2] = data[0];
			obj[3] = data[1];
			obj[4] = index;
			obj[6] = TestTime;
			boolean bin = true;
			String str = "";
			for(int j=7;j<data.length;j++){
				obj[j] = data[j];
				bin =bin&&(data[j]==null|| "null".equals(data[j])|| "".equals(data[j])||(Double.parseDouble(data[j])>=upperAndLowerLimit.get(j-7).get("Lower")&&Double.parseDouble(data[j])<=upperAndLowerLimit.get(j-7).get("Upper")));
				str += ","+bin;
				if(m == filelist.size()-1){
					column +=",C";
					columnStr +=",?";
				}
			}
			obj[5] = str.contains("false")?"255":"1";
			if(Integer.parseInt(data[4])==-1){
				obj[5] = "-1";
			}
			list.add(obj);
			
		}//循环遍历数据信息行
		} catch (SQLException e) {
			e.printStackTrace();
		}
		status = coordinate.insertCoordinate(conn, list, column, columnStr);
		
		return status;
	}
	
}
