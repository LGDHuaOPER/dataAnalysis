/**
 * 
 */
package com.eoulu.service.impl;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.eoulu.action.calculate.ExpressionFormatException;
import com.eoulu.action.calculate.NumericalCalculator;
import com.eoulu.dao.CoordinateDao;
import com.eoulu.dao.CurveDao;
import com.eoulu.dao.ParameterDao;
import com.eoulu.dao.SmithDao;
import com.eoulu.dao.WaferDao;
import com.eoulu.service.AnalysisService;
import com.eoulu.util.DataBaseUtil;

/**
 * @author mengdi
 *
 * 
 */
public class AnalysisServiceImpl implements AnalysisService{

	private CurveDao curveDao = new CurveDao();
	private SmithDao smithDao = new SmithDao();
	private WaferDao dao = new WaferDao();
	@Override
	public String getVerificationDC(String[] waferId,String[] waferNO,int count) {
		int id = 0;
		String status = "success";
		for(int i=0,length=waferId.length;i<length;i++){
			id = Integer.parseInt(waferId[i]);
			if(!curveDao.getAnalysisClassify(id, count)){
				status = "晶圆"+waferNO[i]+"曲线不包含"+count+"列数据！";
						break;
			}
		}
		return status;
	}

	@Override
	public String getVerificationS2P(String[] waferId,String[] waferNO) {
		int id = 0;
		String status = "success";
		for(int i=0,length=waferId.length;i<length;i++){
			id = Integer.parseInt(waferId[i]);
			if(!curveDao.getAnalysisClassify(id)){
				status = "晶圆"+waferNO[i]+"曲线未含有S2P数据！";
						break;
			}
		}
		return status;
	}

	@Override
	public Map<String, Object> getCurveFile(String[] waferId) {
		Map<String, Object> map = new LinkedHashMap<>();
		List<String[]> list = null;
		int id = 0;
		String waferFile = "",waferNO="";
		DataBaseUtil db = new DataBaseUtil();
		Connection conn = db.getConnection();
		Map<String,Object> wafer = null;
		try {
			for(int i=0,length=waferId.length;i<length;i++){
				id = Integer.parseInt(waferId[i]);
				list = curveDao.getCurvFile(conn,id);
				wafer = dao.getFile(conn,id);
				waferFile = wafer.get("wafer_file_name").toString();
				waferNO = wafer.get("wafer_number").toString();
				map.put(waferFile+","+waferNO, list);
			}
		}finally {
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return map;
	}

	@Override
	public Map<String,Object> getSmithData( String[] curveTypeId,String[] legend,String graphStyle,String sParameter) {
		Map<String,Object> result = new LinkedHashMap<>();
		Map<String, List<Double[]>> map = null;
		int id = 0;
		for(int i=0,length=curveTypeId.length;i<length;i++){
			id = Integer.parseInt(curveTypeId[i]);
			if("S11".equals(sParameter)){
				map = smithDao.getSmithDataOfS11(id,graphStyle);
			}
			if("S12".equals(sParameter)){
				map = smithDao.getSmithDataOfS12(id,graphStyle);
			}
			if("S21".equals(sParameter)){
				map = smithDao.getSmithDataOfS21(id,graphStyle);
			}
			if("S22".equals(sParameter)){
				map = smithDao.getSmithDataOfS22(id,graphStyle);
			}
			result.put(legend[i], map);
		}
		return result;
	}

	@Override
	public Map<String, Object> getMarkerCurve(String[] curveTypeId, String sParameter,int waferId,String module) {
		
		Map<String,Object> curve = new HashMap<>();
		Map<String,Object> curveValue = new LinkedHashMap<>();
		Map<String,Object> markerValue = new LinkedHashMap<>();
		Connection conn = new DataBaseUtil().getConnection();
		try {
			conn.setAutoCommit(false);
			List<Map<String,Object>> list = null;
			List<Double[]> ls = null;
			int id = 0;
			for(String str:curveTypeId){
				id = Integer.parseInt(str);
				ls = smithDao.getSmithData(conn,id, sParameter);
				curveValue.put(str, ls);
				//曲线上的marker点
				list = smithDao.getMarkerByTypeId(conn, id);
				markerValue.put(str, list);
			}
			curve.put("curveData", curveValue);
			curve.put("markerData", markerValue);
			
		} catch (SQLException e) {
			e.printStackTrace();
		}finally {
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
			
		}
		
		return curve;
	}
	
	
	@Override
	public boolean getParameterExsit(int waferId, String parameter) {

		Object[] param = new Object[]{waferId,parameter};
		return new ParameterDao().getParameterExsit(param);
	}

	@Override
	public boolean saveCalculation(int waferId, int coordinateId, String parameter, String calculationFormula,String userFormula,
			double result,String module) {
		ParameterDao paramDao = new ParameterDao();
		Connection conn = new DataBaseUtil().getConnection();
		boolean flag = false;
		try {
			conn.setAutoCommit(false);
			Object[] param = new Object[]{waferId,module,parameter,userFormula,calculationFormula,result};
			 flag = smithDao.insertMarkerCalculation(conn,param);
			if(!flag){
				conn.rollback();
				return flag;
			}
			param = new Object[]{waferId};
			String column = paramDao.getMaxColumn(conn,param);
			column = "C"+(Integer.parseInt(column.substring(1))+1);
			param = new Object[]{waferId,parameter,column};
			flag = paramDao.insertCustomParameter(conn,param);
			if(!flag){
				conn.rollback();
				return flag;
			}
			param = new Object[]{result,coordinateId};
			flag = new CoordinateDao().updateDieParamByMarker(conn,param, column);
			if(!flag){
				conn.rollback();
				return flag;
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		}finally {
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return flag;
	}
	
	@Override
	public boolean modifyCalculation(String oldParam, String customParam, String formula,String userformula, String result,
			int calculationId,int coordinateId,int waferId) {
		
		ParameterDao paramDao = new ParameterDao();
		Connection conn = new DataBaseUtil().getConnection();
		boolean flag = false;
		try {
			conn.setAutoCommit(false);
			Object[] param = null;
			if(!oldParam.equals(customParam)){
				param = new Object[]{customParam,userformula,formula,result,calculationId};
				 flag = smithDao.updateCalculation(conn, param);
				if(!flag){
					conn.rollback();
					return flag;
				}
			}
			param = new Object[]{waferId};
			String column = paramDao.getColumnByName(conn, oldParam, waferId);
			if(!oldParam.equals(customParam)){
				flag = paramDao.updateParamName(conn, oldParam, waferId, customParam);
				if(!flag){
					conn.rollback();
					return flag;
				}
			}
			param = new Object[]{Double.parseDouble(result),coordinateId};
			flag = new CoordinateDao().updateDieParamByMarker(conn,param, column);
			if(!flag){
				conn.rollback();
				return flag;
			}

		} catch (SQLException e) {
			e.printStackTrace();
		}finally {
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		
		
		return flag;
	}
	
	@Override
	public boolean updateCalculation(int waferId, int coordinateId) {
		boolean flag = false;
		int dieId=0;
		String typeIdStr = "",parameter="",formula="",result = "",pointX="",pointY="",column="";
		Map<String,List<String>> map = null;
		Connection conn = new DataBaseUtil().getConnection();
		List<Map<String,Object>> calList = smithDao.getCalculation(conn, waferId, "TCF");
		List<Integer> ls = curveDao.getCoordinateId(conn, waferId);
		Object[] param = null;
		try {
			conn.setAutoCommit(false);
		for (int i = 0, size = ls.size(); i < size; i++) {
			dieId = ls.get(i);
			if (dieId == coordinateId) {
				continue;
			}
			typeIdStr = smithDao.getTypeIdStr(conn, dieId);
			map = smithDao.getAllMarker(conn, typeIdStr);
			for(int j=0,size2=calList.size();j<size2;j++){
				parameter = calList.get(j).get("custom_parameter").toString();
			 column =new ParameterDao().getColumnByName(conn, parameter, waferId);
				formula = calList.get(j).get("calculate_formula").toString();
				for(String key:map.keySet()){
					pointX = map.get(key).get(0);
					pointY = map.get(key).get(1);
					pointX = "NaN".equals(pointX)?"9E37":pointX;
					pointY = "NaN".equals(pointY)?"9E37":pointY;
					if(formula.contains(key+".X")){
						formula = formula.replaceAll(key+".X", pointX);
					}
					if(formula.contains(key+".Y")){
						formula = formula.replaceAll(key+".Y", pointY);
					}
				}
				result = NumericalCalculator.cal(formula).get("result").toString();
				param = new Object[]{Double.parseDouble(result),dieId};
				flag = new CoordinateDao().updateDieParamByMarker(conn,param, column);
				if(!flag){
					break;
				}
			}
		}
		conn.commit();
		} catch (ExpressionFormatException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}finally {
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return false;
	}
	
	@Override
	public boolean getMarkerExsit(int waferId, String markerName, String module, String sParameter) {
		Object[] param = new Object[]{waferId,module,sParameter,markerName};
		return smithDao.getMarkerId(param)>0?true:false;
	}

	@Override
	public boolean saveMarkerByX(int waferId, String module, int coordinateId, String[] att, String sParameter) {
		boolean flag = false,exsitFlag = false;
		Connection conn = new DataBaseUtil().getConnection();
		int curveTypeId = 0, num = 0, dieId = 0, curveTypeId2 = 0;
		List<Map<String, Object>> list = null,smithList = null;
		Map<String, Object> map = null;
		Object[] param = null;
		String  markerName = "",markerId = "";
		double pointX = 0;
		try {
			conn.setAutoCommit(false);
		
		List<Integer> ls = curveDao.getCoordinateId(conn, waferId);
		for (int i = 0, size = ls.size(); i < size; i++) {
			dieId = ls.get(i);
			if (dieId == coordinateId) {
				continue;
			}
			for (String id : att) {
				curveTypeId = Integer.parseInt(id);
				list = smithDao.getMarkerByTypeId(conn,  curveTypeId);
				num = smithDao.getRowNumber(conn, coordinateId, curveTypeId);
				curveTypeId2 = smithDao.getCurveTypeId(conn, dieId, num);
				exsitFlag = smithDao.getMarkerExsit(conn, curveTypeId2);
				if(exsitFlag){
					exsitFlag = smithDao.deleteMarkerById(conn, curveTypeId2);
				}
				smithList = smithDao.getMarkerSmithData(conn, curveTypeId2, sParameter);
				if(list.size()>0){
					map = list.get(0);
					markerName = map.get("marker_name").toString();
					markerId = map.get("marker_id").toString();
					pointX = Double.parseDouble(map.get("point_x").toString());
					List<Double[]> markerList = getMarker(smithList, pointX);
					if (markerList.size() < 1) {
						map.put(markerName, new String[] { "NaN", "NaN" });
					}
					if (markerList.size() == 1) {
						Double[] marker = markerList.get(0);
						map.put(markerName, new String[] { marker[0] + "", marker[1] + "" });
					}
					if (markerList.size() > 1) {
						Double[] marker = markerList.get(0);
						map.put(markerName, new String[] { marker[0] + "", marker[1] + "" });
					}
					String[] markerAtt = (String[]) map.get(markerName);
					param = new Object[] { waferId, curveTypeId2, module, markerName, markerAtt[0],
							markerAtt[1], "X" };
					flag = smithDao.insertMarker(conn, param);
					if (!flag) {
						conn.rollback();
						return flag;
					}
				}
				
			}
		}
		conn.commit();
		} catch (SQLException e1) {
			e1.printStackTrace();
		}finally{
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		
		return flag;
	}

	@Override
	public boolean saveMarkerByY(int waferId, String module, int coordinateId, String[] att, String sParameter) {
		boolean flag = false, minFlag = false, maxFlag = false,exsitFlag=false;
		Connection conn = new DataBaseUtil().getConnection();
		int curveTypeId = 0, num = 0, dieId = 0, curveTypeId2 = 0;
		List<Map<String, Object>> list = null, smithList = null;
		Map<String, Object> map = null;
		List<String> limit = null;
		Object[] param = null;
		String markerName = "", markerName2 = "";
		double pointY = 0, max = 0, min = 0;
		try {
			conn.setAutoCommit(false);
		List<Integer> ls = curveDao.getCoordinateId(conn, waferId);
		for (int i = 0, size = ls.size(); i < size; i++) {
			dieId = ls.get(i);
			if (dieId == coordinateId) {
				continue;
			}
			for (String id : att) {
				curveTypeId = Integer.parseInt(id);
				list = smithDao.getMarkerByTypeId(conn,  curveTypeId);
				num = smithDao.getRowNumber(conn, coordinateId, curveTypeId);
				curveTypeId2 = smithDao.getCurveTypeId(conn, dieId, num);
				exsitFlag = smithDao.getMarkerExsit(conn, curveTypeId2);
				if(exsitFlag){
					exsitFlag = smithDao.deleteMarkerById(conn, curveTypeId2);
				}
				limit = smithDao.getMaxAndMin(conn, curveTypeId2, sParameter);
				max = Double.parseDouble(limit.get(0));
				min = Double.parseDouble(limit.get(1));
				smithList = smithDao.getMarkerSmithData(conn, curveTypeId2, sParameter);
				markerName2 = "";
				
				if (list.size() > 1) {
					map = list.get(0);
					if (list.size() > 1) {
						markerName = map.get("marker_name").toString();
						markerName2 = list.get(1).get("marker_name").toString();
						if (!"NaN".equals(map.get("point_y").toString())) {
							pointY = Double.parseDouble(map.get("point_y").toString());
						} else if (!"NaN".equals(list.get(1).get("point_y").toString())) {
							pointY = Double.parseDouble(list.get(1).get("point_y").toString());
						} else {
							continue;
						}
					}
					maxFlag = smithDao.getIntersection(conn, pointY, curveTypeId2, sParameter, max + ">=");
					minFlag = smithDao.getIntersection(conn, pointY, curveTypeId2, sParameter, min + "<=");
					if (maxFlag || minFlag) {
						List<Double[]> markerList = getMarker(smithList, pointY);
						if (markerList.size() < 1) {
							map.put(markerName, new String[] { "NaN", "NaN" });
							map.put(markerName2, new String[] { "NaN", "NaN" });
						}
						if (markerList.size() == 1) {
							Double[] marker = markerList.get(0);
							map.put(markerName, new String[] { marker[0] + "", marker[1] + "" });
							map.put(markerName2, new String[] { "NaN", "NaN" });
						}
						if (markerList.size() > 1) {
							Double[] marker = markerList.get(0);
							Double[] marker2 = markerList.get(markerList.size() - 1);
							map.put(markerName, new String[] { marker[0] + "", marker[1] + "" });
							map.put(markerName2, new String[] { marker2[0] + "", marker2[1] + "" });
						}
					} else {
						map.put(markerName, new String[] { "NaN", "NaN" });
						map.put(markerName2, new String[] { "NaN", "NaN" });
					}
					String[] markerAtt = (String[]) map.get(markerName);
					param = new Object[] { waferId, curveTypeId2, module, markerName, markerAtt[0], markerAtt[1], "Y" };
					flag = smithDao.insertMarker(conn, param);
					if (!flag) {
						conn.rollback();
						return flag;
					}
					String[] markerAtt2 = (String[]) map.get(markerName2);
					param = new Object[] { waferId, curveTypeId2, module, markerName2, markerAtt2[0], markerAtt2[1],
							"Y" };
					flag = smithDao.insertMarker(conn, param);
					if (!flag) {
						conn.rollback();
						return flag;
					}
				}

			}
		}
		conn.commit();
		} catch (SQLException e1) {
			e1.printStackTrace();
		}finally{
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return flag;
	}

	
	
	public List<Double[]> getMarker(List<Map<String,Object>> ls,double markerY){
		double k=0,x1 = Double.parseDouble(ls.get(0).get("x").toString()),y1 = Double.parseDouble(ls.get(0).get("y").toString()),x2=0,y2=0;
		List<Double[]> result = new ArrayList<>();
		Double[] att = null;
		if(y1 == markerY){
			att = new Double[]{x1,y1};
			result.add(att);
		}
		for(int i=1,size=ls.size();i<size;i++){
			y1 = Double.parseDouble(ls.get(i-1).get("y").toString());
			y2 = Double.parseDouble(ls.get(i).get("y").toString());
			x1 = Double.parseDouble(ls.get(i-1).get("x").toString());
			x2 = Double.parseDouble(ls.get(i).get("x").toString());
			k = (y2-y1)/(x2-x1);
			if( k==0 ){
				if(markerY==y2){
					att = new Double[]{x2,y2};
					result.add(att);
				}
			}
			if(k>0){
				if(markerY==y2){
					att = new Double[]{x2,y2};
					result.add(att);
				}else if(y1<markerY && y2>markerY){
					x2 = y2/k;
					x2 = new BigDecimal(x2).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
					att = new Double[]{x2,y2};
					result.add(att);
				}
			}
			if(k<0){
				if(markerY==y2){
					att = new Double[]{x2,y2};
					result.add(att);
				}else if(y1<markerY && y2>markerY){
					x2 = y2/k;
					x2 = new BigDecimal(x2).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
					att = new Double[]{x2,y2};
					result.add(att);
				}
			}
		}
		return result;
	}
	
	public List<Double[]> getMarkerX(List<Map<String,Object>> ls,double markerX){
		double k=0,x1 = Double.parseDouble(ls.get(0).get("x").toString()),y1 = Double.parseDouble(ls.get(0).get("y").toString()),x2=0,y2=0;
		List<Double[]> result = new ArrayList<>();
		Double[] att = null;
		if(x1 == markerX){
			att = new Double[]{x1,y1};
			result.add(att);
		}
		for(int i=1,size=ls.size();i<size;i++){
			y1 = Double.parseDouble(ls.get(i-1).get("y").toString());
			y2 = Double.parseDouble(ls.get(i).get("y").toString());
			x1 = Double.parseDouble(ls.get(i-1).get("x").toString());
			x2 = Double.parseDouble(ls.get(i).get("x").toString());
			k = (y2-y1)/(x2-x1);
			if(x2 == markerX){
				att = new Double[]{x2,y2};
				result.add(att);
			}
			if(markerX > x1 && markerX < x2){
				y2 = k*x2;
				y2 = new BigDecimal(y2).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
				att = new Double[]{x2,y2};
				result.add(att);
			}
		}
		return result;
	}
	@Override
	public boolean operateMarker(Object[] param, String classify
			) {
		boolean flag = false;
		Connection conn = new DataBaseUtil().getConnection();
		try {
			conn.setAutoCommit(false);
			if ("add".equals(classify)) {
				flag = smithDao.insertMarker(conn, param);
				if(!flag){
					conn.rollback();
					return flag;
				}
			}
			if ("modify".equals(classify)) {
				flag = smithDao.updateMarker(conn,param);
				if(!flag){
					conn.rollback();
					return flag;
				}
			}
			conn.commit();
		} catch (SQLException e) {
			e.printStackTrace();
		}finally{
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}

		return flag;
	}

	@Override
	public int getMarkerId(Object[] param) {
		return smithDao.getMarkerId(param);
	}

	@Override
	public List<Map<String, Object>> getCalculation(int waferId, String module) {
		return smithDao.getCalculation(waferId, module);
	}
	
	@Override
	public int getCalculationId(int waferId, String parameter, String module) {
		Object[] param = new Object[]{waferId,module,parameter};
		return smithDao.getCalculationId(param);
	}

	

	@Override
	public boolean deleteMarker(Object[] param) {
		return smithDao.deleteMarker(param);
	}

	@Override
	public boolean deleteMarkerById(String[] curveTypeId) {

		int id = 0;
		boolean flag = false;
		Connection conn = new DataBaseUtil().getConnection();
		try {
			conn.setAutoCommit(false);
		for(String str:curveTypeId){
			id = Integer.parseInt(str);
			flag = smithDao.deleteMarkerById(conn, id);
			if(!flag){
				conn.rollback();
				return flag;
			}
		}
		conn.commit();
		} catch (SQLException e) {
			e.printStackTrace();
		}finally{
			try {
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return flag;
	}


	
	
	

}
