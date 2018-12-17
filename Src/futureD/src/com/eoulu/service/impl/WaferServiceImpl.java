/**
 * 
 */
package com.eoulu.service.impl;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import com.eoulu.dao.CoordinateDao;
import com.eoulu.dao.CurveDao;
import com.eoulu.dao.ParameterDao;
import com.eoulu.dao.SmithDao;
import com.eoulu.dao.SubdieDao;
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
import com.eoulu.transfer.ObjectTable;
import com.eoulu.transfer.PageDTO;
import com.eoulu.transfer.ProgressSingleton;
import com.eoulu.util.DataBaseUtil;
import com.eoulu.util.Md5Util;
import com.google.gson.Gson;



/**
 * @author mengdi
 *
 * 
 */
public class WaferServiceImpl implements WaferService {


	@Override
	public List<Map<String, Object>> listWafer(PageDTO page, String keyword, String Parameter,int deleteStatus) {
		WaferDao dao = (WaferDao) ObjectTable.getObject("WaferDao");
		return dao.listWafer(page, keyword, Parameter, deleteStatus);
	}

	@Override
	public int countWafer(String keyword, String Parameter,int deleteStatus) {
		WaferDao dao = (WaferDao) ObjectTable.getObject("WaferDao");
		return dao.countWafer(keyword, Parameter, deleteStatus);
	}

	@Override
	public boolean remove(String waferId) {
		WaferDao dao = (WaferDao) ObjectTable.getObject("WaferDao");
		return dao.remove(waferId,1);
	}

	@Override
	public boolean update(WaferDO wafer) {
		WaferDao dao = (WaferDao) ObjectTable.getObject("WaferDao");
		return dao.update(wafer);
	}

	@Override
	public List<Map<String, Object>> getAllUser() {
		return new UserDao().getAllUser();
	}

	@Override
	public List<Map<String, Object>> getProductCategory() {
		WaferDao dao = (WaferDao) ObjectTable.getObject("WaferDao");
		return dao.getProductCategory();
	}

	@Override
	public String getWaferNO(String waferId) {
		WaferDao dao = (WaferDao) ObjectTable.getObject("WaferDao");
		String[] att = waferId.split(",");
		String waferNO = dao.getWaferNO(Integer.parseInt(att[0]));
		for(int i=1,length=att.length;i<length;i++){
			waferNO += ","+dao.getWaferNO(Integer.parseInt(att[i]));
		}
		
		return waferNO;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public synchronized String saveZipData(Connection conn,Map<String,Object> mapFileList,String file,DataBaseUtil db,Map<String,Object> map) {
	
		WaferDao dao = (WaferDao) ObjectTable.getObject("WaferDao");
		SubdieDao subdieDao =  (SubdieDao) ObjectTable.getObject("SubdieDao");
		ZipService zipUtil = (ZipService) ObjectTable.getObject("ZipService");
		ZipFileParser util = (ZipFileParser) ObjectTable.getObject("ZipFileParser");
		ExcelService excelUtil = (ExcelService) ObjectTable.getObject("ExcelService");
		ParameterDao parameterDao = (ParameterDao) ObjectTable.getObject("ParameterDao");
		CoordinateDao coordinate =  (CoordinateDao) ObjectTable.getObject("CoordinateDao");
		List<String> filelist = util.getFile(file),dieTypeList = null,convertParam = null,configList=null,dieList = filelist;
		String status = null, operator = "",waferNO = "", mapFile="",totalTestTime = "",
						 productCategory = map.get("productCategory").toString(),  
						 description = map.get("description").toString(), 
								 archiveUser = map.get("currentUser").toString(),
								fileName = map.get("fileName").toString(),
										lastModified = map.get("lastModified")==null?"":map.get("lastModified").toString();
		Map<String, Object> messageMap = util.getMessage(filelist, productCategory),dieMap = null,dataMap = null,subdieMap=null,transfer = new HashMap<>();
		status = (String) messageMap.get("status");
		WaferDO wafer = (WaferDO) messageMap.get("waferDO"); 
		wafer.setDescription(description);
		wafer.setFileName(fileName);
		wafer.setTotalTestQuantity(0);
		wafer.setLastModified(lastModified);
		// 数据信息开始的行数
		int datanum = 0, testerWaferSerialIDnum = 0, limitnum = 0;
		if (status != null) {
			return status;
		} else {
			waferNO = wafer.getWaferNumber();
			if("".equals(waferNO)){
				return "上传失败，CSV文件的WaferID是空值！";
			}
			if(mapFileList.get(waferNO)==null){
				return  "上传失败，导入目标文件前没有导入对应的map文件！";
			}
			mapFile = mapFileList.get(waferNO).toString();
			dataMap = util.readMapFile(mapFile);
			dieMap = (Map<String, Object>) dataMap.get("dieMap");
			subdieMap = (Map<String, Object>) dataMap.get("subdieMap");
			convertParam = (List<String>) dataMap.get("convert");
			configList = (List<String>) dataMap.get("configList");
			operator = (String) messageMap.get("operator"); 
			datanum = (int) messageMap.get("datanum");
			testerWaferSerialIDnum = (int) messageMap.get("testerWaferSerialIDnum");
			limitnum = (int) messageMap.get("limitnum");
			dieTypeList = (List<String>) messageMap.get("dieTypeList");
			totalTestTime = messageMap.get("totalTestTime").toString();
			
		}
		
		MapParameterDO mapParamDO =  (MapParameterDO) dataMap.get("mapParamDO");
		mapParamDO.setWaferNumber(waferNO);
		boolean subdieExist = (boolean) dataMap.get("subdieExist");
		try {	
		// 判断文件是否上传
			Map<Integer, Object> dietypeName = util.getDieTypeName(filelist, testerWaferSerialIDnum, limitnum);
			String tester = operator;
			UserDao userDao = new UserDao();
			operator = operator.trim();
			operator = userDao.getUserId(conn,operator);
			if ("".equals(operator)) {
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
					operator = userDao.getUserId(conn,tester);
				}
			}
			if (archiveUser.equals(operator)) {
				archiveUser = operator;
			} else {
				archiveUser = userDao.getUserId(conn,archiveUser);
			}
			wafer.setArchiveUser(Integer.parseInt(archiveUser));
			wafer.setTestOperator(Integer.parseInt(operator));
			wafer.setSubdieFlag(subdieExist?1:0);
			Map<String, List<Object[]>> parameterList = util.getParameter(filelist, datanum, testerWaferSerialIDnum,
					limitnum, dieTypeList);

			status = zipUtil.saveWaferInfo(conn,  wafer, parameterList,tester,dao,parameterDao,subdieDao);
			if (!"success".equals(status)) {
				conn.rollback();
				return status;
			}
			System.out.println("wafer:"+status);
			//次要信息
			Object[] param = new Object[] { waferNO, "", tester, totalTestTime };
			if(dao.getSecondaryInfo(conn, waferNO).size()>0){
				status = dao.updateSecondaryInfo(conn, param);
			}else{
				status = dao.insertSecondaryInfo(conn, param);
			}
			if (!"success".equals(status)) {
				conn.rollback();
				return status;
			}
			status = zipUtil.saveMapParameter(conn, mapParamDO, parameterDao);
			if (!"success".equals(status)) {
				conn.rollback();
				return status;
			}
			System.out.println("ciyao:"+status);
			transfer.put("dieList", dieList);
			transfer.put("filelist", filelist);
			transfer.put("datanum", datanum);
			transfer.put("dietypeName", dietypeName);
			transfer.put("convertParam", convertParam);
			transfer.put("waferNO", waferNO);
			transfer.put("dieMap", dieMap);
			transfer.put("subdieExist", subdieExist);
//			List<String> mapparameters = parameterDao.getEightParameter(conn, waferID);
			status = zipUtil.saveCoordinateData(conn, transfer,coordinate,dao,parameterDao);
			if (!"success".equals(status)) {
				conn.rollback();
				return status;
			}
			transfer.put("subdieMap", subdieMap);
			transfer.put("configList", configList);
			status = zipUtil.saveSubdie(conn, transfer,coordinate,dao,parameterDao,subdieDao);
			if (!"success".equals(status)) {
				conn.rollback();
				return status;
			}
			
			status = excelUtil.updateYield(conn, dieTypeList, waferNO,subdieExist,subdieDao);
			if (!"success".equals(status)) {
				conn.rollback();
				return status;
			}
			System.out.println("subdie:"+status);
			status = zipUtil.insertCurve(conn, file,db);
			if (!"success".equals(status)) {
				conn.rollback();
				return status;
			}
			System.out.println("curve:"+status);
			conn.commit();
		} catch (IOException e) {
			e.printStackTrace();
			status = "读取失败！";
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
		} catch (SQLException e) {
			status = "存储失败！";
			e.printStackTrace();
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
		}
//		System.out.println("end==="+status);
		return status;
	}

	
	
	@Override
	public String saveExcelData(Connection conn, Map<String, Object> map, WaferDO wafer, boolean coordinateFlag) {
		ParameterDao parameterDao = new ParameterDao();
		WaferDao dao = new WaferDao();
		ExcelService excelUtil = (ExcelService) ObjectTable.getObject("ExcelService");
		String status = "";
//		System.out.println("operator:"+map.get("operator"));
		String operator = map.get("operator") == null ? "" : map.get("operator").toString(), tester = operator,
				currentUser = map.get("currentUser") == null ? "" : map.get("currentUser").toString(),
				computerName = map.get("computerName") == null ? "" : map.get("computerName").toString(),
				totalTestTime = map.get("totalTestTime") == null ? "" : map.get("totalTestTime").toString(),
				columnStr = map.get("columnStr") == null ? "" : map.get("columnStr").toString(),
				condtion = map.get("condition") == null ? "" : map.get("condition").toString(),
						sessionId = map.get("sessionId")==null?"":map.get("sessionId").toString();
		boolean summation = (boolean) map.get("summation");
		int interval = Integer.parseInt(map.get("interval").toString());
		double sizeX = Double.parseDouble(map.get("sizeX")==null?"0":map.get("sizeX").toString()),sizeY = Double.parseDouble(map.get("sizeY")==null?"0":map.get("sizeY").toString());
		List<List<String>> paramList = (List<List<String>>) map.get("paramList");
		Map<String, List<String>> limitMap = (Map<String, List<String>>) map.get("limitMap");
		Map<String, List<Object[]>> dataMap = (Map<String, List<Object[]>>) map.get("dataMap");
		try {
			UserDao userDao = new UserDao();
			operator = userDao.getUserId(conn, operator);
//			System.out.println("operator:"+operator);
			if ("".equals(operator)) {
				UserDO user = new UserDO();
				user.setUserName(tester);
				user.setTelephone("");
				user.setAuthority("");
				user.setPassword(Md5Util.md5("EOULU2018"));
				user.setRoleId(1);
				user.setSex("男");
				user.setEmail("");
				boolean flag = userDao.insert(conn, user);
				if (flag) {
					operator = userDao.getUserId(conn, operator);
				}
			}
//			System.out.println("operator:"+operator);
			if (currentUser.equals(operator)) {
				currentUser = operator;
			} else {
				String userId = userDao.getUserId(conn, currentUser);
				if("".equals(userId)){
					UserDO user = new UserDO();
					user.setUserName(currentUser);
					user.setTelephone("");
					user.setAuthority("");
					user.setPassword(Md5Util.md5("EOULU2018"));
					user.setRoleId(1);
					user.setSex("男");
					user.setEmail("");
					boolean flag = userDao.insert(conn, user);
					if (flag) {
						currentUser = userDao.getUserId(conn, currentUser);
					}
				}else{
					currentUser = userId;
				}
			}
			wafer.setArchiveUser(Integer.parseInt(currentUser));
			wafer.setTestOperator(Integer.parseInt(operator));
			ProgressSingleton.put(sessionId, summation?interval:(interval+=10));
			// 晶圆，参数
			status = excelUtil.saveWaferParameter(conn, paramList, limitMap, wafer);
			if (!"success".equals(status)) {
				conn.rollback();
				return status;
			}
			ProgressSingleton.put(sessionId, summation?interval:(interval+=10));
			// 次要信息
			boolean exsit = dao.getSecondaryExsit(conn, wafer.getWaferNumber());
			Object[] param = new Object[] { wafer.getWaferNumber(), computerName, tester, totalTestTime };
			if (exsit) {
				status = dao.updateSecondaryInfo(conn, param);
			} else {

				status = dao.insertSecondaryInfo(conn, param);
			}
			if (!"success".equals(status)) {
				conn.rollback();
				return status;
			}
			ProgressSingleton.put(sessionId, summation?interval:(interval+=5));
			long time4 = System.currentTimeMillis();
			status = excelUtil.saveCoordinate(conn, limitMap, dataMap, wafer.getWaferNumber(), coordinateFlag,
					columnStr, condtion);
			if (!"success".equals(status)) {
				conn.rollback();
				return status;
			}
			ProgressSingleton.put(sessionId, summation?interval:(interval+=18));
			long time5 = System.currentTimeMillis();
			System.out.println("update yield:" + (time5 - time4));
			status = excelUtil.updateYield(conn, limitMap, wafer.getWaferNumber());
			if (!"success".equals(status)) {
				conn.rollback();
				return status;
			}
			ProgressSingleton.put(sessionId, summation?interval:(interval+=2));
			exsit = parameterDao.getMapParameter(conn, wafer.getWaferNumber());
			status = excelUtil.saveMap(conn, wafer.getWaferNumber(), exsit,sizeX,sizeY);
			if (!"success".equals(status)) {
				conn.rollback();
				return status;
			}
			ProgressSingleton.put(sessionId, summation?interval:(interval+=15));
			conn.commit();
		} catch (SQLException e) {
			e.printStackTrace();
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			status = "添加失败！";
		}
		return status;
	}

	@Override
	public String saveExcel(String path, String waferNO, String productCategory,
			String description, String currentUser, String progress, int interval) {
		ParameterDao parameterDao = new ParameterDao();
		WaferDao dao = new WaferDao();
		CoordinateDao coordinate = new CoordinateDao();
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
		 WaferDao dao = new WaferDao();
		 ExcelService excelUtil = (ExcelService) ObjectTable.getObject("ExcelService");
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
		DataBaseUtil db = new DataBaseUtil();
		WaferDao dao = new WaferDao();
		ParameterDao parameterDao = new ParameterDao();
		CoordinateDao coordinate = new CoordinateDao();
		Connection conn = db.getConnection();
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
			smithDao.deleteSmithData(conn, waferId,db);
			smithDao.deleteMarker(conn, waferId,db);
			smithDao.deleteMarkerCalculation(conn, waferId,db);
			
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
		ParameterDao parameterDao = new ParameterDao();
		List<String> paramList = new ArrayList<>();
		List<String> ls = new ArrayList<>();
		String[] att = waferIdStr.split(",");
		Connection conn = new DataBaseUtil().getConnection();
		for(int i=0,length=att.length;i<length;i++){
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

	@Override
	public boolean getWafer(String fileName, String editTime) {
		return new WaferDao().getWafer(fileName, editTime);
	}

	@Override
	public boolean delete(String waferId) {
		
		return new WaferDao().remove(waferId, 2);
	}

	@Override
	public boolean recovery(String waferId) {
		return new WaferDao().remove(waferId, 0);
	}

	@Override
	public boolean getCompareFile(String fileName, String lastModified) {
		String lastModifyTime = new WaferDao().getFileTime(fileName);
		boolean flag = false;
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date date;
		try {
			date = df.parse(lastModifyTime);
			Date date2 = df.parse(lastModified);
			if (date.before(date2)) {
				flag = true;
			}
		} catch (ParseException e) {
			e.printStackTrace();
		}

		return flag;
	}

	@Override
	public boolean getMapFlag(int waferId) {
		SubdieDao subdieDao = (SubdieDao) ObjectTable.getObject("SubdieDao");
		if(subdieDao.getSubdieExist(null, waferId)){
			return subdieDao.getMapFlag(waferId);
		}
		return new WaferDao().getMapFlag(waferId);
	}
	
	

}
