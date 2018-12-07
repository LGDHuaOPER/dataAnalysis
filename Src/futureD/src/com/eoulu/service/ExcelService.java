/**
 * 
 */
package com.eoulu.service;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.eoulu.dao.CoordinateDao;
import com.eoulu.dao.CurveDao;
import com.eoulu.dao.ParameterDao;
import com.eoulu.dao.WaferDao;
import com.eoulu.entity.MapParameterDO;
import com.eoulu.entity.WaferDO;
import com.eoulu.parser.ExcelParser;
import com.eoulu.parser.ZipFileParser;


/**
 * @author mengdi
 *
 * 
 */
public class ExcelService {
	
	private WaferDao dao ;
	private ParameterDao parameterDao;
	private ExcelParser util ;
	private CoordinateDao coordinate ;
	public ExcelService(WaferDao dao,ParameterDao parameterDao,ExcelParser util,CoordinateDao coordinate){
		this.dao = dao;
		this.parameterDao = parameterDao;
		this.util = util;
		this.coordinate = coordinate;
	}

	private List<String> coor = new ArrayList<String>();
//	private double sizeX;
//	private double sizeY;
	
	/**
	 * 存储晶圆信息与晶圆参数
	 * @param conn
	 * @param unitList
	 * @param paramList
	 * @param limitMap
	 * @param wafer
	 * @param dataMap
	 * @return
	 */
	public String saveWaferParameter(Connection conn,List<List<String>> paramList,Map<String, List<String>> limitMap,WaferDO wafer ){
		String status = "";
		int waferId = 0;
		Object[] param = null;
		for (String dieType : limitMap.keySet()) {
			 waferId = dao.queryWaferinfo(conn, wafer.getWaferNumber(), wafer.getLotNumber(), wafer.getDeviceNumber(),dieType);
			// 覆盖已存在的
			if(waferId !=0){
				 dao.remove(conn,waferId, 2);
			}
			// 存晶圆信息
			wafer.setDieType(dieType);
			status = dao.insert(conn, wafer);
			if(!"success".equals(status)){
				break;
			}
			waferId = dao.queryWaferinfo(conn, wafer.getWaferNumber(), wafer.getLotNumber(), wafer.getDeviceNumber(),dieType);
			// 存参数
			for (int i = 0; i < paramList.size() - 1; i++) {
				String limit = "";
				if (limitMap.get(dieType).size() <= i) {
					limit = " , ";
				} else {
					limit = limitMap.get(dieType).get(i);
				}
				String[] limitArr = limit.split(",");
				param = new Object[]{waferId,paramList.get(i).get(0),paramList.get(i).get(1),paramList.get(i).get(2), limitArr[0], limitArr[1]};
				status = parameterDao.insertParameter(conn, param);
				if(!"success".equals(status)){
					break;
				}
			}
		}
		return status;
	}
	
	/**
	 * 存储die数据
	 * 
	 * @param conn
	 * @param limitMap
	 * @param wafer
	 * @param dataMap
	 * @param waferNumber
	 * @param coordinateFlag
	 * @return
	 */
	public String saveCoordinate(Connection conn, Map<String, List<String>> limitMap,
			Map<String,List<Object[]>> dataMap, String waferNumber, boolean coordinateFlag,String column,String str) {
		List<Object[]> dieList = null;
		int  maxX = 0, minX = 10000000, maxY = 0, minY = 10000000, size = limitMap.keySet().size(),
				 waferId = 0;
		String sizeX = "0", sizeY = "0", status="";
		double lower = 0, upper = 0;
		long time0 = System.currentTimeMillis();
		for (String dieType : limitMap.keySet()) {
			dieList = dataMap.get(dieType);
			waferId = dao.getWaferID(conn, waferNumber, dieType);
			 status = coordinate.insertCoordinate(conn, dieList,column, str,waferId);
			 if(!"success".equals(status)){
				 return status;
			 }
		}
		
		return status;
	}
	
	public String updateYield(Connection conn,Map<String, List<String>> limitMap,String waferNO){
		int waferId=0;
		double yield = 0;
		for(String dieType:limitMap.keySet()){
			waferId = dao.getWaferID(conn, waferNO, dieType);
			yield = coordinate.getYield(conn, waferId)*100;
			if(!dao.updateYield(conn, yield, waferId)){
				return "良率计算失败！";
			}
		}
		return "success";
	}
	
	public String updateYield(Connection conn,List<String> typeList,String waferNO){
		int waferId=0;
		double yield = 0;
		for(int i=0,size=typeList.size();i<size;i++){
			waferId = dao.getWaferID(conn, waferNO, typeList.get(i));
			yield = coordinate.getYield(conn, waferId)*100;
			if(!dao.updateYield(conn, yield, waferId)){
				return "良率计算失败！";
			}
//			System.out.println("id:"+waferId+"---yield:"+yield);
		}
		return "success";
	}
	
	public int getBin(StringBuilder paramvalue,int waferId,Connection conn){
		//按逗号分割paramvalue，获取参数结果
		String[] paramvalues = paramvalue.toString().split(",");
		System.out.println(Arrays.toString(paramvalues));
		//获取对应的上下限，根据waferId
		List<Map<String, Double>> upperAndLowerLimit = parameterDao.getUpperAndLowerLimit(waferId, conn);
		System.out.println(upperAndLowerLimit);
		boolean bin = true;
		//计算bin
		for(int i =0;i<paramvalues.length;i++){
			if(!bin){
				break;
			}
			bin =bin&&(paramvalues[i]==null||paramvalues[i].equals("")||(Double.parseDouble(paramvalues[i])>=upperAndLowerLimit.get(i).get("lower")&&Double.parseDouble(paramvalues[i])<=upperAndLowerLimit.get(i).get("upper")));
		} 
		return bin?1:255;
	}
	
	/**
	 * map参数存储
	 * @param conn
	 * @param waferId
	 * @param waferNumber
	 * @return
	 */
	public String saveMap(Connection conn,String waferNumber,boolean exsit,double sizeX,double sizeY){
		double diameter = 200;
		double flatLength = 50;
		MapParameterDO map = new MapParameterDO();
		map.setCuttingEdgeLength(flatLength);
		map.setDiameter(diameter);
		map.setDieXMax(sizeX);
		map.setDieYMax(sizeY);
		map.setDirectionX("Left");
		map.setDirectionY("Down");
		map.setSetCoorX("Left");
		map.setSetCoorY("Down");
		map.setSetCoorDieX(1);
		map.setSetCoorDieY(1);
		map.setStandCoorDieX("A");
		map.setStandCoorDieY("A");
		map.setWaferNumber(waferNumber);
		String status = "";
		if(exsit){
			status = parameterDao.updateMapParameter(conn, map);
		}else{
			status = parameterDao.insertMapParameter(conn,map);
		}
		return status;
		
	}
	/**
	 * TXT参数存储
	 * @param conn
	 * @param interval  进度间隔
	 * @param waferId
	 * @param paramList
	 * @param downLimit
	 * @param upLimit
	 * @param hex      输出结果数据十六进制判断
	 * @param dataList
	 * @return
	 */
	public String saveTxtParameter(Connection conn,int interval,int waferId,List<String> paramList,List<String> downLimit,List<String> upLimit,List<Integer> hex,List<Object> dataList){
		String paramColumn = "";
		String valueColumn = "";
		String lower = "";
		String up = "";
		String status = "";
		Object[] param = null;
		String column = "";
		int increment = 50/10;
		int count = 1;
		for(int i=0,length = paramList.size();i<length;i++){
			if(i==(length/5*count) && count<increment){
				interval += 10;
				count ++;
			}
			lower = downLimit.get(i);
			up = upLimit.get(i);
			column = "C"+(i+1);
			for(int j=0,length2=hex.size();j<length2;j++){
				if( hex.get(j).equals(i) ){
					column = "H"+(j+1);
					break;
				}
			}
			paramColumn += ","+column;
			valueColumn += ",?";
			if(up.equals("") || lower.equals("")){
				param = new Object[]{waferId,paramList.get(i),"",column};
				status = ParameterDao.insertExcelParameter(conn, param);
			}else{
				param = new Object[]{waferId,paramList.get(i),"",column,up,lower};
				status = parameterDao.insertParameter(conn, param);
			}
		
			if(!"success".equals(status)){
				return status;
			}
			
		}
		System.out.println(paramColumn);
		status = coordinate.insertTxtCoordinate(conn, paramColumn, valueColumn, dataList, waferId);
		return status;
	}
	
}
