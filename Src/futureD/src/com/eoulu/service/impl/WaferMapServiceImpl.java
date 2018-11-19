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
import com.eoulu.dao.WaferDao;
import com.eoulu.service.AnalysisService;
import com.eoulu.service.WaferMapService;
import com.eoulu.transfer.WaferMapDTO;
import com.eoulu.util.DataBaseUtil;


/**
 * @author mengdi
 *
 * 
 */
public class WaferMapServiceImpl implements WaferMapService {


	@Override
	public Map<String, Object> getMapInfo( String[] waferAtt, List<String> paramList,
			Map<String,List<Double>> rangeList) {
		 WaferDao dao = new WaferDao();
		 ParameterDao parameterDao = new ParameterDao();
		 CoordinateDao coordinate = new CoordinateDao();
		Map<String, Object> result = new LinkedHashMap<>(), map = null;
		int waferId = 0;
		double upper=0,lower=0;
		String column = "";
		List<WaferMapDTO> waferList = null;
		Connection conn = new DataBaseUtil().getConnection();
		for (int i = 0, length = waferAtt.length; i < length; i++) {
			waferId = Integer.parseInt(waferAtt[i]);
			String waferNO = dao.getWaferNO(waferId);
			map = getMapParameter(conn, waferNO);
			map.put("otherDieType",coordinate.getOtherDie(conn, waferId, waferNO));
			waferList = new ArrayList<WaferMapDTO>();
			waferList.add(coordinate.getAllParameter(conn, waferId));
			for (String param : paramList) {
				List<Double> ls = rangeList.get(param);
				upper = ls.get(0);
				lower = ls.get(1);
				column = parameterDao.getColumnByName(conn, param, waferId);
				waferList.add(coordinate.getPerParameter(conn, waferId, column, param, upper, lower));
			}
			map.put("waferList", waferList);
			result.put(waferNO, map);
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
		 WaferDao dao = new WaferDao();
		 ParameterDao parameterDao = new ParameterDao();
		 CoordinateDao coordinate = new CoordinateDao();
		Map<String, Object> result = new LinkedHashMap<>(), map = null;
		int waferId = 0;
		double upper=0,lower=0;
		String column = "";
		List<WaferMapDTO> waferList = null;
		Connection conn = new DataBaseUtil().getConnection();
		for (int i = 0, length = waferAtt.length; i < length; i++) {
			waferId = Integer.parseInt(waferAtt[i]);
			String waferNO = dao.getWaferNO(waferId);
			map = getMapParameter(conn, waferNO);
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
			result.put(waferNO, map);
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
	public Map<String, Object> getMapParameter(Connection conn, String waferNO) {
		Map<String, Object> result = new HashMap<>();
		ParameterDao parameterDao = new ParameterDao();
		CoordinateDao coordinate = new CoordinateDao();
		List<Map<String, Object>> map = parameterDao.getMapInfo(conn, waferNO);
		if (map.size() > 0) {
			result.put("directionX", map.get(0).get("directionX").toString());
			result.put("directionY", map.get(0).get("directionY").toString());
			result.put("dieSizeX", map.get(0).get("dieSizeX").toString());
			result.put("dieSizeY", map.get(0).get("dieSizeY").toString());
			result.put("diameter", map.get(0).get("diameter").toString());
			result.put("flagLength", map.get(0).get("flatLength").toString());
		}
		List<Map<String, Object>> list = coordinate.getCoordinateRange(conn, waferNO);
		if (list.size() > 0) {
			result.put("minX", list.get(0).get("minX").toString());
			result.put("maxX", list.get(0).get("maxX").toString());
			result.put("minY", list.get(0).get("minY").toString());
			result.put("minY", list.get(0).get("minY").toString());
		}
		return result;
	}


	public Map<String, Object> getVectorMap(int waferId){
		 WaferDao dao = new WaferDao();
		 CoordinateDao coordinate = new CoordinateDao();
		Map<String, Object> map = new HashMap<>();
		String waferNO = dao.getWaferNO(waferId);
		Connection conn = new DataBaseUtil().getConnection();
		map = getMapParameter(conn, waferNO);
		map.put("otherDieType",coordinate.getOtherDie(conn, waferId, waferNO));
		map.put("waferList", coordinate.getVectorMap(conn, waferId, "", ""));
		map.put("waferNO", waferNO);
		try {
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return map;
	}

	@Override
	public WaferMapDTO getVectorMap(int waferId, String subdieName, String deviceGroup) {
		Connection conn = DataBaseUtil.getInstance().getConnection();
		CoordinateDao coordinate = new CoordinateDao();
		WaferMapDTO wafer = coordinate.getVectorMap(conn, waferId, subdieName, deviceGroup);
		try {
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return wafer;
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
		Map<String, Object> temp = null, paramMap = null, curveMap = new HashMap<>(), result = new HashMap<>();
		int curveTypeId = 0, fileType = 0;
		String curveType = "", column = "";
		SmithDao smithDao = new SmithDao();
		for (int i = 0, size = typeList.size(); i < size; i++) {
			temp = typeList.get(i);
			curveTypeId = Integer.parseInt(temp.get("curve_type_id").toString());
			fileType = Integer.parseInt(temp.get("curve_file_type").toString());
			curveType = temp.get("curve_type").toString();
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


	

	

	
}
