/**
 * 
 */
package com.eoulu.service;

import java.sql.Connection;
import java.util.List;
import java.util.Map;

import com.eoulu.transfer.WaferMapDTO;

/**
 * @author mengdi
 *
 * 
 */
public interface WaferMapService {

	/**
	 * 良率晶圆
	 * @param waferAtt
	 * @param paramList
	 * @param rangeList
	 * @param parameter
	 * @return
	 */
	Map<String,Object> getMapInfo(String[] waferAtt,List<String> paramList,Map<String,List<Double>> rangeList);
	
	
	
	/**
	 * 色阶晶圆
	 * @param waferAtt
	 * @param paramList
	 * @param rangeList
	 * @param parameter
	 * @return
	 */
	Map<String,Object> getColorMap(String[] waferAtt,List<String> paramList,Map<String,List<Double>> rangeList);
	
	/**
	 * 矢量map
	 * @param waferId
	 * @param subdieName
	 * @param deviceGroup
	 * @return
	 */
	Map<String, Object> getVectorMap(int waferId);
	/**
	 * 矢量map 过滤
	 * @param waferId
	 * @param subdieName
	 * @param deviceGroup
	 * @return
	 */
	Object getVectorMap(int waferId,String subdieName,String deviceGroup);
	/**
	 * 指定晶圆的所有subdie
	 * @param waferId
	 * @return
	 */
	List<String> getSubdie(int waferId);
	
	/**
	 * 指定晶圆的所有曲线类型
	 * @param waferId
	 * @return
	 */
	List<String> getDeviceGroup(int waferId);
	/**
	 * die对应的曲线
	 * @param coordinateId
	 * @param subdieName
	 * @param deviceGroup
	 * @return
	 */
	Map<String, Object> getVectorCurve(int coordinateId, String subdieName, String deviceGroup);
	
	
}
