/**
 * 
 */
package com.eoulu.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.eoulu.dao.CorrelationDao;
import com.eoulu.dao.WaferDao;
import com.eoulu.service.CorrelationService;

/**
 * @author mengdi
 *
 * 
 */
public class CorrelationServiceImpl implements CorrelationService{

	@Override
	public Map<String, Object> getCorrelation(String waferIdStr, String paramX, String paramY, double minX, double maxX,
			double minY, double maxY) {
		Map<String, Object> result = new HashMap<>();
		String[] att = waferIdStr.split(",");
		Map<String, Object> map = null;
		int waferId = 0;
		String waferNO = "";
		for(int i=0,length=att.length;i<length;i++){
			waferId = Integer.parseInt(att[i]);
			map = new CorrelationDao().getCorrelation(waferId, paramX, paramY, minX, maxX, minY, maxY);
			waferNO = new WaferDao().getWaferNO(waferId);
			result.put(waferNO, map);
		}
		
		return result;
	}

}
