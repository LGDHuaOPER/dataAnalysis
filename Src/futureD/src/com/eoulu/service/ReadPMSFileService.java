package com.eoulu.service;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.eoulu.dao.CoordinateDao;
import com.eoulu.dao.CurveDao;
import com.eoulu.dao.WaferDao;
import com.eoulu.dao.user.UserDao;
import com.eoulu.entity.MapParameterDO;
import com.eoulu.entity.UserDO;
import com.eoulu.entity.WaferDO;
import com.eoulu.parser.ZipFileParser;
import com.eoulu.transfer.IndexChange;
import com.eoulu.util.DataBaseUtil;
import com.eoulu.util.Md5Util;


public class ReadPMSFileService {

	private static boolean Flag = false;
	private WaferDao dao = new WaferDao();
	private CoordinateDao coordinate = new CoordinateDao();
	private Map<String,Object> subdieIdMap = null;//key:坐标+DieType ;value:subdieId

	public String getPMSFiles(String filePath, String productCategory, String testOperator,
			String description, String dataFormat, String sessionId, int interval) {
		if(!"1".equals(dataFormat)){
			return "文件与数据格式不一致！";
		}
		Map<String, Object> waferinfo = null; // 晶圆信息、晶圆参数
		List<Map<String, Object>> dieXYAndBin = new ArrayList<>(); // Die坐标、Bin值、DieType、Dieno
		Map<String, Object> curvedata = new HashMap<>(); // 曲线数据
		Map<String, Object> curveParameters = new HashMap<>();// 曲线参数
		Map<String,Object> subdieMap = new HashMap<>();//key:坐标+DieType ;value:subdie
		Map<String, Object> result = new HashMap<>();
		List<String> dieTypeList = new ArrayList<>();
		int dieNO = 0; // Die编号
		String fileName = ""; // Wafer文件
		String status = "";
		File root = new File(filePath);
		File[] files = root.listFiles();
		if (files.length == 1) {
			files = files[0].listFiles();
		}
		if (files.length == 1) {
			files = files[0].listFiles();
		}
		if (files.length == 1) {
			files = files[0].listFiles();
		}
		interval += 5;
		long time0 = System.currentTimeMillis();
		for (File file : files) {
			if (file.isFile()) {
				fileName = file.getAbsolutePath();
				waferinfo = getWaferInfo(file.getAbsolutePath(), productCategory, testOperator, description, waferinfo);
				if (dao.queryWaferinfo(waferinfo.get("WaferID").toString())) {
					return "上传失败！晶圆已存在！";
				}
			}
			if (file.isDirectory()) {
				result = getWaferdataAndCurve(file,  curvedata, curveParameters, dieTypeList, dieNO);
				dieXYAndBin.add((Map<String, Object>) result.get("dieMap"));
				curvedata.put((String) result.get("curveParametersKey"), result.get("curvedataValue"));
				curveParameters.put((String) result.get("curveParametersKey"), result.get("curveParametersValue"));
				subdieMap.put((String) result.get("curveParametersKey"),result.get("subdieList"));
				dieTypeList = (List<String>) result.get("dieTypeList");
				dieNO = Integer.parseInt(result.get("dieNO").toString());
				status = result.get("status").toString();
			}
			if(!"".equals(status)){
				return status;
			}
		}
		interval += 15;
		long time1 = System.currentTimeMillis();
		System.out.println("读取文件数据用时：" + (time1 - time0));
		status = this.operateDatabase(productCategory, testOperator, description, waferinfo, dieXYAndBin, curvedata,
				curveParameters, dieTypeList,subdieMap, dataFormat, fileName, interval);

		long time2 = System.currentTimeMillis();
		System.out.println("存储数据用时：" + (time2 - time1));
		return status;
	}

	
	public Map<String,Object> getWaferInfo(String filePath, String productcatagories, String testOperator, String Details,Map<String, Object> waferinfo) {// 获取CSV文件中的晶圆信息
		waferinfo = new HashMap<>();
		List<String> filelist = ZipFileParser.getFile(filePath);
		for (int i = 0; i < 19; i++) {
			String[] temp = filelist.get(i).split(",");
			if (temp == null || temp[0] == null) {
				return null;
			}
			if (i == 0 && temp[0].equals("WaferID")) {
				if (temp[2] == null || temp[2].equals("")) {
					return null;
				} else {
					waferinfo.put(temp[0], temp[2]);
				}

			} else {
				waferinfo.put(temp[0], temp[2]);
			}

		}
		return waferinfo;
	}

	public Map<String,Object> getWaferdataAndCurve(File file,Map<String, Object> curvedata,Map<String, Object> curveParameters,List<String> dieTypeList,int dieNO) {
		Map<String,Object> result = new HashMap<>();
		File[] files = file.listFiles();
		String dieX="" ,dieY="",bin="",dieType="",status = "";
		List<String[]> subdieList = new ArrayList<>();
		List<String[]> curvedataList = new ArrayList<>();
		List<String[]> curveParametersList = new ArrayList<>();
		String[] att = null;
		dieNO++;
		for (int f = 0; f < files.length; f++) {
			String[] fileName = files[f].getName().split("_");
			if (f == 0) {// 同一个Die文件夹下的Die文件信息相同
				dieX = fileName[0];
				dieY = fileName[1];
				bin = "255";
				dieType = fileName[2];
			}
			String subdieName = fileName[3],deviceGroup = "",x = "",y = "",p = "";
			String[] point = null;
			List<String> filelist = ZipFileParser.getFile(files[f].getAbsolutePath());
			if (f == 0 && filelist.size() > 4) {
				bin = "1";
			}
			int index = 0;
			for (int i = 0; i < filelist.size(); i++) {
				String info = filelist.get(i);
				if(!info.startsWith("//") && !info.startsWith("\\") && info.startsWith("{group=")){
					index = i;
					break;
				}
			}
			for (int i = index; i < filelist.size(); i++) {
				String info = filelist.get(i);
				if ((info.startsWith("{group=") && i!=index)  || info.equals("")) {// 文件中有重复数据，只取上面的部分
					break;
				}
				if(info.trim().equals("")){
					break;
				}
				if(i==index){
					deviceGroup = info.substring(info.indexOf("=") + 1, info.indexOf(","));
					if (f == 0 && !bin.equals("1") && !deviceGroup.trim().equals("")) {
						bin = "1";
					}
					y = info.substring(info.indexOf(",y=") + 3, info.indexOf(",x"));
					x = info.substring(info.indexOf(",x=") + 3, info.indexOf(",p"));
					p = info.substring(info.indexOf(",p=") + 3, info.indexOf(",condition"));
					point = p.substring(p.indexOf("(") + 1, p.indexOf(")")).split(",");
					p = p.substring(0, p.indexOf("("));
					index = i;
				}
				if ( i>index){
					String str = filelist.get(i);
					if(str.contains(" \t")){
						str = str.replaceAll(" \t", " ");
					}
					if(str.contains("\t ")){
						str = str.replaceAll("\t ", " ");
					}
					str =str.replaceAll(" ", "\t");
					String[] rowdata = str.replaceAll("\t", ",").split(",");
//						System.out.println("i=="+i+"----"+Arrays.toString(rowdata));
					for (int j = 0; j < rowdata.length; j++) {
						if (j > 0) {
							
							String[] temp = new String[] { deviceGroup, dieNO + "", subdieName, deviceGroup,
									point[j - 1], rowdata[0], rowdata[j] };
							curvedataList.add(temp);
						}
					}
				}
			}
			String[] curveParameters_arr = new String[] { deviceGroup, dieNO + "", subdieName, deviceGroup, p, x,
					y };
			curveParametersList.add(curveParameters_arr);
			att = new String[]{subdieName,deviceGroup};
			subdieList.add(att);
		}
		boolean flag = false;
		for (int i = 0; i < dieTypeList.size(); i++) {
			if (dieTypeList.get(i).equals(dieType)) {
				flag = true;
				break;
			}
		}
		if (!flag) {
			dieTypeList.add(dieType);
		}
		Map<String, Object> dieMap = new HashMap<>();
		dieMap.put("DieType", dieType);
		dieMap.put("DieX", dieX);
		dieMap.put("DieY", dieY);
		dieMap.put("Bin", Integer.parseInt(bin));
		dieMap.put("dieNO", dieNO);
		result.put("dieMap", dieMap);
		result.put("curveParametersKey", dieX + "," + dieY + "," + dieType);
		result.put("curveParametersValue", curveParametersList);
		result.put("curvedataValue", curvedataList);
		result.put("subdieList", subdieList);
		result.put("dieTypeList", dieTypeList);
		result.put("status", status);
		return result;
	}

	/**
	 * 
	 * @param productCategory
	 * @param testOperator  用户输入的测试员
	 * @param description
	 * @param waferinfo
	 * @param DieXYAndBin
	 * @param curvedata
	 * @param curveParameters
	 * @param dieTypeList
	 * @param DataFormat
	 * @param fileName
	 * @param sessionId
	 * @param interval
	 * @return
	 */
	public String operateDatabase(String productCategory, String testOperator, String description,Map<String, Object> waferinfo,List<Map<String, Object>> dieXYAndBin,Map<String, Object> curvedata,Map<String, Object> curveParameters,List<String> dieTypeList,Map<String,Object> subdieMap,String fileName,String sessionId,int interval) {

		String status = "";
		String waferID = waferinfo.get("WaferID") == null ? "" : waferinfo.get("WaferID").toString();
		String lotID = waferinfo.get("LotID") == null ? "" : waferinfo.get("LotID").toString();
		String diameter = waferinfo.get("Diameter") == null ? "" : waferinfo.get("Diameter").toString();
		String flatLength = waferinfo.get("FlatLength") == null ? "" : waferinfo.get("FlatLength").toString();
		String dieSizeX = waferinfo.get("DieSizeX") == null ? "" : waferinfo.get("DieSizeX").toString();
		String dieSizeY = waferinfo.get("DieSizeY") == null ? "" : waferinfo.get("DieSizeY").toString();
		String directionX = waferinfo.get("DirectionX") == null ? "" : waferinfo.get("DirectionX").toString();
		String directionY = waferinfo.get("DirectionY") == null ? "" : waferinfo.get("DirectionY").toString();
		String setCoorX = waferinfo.get("SetCoorX") == null ? "" : waferinfo.get("SetCoorX").toString();
		String setCoorY = waferinfo.get("SetCoorY") == null ? "" : waferinfo.get("SetCoorY").toString();
		String setCoorDieX = waferinfo.get("SetCoorDieX") == null ? "" : waferinfo.get("SetCoorDieX").toString();
		String setCoorDieY = waferinfo.get("SetCoorDieY") == null ? "" : waferinfo.get("SetCoorDieY").toString();
		String standCoorDieX = waferinfo.get("StandCoorDieX") == null ? "" : waferinfo.get("StandCoorDieX").toString();
		String standCoorDieY = waferinfo.get("StandCoorDieY") == null ? "" : waferinfo.get("StandCoorDieY").toString();
		String testStarTime = waferinfo.get("TestStarTime") == null ? "" : waferinfo.get("TestStarTime").toString();
		String testStopTime = waferinfo.get("TestStopTime") == null ? "" : waferinfo.get("TestStopTime").toString();
		String operator = waferinfo.get("Operator") == null ? "" : waferinfo.get("Operator").toString();//文件中的测试员
		String yield = waferinfo.get("Yield") == null ? "" : waferinfo.get("Yield").toString();
		String deviceID = waferinfo.get("DeviceID") == null ? "" : waferinfo.get("DeviceID").toString();
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		WaferDO wafer = new WaferDO();
		wafer.setWaferNumber(waferID);
		wafer.setLotNumber(lotID);
		wafer.setDeviceNumber(deviceID);
		wafer.setDataFormat(1);
		wafer.setTestStartDate(testStarTime);
		wafer.setTestEndDate(testStopTime);
		wafer.setQualifiedRate(Double.parseDouble(yield));
		wafer.setTotalTestQuantity(0);
		wafer.setGmtCreate(df.format(new Date()));
		wafer.setGmtModified(df.format(new Date()));
		wafer.setDescription(description);
		wafer.setProductCategory(productCategory);
		wafer.setFileName(fileName);

		MapParameterDO mapDO = new MapParameterDO();
		mapDO.setWaferNumber(waferID);
		mapDO.setCuttingEdgeLength(Double.parseDouble(flatLength));
		mapDO.setDiameter(Double.parseDouble(diameter));
		mapDO.setDieXMax(Double.parseDouble(dieSizeX));
		mapDO.setDieYMax(Double.parseDouble(dieSizeY));
		mapDO.setDirectionX(directionX);
		mapDO.setDirectionY(directionY);
		mapDO.setSetCoorX(setCoorX);
		mapDO.setSetCoorY(setCoorY);
		mapDO.setSetCoorDieX(Integer.parseInt(setCoorDieX));
		mapDO.setSetCoorDieY(Integer.parseInt(setCoorDieY));
		mapDO.setStandCoorDieX(standCoorDieX);
		mapDO.setStandCoorDieY(standCoorDieY);
		
		Map<String,Object> map = new HashMap<>();
		Connection conn = null;
		try {
			conn = new DataBaseUtil().getConnection();
			conn.setAutoCommit(false);
		  	
			UserDao userDao = new UserDao();
			String Editor = userDao.getUserId(conn, operator);
			if(Editor.equals("lose")){
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
					Editor = userDao.getUserId(conn,operator);
				}else{
					conn.rollback();
					return status;
				}
			}
			if (testOperator.equals(operator)) {
				testOperator = Editor;
			} else {
				testOperator = userDao.getUserId(conn, testOperator);
			}
			wafer.setArchiveUser(Integer.parseInt(testOperator));
			wafer.setTestOperator(Integer.parseInt(operator));
			int waferId = 0;
			for (String dieType : dieTypeList) {
				wafer.setDieType(dieType);
				status = dao.insert(conn, wafer);
				if(!"success".equals(status)){
					conn.rollback();
					return status;
				}
				waferId = dao.getWaferID(conn, waferID, dieType);
				map.put(dieType, waferId);
			}
			// 晶圆Die数据
			status = this.insertWaferData(conn, waferID, mapDO,dieXYAndBin,map);
			if(!"success".equals(status)){
				conn.rollback();
				return status;
			}
			CurveDao curveDao = new CurveDao();
			status = saveSubdie(conn, map, subdieMap, curveDao);
			if(!"success".equals(status)){
				conn.rollback();
				return status;
			}
			status = addCurveParameter(conn, map, curveDao, curveParameters);
			if(!"success".equals(status)){
				conn.rollback();
				return status;
			}
			status = addCurveData(conn, curveDao, curvedata, map);
			if(!"success".equals(status)){
				conn.rollback();
				return status;
			}
			conn.commit();
			interval += 20;
		} catch (SQLException e) {
			e.printStackTrace();
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
		} catch (NumberFormatException e) {
			e.printStackTrace();
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
		} catch (Exception e) {
			e.printStackTrace();
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
		}

		return status;
	}

	public String insertWaferData(Connection conn, String waferID, MapParameterDO mapDO, List<Map<String, Object>> dieXYAndBin,Map<String,Object> dieTypeMap) {
		String status = "", dieType,dieX,dieY,dieno,diepos;
		List<Object[]> ls = new ArrayList<>();
		Object[] data = null;
		for (int i = 0; i < dieXYAndBin.size(); i++) {
			Map<String, Object> map = dieXYAndBin.get(i);
			 dieType = map.get("DieType").toString();
			 dieX = map.get("DieX").toString();
			 dieY = map.get("DieY").toString();
			int bin = (int) map.get("Bin");
			 dieno = map.get("Dieno").toString();
			int waferId = (int) dieTypeMap.get(dieType);
			 diepos = IndexChange.DiePositionTrans(Integer.parseInt(dieX), Integer.parseInt(dieY), mapDO.getDirectionX(),
					mapDO.getDirectionY(), mapDO.getSetCoorX(), mapDO.getSetCoorY(), mapDO.getSetCoorDieX(), mapDO.getSetCoorDieX(), mapDO.getStandCoorDieX(), mapDO.getStandCoorDieY());
			data = new Object[] { waferId,diepos,dieX, dieY, bin + "",  dieno, "0" };
			ls.add(data);
		}
		status = new CoordinateDao().insertPMSCoordinate(conn, ls);
		return status;
	}

	/**
	 * 判断解压后的文件夹中是否包含某类文件
	 * @param path
	 * @param suffix
	 * @return
	 */
	public static boolean isContains(String path, String suffix) {
		boolean flag = false;
		Flag = false;
		File root = new File(path);
		if(root.isFile()){
			return false;
		}
		File[] files = root.listFiles();
		for (File file : files) {
			if(file.isFile()){
				String temp = file.getName().substring(file.getName().lastIndexOf(".")+1);
				if (temp.equalsIgnoreCase(suffix)) {
					flag = true;
					break;
				}
			}else{
				if(isExist(file.getAbsolutePath(), suffix)){
					flag = true;
					break;
				}
			}
			
		}
		return flag;
	}
	
	public static boolean isExist(String path, String suffix){
		File root = new File(path);
		if(!Flag){
			if(root.isDirectory()){
				File[] files = root.listFiles();
				for (File file : files) {
					if (file.isDirectory()) {
						isExist(file.getAbsolutePath(), suffix);
					}
					String temp = file.getName().substring(file.getName().lastIndexOf(".")+1);
					if (temp.equalsIgnoreCase(suffix)) {
						Flag = true;
						break;
					}
				}
			}else{
				String temp = root.getName().substring(root.getName().lastIndexOf(".")+1);
				if (temp.equalsIgnoreCase(suffix)) {
					Flag = true;
				}
			}
		}
		
		return Flag;
	}

	public static void main(String[] args) {
		String path = "D:\\孟迪\\EDM项目\\需求\\1807\\180713\\测试文件\\20180709";
		System.out.println(isContains(path, "PMS"));
	}
	
	/**
	 * subdie存储
	 * @param conn
	 * @param map
	 * @param subdieMap
	 * @return
	 */
	public String saveSubdie(Connection conn,Map<String,Object> map,Map<String,Object> subdieMap,CurveDao curve){
		
		int waferId ,coordinateId,subdieId,curveTypeId;
		String dieX,dieY,dieType,subdieName,deviceGroup,status="";
		Object[] att = null;
		subdieIdMap = new HashMap<>();
		for(String key:subdieMap.keySet()){
			att = key.split(",");
			dieX = att[0].toString();
			dieY = att[1].toString();
			dieType = att[2].toString();
			waferId = Integer.parseInt(map.get(dieType).toString());
			coordinateId = coordinate.getCoordinateId(conn, waferId, dieX, dieY);
			subdieName = subdieMap.get(key).toString().split(",")[0];
			deviceGroup = subdieMap.get(key).toString().split(",")[1];
			att = new Object[]{coordinateId,0,subdieName};
			status = coordinate.insertSubdie(conn, att);
			if(!"success".equals(status)){
				break;
			}
			subdieId = coordinate.getSubdieId(conn, coordinateId, 0, subdieName);
			att = new Object[]{waferId,coordinateId,subdieId,deviceGroup,deviceGroup,"",0};
			status = curve.insertCurveType(conn, att);
			if(!"success".equals(status)){
				break;
			}
			curveTypeId = curve.getCurveTypeId(conn, subdieId, "");
			subdieIdMap.put(key, curveTypeId);
		}
		return status;
	}
	
	
	public String addCurveParameter(Connection conn, Map<String,Object> map, CurveDao curveDao,Map<String, Object> curveParameters) {

		int waferId = 0,curveTypeId=0;
		String dieType ;
		List<Object[]> ls = new ArrayList<>();
		List<String[]> curveParameterList = null;
		Object[] att = null;
		for (String key : curveParameters.keySet()) {
			dieType = key.split(",")[2];
			waferId = Integer.parseInt(map.get(dieType).toString());
			curveTypeId = Integer.parseInt(subdieIdMap.get(key).toString());
			curveParameterList = (List<String[]>) curveParameters.get(key);
			for (int i = 0; i < curveParameterList.size(); i++) {
				String[] arr = curveParameterList.get(i);
				String parameterName = "",parameterColumn = "";
				int length = arr[4] != "" ? 3 : 2;
				for (int j = 0; j < length; j++) {
					
					parameterColumn = "C" + (j + 1);
					if (j == 0) {
						parameterName = arr[4];
					}
					if (j == 1) {
						parameterName = arr[5];
					}
					if (j == 2) {
						parameterName = arr[6];
					}
					att = new Object[]{curveTypeId,parameterName, "",parameterColumn,waferId};
					ls.add(att);
				}

			}
		}
		System.out.println("多少条："+ls.size());
		return curveDao.insertCurveParameter(conn, ls);
	}

	public String addCurveData(Connection conn, CurveDao curveDao,Map<String, Object> curvedata,Map<String,Object> map) {
		int waferId = 0,curveTypeId;
		String dieType ;
		List<Object[]> ls = new ArrayList<>();
		Object[] att = null;
		for (String key : curvedata.keySet()) {
			dieType = key.split(",")[2];
			waferId = Integer.parseInt(map.get(dieType).toString());
			curveTypeId = Integer.parseInt(subdieIdMap.get(key).toString());
			List<String[]> curvedata_list = (List<String[]>) curvedata.get(key);
			for (int i = 0; i < curvedata_list.size(); i++) {
				String[] arr = curvedata_list.get(i);
//				String curveType = arr[0];
//				String dieno = arr[1];
//				String subdieNO = arr[2];
//				String group = arr[3];
				//本次博达微数据只会有三列：P轴、X轴、Y轴，分别对应C1、C2、C3
//				String[] data = new String[] { arr[4], arr[5], arr[6] };
				att = new Object[]{curveTypeId,  waferId,Double.parseDouble(arr[4]), Double.parseDouble(arr[5]), Double.parseDouble(arr[6])};
				ls.add(att);
			}

		}
		return curveDao.insertCurveData(conn, ls);
	}

	public int getWaferSerialID(Connection conn, String waferID, String dieType) {
		PreparedStatement psm = null;
		ResultSet rs = null;
		int WaferSerialID = 0;
		String WaferSerialIDsql = "(SELECT max(WaferSerialID) FROM waferinfo WHERE WaferID=? and DieType=?)";
		try {
			psm = conn.prepareStatement(WaferSerialIDsql);
			psm.setString(1, waferID);
			psm.setString(2, dieType);
			rs = psm.executeQuery();
			while (rs.next()) {
				WaferSerialID = rs.getInt(1);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return WaferSerialID;
	}

	// 插入waferdata
	public int insertWaferdata(Connection conn, String waferid, StringBuilder sb, String data[], String DieType,
			String TestTime, StringBuilder paramvalue, String diepos) throws Exception {
		PreparedStatement psm = null;
		ResultSet rs = null;
		int rows = 0;
		int WaferSerialID = 0;
		if (conn != null) {
			String WaferSerialIDsql = "(SELECT max(WaferSerialID) FROM waferinfo WHERE WaferID=? and DieType=?)";
			psm = conn.prepareStatement(WaferSerialIDsql);
			psm.setString(1, waferid);
			psm.setString(2, DieType);
			rs = psm.executeQuery();
			while (rs.next()) {
				WaferSerialID = rs.getInt(1);
			}
			// 结束
			String sql = "INSERT into Waferdata(WaferSerialID,DiePos,DieType,DieX,DieY,Bin,Dieno,SubdieNo,TestTime) "
					+ "values(?,?," + "?,?,?,?,?,?,?)";
			psm = conn.prepareStatement(sql);
			psm.setInt(1, WaferSerialID);
			psm.setString(2, diepos);
			psm.setString(3, DieType);
			psm.setInt(4, Integer.parseInt(data[0]));
			psm.setInt(5, Integer.parseInt(data[1]));
			psm.setInt(6, Integer.parseInt(data[2]));
			psm.setInt(7, Integer.parseInt(data[4]));
			psm.setInt(8, Integer.parseInt(data[5]));
			psm.setInt(9, Integer.parseInt(TestTime));
			rows = psm.executeUpdate();
		}
		return rows;
	}


	public static String get_charset(File file) {
		String charset = "GBK";
		byte[] first3Bytes = new byte[3];
		try {
			boolean checked = false;
			;
			BufferedInputStream bis = new BufferedInputStream(new FileInputStream(file));
			bis.mark(0);
			int read = bis.read(first3Bytes, 0, 3);
			if (read == -1)
				return charset;
			if (first3Bytes[0] == (byte) 0xFF && first3Bytes[1] == (byte) 0xFE) {
				charset = "UTF-16LE";
				checked = true;
			} else if (first3Bytes[0] == (byte) 0xFE && first3Bytes[1] == (byte) 0xFF) {
				charset = "UTF-16BE";
				checked = true;
			} else if (first3Bytes[0] == (byte) 0xEF && first3Bytes[1] == (byte) 0xBB
					&& first3Bytes[2] == (byte) 0xBF) {
				charset = "UTF-8";
				checked = true;
			}
			bis.reset();
			if (!checked) {
				// int len = 0;
				int loc = 0;

				while ((read = bis.read()) != -1) {
					loc++;
					if (read >= 0xF0)
						break;
					if (0x80 <= read && read <= 0xBF) // 单独出现BF以下的，也算是GBK
						break;
					if (0xC0 <= read && read <= 0xDF) {
						read = bis.read();
						if (0x80 <= read && read <= 0xBF) // 双字节 (0xC0 - 0xDF)
							// (0x80
							// - 0xBF),也可能在GB编码内
							continue;
						else
							break;
					} else if (0xE0 <= read && read <= 0xEF) {// 也有可能出错，但是几率较小
						read = bis.read();
						if (0x80 <= read && read <= 0xBF) {
							read = bis.read();
							if (0x80 <= read && read <= 0xBF) {
								charset = "UTF-8";
								break;
							} else
								break;
						} else
							break;
					}
				}

			}

			bis.close();
		} catch (Exception e) {
			e.printStackTrace();
		}

		return charset;
	}

}
