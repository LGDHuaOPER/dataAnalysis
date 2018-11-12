/**
 * 
 */
package com.eoulu.service;

import java.io.File;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;

import com.eoulu.dao.CoordinateDao;
import com.eoulu.dao.CurveDao;
import com.eoulu.dao.ParameterDao;
import com.eoulu.dao.SmithDao;
import com.eoulu.dao.WaferDao;
import com.eoulu.entity.MapParameterDO;
import com.eoulu.entity.WaferDO;
import com.eoulu.parser.ZipFileParser;
import com.eoulu.transfer.IndexChange;

/**
 * @author mengdi
 *
 * 
 */
public class ZipService {
	
	private WaferDao dao ;
	private ParameterDao parameterDao;
	private ZipFileParser util ;
	private CoordinateDao coordinate;
	private CurveDao curveDao = new CurveDao();
	private List<Object[]> subdie = null; // die编号+subdie编号
	private Hashtable<String, Object[]> table = null;// key:die编号+subdie编号，value：waferId+coordinateId
	public ZipService(WaferDao dao,ParameterDao parameterDao,ZipFileParser util,CoordinateDao coordinate){
		this.dao = dao;
		this.parameterDao = parameterDao;
		this.util = util;
		this.coordinate = coordinate;
	}
	
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
			Map<String, List<Object[]>> parameterList,String tester,String totalTestTime ) {
		int waferFlag = 0;
		String status = null;
		for (String dieType:parameterList.keySet()) {
			waferFlag = dao.queryWaferinfo(wafer.getWaferNumber(), wafer.getLotNumber(), wafer.getDeviceNumber(), dieType);
			if(waferFlag != 0){
				dao.remove(waferFlag+"", 2);
				
			}
			wafer.setDieType(dieType);
			status = dao.insert(conn, wafer);
			if (!"success".equals(status)) {
				break;
			}
			int waferId = dao.getWaferID(conn, wafer.getWaferNumber(), dieType);
			List<Object[]> list = parameterList.get(dieType);
			status = parameterDao.insertParameter(conn, list, waferId);
			if (!"success".equals(status)) {
				break;
			}
			
			
		}
		return status;
	}

	/**
	 * 存储Die坐标数据
	 * @param conn
	 * @param filelist
	 * @param datanum
	 * @param dietypeName
	 * @param mapparameters
	 * @param waferNumber
	 * @param invalidationList 无效die
	 * @return
	 */
	public String saveCoordinateData(Connection conn, List<String> filelist, int datanum,
			Map<Integer, Object> dietypeName, List<String> mapparameters, String waferNumber,List<String> invalidationList) {
		for(String str:invalidationList){
			filelist.add(str);
		}
		String status = null;
		String diepos;// 字母坐标
		String TestTime;
		String dieType;
		String temp = ""; // 临时变量，用于比较dieType
		int paramLength = 0;
		int waferId = 0;
		int index = 0; // die编号
		String column = "";
		String columnStr = "";
		Object[] obj = null;
		List<Map<String, Double>> upperAndLowerLimit = null;// 参数上下限
		List<Object[]> list = new ArrayList<>();
		if (subdie != null) {
			subdie = null;
		}
		subdie = new ArrayList<>();
		Object[] subdieInfo = null;
		try {
			for (int m = datanum; m < filelist.size(); m++) {
				index++;
				String data[] = filelist.get(m).split(",");
				if (m == datanum) {
					paramLength = data.length;
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
					waferId = dao.getWaferID(conn, waferNumber, dieType);
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
				diepos = IndexChange.DiePositionTrans(Integer.parseInt(data[0]), Integer.parseInt(data[1]),
						mapparameters.get(0), mapparameters.get(1), mapparameters.get(2), mapparameters.get(3),
						Integer.parseInt(mapparameters.get(4)), Integer.parseInt(mapparameters.get(5)),
						mapparameters.get(6), mapparameters.get(7));
				obj[0] = waferId;
				obj[1] = diepos;
				obj[2] = data[0];
				obj[3] = data[1];
				obj[4] = index;
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
				
				obj[5] = str.contains("false") ? "255" : "1";
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
		System.out.println("waferId:"+waferId);
		status = coordinate.insertCoordinate(conn, list, column, columnStr);

		return status;
	}

	/**
	 * subdie存储
	 * 
	 * @param conn
	 * @param waferNumber
	 * @return
	 */
	public String saveSubdie(Connection conn, String waferNumber) {
		Object[] subdieInfo = null;
		Map<String, Object> map = null;
		int waferId = 0;
		int coordinateId = 0;
		String dieNO = "";
		String subdieNO = "";
		List<Object[]> list = new ArrayList<>();
		if (table != null) {
			table = null;
		}
		table = new Hashtable<>();
		System.out.println("subdie.size():"+Arrays.toString(subdie.get(0)));
		for (int i = 0, size = subdie.size(); i < size; i++) {
			subdieInfo = subdie.get(i);
			dieNO = subdieInfo[0].toString();
			subdieNO = subdieInfo[1].toString();
			waferId = Integer.parseInt(subdieInfo[4].toString());
			map = coordinate.getCoordinate(conn, waferId, dieNO);
			coordinateId = Integer.parseInt(map.get("coordinate_id").toString());
			subdieInfo = new Object[] { coordinateId, Integer.parseInt(subdieNO), "" ,waferId};
			list.add(subdieInfo);
			subdieInfo = new Object[] { waferId, coordinateId };
			table.put(dieNO + "," + subdieNO, subdieInfo);
		}
		return coordinate.insertSubdie(conn, list);
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

	public String insertCurve(Connection conn, String file) {
		System.out.println("读到了么：" + file);
		long time0 = System.currentTimeMillis();
		// 曲线文件夹名字与CSV文件名字相同
		file = file.substring(0, file.lastIndexOf("."));
		File file1 = new File(file);
		String status = null;
		// 各曲线文件夹
		File[] files = file1.listFiles();
		if (files != null) {
			int subdieId = 0;// subdie主键
			int waferId = 0;
			int coordinateId = 0;
			String dieNO = "";
			String subdieNO = "";
			String group = "";
			Object[] tempObj = null;
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
					if (fileName.length < 3) {
						System.out.println("curveType:"+curveType+"----"+name);
						status = "曲线数据文件名格式有误！";
						break;
					}
					dieNO = fileName[0];
					subdieNO = fileName[1];
					group = fileName[2];
					tempObj = table.get(dieNO + "," + subdieNO);
					waferId = Integer.parseInt(tempObj[0].toString());
					coordinateId = Integer.parseInt(tempObj[1].toString());
					subdieId = coordinate.getSubdieId(conn, coordinateId, Integer.parseInt(subdieNO),"");
					List<String> list = util.getFile(curve.getAbsolutePath());
					if(list.size()<66){
						System.out.println(curveType+":"+name);
						System.out.println(list.size());
					}
					if (".S2P".equalsIgnoreCase(su)) {
						status = saveCurveType(conn, waferId, coordinateId, subdieId, curveType, group, name, 1);
						if (!"success".equals(status)) {
							break;
						}
						status = saveSmith(conn, waferId, subdieId, name, list);
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
	public String saveSmith(Connection conn, int waferId, int subdieId, String name, List<String> list) {
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
		return new SmithDao().insertSmithData(conn, smithList);
	}

	
}
