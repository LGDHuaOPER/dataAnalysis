/**
 * 
 */
package com.eoulu.service;

import java.util.List;
import java.util.Map;

/**
 * @author mengdi
 *
 * 
 */
public interface CorrelationService {

	Map<String, Object> getCorrelation(String waferIdStr,String paramX,String paramY,double minX,double maxX,double minY,double maxY);
	
}
