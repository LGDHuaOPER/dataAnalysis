/**
 * 
 */
package com.eoulu.service;

import java.io.File;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;

import com.eoulu.dao.CoordinateDao;
import com.eoulu.dao.CurveDao;
import com.eoulu.dao.ParameterDao;
import com.eoulu.dao.SmithDao;
import com.eoulu.dao.SubdieDao;
import com.eoulu.dao.WaferDao;
import com.eoulu.entity.MapParameterDO;
import com.eoulu.entity.WaferDO;
import com.eoulu.parser.ZipFileParser;
import com.eoulu.transfer.IndexChange;
import com.eoulu.transfer.ObjectTable;
import com.eoulu.util.DataBaseUtil;
import com.google.gson.Gson;

/**
 * @author mengdi
 *
 * 
 */
public class ZipService {
	
	private List<Object[]> subdie = new ArrayList<>(); // die编号+subdie编号
	// key:die编号+subdie编号，value：waferId+coordinateId ;
	private Hashtable<String, Object[]> table = new Hashtable<>();
	
	/**
	 * 晶圆表与参数表的添加
	 * 根据批次号、设备号、晶圆编号、器件类型判断是否重复
	 * 若部分器件类型重复，则只存储不重复的器件类型对应数据
	 * @param conn
	 * @param dieTypeList
	 * @param wafer
	 * @param parameterList
	 * @return
	 */
	public String saveWaferInfo(Connection conn,  WaferDO wafer,
			Map<String, List<Object[]>> parameterList,String tester,WaferDao dao ,ParameterDao parameterDao,SubdieDao subdieDao) {
		int waferFlag = 0;
		String status = null;
		for (String dieType:parameterList.keySet()) {
			waferFlag = dao.queryWaferinfo(conn,wafer.getWaferNumber(), wafer.getLotNumber(), wafer.getDeviceNumber(), dieType);
			if(waferFlag != 0){
				dao.remove(conn,waferFlag, 2);
			}
			wafer.setDieType(dieType);
			status = dao.insert(conn, wafer);
			if (!"success".equals(status)) {
				status = "晶圆信息存储失败！";
				break;
			}
			int waferId = dao.getWaferID(conn, wafer.getWaferNumber(), dieType);
			List<Object[]> list = parameterList.get(dieType);
			status = parameterDao.insertParameter(conn, list, waferId);
			if (!"success".equals(status)) {
				status = "晶圆参数存储失败！";
				break;
			}
			
			
		}
		return status;
	}

	/**
	 * 晶圆的map参数存储
	 * @param conn
	 * @param mapParamDO
	 * @param parameterDao
	 * @return
	 */
	public String saveMapParameter(Connection conn,MapParameterDO mapParamDO,ParameterDao parameterDao){
		String status = "success";
		if(parameterDao.getMapParameter(conn, mapParamDO.getWaferNumber(),mapParamDO.getDeviceNO(),mapParamDO.getLotNO())){
			status = parameterDao.updateMapParameter(conn, mapParamDO);
		}else{
			status = parameterDao.insertMapParameter(conn, mapParamDO);
		}
		return status;
	}
	
	/**
	 * 存储Die坐标数据
	 * @param conn
	 * @param filelist
	 * @param datanum
	 * @param dietypeName
	 * @param convertParam
	 * @param waferNumber
	 * @param dieMap
	 * @param subdieExist
	 * @param coordinate
	 * @param dao
	 * @param parameterDao
	 * @return
	 */
	public String saveCoordinateData(Connection conn, Map<String,Object> transfer,CoordinateDao coordinate,WaferDao dao,ParameterDao parameterDao) {
		List<String> dieList = (List<String>) transfer.get("dieList"),convertParam = (List<String>) transfer.get("convertParam"); 
		Map<Integer, Object> dietypeName = (Map<Integer, Object>) transfer.get("dietypeName"); 
		Map<String,Object> dieMap = (Map<String, Object>) transfer.get("dieMap");
		boolean subdieExist = (boolean) transfer.get("subdieExist");
		int datanum = Integer.parseInt(transfer.get("datanum").toString());
		List<String> invalidationList = (List<String>) dieMap.get("invalidation");
		Map<String,String> validList = (Map<String, String>) dieMap.get("validation");
//		System.out.println(invalidationList.size()+"===validList"+validList.size());
		if(subdieExist){
			dieList = new ArrayList<>();
			datanum = 0;
		}
		String key = "",value = "";
		String attCsv[] = null,attMap[] = null;
		for(int m = datanum;m < dieList.size();m++){
			attCsv = dieList.get(m).split(",");
			key = attCsv[0]+","+attCsv[1];
			if(validList.containsKey(key)){
				value = validList.get(key);
				attMap = value.split(",");
				if("-1".equals(attCsv[2])){
					attCsv[2] = attMap[2];
					dieList.set(m, String.join(",", attCsv));
				}
				validList.remove(key);
			}
			
		}
		for(String diexy:validList.keySet()){
			value = validList.get(diexy);
			dieList.add(value);
		}
//		System.out.println("value:"+value);
		for(String str:invalidationList){
			dieList.add(str);
		}
		String status = null, diepos="", TestTime,dieType,temp = "",waferNO = transfer.get("waferNO").toString(),device = transfer.get("device").toString(),lot = transfer.get("lot").toString(); 
		int paramLength = 0 , waferId = 0;
		String column = "", columnStr = "";
		Object[] obj = null;
		List<Map<String, Double>> upperAndLowerLimit = null;
		List<Object[]> list = new ArrayList<>();
		Object[] subdieInfo = null;
		if(subdie !=null){
			subdie = null;
		}
		subdie = new ArrayList<>();
		boolean convertFlag = convertParam.size()>0?true:false;//map文件中存在字母/数字坐标转换的数据时才进行转换
		System.out.println("dieList:"+dieList.size()+"datanum="+datanum);
		try {
			for (int m = datanum; m < dieList.size(); m++) {
				String data[] = dieList.get(m).split(",");//x,y,bin,dieType,dieNO,subdieNo,testTime
				if (m == datanum) {
					paramLength = data.length;
					for (int j = 7; j < data.length; j++) {
					column += ",C" + (j - 6);
					columnStr += ",?";
					}
					
				}
//				System.out.println("data:"+Arrays.toString(data));
				obj = new Object[paramLength];
				if (data.length == 0)
					continue;
				if ("".equals(data[3])) {
					status = "上传失败，文件中的DieType存在空值！";
					conn.rollback();
					return status;
				} else if (!dietypeName.containsKey(Integer.parseInt(data[3]))) {
					dieType = "DefaultType";
				} else {
					dieType = (String) dietypeName.get(Integer.parseInt(data[3]));
				}
				if (!temp.equals(dieType)) {
					waferId = dao.getWaferID(conn, waferNO, dieType,device,lot);
					upperAndLowerLimit = parameterDao.getUpperAndLowerLimit(waferId, conn);
					temp = dieType;
				}

				if ("".equals(data[0])) {
					status = "上传失败，文件中的DieX存在空值！";
					conn.rollback();
					return status;
				}
				if ("".equals(data[1])) {
					status = "上传失败，文件中的DieY存在空值！";
					conn.rollback();
					return status;
				}
				if ("".equals(data[2])) {
					status = "上传失败，文件中的Bin值存在空值！";
					conn.rollback();
					return status;
				}
				// 设置默认值
				if ("".equals(data[4])) {
					data[4] = "0";
				}
				if ("".equals(data[5])) {
					data[5] = "0";
				}
				if (6 >= data.length || "".equals(data[6])) {
					TestTime = "0";
				} else {
					TestTime = data[6];
				}
				if(convertFlag){
					diepos = IndexChange.DiePositionTrans(Integer.parseInt(data[0]), Integer.parseInt(data[1]),
							convertParam.get(0), convertParam.get(1), convertParam.get(2), convertParam.get(3),
							Integer.parseInt(convertParam.get(4)), Integer.parseInt(convertParam.get(5)),
							convertParam.get(6), convertParam.get(7));	
				}
				
				obj[0] = waferId;
				obj[1] = diepos;
				obj[2] = data[0];
				obj[3] = data[1];
				obj[4] = data[4];
				obj[6] = TestTime;
				boolean bin = true;
				String str = "";
				for (int j = 7; j < data.length; j++) {
					obj[j] = data[j];
					bin = bin && (data[j] == null || "null".equals(data[j]) || "".equals(data[j])
							|| (Double.parseDouble(data[j]) >= upperAndLowerLimit.get(j - 7).get("lower")
									&& Double.parseDouble(data[j]) <= upperAndLowerLimit.get(j - 7).get("upper")));
					str += "," + bin;
				}
				if(data.length == 7){
					obj[5] = data[2];
				}else{
					obj[5] = str.contains("false") ? "255" : "1";
				}
				
				if (Integer.parseInt(data[4]) == -1) {
					obj[5] = "-1";
				}else{
					subdieInfo = new Object[] { data[4], data[5], data[0],data[1],waferId};
					subdie.add(subdieInfo);
				}
				list.add(obj);
				

			} // 循环遍历数据信息行
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		status = coordinate.insertCoordinate(conn, list, column, columnStr);
		
		return status;
	}
	

	/**
	 * subdie存储,非测试数据
	 * transfer
	 * @param conn
	 * @param waferNumber
	 * @return
	 */
	public String saveSubdie(Connection conn,Map<String,Object> transfer,CoordinateDao coordinate,WaferDao dao,ParameterDao parameterDao,SubdieDao subdieDao) {
		Object[] subdieInfo = null;
		String[] att = null;
		int waferId =0 , coordinateId;
		String dieNO = "", subdieNO = "",status = "",waferNO = transfer.get("waferNO").toString(),device = transfer.get("device").toString(),lot = transfer.get("lot").toString(); 
		List<Object[]> list = new ArrayList<>();
		boolean subdieExist = (boolean) transfer.get("subdieExist");
		if(subdieExist){
			List<String> filelist = (List<String>) transfer.get("filelist"),
					convertParam = (List<String>) transfer.get("convertParam"),
							configList = (List<String>) transfer.get("configList");
			for(int i=0,size=configList.size();i<size;i++){
				att = configList.get(i).split(",");
				subdieInfo = new Object[]{Integer.parseInt(att[0])+1,att[1],att[2],att[3],att[4],waferNO,device,lot};
				list.add(subdieInfo);
			}
			subdieDao.deleteSubdieConfig(conn, waferNO, device, lot);
			status = subdieDao.insertSubdieConfig(conn, list);
			
			if(!"success".equals(status)){
				return status;
			}
			list = new ArrayList<>();
			 
			Map<Integer, Object> dietypeName = (Map<Integer, Object>) transfer.get("dietypeName"); 
			Map<String,Object> subdieMap = (Map<String, Object>) transfer.get("subdieMap");
			int datanum = Integer.parseInt(transfer.get("datanum").toString());
			List<String> subdieList = (List<String>) subdieMap.get("subdieList");
			Map<String,String> map = (Map<String, String>) subdieMap.get("subdieMap");
			
			String key = "",value = "";
			String attCsv[] = null,attMap[] = null;
			for(int m = datanum;m < filelist.size();m++){
				attCsv = filelist.get(m).split(",");
				key = attCsv[0]+","+attCsv[1];
				if(map.containsKey(key)){
					value = map.get(key);
					attMap = value.split(",");
					if("-1".equals(attCsv[2])){
						attCsv[2] = attMap[2];
						filelist.set(m, String.join(",", attCsv));
					}
					map.remove(key);
				}
				
			}
		
			for(String diexy:map.keySet()){
				value = map.get(diexy);
				filelist.add(value);
			}
			for(String str:subdieList){
				filelist.add(str);
			}
			
			String  diepos="", TestTime,dieType,temp = "";  
			int paramLength = 0 ;
			String column = "", columnStr = "";
			Object[] obj = null;
			List<Map<String, Double>> upperAndLowerLimit = null;
			if(table != null){
				table = null;
			}
			table = new Hashtable<>();
			boolean convertFlag = convertParam.size()>0?true:false;//map文件中存在字母/数字坐标转换的数据时才进行转换

			try {
				for (int m = datanum; m < filelist.size(); m++) {
					String data[] = filelist.get(m).split(",");//x,y,bin,dieType,dieNO,subdieNo,testTime
					if (m == datanum) {
						paramLength = data.length+1;
						for (int j = 7; j < data.length; j++) {
						column += ",C" + (j - 6);
						columnStr += ",?";
						}
						
					}
					obj = new Object[paramLength];
					if (data.length == 0)
						continue;
					if ("".equals(data[3])) {
						status = "上传失败，文件中的DieType存在空值！";
						conn.rollback();
						return status;
					} else if (!dietypeName.containsKey(Integer.parseInt(data[3]))) {
						dieType = "DefaultType";
						
					} else {
						dieType = (String) dietypeName.get(Integer.parseInt(data[3]));
					}
					if (!temp.equals(dieType)) {
						waferId = dao.getWaferID(conn, waferNO, dieType,device,lot);
						upperAndLowerLimit = parameterDao.getUpperAndLowerLimit(waferId, conn);
						temp = dieType;
					}

					if ("".equals(data[0])) {
						status = "上传失败，文件中的DieX存在空值！";
						conn.rollback();
						return status;
					}
					if ("".equals(data[1])) {
						status = "上传失败，文件中的DieY存在空值！";
						conn.rollback();
						return status;
					}
					if ("".equals(data[2])) {
						status = "上传失败，文件中的Bin值存在空值！";
						conn.rollback();
						return status;
					}
					// 设置默认值
					if ("".equals(data[4])) {
						data[4] = "0";
					}
					if ("".equals(data[5])) {
						data[5] = "0";
					}
					if (6 >= data.length || "".equals(data[6])) {
						TestTime = "0";
					} else {
						TestTime = data[6];
					}
					if(convertFlag){
						diepos = IndexChange.DiePositionTrans(Integer.parseInt(data[0]), Integer.parseInt(data[1]),
								convertParam.get(0), convertParam.get(1), convertParam.get(2), convertParam.get(3),
								Integer.parseInt(convertParam.get(4)), Integer.parseInt(convertParam.get(5)),
								convertParam.get(6), convertParam.get(7));	
					}
					obj[0] = waferId;
					obj[1] = diepos;
					obj[2] = data[0];
					obj[3] = data[1];
					obj[4] = data[5];
					obj[6] = TestTime;
					boolean bin = true;
					String str = "";
					
					if(!"-1".equals(data[4])){
						obj[5] = data[2];
						for (int j = 7; j < data.length; j++) {
							if(data[j] == null || "null".equals(data[j])){
								continue;
							}
							obj[j+1] = data[j];
							bin = bin && (data[j] == null || "null".equals(data[j]) || "".equals(data[j])
									|| (Double.parseDouble(data[j]) >= upperAndLowerLimit.get(j - 7).get("lower")
											&& Double.parseDouble(data[j]) <= upperAndLowerLimit.get(j - 7).get("upper")));
							str += "," + bin;
						}
						if(!"".equals(str)){
							obj[5] = str.contains("false") ? "255" : "1";
						}
						obj[7] = coordinate.getCoordinate(conn,waferNO, data[4],device,lot);
						table.put(data[4] + "," + obj[4], new Object[]{waferId,obj[7]});
					}else{
						obj[5] = "-1";
						obj[7] = coordinate.getCoordinateId(conn, waferNO, data[7], data[8],device,lot);
					}
					
					list.add(obj);
					

				} // 循环遍历数据信息行
			} catch (SQLException e) {
				e.printStackTrace();
			}
			status = subdieDao.insertSubdie(conn, list, column, columnStr);
		}else{
			
			table = new Hashtable<>();
			for (int i = 0, size = subdie.size(); i < size; i++) {
				subdieInfo = subdie.get(i);
				dieNO = subdieInfo[0].toString();
				subdieNO = subdieInfo[1].toString();
				waferId = Integer.parseInt(subdieInfo[4].toString());
				coordinateId = coordinate.getCoordinate(conn, waferId, dieNO);
				subdieInfo = new Object[] { coordinateId, Integer.parseInt(subdieNO),waferId};
				list.add(subdieInfo);
				subdieInfo = new Object[] { waferId, coordinateId };
				table.put(dieNO + "," + subdieNO, subdieInfo);
			}
			status = coordinate.insertSubdie(conn, list);
		}
		
		return status;
	}
	

	private static List<String> suffix = null;
	static {
		suffix = new ArrayList<>();
		suffix.add(".csv");
		suffix.add(".CSV");
		suffix.add(".pms");
		suffix.add(".PMS");
		suffix.add(".S2P");
		suffix.add(".s2p");
		suffix.add(".xlsx");
	}

	/**
	 * 此处用于曲线数据添加，需改
	 * 
	 * @param conn
	 * @param file
	 * @param WaferID
	 * @return
	 */

	public String insertCurve(Connection conn, String file,DataBaseUtil db) {
		ZipFileParser util = (ZipFileParser) ObjectTable.getObject("ZipFileParser");
		CoordinateDao coordinate =  (CoordinateDao) ObjectTable.getObject("CoordinateDao");
//		System.out.println("读到了么：" + file);
		long time0 = System.currentTimeMillis();
		// 曲线文件夹名字与CSV文件名字相同
		file = file.substring(0, file.lastIndexOf("."));
		File file1 = new File(file);
		String status = "success";
		// 各曲线文件夹
		File[] files = file1.listFiles();
		if (files != null) {
			int subdieId = 0;// subdie主键
			int waferId = 0;
			int coordinateId = 0;
			String dieNO = "";
			String subdieNO = "";
			String group = "";
			Object[] tempObj = null,subdieInfo=null;
			for (File temp : files) {
				String curveType = temp.getName();
				File[] curvefile = temp.listFiles();
				// 曲线文件
				for (File curve : curvefile) {
					String name = curve.getName().trim();
					String su = name.substring(name.indexOf("."));
					if (!suffix.contains(su)) {
						break;
					}
					String[] fileName = null;
					if (!name.contains("_")) {
						fileName = name.substring(0, curve.getName().indexOf(".")).split("-");
					} else {
						fileName = name.substring(0, curve.getName().indexOf(".")).split("_");
					}
					if (fileName.length < 3 || fileName[0].contains("_") || fileName[0].contains("-") || fileName[1].contains("_") || fileName[1].contains("-")) {
//						System.out.println("curveType:"+curveType+"----"+name);
						status = curveType+"文件夹下的"+name+"文件名格式有误！";
						return status;
					}
					dieNO = fileName[0];
					subdieNO = fileName[1];
					group = fileName[2];
					tempObj = table.get(dieNO + "," + subdieNO);
					if(tempObj == null){
						tempObj = table.get(dieNO + ",0" );
						subdieInfo = new Object[] { tempObj[1], Integer.parseInt(subdieNO), tempObj[0]};
						coordinate.saveSubdie(conn, subdieInfo);
						table.put(dieNO + "," + subdieNO, tempObj);
					}
					waferId = Integer.parseInt(tempObj[0].toString());
					coordinateId = Integer.parseInt(tempObj[1].toString());
					subdieId = coordinate.getSubdieId(conn, coordinateId, Integer.parseInt(subdieNO),waferId);
					List<String> list = util.getFile(curve.getAbsolutePath());
					if (".S2P".equalsIgnoreCase(su)) {
						status = saveCurveType(conn, waferId, coordinateId, subdieId, curveType, group, name, 1);
						if (!"success".equals(status)) {
							break;
						}
						status = saveSmith(conn, waferId, subdieId, name, list,db);
						if (!"success".equals(status)) {
							break;
						}
					} else {
						status = saveCurveType(conn, waferId, coordinateId, subdieId, curveType, group, name, 0);
						if (!"success".equals(status)) {
							break;
						}
						status = saveCurve(conn, waferId, subdieId, name, list);
						if (!"success".equals(status)) {
							break;
						}
					}
				}
			}
		}
		long time2 = System.currentTimeMillis();
		System.out.println("曲线数据：" + (time2 - time0));
		return status;
	}
	
	public static void main(String[] args) {
//		String name = "1-0_Voltate_CPD.CSV";
//		String[] fileName = null;
//		if (!name.contains("_") || (name.indexOf("-")<name.indexOf("_"))) {
//			fileName = name.substring(0,name.indexOf(".")).split("-");
//		} else {
//			fileName = name.substring(0,name.indexOf(".")).split("_");
//		}
//		System.out.println(Arrays.toString(fileName));
		Map<String,String> map = new HashMap<>();
		map.put("13", "qwe");
		map.put("12", "12");
		if(map.containsKey("2")){
			map.remove("12");
			
		}
		System.out.println(map);
		
		List<String> ls = new ArrayList<>();
		ls.add("12");
		ls.add("wer");
		for(int i=0,size=ls.size();i<size;i++){
			
		}
		ls.set(1, "agshflk");
		System.out.println(ls);
		
		String att[] = new String[]{"12","asd","78"};
		att[2] = "vb";
		System.out.println(Arrays.toString(att));
		System.out.println(String.join(",", att));
		
	}

	/**
	 * 曲线类型存储
	 * 
	 * @param conn
	 * @param datas
	 * @param waferId
	 * @param coordinateId
	 * @param subdieId
	 * @param curveType
	 * @param deviceGroup
	 * @param name
	 * @return
	 */
	public String saveCurveType(Connection conn, int waferId, int coordinateId, int subdieId, String curveType,
			String deviceGroup, String name, int fileType) {
		CurveDao curveDao = (CurveDao) ObjectTable.getObject("CurveDao");
		String flag = "success";
		Object[] param = new Object[] { waferId, coordinateId, subdieId, curveType, deviceGroup, name, fileType };
		flag = curveDao.insertCurveType(conn, param);
		if (!"success".equals(flag)) {
			return flag;
		}
		return flag;
	}

	/**
	 * 曲线参数与数据存储
	 * 
	 * @param conn
	 * @param waferId
	 * @param subdieId
	 * @param name
	 * @param list
	 * @return
	 */
	public String saveCurve(Connection conn, int waferId, int subdieId, String name, List<String> list) {
		String flag = "success";
		CurveDao curveDao = (CurveDao) ObjectTable.getObject("CurveDao");
		int curveTypeId = curveDao.getCurveTypeId(conn, subdieId, name);
		String[] datas = null;
		Object[] temp = null;
		if (list.size() > 1) {
			datas = list.get(0).split(",");
			for (int i = 0; i < datas.length; i++) {
				String parameterColumn = "C" + (i + 1);
				String parameterName = datas[i].contains("(") ? datas[i].substring(0, datas[i].indexOf("(")) : datas[i];
				String parameterUnit = (datas[i].contains("(") && datas[i].contains(")"))
						? datas[i].substring(datas[i].indexOf("(") + 1, datas[i].indexOf(")")) : "";
				temp = new Object[] { curveTypeId, parameterName, parameterUnit, parameterColumn, waferId };
				flag = curveDao.insertCurveParameter(conn, temp);
				if (!"success".equals(flag)) {
					break;
				}
			}
		}
		String condition = "";
		String condition2 = "";
		for (int j = 1; j <= datas.length; j++) {
			condition += ",C" + j;
			condition2 += ",?";
		}
		List<Object[]> ls = new ArrayList<>();
		for (int i = 1; i < list.size(); i++) {
			datas = list.get(i).replaceAll("\\s*", "").split(",");
			temp = new Object[datas.length + 2];
			temp[0] = curveTypeId;
			temp[1] = waferId;
			for (int j = 0, length = datas.length; j < length; j++) {
				temp[2 + j] = datas[j];
			}
			ls.add(temp);
		}
		flag = curveDao.insertCurveData(conn, ls, condition, condition2);
		return flag;
	}

	/**
	 * smith数据存储
	 * 
	 * @param conn
	 * @param waferId
	 * @param subdieId
	 * @param name
	 * @param list
	 * @return
	 */
	public String saveSmith(Connection conn, int waferId, int subdieId, String name, List<String> list,DataBaseUtil db) {
		CurveDao curveDao = (CurveDao) ObjectTable.getObject("CurveDao");
		int curveTypeId = curveDao.getCurveTypeId(conn, subdieId, name);
		int index = 0;
		List<Object[]> smithList = new ArrayList<>();
		Object[] tempObj = null;
		String[] datas = null;
		for (int i = 0; i < list.size(); i++) {
			String tempStr = list.get(i).trim();
			if (i > 0 && list.get(i).startsWith("#")) {
				index = i;
				continue;
			}
			if (index > 0 && i > index && !tempStr.equals("")) {
				datas = tempStr.replaceAll("\t", " ").split(" ");
				tempObj = new Object[datas.length + 2];
				tempObj[0] = curveTypeId;
				tempObj[1] = waferId;
				for (int j = 0, length = datas.length; j < length; j++) {
					tempObj[2 + j] = datas[j];
				}
				smithList.add(tempObj);
			}
		}
		return new SmithDao().insertSmithData(conn, smithList,db);
	}

	
}
