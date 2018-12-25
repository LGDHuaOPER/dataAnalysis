/**
 * 
 */
package com.eoulu.service.impl;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
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
import com.eoulu.enums.SubdieFlagEnum;
import com.eoulu.service.AnalysisService;
import com.eoulu.util.DataBaseUtil;

/**
 * @author mengdi
 *
 * 
 */
public class AnalysisServiceImpl implements AnalysisService{

	@Override
	public String getVerificationDC(String[] waferId,String[] waferNO,int count) {
		CurveDao curveDao = new CurveDao();
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
		CurveDao curveDao = new CurveDao();
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
		CurveDao curveDao = new CurveDao();
		WaferDao dao = new WaferDao();
		Map<String, Object> map = new LinkedHashMap<>();
		List<String[]> list = null;
		int id = 0;
		String waferNO="";
		Connection conn = DataBaseUtil.getInstance().getConnection();
		Map<String,Object> wafer = null;
		Map<String, Object> waferInfo = null;
		try {
			for(int i=0,length=waferId.length;i<length;i++){
				id = Integer.parseInt(waferId[i]);
				list = curveDao.getCurvFile(conn,id);
				wafer = dao.getFile(conn,id);
//				waferFile = wafer.get("wafer_file_name").toString();
				waferNO = wafer.get("wafer_number").toString()+".CSV";
				waferInfo = new HashMap<>();
				waferInfo.put("waferFile", waferNO);
				waferInfo.put("curveFile", list);
				map.put(id+"", waferInfo);
				
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
	public Map<String, Object> getSmithData(String[] curveTypeId, String[] legend, String graphStyle,
			String sParameter) {
		SmithDao smithDao = new SmithDao();
		Map<String, Object> result = new LinkedHashMap<>();
		Map<String, List<Object[]>> map = null;
		int id = 0;
		DataBaseUtil db = DataBaseUtil.getInstance();
		Connection conn = db.getConnection();
		if ("".equals(sParameter)) {
			for (int i = 0, length = curveTypeId.length; i < length; i++) {
				id = Integer.parseInt(curveTypeId[i]);
				map = new HashMap<>();
				map.put("S11", smithDao.getGraphStyleData(conn, id, "Smith", "S11",db));
				map.put("S12", smithDao.getGraphStyleData(conn, id, "XYdBOfMagnitude", "S12",db));
				map.put("S21", smithDao.getGraphStyleData(conn, id, "XYdBOfMagnitude", "S21",db));
				map.put("S22", smithDao.getGraphStyleData(conn, id, "Smith", "S22",db));
				result.put(legend == null ? "Smith" : legend[i], map);
			}
		} else {
			for (int i = 0, length = curveTypeId.length; i < length; i++) {
				id = Integer.parseInt(curveTypeId[i]);
				map = new HashMap<>();
				map.put(sParameter, smithDao.getGraphStyleData(conn, id, graphStyle, sParameter,db));
				result.put(legend == null ? "Smith" : legend[i], map);
			}
		}

		db.close(conn);
		return result;
	}

	@Override
	public Map<String, Object> getMarkerCurve(String[] curveTypeId, String sParameter,String module) {
		SmithDao smithDao = new SmithDao();
		Map<String,Object> curve = new HashMap<>();
		Map<String,Object> curveValue = null;
		DataBaseUtil db = DataBaseUtil.getInstance();
		Connection conn = db.getConnection();
		try {
			conn.setAutoCommit(false);
			List<Map<String,Object>> list = null;
			List<Object[]> ls = null;
			int id = 0;
			for(int i=0,length=curveTypeId.length;i<length;i++){
				id = Integer.parseInt(curveTypeId[i]);
				ls = smithDao.getGraphStyleData(conn, id, "XYdBOfMagnitude", sParameter, db);
				curveValue = new HashMap<>();
				curveValue.put("curveData", ls);
				//曲线上的marker点
				list = smithDao.getMarkerByTypeId(conn, id,sParameter,db);
				curveValue.put("markerData", list);
				curve.put(curveTypeId[i], curveValue);
			}
			
		} catch (SQLException e) {
			e.printStackTrace();
		}finally {
			db.close(conn);
		}
		
		return curve;
	}
	
	
	@Override
	public boolean getParameterExsit(int waferId, String parameter,String subdieFlag) {

		Object[] param = new Object[]{waferId,parameter};
		if(subdieFlag.equals(SubdieFlagEnum.DIE.getCode())){
			return new ParameterDao().getParameterExsit(param);
		}else {
			return new ParameterDao().getSubdieParameterExsit(param);
		}
		
	}

	@Override
	public boolean saveCalculation(int waferId, int coordinateId,int subdieId,String subdieFlag, String parameter, String calculationFormula,String userFormula,
			double result,String module) {
		ParameterDao paramDao = new ParameterDao();
		SmithDao smithDao = new SmithDao();
		DataBaseUtil db = DataBaseUtil.getInstance();
		Connection conn = db.getConnection();
		boolean flag = false;
		try {
			conn.setAutoCommit(false);
			Object[] param = new Object[]{waferId,module,userFormula,parameter,calculationFormula,result};
			 flag = smithDao.insertMarkerCalculation(conn,param,db);
			if(!flag){
				conn.rollback();
				return flag;
			}
			//System.out.println("subdie=============="+SubdieFlagEnum.DIE.getCode());
			if(subdieFlag.equals(SubdieFlagEnum.DIE.getCode())){
				param = new Object[]{waferId};
				String column = paramDao.getMaxColumn(conn,param);
				if(column.equals("")){
					column = "C1";
				}else{
					column = "C"+(Integer.parseInt(column.substring(1))+1);
				}
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
			}else if(subdieFlag.equals(SubdieFlagEnum.SUBDIE.getCode())){
				param = new Object[]{waferId};
				String column = paramDao.getSubdieMaxColumn(conn, param);
				if(column.equals("")){
					column = "C1";
				}else{
					column = "C"+(Integer.parseInt(column.substring(1))+1);
				}
				param = new Object[]{waferId,parameter,column};
				flag = paramDao.insertSubdieCustomParameter(conn, param);
				if(!flag){
					conn.rollback();
					return flag;
				}
				param = new Object[]{result,subdieId};
				flag = new CoordinateDao().updateSubdieParamByMarker(conn, param, column);
				if(!flag){
					conn.rollback();
					return flag;
				}
			}
			
			conn.commit();
		} catch (SQLException e) {
			e.printStackTrace();
		}finally {
			db.close(conn);
		}
		return flag;
	}
	
	@Override
	public boolean modifyCalculation(String oldParam, String customParam, String formula,String userformula, String result,
			int calculationId,int coordinateId,int subdieId,String subdieFlag,int waferId) {
		SmithDao smithDao = new SmithDao();
		ParameterDao paramDao = new ParameterDao();
		DataBaseUtil db = DataBaseUtil.getInstance();
		Connection conn = db.getConnection();
		boolean flag = false;
		try {
			conn.setAutoCommit(false);
			Object[] param = null;
			param = new Object[]{customParam,userformula,formula,result,calculationId};
			 flag = smithDao.updateCalculation(conn, param,db);
			if(!flag){
				conn.rollback();
				return flag;
			}
			if(subdieFlag.equals(SubdieFlagEnum.DIE.getCode())){
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
			}else if(subdieFlag.equals(SubdieFlagEnum.SUBDIE.getCode())){
				param = new Object[]{waferId};
				String column = paramDao.getSubdieColumn(conn, oldParam, waferId);
				if(!oldParam.equals(customParam)){
					flag = paramDao.updateSubdieParamName(conn, oldParam, waferId, customParam);
					if(!flag){
						conn.rollback();
						return flag;
					}
				}
				param = new Object[]{Double.parseDouble(result),coordinateId};
				flag = new CoordinateDao().updateSubdieParamByMarker(conn,param, column);
				if(!flag){
					conn.rollback();
					return flag;
				}
			}
			
			conn.commit();
		} catch (SQLException e) {
			e.printStackTrace();
		}finally {
			db.close(conn);
		}
		
		
		return flag;
	}
	

	
	
	
	@Override
	public boolean updateCalculation(int waferId, int coordinateId,String sParameter) {
	
	
		CurveDao curveDao = new CurveDao();
		SmithDao smithDao = new SmithDao();
		ParameterDao paramDao = new ParameterDao();
		boolean flag = false;
		int dieId=0;
		String typeIdStr = "",parameter="",formula="",result = "",pointX="",pointY="",column="";
		Map<String,List<String>> map = null;
		DataBaseUtil db = DataBaseUtil.getInstance();
		Connection conn = db.getConnection();
		List<Map<String,Object>> calList = smithDao.getCalculation(conn, waferId, "TCF",db);
		List<Integer> ls = null;

		ls = curveDao.getCoordinateId(conn, waferId);
		
		Object[] param = null;
		try {
			conn.setAutoCommit(false);
		for (int i = 0, size = ls.size(); i < size; i++) {
			dieId = ls.get(i);
			if (dieId == coordinateId) {
				continue;
			}
			typeIdStr = smithDao.getTypeIdStr(conn, dieId,db);
			map = smithDao.getAllMarker(conn, typeIdStr,sParameter,db);
			for(int j=0,size2=calList.size();j<size2;j++){
				parameter = calList.get(j).get("custom_parameter").toString();
				column = paramDao.getColumnByName(conn,parameter, waferId);
				formula = calList.get(j).get("user_formula").toString();
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
					conn.rollback();
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
			db.close(conn);
		}
		return false;
	}
	
	@Override
	public boolean updateSubdieCalculation(int waferId, int subdieId,String sParameter) {
	
	
		CurveDao curveDao = new CurveDao();
		SmithDao smithDao = new SmithDao();
		ParameterDao paramDao = new ParameterDao();
		boolean flag = false;
		int dieId=0;
		String typeIdStr = "",parameter="",formula="",result = "",pointX="",pointY="",column="";
		Map<String,List<String>> map = null;
		DataBaseUtil db = DataBaseUtil.getInstance();
		Connection conn = db.getConnection();
		List<Map<String,Object>> calList = smithDao.getCalculation(conn, waferId, "TCF",db);
		List<Integer> ls = null;

		ls = curveDao.getSubdieId(conn, waferId);
		
		Object[] param = null;
		try {
			conn.setAutoCommit(false);
		for (int i = 0, size = ls.size(); i < size; i++) {
			dieId = ls.get(i);
			if (dieId == subdieId) {
				continue;
			}
			typeIdStr = smithDao.getSubdieTypeIdStr(conn, dieId,db);
			map = smithDao.getAllMarker(conn, typeIdStr,sParameter,db);
			for(int j=0,size2=calList.size();j<size2;j++){
				parameter = calList.get(j).get("custom_parameter").toString();
				column = paramDao.getSubdieColumn(conn,parameter, waferId);
				formula = calList.get(j).get("user_formula").toString();
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
				flag = new CoordinateDao().updateSubdieParamByMarker(conn,param, column);
				if(!flag){
					conn.rollback();
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
			db.close(conn);
		}
		return false;
	}
	


	@Override
	public boolean getMarkerExsit(int waferId, String markerName, String module, String sParameter) {
		DataBaseUtil db = DataBaseUtil.getInstance();
		SmithDao smithDao = new SmithDao();
		Object[] param = new Object[]{waferId,module,sParameter,markerName};
		return smithDao.getMarkerId(param,db)>0?true:false;
	}

	@Override
	public boolean saveMarkerByX(int waferId, String module, int coordinateId, String[] att, String sParameter) {
		
		boolean flag = false,exsitFlag = false;
		CurveDao curveDao = new CurveDao();
		
		DataBaseUtil db = DataBaseUtil.getInstance();
		Connection conn = db.getConnection();
		int curveTypeId = 0, num = 0, dieId = 0, curveTypeId2 = 0;
		List<Map<String, Object>> list = null,smithList = null;
		Map<String, Object> map = null;
		Object[] param = null;
		String  markerName = "",markerId = "";
		double pointX = 0;
		try {
			conn.setAutoCommit(false);
		
		List<Integer> ls = curveDao.getCoordinateId(conn, waferId);
		SmithDao smithDao = new SmithDao();
		for (int i = 0, size = ls.size(); i < size; i++) {
			dieId = ls.get(i);
			if (dieId == coordinateId) {
				continue;
			}
			for (String id : att) {
				curveTypeId = Integer.parseInt(id);
				list = smithDao.getMarkerByTypeId(conn,  curveTypeId,sParameter,db);
				num = smithDao.getRowNumber(conn, coordinateId, curveTypeId,db);
				curveTypeId2 = smithDao.getCurveTypeId(conn, dieId, num,db);
				exsitFlag = smithDao.getMarkerExsit(conn, curveTypeId2,sParameter,db);
				if(exsitFlag){
					exsitFlag = smithDao.deleteMarkerById(conn, curveTypeId2,sParameter,db);
				}
				smithList = smithDao.getMarkerSmithData(conn, curveTypeId2, sParameter,db);
				if(list.size()>0){
					map = list.get(0);
					markerName = map.get("marker_name").toString();
					markerId = map.get("marker_id").toString();
					pointX = Double.parseDouble(map.get("point_x").toString());
					List<Double[]> markerList = getMarkerX(smithList, pointX);
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
							markerAtt[1], "X",sParameter };
					flag = smithDao.insertMarker(conn, param,db);
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
			db.close(conn);
		}
		
		return flag;
	}

	@Override
	public boolean saveMarkerByY(int waferId, String module, int coordinateId,String subdieFlag, String[] att, String sParameter) {
		boolean flag = false, minFlag = false, maxFlag = false,exsitFlag=false;
		CurveDao curveDao = new CurveDao();
		SmithDao smithDao = new SmithDao();
		DataBaseUtil db = DataBaseUtil.getInstance();
		Connection conn = db.getConnection();
		int curveTypeId = 0, num = 0, dieId = 0, curveTypeId2 = 0;
		List<Map<String, Object>> list = null, smithList = null;
		Map<String, Object> map = null;
		List<String> limit = null;
		Object[] param = null;
		String markerName = "", markerName2 = "";
		double pointY = 0, max = 0, min = 0;
		try {
			conn.setAutoCommit(false);
		List<Integer> ls = null;
		if(subdieFlag.equals(SubdieFlagEnum.DIE.getCode())){
			ls = curveDao.getCoordinateId(conn, waferId);
		}else {
			ls = curveDao.getSubdieId(conn, waferId);
		}
				
		for (int i = 0, size = ls.size(); i < size; i++) {
			dieId = ls.get(i);
			if (dieId == coordinateId) {
				continue;
			}
			for (String id : att) {
				curveTypeId = Integer.parseInt(id);
				list = smithDao.getMarkerByTypeId(conn,  curveTypeId,sParameter,db);
				if(subdieFlag.equals(SubdieFlagEnum.DIE.getCode())){
					num = smithDao.getRowNumber(conn, coordinateId, curveTypeId,db);
					curveTypeId2 = smithDao.getCurveTypeId(conn, dieId, num,db);
				}else {
					num = smithDao.getSubdieRowNumber(conn, coordinateId, curveTypeId,db);
					curveTypeId2 = smithDao.getSubdieCurveTypeId(conn, dieId, num,db);
				}
				
				
				exsitFlag = smithDao.getMarkerExsit(conn, curveTypeId2,sParameter,db);
				if(exsitFlag){
					exsitFlag = smithDao.deleteMarkerById(conn, curveTypeId2,sParameter,db);
				}
				limit = smithDao.getMaxAndMin(conn, curveTypeId2, sParameter,db);
				max = Double.parseDouble(limit.get(0));
				min = Double.parseDouble(limit.get(1));
				smithList = smithDao.getMarkerSmithData(conn, curveTypeId2, sParameter,db);
				markerName2 = "";
				
				if (list.size() > 1) {
					map = list.get(0);
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
					
				maxFlag = smithDao.getIntersection(conn, pointY, curveTypeId2, sParameter, max + ">=",db);
				minFlag = smithDao.getIntersection(conn, pointY, curveTypeId2, sParameter, min + "<=",db);
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
				param = new Object[] { waferId, curveTypeId2, module, markerName, markerAtt[0], markerAtt[1], "Y",sParameter };
				flag = smithDao.insertMarker(conn, param,db);
				if (!flag) {
					conn.rollback();
					return flag;
				}
				String[] markerAtt2 = (String[]) map.get(markerName2);
				param = new Object[] { waferId, curveTypeId2, module, markerName2, markerAtt2[0], markerAtt2[1],
						"Y",sParameter };
				flag = smithDao.insertMarker(conn, param,db);
				if (!flag) {
					conn.rollback();
					return flag;
				}
				

			}
		}
		conn.commit();
		} catch (SQLException e1) {
			e1.printStackTrace();
		}finally{
			db.close(conn);
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
					double b = y2 - k * x2;
					double pointx = (markerY - b)/k;
					pointx = new BigDecimal(pointx).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
					att = new Double[]{pointx,markerY};
					result.add(att);
				}
			}
			if(k<0){
				if(markerY==y2){
					att = new Double[]{x2,y2};
					result.add(att);
				}else if(y1<markerY && y2>markerY){
					double b = y2 - k * x2;
					double pointx = (markerY - b)/k;
					pointx = new BigDecimal(pointx).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
					att = new Double[]{pointx,markerY};
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
			if(markerX > x1 && markerX < x2){            //x拟合？？？？
				y2 = k*x2;
				y2 = new BigDecimal(y2).setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
				att = new Double[]{x2,y2};
				result.add(att);
			}
		}
		return result;
	}
	@Override
	public boolean insertMarker(Map<String,String[]> paramMap,int waferId,String module,String sParameter){
		String curveTypeId1 = null,curveTypeId2 = null;
		Iterator<String[]> iter = paramMap.values().iterator();
		while (iter.hasNext()) {
			String[] item = iter.next();
			if(curveTypeId1 == null){
				curveTypeId1 = item[0];
			}else if(curveTypeId2 == null){
				curveTypeId2 = item[0];
			}else{
				break;
			}
	
		}
		
		SmithDao smithDao = new SmithDao();
		boolean flag = false;
		DataBaseUtil db = DataBaseUtil.getInstance();
		Connection conn = db.getConnection();
		try {
			conn.setAutoCommit(false);
			smithDao.deleteMarker(curveTypeId1, db, sParameter);
			smithDao.deleteMarker(curveTypeId2, db, sParameter);
			String[] value = null;
			Object[] param=null;
			for(String key:paramMap.keySet()){
				value = paramMap.get(key);
				param = new Object[]{waferId,Integer.parseInt(value[0]),module,value[1],value[2],value[3],value[4],sParameter};
				flag = smithDao.insertMarker(conn, param,db);
				if(!flag){
					conn.rollback();
					return flag;
				}
			}
				
			conn.commit();
		} catch (SQLException e) {
			e.printStackTrace();
		}finally{
			db.close(conn);
		}

		return flag;
	}

	public boolean updateMarker(Map<String,String[]> paramMap,int waferId,String module){
		SmithDao smithDao = new SmithDao();
		boolean flag = false;
		DataBaseUtil db = DataBaseUtil.getInstance();
		Connection conn = db.getConnection();
		try {
			conn.setAutoCommit(false);
			String[] value = null;
			Object[] param=null;
			for(String key:paramMap.keySet()){
				value = paramMap.get(key);
				param = new Object[]{value[1],Integer.parseInt(value[0])};
				flag = smithDao.updateMarker(conn,param,db);
				if(!flag){
					conn.rollback();
					return flag;
				}
			}
				
			conn.commit();
		} catch (SQLException e) {
			e.printStackTrace();
		}finally{
			db.close(conn);
		}

		return flag;
	}
	
	@Override
	public List<Object[]> getMarker(String curveTypeId,String sParameter) {
		SmithDao smithDao = new SmithDao();
		DataBaseUtil db = DataBaseUtil.getInstance();
		return smithDao.getMarker(curveTypeId,sParameter,db);
	}
	

	@Override
	public List<Map<String, Object>> getCalculation(int waferId, String module) {
		SmithDao smithDao = new SmithDao();
		DataBaseUtil db = DataBaseUtil.getInstance();
		return smithDao.getCalculation(waferId, module,db);
	}
	
	@Override
	public int getCalculationId(int waferId, String parameter, String module) {
		SmithDao smithDao = new SmithDao();
		DataBaseUtil db = DataBaseUtil.getInstance();
		Object[] param = new Object[]{waferId,module,parameter};
		return smithDao.getCalculationId(param,db);
	}

	

	@Override
	public boolean deleteMarker(String curveTypeId,String sParameter) {
		SmithDao smithDao = new SmithDao();
		DataBaseUtil db = DataBaseUtil.getInstance();
		Connection conn = db.getConnection();
		Map<String, List<String>> map = smithDao.getAllMarker(conn, curveTypeId, sParameter, db);
		if(map.isEmpty()){
			return true;
		}
		return smithDao.deleteMarker(curveTypeId,db,sParameter);
	}



	

	
	
	

}
