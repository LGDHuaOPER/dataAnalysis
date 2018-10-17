/**
 * 
 */
package com.eoulu.service;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
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
	private double sizeX;
	private double sizeY;
	
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
	public String saveWaferParameter(Connection conn,List<String> unitList,List<String> paramList,Map<String, List<String>> limitMap,WaferDO wafer,Map<String, List<String>> dataMap ){
		String status = "";
		int waferId = 0;
		Object[] param = null;
		for (String dieType : limitMap.keySet()) {
			// 存晶圆信息
			status = dao.insert(conn, wafer);
			if(!"success".equals(status)){
				break;
			}
			 waferId = dao.getWaferID(conn, wafer.getWaferNumber(), dieType);
			 String column = "";
			// 存参数
			for (int i = 0; i < paramList.size() - 1; i++) {
				column += ",C"+(i+1);
				String paramName = paramList.get(i);
				String limit = "";
				if (limitMap.get(dieType).size() <= i) {
					limit = " , ";
				} else {
					limit = limitMap.get(dieType).get(i);
				}
				String[] limitArr = limit.split(",");
				param = new Object[]{paramName,unitList.get(i),column, limitArr[0], limitArr[1]};
				status = parameterDao.insertParameter(conn, param);
				if(!"success".equals(status)){
					break;
				}
			}
			// 存数据
			int length = dataMap.get(dieType) == null ? 0 : dataMap.get(dieType).size();
			for (int i = 0; i < length; i++) {
				String[] datas = dataMap.get(dieType).get(i).split(",");
				coor.add(datas[0]);
			}
		}
		return status;
	}
	
	/**
	 * 存储die数据
	 * @param conn
	 * @param limitMap
	 * @param wafer
	 * @param dataMap
	 * @param waferNumber
	 * @param coordinateFlag
	 * @return
	 */
	public String saveCoordinate(Connection conn,Map<String, List<String>> limitMap,WaferDO wafer,Map<String, List<String>> dataMap,String waferNumber,boolean coordinateFlag){
		List<Object[]> dieList = new ArrayList<>();
		String a = "-?[0-9]+.?[0-9]+";
		String b = "-?[0-9]+.[0-9]+E[0-9]+";
		Pattern pattern = Pattern.compile(a);
		Pattern pattern2 = Pattern.compile(b);
		String[] DieXY = null;
		Object[] att = null;
		int waferSerialID = 0;
		StringBuilder c = new StringBuilder();
		StringBuilder condition = new StringBuilder();
		int count = 0;
		int index = 1;
		 int maxX = 0;
         int minX = 10000000;
         int maxY = 0;
         int minY = 10000000;
         String sizeX = "0";
         String sizeY = "0";
         int size = limitMap.keySet().size();
         int increment = 40/size;
         int waferId = 0;
		for (String dieType : limitMap.keySet()) {
			List<String> dataList = dataMap.get(dieType);
			int length = dataList == null ? 0 : dataMap.get(dieType).size();
			waferId = dao.getWaferID(conn, waferNumber, dieType);
			StringBuilder p = null;
			String[] datas = null;
			for (int i = 0; i < length; i++) {
				datas = dataList.get(i).split(",");
				if (coordinateFlag) {
					att = new Object[9 + datas.length - 4];
					att[3] = datas[1];
					att[4] = datas[2];
					index = 3;
					 maxX = Integer.parseInt(datas[1])>maxX?Integer.parseInt(datas[1]):maxX;
	            	 minX = Integer.parseInt(datas[1])<minX?Integer.parseInt(datas[1]):minX;
	            	 maxY = Integer.parseInt(datas[1])>maxY?Integer.parseInt(datas[1]):maxY;
	            	 minY = Integer.parseInt(datas[1])<minY?Integer.parseInt(datas[1]):minY;
				} else {
					att = new Object[9 + datas.length - 2];
					// 此处最影响速度
					DieXY = util.getDieXY(coor, datas[0].split("/")).split(",");
					att[3] = Integer.parseInt(DieXY[0]);
					att[4] = Integer.parseInt(DieXY[1]);
				}
				p = new StringBuilder();
				String value = "";
				for (int j = index,length2=datas.length - 1; j < length2; j++) {
					// 拼接c
					if (count == 0) {
						c.append(",C" + (index>1?(j-2):j));
						condition.append(",?");
					}
					// 拼接参数结果，要判断
					if (j > index-1) {
						Matcher isNum = pattern.matcher(datas[j]);
						Matcher isNum2 = pattern2.matcher(datas[j]);
						if (isNum.matches()) {
							value = datas[j];
						} else if (isNum2.matches()) {
							value = datas[j];
						} else if ("infinity".equals(datas[j])) {
							value = "9E31";
						} else {
							value = "-10000";
						}
						if(j==length2-1){
							p.append( value);
						}else{
							p.append( value+",");
						}
						
				
						att[9 + j - index] = Double.parseDouble(value);
					}
				}
				count++;
				att[0] = waferSerialID;
				att[1] = datas[0];
				att[2] = dieType;
				att[5] = getBin(p, waferSerialID, conn);
				att[6] = datas[datas.length - 1];
				att[7] = 0;
				att[8] = 0;
				dieList.add(att);

			}

		}
	  String status = coordinate.insertCoordinate(conn, dieList, c.toString(), condition.toString());
	  if(coordinateFlag){
		  sizeX = ((double)200000/(maxX-minX+1))+"";
          sizeY = ((double)200000/(maxY-minY+1))+"";
	}else{
		sizeX = DieXY[2];
		sizeY = DieXY[3];
	}
	  return status;
	}
	
	public int getBin(StringBuilder paramvalue,int waferId,Connection conn){
		//按逗号分割paramvalue，获取参数结果
		String[] paramvalues = paramvalue.toString().split(",");
		//获取对应的上下限，根据WaferSerialID
		List<Map<String, Double>> upperAndLowerLimit;
		boolean bin = true;
		upperAndLowerLimit = parameterDao.getUpperAndLowerLimit(waferId, conn);
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
	public String saveMap(Connection conn,int waferId,String waferNumber){
		double diameter = 200;
		double flatLength = 50;
		MapParameterDO map = new MapParameterDO();
		map.setCuttingEdgeLength(flatLength);
		map.setDiameter(diameter);
		map.setDieXMax(sizeX);
		map.setDieYMax(sizeY);
		map.setDirectionX("Right");
		map.setDirectionY("Down");
		map.setSetCoorX("Right");
		map.setSetCoorY("Down");
		map.setSetCoorDieX(1);
		map.setSetCoorDieY(1);
		map.setStandCoorDieX("A");
		map.setStandCoorDieY("A");
		map.setWaferId(waferId);
		map.setWaferNumber(waferNumber);
		String status = parameterDao.insertMapParameter(conn,map);
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
