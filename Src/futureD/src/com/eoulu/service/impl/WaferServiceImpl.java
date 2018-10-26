/**
 * 
 */
package com.eoulu.service.impl;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import com.eoulu.dao.CoordinateDao;
import com.eoulu.dao.CurveDao;
import com.eoulu.dao.ParameterDao;
import com.eoulu.dao.SmithDao;
import com.eoulu.dao.WaferDao;
import com.eoulu.dao.user.UserDao;
import com.eoulu.entity.MapParameterDO;
import com.eoulu.entity.UserDO;
import com.eoulu.entity.WaferDO;
import com.eoulu.parser.ExcelParser;
import com.eoulu.parser.ReadExcel;
import com.eoulu.parser.ZipFileParser;
import com.eoulu.service.ExcelService;
import com.eoulu.service.WaferService;
import com.eoulu.service.ZipService;
import com.eoulu.transfer.PageDTO;
import com.eoulu.util.DataBaseUtil;
import com.eoulu.util.Md5Util;



/**
 * @author mengdi
 *
 * 
 */
public class WaferServiceImpl implements WaferService {

	private static WaferDao dao = new WaferDao();
	private static ParameterDao parameterDao = new ParameterDao();
	private static CoordinateDao coordinate = new CoordinateDao();
	private ZipFileParser util = new ZipFileParser();
	private ExcelParser excel = new ExcelParser();
	private ZipService zipUtil = new ZipService(dao, parameterDao, util, coordinate);
	private ExcelService excelUtil = new ExcelService(dao, parameterDao, excel, coordinate);

	@Override
	public List<Map<String, Object>> listWafer(PageDTO page, String keyword, String Parameter) {
		return dao.listWafer(page, keyword, Parameter);
	}

	@Override
	public int countWafer(String keyword, String Parameter) {
		return dao.countWafer(keyword, Parameter);
	}

	@Override
	public boolean remove(String waferId) {
		return dao.remove(waferId,1);
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
	public List<Map<String, Object>> getProductCategory() {
		return dao.getProductCategory();
	}

	@Override
	public String getWaferNO(int waferId) {
		return dao.getWaferNO(waferId);
	}
	
	@Override
	public synchronized String saveZipData(Map<String,Object> mapFileList,String file, String productCategory, String archiveUser,
			String description, String csvExcel, MapParameterDO mapDO,List<String> invalidationList) {
		List<String> filelist = util.getFile(file);
		Map<String, Object> messageMap = util.getMessage(filelist, productCategory);
		String status = (String) messageMap.get("status");
		String testStarTime = "";
		String testStopTime = "";
		String yield = "";
		String operator = "";
		String deviceID = "";
		String lotID = "";
		String waferID = "";
		String dateNowStr = "";
		String totalTestTime = "";
		int datanum = 0;// 数据信息开始的行数
		int testerWaferSerialIDnum = 0;
		int limitnum = 0;
		List<String> dieTypeList = null;
		if (status != null) {
			return status;
		} else {
			waferID = (String) messageMap.get("WaferID");
			if(mapFileList.get(waferID)==null){
				return  "上传失败，导入目标文件前没有导入对应的map文件！";
			}
			testStarTime = (String) messageMap.get("TestStarTime");
			testStopTime = (String) messageMap.get("TestStopTime");
			yield = (String) messageMap.get("Yield");
			operator = (String) messageMap.get("Operator");
			deviceID = (String) messageMap.get("DeviceID");
			lotID = (String) messageMap.get("LotID");
			dateNowStr = (String) messageMap.get("dateNowStr");
			productCategory = (String) messageMap.get("productCatagory");
			datanum = (int) messageMap.get("datanum");
			testerWaferSerialIDnum = (int) messageMap.get("TesterWaferSerialIDnum");
			limitnum = (int) messageMap.get("Limitnum");
			dieTypeList = (List<String>) messageMap.get("dieTypeList");
			totalTestTime = messageMap.get("totalTestTime").toString();
		}
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Connection conn = null;
		try {
			conn = new DataBaseUtil().getConnection();
			conn.setAutoCommit(false);// 更改JDBC事务的默认提交方式
			// 判断文件是否上传
			Map<Integer, Object> dietypeName = util.getDieTypeName(filelist, testerWaferSerialIDnum, limitnum);
			String tester = operator;
			UserDao userDao = new UserDao();
			operator = userDao.getUserId(conn,operator);
			if ("".equals(operator)) {
				UserDO user = new UserDO();
				user.setUserName(operator);
				user.setTelephone("");
				user.setAuthority("");
				user.setPassword(Md5Util.md5("EOULU2018"));
				user.setRoleId(1);
				user.setSex("男");
				user.setEmail("");
				boolean flag = userDao.insert(conn,user);
				if (flag) {
					operator = userDao.getUserId(conn,operator);
				}
			}
			if (archiveUser.equals(operator)) {
				archiveUser = operator;
			} else {
				archiveUser = userDao.getUserId(conn,archiveUser);
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
			wafer.setTestOperator(Integer.parseInt(operator));
			wafer.setDescription(description);
			wafer.setProductCategory(productCategory);
			wafer.setDataFormat(0);
			wafer.setGmtCreate(df.format(new Date()));
			wafer.setFileName(new File(csvExcel).getName());
			wafer.setDeleteStatus(0);
			wafer.setTotalTestQuantity(0);
			Map<String, List<Object[]>> parameterList = util.getParameter(filelist, datanum, testerWaferSerialIDnum,
					limitnum, dieTypeList);
			status = zipUtil.saveWaferInfo(conn,  wafer, parameterList,mapDO,tester,totalTestTime);
			if (!"success".equals(status)) {
				conn.rollback();
				return status;
			}
			//次要信息
			Object[] param = new Object[] { waferID, "", tester, totalTestTime };
			if(dao.getSecondaryInfo(conn, waferID).size()>0){
				status = dao.updateSecondaryInfo(conn, param);
			}else{
				status = dao.insertSecondaryInfo(conn, param);
			}
			if (!"success".equals(status)) {
				conn.rollback();
				return status;
			}
			
			//晶圆参数
			mapDO.setWaferNumber(waferID);
			if(parameterDao.getMapParameter(conn, waferID)){
				status = parameterDao.updateMapParameter(conn, mapDO);
			}else{
				status = parameterDao.insertMapParameter(conn,mapDO);
			}
			if (!"success".equals(status)) {
				conn.rollback();
				return status;
			}
			
			List<String> mapparameters = parameterDao.getEightParameter(conn, waferID);
			status = zipUtil.saveCoordinateData(conn, filelist, datanum, dietypeName, mapparameters, waferID,invalidationList);
			if (!"success".equals(status)) {
				conn.rollback();
				return status;
			}
			System.out.println("die:"+status);
			status = zipUtil.saveSubdie(conn, waferID);
			if (!"success".equals(status)) {
				conn.rollback();
				return status;
			}
			System.out.println("subdie:"+status);
			status = zipUtil.insertCurve(conn, file);
			if (!"success".equals(status)) {
				conn.rollback();
				return status;
			}
			System.out.println("curve:"+status);
			conn.commit();
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
				status = "回滚失败";
			}
			status = "重复数据";
		} catch (Exception e) {
			e.printStackTrace();
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
		} finally {
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}

		return status;
	}

	public static void main(String[] args) {
		Connection conn = new DataBaseUtil().getConnection();
		CurveDao curveDao = new CurveDao();
		SmithDao smithDao = new SmithDao();
		List<String> ls = dao.getJunkWaferId(conn);
		int waferId = 0;
		for(int i=0,size=ls.size();i<size;i++){
			waferId = Integer.parseInt(ls.get(i));
			parameterDao.delete(conn, waferId);
			coordinate.delete(conn, waferId);
			coordinate.deleteSubdie(conn, waferId);
			curveDao.deleteCurveData(conn, waferId);
			curveDao.deleteCurveParameter(conn, waferId);
			curveDao.deleteCurveType(conn, waferId);
			smithDao.deleteSmithData(conn, waferId);
			smithDao.deleteMarker(conn, waferId);
			smithDao.deleteMarkerCalculation(conn, waferId);
			
		}
		dao.delete(conn);
		try {
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		System.out.println("end");
	}
	
	
	@Override
	public String saveExcelData(Map<String,Object> map, WaferDO wafer, boolean coordinateFlag) {
		String status = "";
		String operator = map.get("operator").toString();
		String currentUser = map.get("currentUser").toString();
		String computerName = map.get("computerName").toString();
		String totalTestTime = map.get("totalTestTime").toString();
		List<String> unitList =  (List<String>) map.get("unitList");
		List<String> paramList =  (List<String>) map.get("paramList");
		Map<String, List<String>> limitMap = (Map<String, List<String>>) map.get("limitMap");
		Map<String, List<String>> dataMap =  (Map<String, List<String>>) map.get("dataMap");
		Connection conn = new DataBaseUtil().getConnection();
		try {
			conn.setAutoCommit(false);
			UserDao userDao = new UserDao();
			operator = userDao.getUserId(conn,operator);
			if ("".equals(operator)) {
				UserDO user = new UserDO();
				user.setUserName(operator);
				user.setTelephone("");
				user.setAuthority("");
				user.setPassword(Md5Util.md5("EOULU2018"));
				user.setRoleId(1);
				user.setSex("男");
				user.setEmail("");
				boolean flag = userDao.insert(conn,user);
				if (flag) {
					operator = userDao.getUserId(conn,operator);
				}
			}
			if (currentUser.equals(operator)) {
				currentUser = operator;
			} else {
				currentUser = userDao.getUserId(conn,currentUser);
			}
			wafer.setArchiveUser(Integer.parseInt(currentUser));
			wafer.setTestOperator(Integer.parseInt(operator));
			//晶圆，参数
			status = excelUtil.saveWaferParameter(conn, unitList, paramList, limitMap, wafer, dataMap);
			if (!"success".equals(status)) {
				conn.rollback();
				return status;
			}
			//次要信息
			int waferId = dao.getMaxWaferID(conn, wafer.getWaferNumber());
			Object[] param = new Object[] { waferId, computerName, wafer.getArchiveUser(), totalTestTime };
			status = dao.insertSecondaryInfo(conn, param);
			if (!"success".equals(status)) {
				conn.rollback();
				return status;
			}
			status = excelUtil.saveCoordinate(conn, limitMap, wafer, dataMap, wafer.getWaferNumber(), coordinateFlag);
			if (!"success".equals(status)) {
				conn.rollback();
				return status;
			}
			status = excelUtil.saveMap(conn, waferId, wafer.getWaferNumber());
			if (!"success".equals(status)) {
				conn.rollback();
				return status;
			}
			conn.commit();
		} catch (SQLException e) {
			e.printStackTrace();
			status = "添加失败！";
		}finally{
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return status;
	}

	@Override
	public String saveExcel(String path, String waferNO, String productCategory,
			String description, String currentUser, String progress, int interval) {
		Map<String, Object> dataMap = new ReadExcel().readExcel(path);
		List<String> paramList = (List<String>) dataMap.get("paramList");
		List<String> unitList = (List<String>) dataMap.get("unitList");
		List<Object> dataList = (List<Object>) dataMap.get("dataList");
		String status = dataMap.get("status").toString();
		if(!status.equals("success")){
			return status;
		}
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date date = new Date();
		String testStarTime = df.format(date);
		String testStopTime = testStarTime;
		String dieType = "DefaultType";
		String device = "Device";
		String lot = testStarTime.substring(0, 10);
		Connection conn = null;

		try {
			conn.setAutoCommit(false);
			UserDao userDao = new UserDao();
			currentUser = userDao.getUserId(conn,currentUser);
			WaferDO wafer = new WaferDO();
			wafer.setArchiveUser(Integer.parseInt(currentUser));
			wafer.setTestOperator(Integer.parseInt(currentUser));
			wafer.setWaferNumber(waferNO);
			wafer.setDeviceNumber(device);
			wafer.setLotNumber(lot);
			wafer.setTestStartDate(testStarTime);
			wafer.setTestEndDate(testStopTime);
			wafer.setDescription(description);
			wafer.setQualifiedRate(Double.parseDouble("0"));
			wafer.setDieType(dieType);
			wafer.setDataFormat(2);
			wafer.setFileName(new File(path).getName());
			wafer.setProductCategory(productCategory);
			wafer.setTotalTestQuantity(0);
			wafer.setGmtCreate(testStarTime);
			wafer.setGmtModified(testStarTime);
			status = dao.insert(conn, wafer);
			if (!"success".equals(status)) {
				conn.rollback();
				return status;
			}
			interval += 20;
			int waferId = dao.getWaferID(conn, waferNO, dieType);
			
			String paramColumn = "";
			String valueColumn = "";
			int length = paramList.size();
			int unitId = 0;
			for(int i=1;i<length;i++){
				Object[] param = new Object[]{waferId,paramList.get(i),unitList.get(i),"C"+i};
				status = parameterDao.insertExcelParameter(conn, param);
				if (!"success".equals(status)) {
					conn.rollback();
					return status;
				}
					paramColumn += ",C"+i;
					valueColumn += ",?";
			}
			interval += 20;
			status = coordinate.insertNewExcelCoordinate(conn, paramColumn, valueColumn, dataList, waferId);
			if (!"success".equals(status)) {
				conn.rollback();
				return status;
			}
			conn.commit();
			status = "success";
			interval += 20;
		} catch (SQLException e) {
			e.printStackTrace();
			try {
				conn.rollback();
				status = "数据存储出错！";
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
		} catch (Exception e) {
			e.printStackTrace();
			try {
				conn.rollback();
				status = "数据存储出错！";
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
		} finally {
			if (conn != null) {
				try {
					conn.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}

		return status;
	}

	@Override
	public String saveTxtToExcel(String path, String productCategory,  String description,
			String currentUser, String fileName, int interval) {
		Map<String, Object> dataMap = new ReadExcel().getExcelDataByTxt(path);
		interval += 10;
		String status = dataMap.get("status").toString();
		if(!status.equals("success")){
			return status;
		}
		List<String> paramList = (List<String>) dataMap.get("paramList");
		List<String> downLimit = (List<String>) dataMap.get("downLimit");
		List<String> upLimit = (List<String>) dataMap.get("upLimit");
		List<Object> dataList = (List<Object>) dataMap.get("dataList");
		List<Integer> hex = (List<Integer>) dataMap.get("hex");
		String waferNO = dataMap.get("WaferID").toString();
		String dieType = "DefaultType";
		String device = dataMap.get("DeviceID").toString();
		String lot = dataMap.get("LotID").toString();
		String testStarTime = dataMap.get("TestStarTime").toString();
		String testStopTime = dataMap.get("TestStopTime").toString();
		String testTime = dataMap.get("TotalTestTime").toString();
		String tester = dataMap.get("Tester").toString();
		Connection conn = null;

		try {
			conn = new DataBaseUtil().getConnection();
			conn.setAutoCommit(false);
			UserDao userDao = new UserDao();
			tester = userDao.getUserId(conn,tester);
			if ("".equals(tester)) {
				UserDO user = new UserDO();
				user.setUserName(tester);
				user.setTelephone("");
				user.setAuthority("");
				user.setPassword(Md5Util.md5("EOULU2018"));
				user.setRoleId(1);
				user.setSex("男");
				user.setEmail("");
				boolean flag = userDao.insert(conn,user);
				if (flag) {
					tester = userDao.getUserId(conn,tester);
				}
			}
			if(tester.equals(currentUser)){
				currentUser = tester;
			}else{
				currentUser = userDao.getUserId(conn, currentUser);
			}
			WaferDO wafer = new WaferDO();
			wafer.setArchiveUser(Integer.parseInt(currentUser));
			wafer.setTestOperator(Integer.parseInt(tester));
			wafer.setWaferNumber(waferNO);
			wafer.setDeviceNumber(device);
			wafer.setLotNumber(lot);
			wafer.setTestStartDate(testStarTime);
			wafer.setTestEndDate(testStopTime);
			wafer.setDescription(description);
			wafer.setQualifiedRate(Double.parseDouble("0"));
			wafer.setDieType(dieType);
			wafer.setDataFormat(2);
			wafer.setFileName(new File(path).getName());
			wafer.setProductCategory(productCategory);
			wafer.setTotalTestQuantity(0);
			wafer.setGmtCreate(testStarTime);
			wafer.setGmtModified(testStarTime);
			status = dao.insert(conn, wafer);
			if (!"success".equals(status)) {
				conn.rollback();
				return status;
			}
			int waferId = dao.getWaferID(conn, waferNO, dieType);
			status = excelUtil.saveTxtParameter(conn, interval, waferId, paramList, downLimit, upLimit, hex, dataList);
			if(!status.equals("")){
				conn.rollback();
				return "上传失败，晶圆数据添加失败！";
			}
			conn.commit();
			status = "success";
		} catch (SQLException e) {
			e.printStackTrace();
			try {
				conn.rollback();
				status = "数据存储出错！";
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
		} catch (Exception e) {
			e.printStackTrace();
			try {
				conn.rollback();
				status = "数据存储出错！";
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
		} finally {
			if (conn != null) {
				try {
					conn.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}

		return status;
	}

	@Override
	public String grabExcelAuto(String path, String fileName, String createTime, String classify,
			String productCategory, String testOperator, String description, String currentUser, String dataFormat) {
		/*String status = "";
		System.out.println("path:"+path);
		String waferId = new ExcelParser().getExcelWaferNumber(path);
		FileOperateRecordDao recordDao = new FileOperateRecordDao();
		RecycleOperation operation = new RecycleOperation();
		boolean flag = recordDao.queryWaferinfo(waferId);
		try {
			if ("上传失败，文件中的晶圆编号为空值！".equals(waferId)) {
				status = waferId;
			} else {
				if (flag) {
					//判断自动抓取的数据是否要覆盖已存在的数据，不覆盖则进行删除，覆盖则进行更新
					boolean cover = false;
					Properties pro = new Properties();
					try {
						pro.load(DataBaseUtil.class.getResourceAsStream("FilePath.properties"));
						String coverFlag = pro.getProperty("coverFlag");
						cover = "false".equals(coverFlag)?false:true;
					} catch (IOException e) {
						e.printStackTrace();
					}
					if(cover){
						boolean deleteFlag = false;
						Connection conn = new DataBaseUtil().getConnection();
						conn.setAutoCommit(false);
						List<Integer> ls = recordDao.getWaferSerialID(waferId,conn);
						int waferSerialId = 0;
						for(int i=0,size=ls.size();i<size;i++){
							waferSerialId = ls.get(i);
							deleteFlag = recordDao.removeWaferDie(waferSerialId,conn);
							if(!deleteFlag){
								break;
							}
						}
						if(deleteFlag){
							boolean flag1 = recordDao.removeParameter(waferSerialId, conn);
							boolean flag2 = operation.removeWafer(waferId, conn);
							deleteFlag = false;
							if(flag1 && flag2){
								conn.commit();
								deleteFlag = true;
							}
						}
						if(conn != null ){
							conn.close();
						}
						if(deleteFlag){
							status = ExcelParser.getExcelDataAuto(path, productCategory, testOperator, description, currentUser, dataFormat);
						}
						
					}
				} else {
					status = ExcelParser.getExcelDataAuto(path, productCategory, testOperator, description, currentUser, dataFormat);

				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		FileOperateRecordDO record = new FileOperateRecordDO();
		record.setClassify(classify);
		record.setFileName(fileName);
		record.setFileDate(createTime);
		record.setOperateResult(status);
		recordDao.insert(record);

		return status;*/
		return null;
	}

	@Override
	public  void deleteJunkData() {
		Connection conn = new DataBaseUtil().getConnection();
		CurveDao curveDao = new CurveDao();
		SmithDao smithDao = new SmithDao();
		List<String> ls = dao.getJunkWaferId(conn);
		int waferId = 0;
		for(int i=0,size=ls.size();i<size;i++){
			waferId = Integer.parseInt(ls.get(i));
			parameterDao.delete(conn, waferId);
			coordinate.delete(conn, waferId);
			coordinate.deleteSubdie(conn, waferId);
			curveDao.deleteCurveData(conn, waferId);
			curveDao.deleteCurveParameter(conn, waferId);
			curveDao.deleteCurveType(conn, waferId);
			smithDao.deleteSmithData(conn, waferId);
			smithDao.deleteMarker(conn, waferId);
			smithDao.deleteMarkerCalculation(conn, waferId);
			
		}
		dao.delete(conn);
		try {
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
	}

	@Override
	public List<String> getWaferParameter(String waferIdStr) {
		List<String> paramList = new ArrayList<>();
		List<String> ls = new ArrayList<>();
		String[] att = waferIdStr.split(",");
		Connection conn = new DataBaseUtil().getConnection();
		for(int i=0,length=waferIdStr.length();i<length;i++){
			if(i==0){
				paramList = parameterDao.getWaferParameter(conn,Integer.parseInt(att[i]));
			}else{
				ls = parameterDao.getWaferParameter(conn,Integer.parseInt(att[i]));
				paramList.retainAll(ls);
			}
			
		}
		try {
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return paramList;
	}

	

}
