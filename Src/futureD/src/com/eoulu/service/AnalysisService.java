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
	/**
	 * marker曲线数据
	 * key为S2P文件对应的主键
	 * @param curveTypeId
	 * @param sParameter  s参数：S11、S12、S21、S22
	 * @return
	 */
	Map<String,Object> getMarkerCurve(String[] curveTypeId,String sParameter);
	
	/**
	 * 保存分析模型的marker与计算参数
	 * @param marker
	 * @param calculation
	 * @param customParameter
	 * @param calculationResult
	 * @param waferId
	 * @param sParameter
	 * @param module
	 * @return
	 */
	boolean saveMarker(String[] marker,String[] calculation,String[] customParameter,String[] calculationResult,String waferId,String sParameter,String module);
	
	
}
