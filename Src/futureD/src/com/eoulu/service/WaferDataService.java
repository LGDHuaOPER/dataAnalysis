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
public interface WaferDataService {

	
	/**
	 * wafer数据显示
	 * @param waferId
	 * @return
	 */
	Map<String,Object> getWaferData(int waferId);
	
	
	void getExportExcel(int waferId,String path);
	
}
