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

import com.eoulu.dao.ParameterDao;
import com.eoulu.dao.SubdieDao;
import com.eoulu.dao.WaferDao;
import com.eoulu.parser.WriteExcel;
import com.eoulu.service.WaferDataService;
import com.eoulu.transfer.ObjectTable;
import com.eoulu.util.DataBaseUtil;

/**
 * @author mengdi
 *
 * 
 */
public class WaferDataServiceImpl implements WaferDataService{

	
	@Override
	public Map<String, Object> getWaferData(int waferId) {
		WaferDao dao = (WaferDao) ObjectTable.getObject("WaferDao");
		SubdieDao subdieDao = (SubdieDao) ObjectTable.getObject("SubdieDao");
		ParameterDao paramDao = (ParameterDao) ObjectTable.getObject("ParameterDao");
		Connection conn = new DataBaseUtil().getConnection();
		String dieType = dao.getDieType(conn, waferId);
		boolean flag = subdieDao.getSubdieExist(conn, waferId);
		Map<String,Object> paramMap = paramDao.getWaferDataParameter(conn, waferId,flag);
		String column = paramMap.get("column").toString();
		paramMap.remove("column");
		List<Map<String,Object>> dataList = dao.getWaferData(conn, waferId, column,dieType,flag);
		List<String> paramList = (List<String>) paramMap.get("paramList");
		List<String> upperList = (List<String>) paramMap.get("upperList");
		List<String> lowerList = (List<String>) paramMap.get("lowerList");
		String upper="",lower="";
		List<Double> ls = new ArrayList<>();
		for(int i=0,size=paramList.size();i<size;i++){
			column = paramDao.getColumnByName(conn, paramList.get(i).substring(0, paramList.get(i).indexOf("(")), waferId);
			upper = upperList.get(i);
			lower = lowerList.get(i);
			if(flag){
				ls.add(subdieDao.getYieldPerParameter(conn, waferId, upper, lower, column));
			}else{
				ls.add(dao.getYieldPerParameter(conn, waferId, upper, lower, column));	
			}
			
		}
		try {
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		Map<String, Object> result = new LinkedHashMap();
		result.put("containSubdie", flag);
		result.put("yield", ls);
		result.put("paramLimit", paramMap);
		result.put("dataList", dataList);
		return result;
	}

	
	
	@Override
	public void getExportExcel(int waferId, String path) {
		WaferDao dao = (WaferDao) ObjectTable.getObject("WaferDao");
		SubdieDao subdieDao = (SubdieDao) ObjectTable.getObject("SubdieDao");
		ParameterDao paramDao = (ParameterDao) ObjectTable.getObject("ParameterDao");
		Connection conn = new DataBaseUtil().getConnection();
		boolean flag = subdieDao.getSubdieExist(conn, waferId);
		Map<String,Object> paramMap = paramDao.getWaferDataParameter(conn, waferId,flag);
		String column = paramMap.get("column").toString();
		List<Map<String,Object>> dataList = dao.getWaferData(conn, waferId, column,flag),
				secondary = dao.getSecondary(conn, waferId),
						yield = null;
		if(flag){
			yield = subdieDao.getYieldById(conn, waferId);
		}else{
			yield = dao.getYieldById(conn, waferId);
		}
		List<String> paramList = (List<String>) paramMap.get("paramList");
		List<String> upperList = (List<String>) paramMap.get("upperList");
		List<String> lowerList = (List<String>) paramMap.get("lowerList");
		String upper="",lower="";
		List<Double> ls = new ArrayList<>();
		for(int i=0,size=paramList.size();i<size;i++){
			column = paramDao.getColumnByName(conn, paramList.get(i).substring(0, paramList.get(i).indexOf("(")), waferId);
			upper = upperList.get(i);
			lower = lowerList.get(i);
			if(flag){
				ls.add(subdieDao.getYieldPerParameter(conn, waferId, upper, lower, column));
			}else{
				ls.add(dao.getYieldPerParameter(conn, waferId, upper, lower, column));	
			}
		}
		try {
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		WriteExcel.exportExcel(path, dataList, paramMap, secondary, yield, ls);
		
	}

}
