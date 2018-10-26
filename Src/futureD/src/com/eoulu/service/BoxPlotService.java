/**
 * 
 */
package com.eoulu.service;

import java.util.Map;

/**
 * @author mengdi
 *
 * 
 */
public interface BoxPlotService {

	Map<String,Object> getBoxPlot(String param,String waferIdStr);
	
}
