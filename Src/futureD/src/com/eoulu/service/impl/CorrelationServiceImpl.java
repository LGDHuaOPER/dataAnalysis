/**
 * 
 */
package com.eoulu.service.impl;

import java.sql.Connection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.eoulu.dao.CorrelationDao;
import com.eoulu.dao.SubdieDao;
import com.eoulu.dao.WaferDao;
import com.eoulu.service.CorrelationService;
import com.eoulu.transfer.ObjectTable;
import com.eoulu.util.DataBaseUtil;

/**
 * @author mengdi
 *
 * 
 */
public class CorrelationServiceImpl implements CorrelationService{

	@Override
	public Map<String, Object> getCorrelation(String waferIdStr, String paramX, String paramY, double minX, double maxX,
			double minY, double maxY) {
		WaferDao waferDao = (WaferDao) ObjectTable.getObject("WaferDao");
		SubdieDao subdieDao = (SubdieDao) ObjectTable.getObject("SubdieDao");
		Map<String, Object> result = new HashMap<>();
		String[] att = waferIdStr.split(",");
		Map<String, Object> map = null;
		int waferId = 0;
		boolean flag = false;
	
		DataBaseUtil db = DataBaseUtil.getInstance();
		Connection conn = db.getConnection();
		for(int i=0,length=att.length;i<length;i++){
			waferId = Integer.parseInt(att[i]);
		
			flag = subdieDao.getSubdieExist(conn, waferId);
			map = new CorrelationDao().getCorrelation(conn,waferId, paramX, paramY, minX, maxX, minY, maxY,flag);
			
			result.put(waferId+"", map);
		}
	   db.close(conn);
		return result;
	}

}
