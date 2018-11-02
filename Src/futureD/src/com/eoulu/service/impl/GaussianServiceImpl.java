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
import com.eoulu.service.GaussianService;
import com.eoulu.transfer.FunctionUtil;
import com.eoulu.util.DataBaseUtil;

/**
 * @author mengdi
 *
 * 
 */
public class GaussianServiceImpl implements GaussianService{

	private GaussianDao dao = new GaussianDao();
	@Override
	public Map<String, Object> getGaussian(int waferId, String param, double left, double right, int equal) {
		Connection conn = new DataBaseUtil().getConnection();
		CoordinateDao coordinate = new CoordinateDao();
		double median = coordinate.getMedian(conn, waferId, left, right);
		String column = dao.getParameterColumn(conn, waferId, param);
		Map<String,List<Double>> histogramMap = getHistogram(conn, waferId, column, left, right, equal);
		List<Map<String,Object>> functionList = dao.getFunctionData(conn, waferId, column);
		double standard = Double.parseDouble(functionList.get(0).get("standard").toString()),
				variance = new BigDecimal(Math.pow(standard, 2)).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue(),
				average = Double.parseDouble(functionList.get(0).get("average").toString()),
				max =  Double.parseDouble(functionList.get(0).get("max").toString()),
				min =  Double.parseDouble(functionList.get(0).get("min").toString()),
				x=0,y=0;
		List<String> dataList = dao.getParamData(conn, waferId, column),rangeList = getRangeOrderAsc(left, right, equal);
		List<Double> gaussianList = new ArrayList<>();
		for(int i=0,size=dataList.size();i<size;i++){
			x = Double.parseDouble(dataList.get(i));
			y = FunctionUtil.getNormality(x, standard, average);
			gaussianList.add(y);
		}
		try {
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		Map<String,Object> result = new HashMap<>();
		result.put("average", average);
		result.put("mean", average);
		result.put("standard", standard);
		result.put("variance", variance);
		result.put("max", max);
		result.put("min", min);
		result.put("median", median);
		result.put("gaussianList", gaussianList);
		result.put("histogramMap", histogramMap);
		result.put("rangeX", rangeList);
		return result;
	}

	@Override
	public Map<String, List<Double>> getRangList(List<String> paramList, String waferIdStr) {
		Map<String, List<Double>> result = new HashMap<>();
		String column = "";
		int waferId = 0;
		String[] waferAtt = waferIdStr.split(",");
		List<Double> list = null,ls = null;
		Connection conn = new DataBaseUtil().getConnection();
		for (int j=0,size=paramList.size();j<size;j++) {
			double right=0,left=0;
			for (int i = 0, length = waferAtt.length; i < length; i++) {
				waferId = Integer.parseInt(waferAtt[i]);
				column = dao.getParameterColumn(conn, waferId, paramList.get(j));
				list = dao.getRangeByColumn(conn, waferId, column);
				right = list.get(0)>right?list.get(0):right;
				left = list.get(1)<left?list.get(1):left;
				
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

	public Map<String,List<Double>> getHistogram(Connection conn, int waferId,String column,double left, double right, int equal){
		HistogramDao hitogram = new HistogramDao();
		Map<String,List<Double>> map = new LinkedHashMap<>();
		double first = 0, last = 0, percent = 0;
		List<Double> ls = new ArrayList<>();
		int total = hitogram.getQuantity(conn,waferId, " and bin<>-1");
		int upper = hitogram.getQuantity(conn,waferId, " and bin<>-1 and " + column + "<" + right);
		int lower = hitogram.getQuantity(conn,waferId, " and bin<>-1 and " + column + ">" + left);
		if (lower != 0) {
			first = FunctionUtil.div(lower, total, 8);
			first = Double.parseDouble(String.format("%1.4g", first));
		}
		ls.add(first);
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
				int count = hitogram.getQuantity(conn,waferId, condition);
				if (count == 0) {
					percent = 0;
				} else {
					percent = FunctionUtil.div(count, total, 8);
					percent = Double.parseDouble(String.format("%1.4g", percent));
				}
				ls.add(percent);
			}
		}
		if (last != 0) {
			last = FunctionUtil.div(upper, total, 8);
			last = Double.parseDouble(String.format("%1.4g", last));
		}
		ls.add(last);
		map.put(waferId+"", ls);
		
		return map;
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
