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
	public Map<String,List<Object>> getCPK(String waferIdStr, String param) {
		HistogramDao histogram = new HistogramDao();
		Map<String,List<Object>> waferMap=new HashMap();
		Connection conn = new DataBaseUtil().getConnection();
		List<Map<String,Object>> limit = null,list = null;
		List<Object> result = null;
		List<Double> ls=null,datas=null;
		double upper = 0,lower=0,avg=0,variance=0,StandardDeviation=0,CPKu=0,CPKI=0,CPK=0;
		int waferId = 0,count = 0;String waferNO = "";
		String att[] = waferIdStr.split(",");
		
		for(int i=0,length=att.length;i<length;i++){
			waferId = Integer.parseInt(att[i]);
			limit = new CPKDao().getLimit(conn, param, waferId);
		
			String column = histogram.getColumn(conn, waferId, param);
			if(limit.size()<1){
				ls = new GaussianDao().getRangeByColumn(conn, waferId, column);
				upper = ls.get(0);
				lower = ls.get(1);
			}else{
				upper =  Double.parseDouble(limit.get(0).get("upper_limit").toString());//参数对应数据的上下
				lower =  Double.parseDouble(limit.get(0).get("lower_limit").toString());//参数对应数据的下限
			}
			count = histogram.getQuantity(conn, waferId, "and "+column+" is not null and "+column+" < 9E30 and bin <>-1");
			result = new ArrayList<Object>();
			list = new CPKDao().getData(conn, column, waferId,count);
//			System.out.println(list);
//			if(list==null){
//				return null;
//			}
			for(Map<String,Object> waferData:list){
				 avg = waferData.get("avg")==null?0:Double.parseDouble(waferData.get("avg").toString());
				datas = (List<Double>) waferData.get("datas");
//				System.out.println(datas);
				 variance = FunctionUtil.getVariance(datas,avg); //方差
				if(variance==0){
					variance=Variance;
				}
//				System.out.println("variance:"+variance);
				 StandardDeviation = FunctionUtil.getStandardDeviation(variance);
				 CPKu = (upper-avg>0?upper-avg:avg-upper)/(StandardDeviation*3);
				 CPKI = (avg-lower>0?avg-lower:lower-avg)/(StandardDeviation*3);
				 CPK = CPKu>CPKI?CPKI:CPKu;
				 if(Double.isNaN(CPK)){
					 result.add("");
				 }else{
					 result.add(CPK);
				 }
				
			}
			waferNO = new YieldDao().getWaferNO(conn, waferId);
			waferMap.put(att[i], result);
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
