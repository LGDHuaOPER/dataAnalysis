/**
 * 
 */
package com.eoulu.service.impl;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.eoulu.dao.CPKDao;
import com.eoulu.dao.GaussianDao;
import com.eoulu.dao.HistogramDao;
import com.eoulu.dao.YieldDao;
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
	public Map<String,List<Double>> getCPK(String waferIdStr, String param) {

		Map<String,List<Double>> waferMap=new HashMap();
		Connection conn = new DataBaseUtil().getConnection();
		List<Map<String,Object>> limit = null;
		List<Map<String, List<Double>>>  list = null;
		List<Double> result = null,ls=null,datas=null;
		double upper = 0,lower=0,avg=0,variance=0,StandardDeviation=0,CPKu=0,CPKI=0,CPK=0;
		int waferId = 0;String waferNO = "";
		String att[] = waferIdStr.split(",");
		
		for(int i=0,length=att.length;i<length;i++){
			waferId = Integer.parseInt(att[i]);
			limit = new CPKDao().getLimit(conn, param, waferId);
			HistogramDao histogram = new HistogramDao();
			String column = histogram.getColumn(conn, waferId, param);
			if(limit.size()<1){
				ls = new GaussianDao().getRangeByColumn(conn, waferId, column);
				upper = ls.get(0);
				lower = ls.get(1);
			}else{
				upper = (double) limit.get(0).get("upper_limit");//参数对应数据的上下
				lower = (double) limit.get(0).get("lower_limit");//参数对应数据的下限
			}
			result = new ArrayList<Double>();
			list = new CPKDao().getData(conn, column, waferId);
//			if(list==null){
//				return null;
//			}
			for(Map<String,List<Double>> waferDate:list){
				 avg = waferDate.get("avg").get(0);
				datas = waferDate.get("datas");
				 variance = FunctionUtil.getVariance(datas,avg); //方差
				if(variance==0){
					variance=Variance;
				}
				 StandardDeviation = FunctionUtil.getStandardDeviation(variance);
				 CPKu = (upper-avg>0?upper-avg:avg-upper)/(StandardDeviation*3);
				 CPKI = (avg-lower>0?avg-lower:lower-avg)/(StandardDeviation*3);
				 CPK = CPKu>CPKI?CPKI:CPKu;
				result.add(CPK);
			}
			waferNO = new YieldDao().getWaferNO(conn, waferId);
			waferMap.put(waferNO, result);
		}
		
		
		try {
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return waferMap;
	}
	
	
	

	@Override
	public List<String> getParameter(int waferId) {
		return new CPKDao().getParameter(waferId);
	}

}
