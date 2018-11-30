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
				waferId = Integer.parseInt(att[j]);
				ls = yieldDao.getUpperAndLowerLimit(waferId, parameter, conn);
				System.out.println("ls:"+ls);
				right = ls.get(1);
				left = ls.get(0);
				if(left == Double.NaN || right == Double.NaN){
					yield = 1;
					System.out.println("总么会");
				}else{
					column = dao.getParameterColumn(conn, waferId, parameter);
					yield = wafer.getYieldPerParameter(conn, waferId, right+"", left+"", column);
				}
				waferNO = yieldDao.getWaferNO(conn, waferId);
				map.put(att[j], yield*100+"%");
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

	@Override
	public Map<String, List<Double>> getRangeList(String waferIdStr, List<String> paramList) {
		Map<String, List<Double>> result = new HashMap<>();
		GaussianDao dao = new GaussianDao();
		YieldDao yieldDao = new YieldDao();
		String column = "";
		int waferId = 0;
		String[] waferAtt = waferIdStr.split(",");
		List<Double> list = null,ls = null,limit=null;
		Connection conn = DataBaseUtil.getInstance().getConnection();
		for (int j=0,size=paramList.size();j<size;j++) {
			double right = 0,left = 100000000;
			for (int i = 0, length = waferAtt.length; i < length; i++) {
				waferId = Integer.parseInt(waferAtt[i]);
				limit = yieldDao.getUpperAndLowerLimit(waferId, paramList.get(j), conn);
				if(limit.get(1) == Double.NaN || limit.get(0) == Double.NaN){
					column = dao.getParameterColumn(conn, waferId, paramList.get(j));
					list = dao.getRangeByColumn(conn, waferId, column);
					right = list.get(0)>right?list.get(0):right;
					left = list.get(1)<left?list.get(1):left;
					continue;
				}
				right = right<limit.get(1)?limit.get(1):right;
				left = left<limit.get(0)?left:limit.get(0);
			}
			ls = new ArrayList<>();
			ls.add(left);
			ls.add(right);
			result.put(paramList.get(j), ls);

		}
		try {
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return result;
	}
	
}
