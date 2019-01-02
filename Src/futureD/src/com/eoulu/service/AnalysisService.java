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
	Map<String,Object> getSmithData(String[] curveTypeId,String[] legend,String graphStyle,String sParameter);
	/**
	 *  marker曲线数据
	 * key为S2P文件对应的主键
	 * @param curveTypeId
	 * @param sParameter
	 * @param waferId
	 * @param module
	 * @return
	 */
	Map<String,Object> getMarkerCurve(String[] curveTypeId,String sParameter,String module);
	
	/**
	 * 应用marker到其他die
	 * @param marker
	 * @param calculation
	 * @param customParameter
	 * @param calculationResult
	 * @param waferId
	 * @param sParameter
	 * @param module
	 * @return
	 */
	boolean saveMarkerByX(int waferId,String module,int coordinateId,String[] att,String sParameter);
	
	boolean saveMarkerByY(int waferId,String module,int coordinateId,String subdieFlag,String[] att,String sParameter);
	/**
	 * 判断自定义参数是否存在
	 * @param waferId
	 * @param parameter
	 * @return
	 */
	boolean getParameterExsit(int waferId,String parameter,String subdieFlag);
	
	/**
	 * 计算公式存储
	 * @param waferId
	 * @param coordinateId
	 * @param parameter
	 * @param calculationFormula
	 * @param result
	 * @param module
	 * @param sParameter
	 * @return
	 */
	boolean saveCalculation(int waferId,int coordinateId,int subdieId,String subdieFlag,String parameter,String calculationFormula,String userFormula,double result,String module);


	
	/**
	 * 获取计算公式主键
	 * @param waferId
	 * @param parameter
	 * @param module
	 * @param sParameter
	 * @return
	 */
	
	int getCalculationId(int waferId,String parameter,String module);
	
	
	/**
	 * 计算公式修改
	 * @param oldParam 修改前的自定义参数
	 * @param customParam 修改的自定义参数
	 * @param formula 公式
	 * @param result  计算结果
	 * @param calculationId
	 * @param coordinateId
	 * @param waferId
	 * @return
	 */
	boolean modifyCalculation(String oldParam,String customParam,String formula,String userformula,String result,int calculationId,int coordinateId,int subdieId,String subdieFlag,int waferId);
	

	
	
	boolean updateCalculation(int waferId,int coordinateId,String sParameter);
	/**
	 * 更新subdie其他die公式值
	 * @param waferId
	 * @param subdieId
	 * @param sParameter
	 * @return
	 */
	boolean updateSubdieCalculation(int waferId,int subdieId,String sParameter);
	/**
	 * 替换marker
	 * @param typeIdStr
	 * @param sParameter
	 * @return
	 */
	String replaceFormula(String typeIdStr, String sParameter,String formula);
	
	/**
	 * marker是否存在
	 * @param waferId
	 * @param markerName
	 * @param module
	 * @param sParameter
	 * @return
	 */
	
	boolean getMarkerExsit(int waferId, String markerName, String module, String sParameter);
	/**
	 * 添加
	 * @param param
	 * @param classify
	 * @return
	 */
	boolean insertMarker(Map<String,String[]> paramMap,int waferId,String module,String sParameter);
	
	boolean updateMarker(Map<String,String[]> paramMap,int waferId,String module);
	/**
	 * 删除marker
	 * @param param
	 * @return
	 */
	boolean deleteMarker(String curveTypeId,String sParameter);
	
	List<Object[]> getMarker(String curveTypeId,String sParameter);
	
	/**
	 * 计算区域内容
	 * @param waferId
	 * @param module
	 * @return
	 */
	List<Map<String,Object>> getCalculation(int waferId,String module);
	
	
}
