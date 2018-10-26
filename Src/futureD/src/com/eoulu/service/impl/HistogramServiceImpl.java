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
		for(int i=0,length=waferIdStr.length();i<length;i++){
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
	public Map<String,Object> getPercent(String paramName, String waferIdStr, double left, double right, int equal) {
		List<Double> ls = null,proportionList = null;
		Map<String,Object> result = new HashMap<>();
		Map<String,List<Double>> map = new LinkedHashMap<>();
		double first = 0, last = 0, percent = 0,proportion=0;
		int waferId = 0;
		String[] att = waferIdStr.split(",");
		Connection conn = new DataBaseUtil().getConnection();
		for (int i = 0, length = att.length; i < length; i++) {
			proportion = 0;
			ls = new ArrayList<>();
			waferId = Integer.parseInt(att[i]);
			String column = dao.getColumn(conn,waferId, paramName);
			int total = dao.getQuantity(conn,waferId, " and bin<>-1");
			int upper = dao.getQuantity(conn,waferId, " and bin<>-1 and " + column + "<" + right);
			int lower = dao.getQuantity(conn,waferId, " and bin<>-1 and " + column + ">" + left);
			if (lower != 0) {
				first = FunctionUtil.div(lower, total, 8);
				first = Double.parseDouble(String.format("%1.4g", first));
			}
			ls.add(first);
			proportion += first;
			proportionList.add(proportion);
			for (int j = 1; j < equal + 1; j++) {
				if (equal == 0) {
					System.out.println("划分等分n为0");
				} else {
					double S1 = left + FunctionUtil.div(right - left, equal, 10) * (j - 1);
					double S2 = left + FunctionUtil.div(right - left, equal, 10) * (j);
					// S1,S2范围划分为 n分，，每一份的左右小范围
					// 看（C1 C2 C3 C4）参数值是否在（S1，S2）的范围
					String condition = " and bin!=-1 and " + column + ">=" + S1 + " And " + column + "<" + S2;
					if (j == equal) {
						condition = " And Bin!=-1 And " + column + ">=" + S1 + " And " + column + "<=" + S2;
					}
					int count = dao.getQuantity(conn,waferId, condition);
					if (count == 0) {
						percent = 0;
					} else {
						percent = FunctionUtil.div(count, total, 8);
						percent = Double.parseDouble(String.format("%1.4g", percent));
					}
					ls.add(percent);
					proportion += percent;
					proportionList.add(proportion);
				}
			}
			if (last != 0) {
				last = FunctionUtil.div(upper, total, 8);
				last = Double.parseDouble(String.format("%1.4g", last));
			}
			ls.add(last);
			proportion += last;
			proportionList.add(proportion);
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
	
	/**
	 * 等分范围处理
	 * @param A 最小值
	 * @param B 最大值
	 * @param n 等分
	 * @return
	 */
	public List<String> getRangeOrderAsc(double A,double B,int n){
 		List<String> getrangelist=new ArrayList<String>();
 		String smallthanlimit="-∞,"+A;
 		String bigthanlimit=B+",+∞";
 		getrangelist.add(smallthanlimit);
 		double S1,S2;
 		String str=null;
 		for(int s=1;s<n+1;s++)
 		{     
			S1=A+(B-A)*(s-1)/n;
			S2=A+(B-A)*(s)/n;
			str=String.format("%1.4g",S1)+"~"+String.format("%1.4g",S2);
			getrangelist.add(str);
 		}
 		getrangelist.add(bigthanlimit);
 		return getrangelist;
 	}
	
	
	

}
