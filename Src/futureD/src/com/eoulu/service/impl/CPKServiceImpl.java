/**
 * 
 */
package com.eoulu.service.impl;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.eoulu.dao.CPKDao;
import com.eoulu.dao.GaussianDao;
import com.eoulu.dao.HistogramDao;
import com.eoulu.service.CPKService;
import com.eoulu.transfer.FunctionUtil;
import com.eoulu.util.DataBaseUtil;

/**
 * @author mengdi
 *
 * 
 */
public class CPKServiceImpl implements CPKService{
	private final static double Variance=6E-6;
	@Override
	public List<Double> getCPK(int waferId, String param) {

		Connection conn = new DataBaseUtil().getConnection();
		List<Map<String,Object>> limit = new CPKDao().getLimit(conn, param, waferId);
		double upper = 0,lower=0;
		HistogramDao histogram = new HistogramDao();
		String column = histogram.getColumn(conn, waferId, param);
		if(limit.size()<1){
			List<Double> ls = new GaussianDao().getRangeByColumn(conn, waferId, column);
			upper = ls.get(0);
			lower = ls.get(1);
		}else{
			upper = (double) limit.get(0).get("upper_limit");//参数对应数据的上下
			lower = (double) limit.get(0).get("lower_limit");//参数对应数据的下限
		}
		List<Double> result = new ArrayList<Double>();
		List<Map<String, List<Double>>>  list = new CPKDao().getData(conn, column, waferId);
		if(list==null){
			return null;
		}
		for(Map<String,List<Double>> waferDate:list){
			double avg = waferDate.get("avg").get(0);
			List<Double> datas = waferDate.get("datas");
			double variance = FunctionUtil.getVariance(datas,avg); //方差
			if(variance==0){
				variance=Variance;
			}
			double StandardDeviation = FunctionUtil.getStandardDeviation(variance);
			double CPKu = (upper-avg>0?upper-avg:avg-upper)/(StandardDeviation*3);
			double CPKI = (avg-lower>0?avg-lower:lower-avg)/(StandardDeviation*3);
			double CPK = CPKu>CPKI?CPKI:CPKu;
			result.add(CPK);
		}
		
		return result;
	}
	
	
	

	@Override
	public List<String> getParameter(int waferId) {
		return new CPKDao().getParameter(waferId);
	}

}
