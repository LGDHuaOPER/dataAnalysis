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
public interface YieldService {
	
	Map<String,Object> getYield(String waferIdStr,List<String> paramList);

}
