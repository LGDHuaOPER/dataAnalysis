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
import com.eoulu.dao.ParameterDao;
import com.eoulu.dao.WaferDao;
import com.eoulu.service.WaferMapService;
import com.eoulu.transfer.WaferMapDTO;
import com.eoulu.util.DataBaseUtil;


/**
 * @author mengdi
 *
 * 
 */
public class WaferMapServiceImpl implements WaferMapService {

	private static WaferDao dao = new WaferDao();
	private static ParameterDao parameterDao = new ParameterDao();
	private CoordinateDao coordinate = new CoordinateDao();

	@Override
	public Map<String, Object> getMapInfo( String[] waferAtt, List<String> paramList,
			Map<String,List<Double>> rangeList,String parameter) {
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
			if("".equals(parameter)){
				waferList.add(coordinate.getAllParameter(conn, waferId, waferNO));
			}
			for (String param : paramList) {
				List<Double> ls = (List<Double>) map.get(param);
				upper = ls.get(0);
				lower = ls.get(1);
				column = parameterDao.getColumnByName(conn, param, waferId);
				waferList.add(coordinate.getPerParameter(conn, waferId, column, param, upper, lower));
			}
			map.put("waferList", waferList);
			map.put("waferNO", waferNO);
			result.put("wafer:"+waferAtt[i], map);
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


	
	

	

	
}
