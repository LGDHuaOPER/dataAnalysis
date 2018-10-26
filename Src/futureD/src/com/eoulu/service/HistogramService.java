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
public interface HistogramService {
	
	/**
	 * 取多个晶圆的参数交集，不包含自定义参数
	 * @param waferIdStr
	 * @return
	 */
	List<String> getWaferParameter(String waferIdStr);
	
	/**
	 * 直方图
	 * @param paramList 多个晶圆的参数交集
	 * @param waferIdStr 晶圆主键拼接的字符串
	 * @return
	 */
	Map<String,Object> getPercent(String paramName, String waferIdStr, double left, double right, int equal);
	/**
	 *参数以及范围
	 * @param paramList
	 * @param waferIdStr
	 * @return
	 */
//	Map<String,List<Double>> getHistogramRange(List<String> paramList,String waferIdStr);

}
