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
public interface GaussianService {

	
	/**
	 * 正态分布
	 * @param waferId
	 * @param param
	 * @param left
	 * @param right
	 * @param equal
	 * @return
	 */
	Map<String,Object> getGaussian(Map<String,Object> map);
	
	/**
	 * 参数范围
	 * @param paramList
	 * @param waferIdStr
	 * @return
	 */
	Map<String,List<Double>> getRangList(List<String> paramList,String waferIdStr);
	
	
}
