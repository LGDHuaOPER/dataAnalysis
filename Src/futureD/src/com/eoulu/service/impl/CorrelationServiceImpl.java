/**
 * 
 */
package com.eoulu.service.impl;

import java.util.List;
import java.util.Map;

import com.eoulu.dao.CorrelationDao;
import com.eoulu.service.CorrelationService;

/**
 * @author mengdi
 *
 * 
 */
public class CorrelationServiceImpl implements CorrelationService{

	@Override
	public Map<String, Object> getCorrelation(int waferId, String paramX, String paramY, double minX, double maxX,
			double minY, double maxY) {
		
		Map<String, Object> map = new CorrelationDao().getCorrelation(waferId, paramX, paramY, minX, maxX, minY, maxY);
		
		return map;
	}

}
