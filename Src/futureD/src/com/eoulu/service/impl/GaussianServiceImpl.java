/**
 * 
 */
package com.eoulu.service.impl;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.eoulu.dao.CoordinateDao;
import com.eoulu.dao.GaussianDao;
import com.eoulu.dao.HistogramDao;
import com.eoulu.dao.ParameterDao;
import com.eoulu.service.GaussianService;
import com.eoulu.service.HistogramService;
import com.eoulu.transfer.FunctionUtil;
import com.eoulu.util.DataBaseUtil;

/**
 * @author mengdi
 *
 * 
 */
public class GaussianServiceImpl implements GaussianService{

	@Override
	public Map<String, Object> getGaussian(Map<String,Object> map) {
		int waferId = map.get("waferId")==null?0:Integer.parseInt(map.get("waferId").toString());
		String param = map.get("param")==null?"":map.get("param").toString();
		if(waferId==0 || "".equals(param)){
			return null;
		}
		Map<String,Object> result = new HashMap<>();
		CoordinateDao coordinate = new CoordinateDao();
		GaussianDao dao = new GaussianDao();
		Connection conn = new DataBaseUtil().getConnection();
		String column = dao.getParameterColumn(conn, waferId, param);
		
		List<Map<String,Object>> functionList = dao.getFunctionData(conn, waferId, column);
		List<Double> groups = new ArrayList<>(),density = new ArrayList<>();
		List<Integer> frequencyList = new ArrayList<>();
		int total = Integer.parseInt(functionList.get(0).get("total").toString()),frequency=0,length=0;
		if(functionList.get(0).get("standard") == null){
			return null;
		}
		double 
		max =  map.get("right")==null?Double.parseDouble(functionList.get(0).get("max").toString()):Double.parseDouble(map.get("right").toString()),
		min =  map.get("left")==null?Double.parseDouble(functionList.get(0).get("min").toString()):Double.parseDouble(map.get("left").toString()),
		standard = Double.parseDouble(functionList.get(0).get("standard").toString()),
		variance = new BigDecimal(Math.pow(standard, 2)).doubleValue(),
				average = Double.parseDouble(functionList.get(0).get("average").toString()),
				section = max-min,
				columnCount = map.get("equal")==null?Math.sqrt(total)+1:Double.parseDouble(map.get("equal").toString()),
						interval = section/(columnCount-1),expectation=0,x=0,rate=0,y=0;
							String	median = coordinate.getMedian(conn, waferId, min, max,column);
//							System.out.println("标准差:"+standard +"-----方差:"+variance+"柱数:"+columnCount);
		length = (int) Math.floor(columnCount);
		for(int i=0 ;i < length; i ++){
			if(i==0){
				x = min+interval/2;
				frequency =  dao.getCount(conn, waferId, " and "+column+"<="+x);
			}else{
				frequency =  dao.getCount(conn, waferId, " and "+x+"<"+column+" and "+column+"<="+(x+interval));
				x = x + interval;
			}
			rate = frequency/total;
			expectation += frequency*rate;
			y = FunctionUtil.getNormality(x, standard, average);
//			System.out.println("y:"+y);
			if(Double.isNaN(y)){
				result.put("status", "数据太少无法绘制！");
				return result;
			}
//			groups.add(new BigDecimal(x).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue());
			groups.add(x);
			frequencyList.add(frequency);
			density.add(y);
		}
		try {
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		
		result.put("median", "".equals(median)?median:Double.parseDouble(median));
		result.put("average", average);
		result.put("max", max);
		result.put("min", min);
		result.put("expectation", expectation);
		result.put("standard", standard);
		result.put("variance", variance);
		
		result.put("columnCount", columnCount);
		result.put("columnInterval", interval);
		result.put("frequency", frequencyList);
		result.put("groupX", groups);
		result.put("density", density);
		return result;
	}

	@Override
	public Map<String, List<Double>> getRangList(List<String> paramList, String waferIdStr) {
		ParameterDao paramDao = new ParameterDao();
		Map<String, List<Double>> result = new HashMap<>();
		GaussianDao dao = new GaussianDao();
		String column = "";
		int waferId = 0;
		String[] waferAtt = waferIdStr.split(",");
		List<Double> list = null,ls = null;
		Map<String,Object>  map = null;
		DataBaseUtil db = DataBaseUtil.getInstance();
		Connection conn = db.getConnection();
		for (int j=0,size=paramList.size();j<size;j++) {
			double right=0,left=10000000,upper=0,lower=1000000;
			
			for (int i = 0, length = waferAtt.length; i < length; i++) {
				waferId = Integer.parseInt(waferAtt[i]);
				map = paramDao.getLimit(waferId, paramList.get(j), conn);
				if(map == null){
					column = dao.getParameterColumn(conn, waferId, paramList.get(j));
					list = dao.getRangeByColumn(conn, waferId, column);
					right = list.get(0)>right?list.get(0):right;
					left = list.get(1)<left?list.get(1):left;
					continue;
				}
				upper = Double.parseDouble(map.get("upper").toString());
				lower = Double.parseDouble(map.get("lower").toString());
				right = upper>right?upper:right;
				left = lower<left?lower:left;
				map = null;
			}
			ls = new ArrayList<>();
			ls.add(left);
			ls.add(right);
			result.put(paramList.get(j), ls);

		}
		db.close(conn);
		return result;
	}

	public Map<String,Object> getPercent(String paramName, String waferIdStr, List<String> section) {
		HistogramDao dao = new HistogramDao();
		List<String> ls = null;
		Map<String,Object> result = new HashMap<>();
		Map<String,List<String>> map = new LinkedHashMap<>();
		double  percent = 0,total=0,count=0;
		int waferId = 0;
		String[] att = waferIdStr.split(","),limit = null;
		String column = "";
		Connection conn = new DataBaseUtil().getConnection();
		for (int i = 0, length = att.length; i < length; i++) {
			ls = new ArrayList<>();
			waferId = Integer.parseInt(att[i]);
			column = dao.getColumn(conn,waferId, paramName);
			total = dao.getQuantity(conn,waferId, " and bin<>-1");
			for(int j=0,size=section.size();j<size;j++){
				limit = section.get(j).split("~");
				if("-∞".equals(limit[0])){
					count = dao.getQuantity(conn,waferId, " and bin<>-1 and " + column + "<" + limit[1]);
				}else
				if("+∞".equals(limit[1])){
					count = dao.getQuantity(conn,waferId, " and bin<>-1 and " + column + ">=" + limit[0]);
				}else{
					count = dao.getQuantity(conn,waferId, " and bin<>-1 and " +limit[0]+"<="+ column +" and "+ column + "<" + limit[1]);
				}
				percent = FunctionUtil.multiple(count/total, 100, 2);
				ls.add(percent+"%");
				
			}
			map.put("percent", ls);
			result.put(att[i], map);
		}
		try {
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return result;
	}
	

	
}
