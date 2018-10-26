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

	List<Double> getCPK(int waferId,String param);
	
	List<String> getParameter(int waferId);
	
}
