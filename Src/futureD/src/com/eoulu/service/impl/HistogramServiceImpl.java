/**
 * 
 */
package com.eoulu.service.impl;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.SQLException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.eoulu.dao.HistogramDao;
import com.eoulu.dao.ParameterDao;
import com.eoulu.service.HistogramService;
import com.eoulu.transfer.FunctionUtil;
import com.eoulu.util.DataBaseUtil;

/**
 * @author mengdi
 *
 * 
 */
public class HistogramServiceImpl implements HistogramService{
	private ParameterDao parameterDao = new ParameterDao();
	private HistogramDao dao = new HistogramDao();
	@Override
	public List<String> getWaferParameter(String waferIdStr) {
		List<String> paramList = new ArrayList<>();
		List<String> ls = new ArrayList<>();
		String[] att = waferIdStr.split(",");
		Connection conn = new DataBaseUtil().getConnection();
		for(int i=0,length=att.length;i<length;i++){
			if(i==0){
				paramList = parameterDao.getParameterNoCustom(conn,Integer.parseInt(att[i]));
			}else{
				ls = parameterDao.getParameterNoCustom(conn,Integer.parseInt(att[i]));
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
/*
	@Override
	public Map<String, List<Double>> getHistogramRange(List<String> paramList, String waferIdStr) {
		Map<String, List<Double>> result = new HashMap<>();
		List<Double> ls = null;
		String column = "";
		Connection conn = new DataBaseUtil().getConnection();
		for (String param : paramList) {
			ls = dao.getHistogramRange(conn, waferIdStr, param);
			if (ls == null) {
				column = dao.getParameterColumn(conn, waferIdStr, param);
				ls = dao.getHistogramRangeByColumn(conn, waferIdStr, column);
			}
			result.put(param, ls);
		}
		try {
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return result;
	}
	*/
	
	@Override
	public Map<String,Object> getPercent(String paramName, String waferIdStr, List<String> section) {
		List<String> ls = null,proportionList = null;
		Map<String,Object> result = new HashMap<>();
		Map<String,List<String>> map = new LinkedHashMap<>();
		double  percent = 0,proportion=0 ,total=0,count=0;
		int waferId = 0;
		String[] att = waferIdStr.split(","),limit = null;
		String column = "";
		Connection conn = new DataBaseUtil().getConnection();
		for (int i = 0, length = att.length; i < length; i++) {
			proportionList = new ArrayList<>();
			proportion = 0;
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
				proportion = FunctionUtil.add(proportion, percent, 2);
				proportionList.add((proportion>100?100.00:proportion)+"%");
				
			}
			map.put("percent", ls);
			map.put("proportion", proportionList);
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
