/**
 * 
 */
package com.eoulu.service.impl;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.eoulu.dao.CoordinateDao;
import com.eoulu.dao.CurveDao;
import com.eoulu.dao.ParameterDao;
import com.eoulu.dao.SmithDao;
import com.eoulu.dao.SubdieDao;
import com.eoulu.dao.WaferDao;
import com.eoulu.service.AnalysisService;
import com.eoulu.service.WaferMapService;
import com.eoulu.transfer.ObjectTable;
import com.eoulu.transfer.SubdieDO;
import com.eoulu.transfer.WaferMapDTO;
import com.eoulu.util.DataBaseUtil;
import com.google.gson.Gson;


/**
 * @author mengdi
 *
 * 
 */
public class WaferMapServiceImpl implements WaferMapService {

	


	@Override
	public Map<String, Object> getMapInfo( String[] waferAtt, List<String> paramList,
			Map<String,List<Double>> rangeList) {
		WaferDao dao = (WaferDao) ObjectTable.getObject("WaferDao");
		SubdieDao subdieDao = (SubdieDao) ObjectTable.getObject("SubdieDao");
		ParameterDao parameterDao = (ParameterDao) ObjectTable.getObject("ParameterDao");
		CoordinateDao coordinate = (CoordinateDao) ObjectTable.getObject("CoordinateDao");
		Map<String, Object> result = new LinkedHashMap<>(), map = null;
		List<WaferMapDTO> waferList = null;
		List<SubdieDO> waferSubdie = null;
		List<String> lsStr = null;
		int waferId = 0;
		double upper=0,lower=0;
		String column = "",waferNO="",str = "";
		boolean flag = false;
		Connection conn = new DataBaseUtil().getConnection();
		for (int i = 0, length = waferAtt.length; i < length; i++) {
			waferId = Integer.parseInt(waferAtt[i]);
			Map<String,Object> condition = dao.getCondition(conn, waferId);
			 waferNO = condition.get("wafer_number")==null?"":condition.get("wafer_number").toString();
			String device = condition.get("device_number")==null?"":condition.get("device_number").toString();
			String lot = condition.get("lot_number")==null?"":condition.get("lot_number").toString();
			flag = subdieDao.getSubdieExist(conn,waferId);
			map = getMapParameter(conn, waferNO,flag,device,lot);
			str = "";
			if(flag){
				lsStr = subdieDao.getSubdieNO(conn, waferNO, device, lot);
				if(lsStr != null){
					for(int k=0,size=lsStr.size();k<size;k++){
						str += ","+lsStr.get(k);
					}
					str = str.substring(1);
				}
				map.put("waferDie", coordinate.getAllDie(conn, waferNO,device,lot));
				map.put("subdieConfig", subdieDao.getSubdieConfig(conn, waferNO,str));
				map.put("otherSubdieType",subdieDao.getOtherSubdie(conn, waferId, waferNO,device,lot));
				waferSubdie = new ArrayList<SubdieDO>();
				waferSubdie.add(subdieDao.getTotalYield(conn, waferId));
				for (String param : paramList) {
					List<Double> ls = rangeList.get(param);
					upper = ls.get(1);
					lower = ls.get(0);
					column = parameterDao.getColumnByName(conn, param, waferId);
					waferSubdie.add(subdieDao.getPerParameter(conn, waferId, column, param, upper, lower));
				}
				map.put("waferList", waferSubdie);
				map.put("containSubdie", flag);
				result.put(waferAtt[i], map);
				continue;
			}
			map.put("otherDieType",coordinate.getOtherDie(conn, waferId, waferNO));
			waferList = new ArrayList<WaferMapDTO>();
			waferList.add(coordinate.getAllParameter(conn, waferId));
			for (String param : paramList) {
				List<Double> ls = rangeList.get(param);
				upper = ls.get(1);
				lower = ls.get(0);
				column = parameterDao.getColumnByName(conn, param, waferId);
				waferList.add(coordinate.getPerParameter(conn, waferId, column, param, upper, lower));
			}
			map.put("waferList", waferList);
			result.put(waferAtt[i], map);
		}
		try {
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return result;
	}
	
	


	@Override
	public Map<String, Object> getColorMap(String[] waferAtt, List<String> paramList,
			Map<String, List<Double>> rangeList) {
		WaferDao dao = (WaferDao) ObjectTable.getObject("WaferDao");
		SubdieDao subdieDao = (SubdieDao) ObjectTable.getObject("SubdieDao");
		ParameterDao parameterDao = (ParameterDao) ObjectTable.getObject("ParameterDao");
		CoordinateDao coordinate = (CoordinateDao) ObjectTable.getObject("CoordinateDao");
		Map<String, Object> result = new LinkedHashMap<>(), map = null;
		List<String> lsStr = null;
		int waferId = 0;
		boolean flag = false;
		double upper=0,lower=0;
		String column = "",waferNO = "",str = "";
		List<WaferMapDTO> waferList = null;
		List<SubdieDO> waferSubdie = null;
		Connection conn = new DataBaseUtil().getConnection();
		for (int i = 0, length = waferAtt.length; i < length; i++) {
			waferId = Integer.parseInt(waferAtt[i]);
			flag = subdieDao.getSubdieExist(conn,waferId);
			Map<String,Object> condition = dao.getCondition(conn, waferId);
			 waferNO = condition.get("wafer_number")==null?"":condition.get("wafer_number").toString();
			String device = condition.get("device_number")==null?"":condition.get("device_number").toString();
			String lot = condition.get("lot_number")==null?"":condition.get("lot_number").toString();
			map = getMapParameter(conn, waferNO,flag,device,lot);
			str = "";
			if(flag){
				lsStr = subdieDao.getSubdieNO(conn, waferNO, device, lot);
				if(lsStr != null){
					for(int k=0,size=lsStr.size();k<size;k++){
						str += ","+lsStr.get(k);
					}
					str = str.substring(1);
				}
				map.put("waferDie", coordinate.getAllDie(conn, waferNO,device,lot));
				map.put("subdieConfig", subdieDao.getSubdieConfig(conn, waferNO,str));
				map.put("otherSubdieType",subdieDao.getOtherSubdie(conn, waferId, waferNO,device,lot));
				waferSubdie = new ArrayList<SubdieDO>();
				for (String param : paramList) {
					List<Double> ls = rangeList.get(param);
					upper = ls.get(1);
					lower = ls.get(0);
					column = parameterDao.getColumnByName(conn, param, waferId);
					waferSubdie.add(subdieDao.getColorMap(conn, waferId, column, param, upper, lower));
				}
				map.put("waferList", waferSubdie);
				map.put("containSubdie", flag);
				result.put(waferAtt[i], map);
				continue;
			}
			map.put("otherDieType",coordinate.getOtherDie(conn, waferId, waferNO));
			waferList = new ArrayList<WaferMapDTO>();
			for (String param : paramList) {
				List<Double> ls = rangeList.get(param);
				upper = ls.get(1);
				lower = ls.get(0);
				column = parameterDao.getColumnByName(conn, param, waferId);
				waferList.add(coordinate.getColorMap(conn, waferId, column, param, upper, lower));
			}
			map.put("waferList", waferList);
			result.put(waferId+"", map);
		}
		try {
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return result;
	}
	
	/**
	 * 绘制晶圆所需参数
	 * 
	 * @param conn
	 * @param waferNO
	 * @return
	 */
	public Map<String, Object> getMapParameter(Connection conn, String waferNO,boolean flag,String deviceNO,String lotID) {
		Map<String, Object> result = new HashMap<>();
		ParameterDao parameterDao = new ParameterDao();
		CoordinateDao coordinate = new CoordinateDao();
		List<Map<String, Object>> map = parameterDao.getMapInfo(conn, waferNO,deviceNO, lotID);
		if (map.size() > 0) {
			result.put("directionX", map.get(0).get("directionX").toString());
			result.put("directionY", map.get(0).get("directionY").toString());
			result.put("dieSizeX", map.get(0).get("dieSizeX").toString());
			result.put("dieSizeY", map.get(0).get("dieSizeY").toString());
			result.put("diameter", map.get(0).get("diameter").toString());
			result.put("flagLength", map.get(0).get("flatLength").toString());
		}
		List<Map<String, Object>> list = coordinate.getCoordinateRange(conn, waferNO,flag, deviceNO, lotID);
		System.out.println("list:"+list);
		if (list.size() > 0) {
			result.put("minX", list.get(0).get("minX").toString());
			result.put("maxX", list.get(0).get("maxX").toString());
			result.put("maxY", list.get(0).get("maxY").toString());
			result.put("minY", list.get(0).get("minY").toString());
		}
		return result;
	}


	public Map<String, Object> getVectorMap(int waferId){
		WaferDao dao = (WaferDao) ObjectTable.getObject("WaferDao");
		SubdieDao subdieDao = (SubdieDao) ObjectTable.getObject("SubdieDao");
		CoordinateDao coordinate = (CoordinateDao) ObjectTable.getObject("CoordinateDao");
		Map<String, Object> map = new HashMap<>();
		List<String> ls = null;
		Connection conn = new DataBaseUtil().getConnection();
		
		Map<String,Object> condition = dao.getCondition(conn, waferId);
		String waferNO = condition.get("wafer_number")==null?"":condition.get("wafer_number").toString();
		String device = condition.get("device_number")==null?"":condition.get("device_number").toString();
		String lot = condition.get("lot_number")==null?"":condition.get("lot_number").toString(),str="";
		boolean flag = subdieDao.getSubdieExist(conn, waferId);
		map = getMapParameter(conn, waferNO,flag,device,lot);
		if(flag){
			ls = subdieDao.getSubdieNO(conn, waferNO, device, lot);
			if(ls != null){
				for(int i=0,size=ls.size();i<size;i++){
					str += ","+ls.get(i);
				}
				str = str.substring(1);
			}
			System.out.println("str:"+str);
			map.put("waferDie", coordinate.getAllDie(conn, waferNO,device,lot));
			map.put("subdieConfig", subdieDao.getSubdieConfig(conn, waferNO,str));
			map.put("otherSubdieType",subdieDao.getOtherSubdie(conn, waferId, waferNO,device,lot));
			map.put("waferList", subdieDao.getVectorMap(conn, waferId, "", ""));
			map.put("containSubdie", flag);
		}else{
			map.put("otherDieType",coordinate.getOtherDie(conn, waferId, waferNO));
			map.put("waferList", coordinate.getVectorMap(conn, waferId, "", ""));
		}
		map.put("waferNO", waferNO);
		try {
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return map;
	}

	@Override
	public Object getVectorMap(int waferId, String subdieName, String deviceGroup) {
		Connection conn = DataBaseUtil.getInstance().getConnection();
		WaferDao dao = (WaferDao) ObjectTable.getObject("WaferDao");
		SubdieDao subdieDao = (SubdieDao) ObjectTable.getObject("SubdieDao");
		CoordinateDao coordinate = (CoordinateDao) ObjectTable.getObject("CoordinateDao");
	
		boolean flag = subdieDao.getSubdieExist(conn, waferId);
		Object result = null;
		if(flag){
			result = subdieDao.getVectorMap(conn, waferId,  subdieName, deviceGroup);
		}else{
			result = coordinate.getVectorMap(conn, waferId, subdieName, deviceGroup);
		}
		
		try {
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return result;
	}
	
	@Override
	public List<String> getSubdie(int waferId) {
		CoordinateDao coordinate = new CoordinateDao();
		return coordinate.getSubdie(waferId);
	}

	
	@Override
	public List<String> getDeviceGroup(int waferId) {
		return new CurveDao().getDeviceGroup(waferId);
	}
	
	public Map<String, Object> getVectorCurve(int coordinateId, String subdieName, String deviceGroup) {
		CurveDao curveDao = new CurveDao();
		DataBaseUtil db = DataBaseUtil.getInstance();
		Connection conn = db.getConnection();
		List<Map<String, Object>> typeList = curveDao.getCurveType(conn, coordinateId, subdieName, deviceGroup);
		Map<String, Object> temp = null, paramMap = null, curveMap = null, result = new HashMap<>();
		int curveTypeId = 0, fileType = 0;
		String curveType = "", column = "";
		SmithDao smithDao = new SmithDao();
		for (int i = 0, size = typeList.size(); i < size; i++) {
			temp = typeList.get(i);
			curveTypeId = Integer.parseInt(temp.get("curve_type_id").toString());
			fileType = Integer.parseInt(temp.get("curve_file_type").toString());
			curveType = temp.get("curve_type").toString();
			curveMap = new HashMap<>();
			if (fileType == 0) {
				paramMap = curveDao.getCurveColumn(conn, curveTypeId);
				column = paramMap.get("column").toString().substring(1);
				curveMap.put("paramList", paramMap.get("paramList"));
				curveMap.put("curve", curveDao.getCurveData(conn, curveTypeId, column));
				result.put(curveType, curveMap);
				continue;
			}
			if (fileType == 1) {
				curveMap.put("S11-"+curveTypeId,smithDao.getGraphStyleData(conn, curveTypeId, "Smith", "S11",db));
				curveMap.put("S12-"+curveTypeId, smithDao.getGraphStyleData(conn, curveTypeId, "XYdBOfMagnitude", "S12",db));
				curveMap.put("S21-"+curveTypeId, smithDao.getGraphStyleData(conn, curveTypeId, "XYdBOfMagnitude", "S21",db));
				curveMap.put("S22-"+curveTypeId, smithDao.getGraphStyleData(conn, curveTypeId, "Smith", "S22",db));
				result.put(curveType, curveMap);
			}
		}
		try {
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return result;
	}




	

	
public static void main(String[] args) {
	WaferMapService service = new WaferMapServiceImpl();
	String[] waferAtt = new String[]{"124"};
	List<String> paramList = new ArrayList<>();
	paramList.add("BV.Result");
	paramList.add("Vth.Result");
	Map<String, List<Double>> rangeList = new HashMap<>();
	List<Double> ls = new ArrayList<>();
	 ls.add(1e-006);
	 ls.add(1e-005);
	rangeList.put("BV.Result",ls);
	ls.clear();
	 ls.add(9e+037);
	 ls.add(-9e+037);
	rangeList.put("Vth.Result", ls);
	
	System.out.println(new Gson().toJson(service.getMapInfo(waferAtt, paramList, rangeList)));
	
}

	

	
}
