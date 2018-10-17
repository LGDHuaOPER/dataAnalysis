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

import com.eoulu.dao.CurveDao;
import com.eoulu.dao.WaferDao;
import com.eoulu.service.AnalysisService;
import com.eoulu.util.DataBaseUtil;

/**
 * @author mengdi
 *
 * 
 */
public class AnalysisServiceImpl implements AnalysisService{

	private CurveDao curveDao = new CurveDao();
	private WaferDao dao = new WaferDao();
	@Override
	public String getVerificationDC(String[] waferId,String[] waferNO,int count) {
		int id = 0;
		String status = "success";
		for(int i=0,length=waferId.length;i<length;i++){
			id = Integer.parseInt(waferId[i]);
			if(!curveDao.getAnalysisClassify(id, count)){
				status = "晶圆"+waferNO[i]+"曲线不包含"+count+"列数据！";
						break;
			}
		}
		return status;
	}

	@Override
	public String getVerificationS2P(String[] waferId,String[] waferNO) {
		int id = 0;
		String status = "success";
		for(int i=0,length=waferId.length;i<length;i++){
			id = Integer.parseInt(waferId[i]);
			if(!curveDao.getAnalysisClassify(id)){
				status = "晶圆"+waferNO[i]+"曲线未含有S2P数据！";
						break;
			}
		}
		return status;
	}

	@Override
	public Map<String, Object> getCurveFile(String[] waferId) {
		Map<String, Object> map = new LinkedHashMap<>();
		List<String[]> list = null;
		int id = 0;
		String waferFile = "",waferNO="";
		DataBaseUtil db = new DataBaseUtil();
		Connection conn = db.getConnection();
		Map<String,Object> wafer = null;
		try {
			for(int i=0,length=waferId.length;i<length;i++){
				id = Integer.parseInt(waferId[i]);
				list = curveDao.getCurvFile(conn,id);
				wafer = dao.getFile(conn,id);
				waferFile = wafer.get("wafer_file_name").toString();
				waferNO = wafer.get("wafer_number").toString();
				map.put(waferFile+","+waferNO, list);
			}
		}finally {
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return map;
	}

	@Override
	public Map<String,Object> getSmithData( String[] curveTypeId,String[] legend) {
		Map<String,Object> result = new LinkedHashMap<>();
		Map<String, List<Double[]>> map = null;
		int id = 0;
		for(int i=0,length=curveTypeId.length;i<length;i++){
			id = Integer.parseInt(curveTypeId[i]);
			map = curveDao.getSmithData(id);
			result.put(legend[i], map);
		}
		return result;
	}
	
	

}
