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
	Map<String,Object> getGaussian(int waferId,String param,double left,double right,int equal);
	
	/**
	 * 参数范围
	 * @param paramList
	 * @param waferIdStr
	 * @return
	 */
	Map<String,List<Double>> getRangList(List<String> paramList,String waferIdStr);
	
	
}
