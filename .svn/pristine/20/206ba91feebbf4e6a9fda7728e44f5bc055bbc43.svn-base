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
public interface AnalysisService {

	/**
	 * 分析类别校验DC
	 * @param waferId
	 * @return
	 */
	String getVerificationDC(String[] waferId,String[] waferNO,int count);
	/**
	 * 分析类别校验S2P
	 * @param waferId
	 * @return
	 */
	String getVerificationS2P(String[] waferId,String[] waferNO);
	
	/**
	 * 获取对应的Smith文件名
	 * key:晶圆文件+晶圆编号
	 * value：曲线文件名+曲线类型对应主键
	 * @param waferId 工程分析中选中的晶圆主键
	 * @return
	 */
	Map<String,Object> getCurveFile(String[] waferId);
	
	/**
	 * Smith数据
	 * @param waferId
	 * @return
	 */
	Map<String,Object> getSmithData(String[] curveTypeId,String[] legend);
	
	
	
}
