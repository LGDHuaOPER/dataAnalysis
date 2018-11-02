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
public interface CPKService {

	Map<String,List<Double>>  getCPK(String waferIdStr,String param);
	
	List<String> getParameter(int waferId);
	
}
