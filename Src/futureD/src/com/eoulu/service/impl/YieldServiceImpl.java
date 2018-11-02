/**
 * 
 */
package com.eoulu.service.impl;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.eoulu.dao.CoordinateDao;
import com.eoulu.dao.GaussianDao;
import com.eoulu.dao.WaferDao;
import com.eoulu.dao.YieldDao;
import com.eoulu.service.YieldService;
import com.eoulu.util.DataBaseUtil;

/**
 * @author mengdi
 *
 * 
 */
public class YieldServiceImpl implements YieldService{

	
	@Override
	public Map<String, Object> getYield(String waferIdStr, List<String> paramList) {
		GaussianDao dao = new GaussianDao();
		WaferDao wafer = new WaferDao();
		YieldDao yieldDao = new YieldDao();
		Connection conn = new DataBaseUtil().getConnection();
		List<Double> ls = null;
		String[] att = waferIdStr.split(",");
		double left = 0,right=0,yield=0;
		String column = "",parameter="",waferNO="";
		int waferId = 0;
		Map<String, Object> result = new LinkedHashMap<>(),map = null;
		for(int i=0,size=paramList.size();i<size;i++){
			parameter = paramList.get(i);
			map = new LinkedHashMap<>();
			for(int j=0,length=att.length;j<length;j++){
				waferId = Integer.parseInt(att[i]);
				ls = yieldDao.getUpperAndLowerLimit(waferId, parameter, conn);
				right = ls.get(1);
				left = ls.get(0);
				if(left == Double.NaN || right == Double.NaN){
					yield = 0;
				}else{
					column = dao.getParameterColumn(conn, waferId, parameter);
					yield = wafer.getYieldPerParameter(conn, waferId, right+"", left+"", column);
				}
				waferNO = yieldDao.getWaferNO(conn, waferId);
				map.put(waferNO, yield);
			}
			result.put(parameter, map);
		}
		try {
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return result;
	}

}
