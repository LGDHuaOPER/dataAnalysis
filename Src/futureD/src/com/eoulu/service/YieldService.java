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
	
	/**
	 * 没有判据的参数，取参数的最值最为上下限；
	 * 共有参数的判据：取所有晶圆中此参数判据下限的最小值作为判据下限，取所有晶圆中此参数判据上限的最大值作为判据上限
	 * @param waferIdStr
	 * @param paramList
	 * @return
	 */
	Map<String,List<Double>> getRangeList(String waferIdStr,List<String> paramList);

}
