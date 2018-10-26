/**
 * 
 */
package com.eoulu.service;

import java.sql.Connection;
import java.util.List;
import java.util.Map;

/**
 * @author mengdi
 *
 * 
 */
public interface WaferMapService {

	Map<String,Object> getMapInfo(String[] waferAtt,List<String> paramList,Map<String,List<Double>> rangeList,String parameter);
	
}
