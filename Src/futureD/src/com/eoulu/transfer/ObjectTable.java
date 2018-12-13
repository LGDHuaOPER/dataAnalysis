/**
 * 
 */
package com.eoulu.transfer;

import java.util.Hashtable;

import com.eoulu.dao.CoordinateDao;
import com.eoulu.dao.CurveDao;
import com.eoulu.dao.ParameterDao;
import com.eoulu.dao.SubdieDao;
import com.eoulu.dao.WaferDao;
import com.eoulu.parser.ExcelParser;
import com.eoulu.parser.ZipFileParser;
import com.eoulu.service.ExcelService;
import com.eoulu.service.ZipService;

/**
 * @author mengdi
 *
 * 
 */
public class ObjectTable {
	
	private static Hashtable<String, Object> table = new Hashtable<>();
	
	public static Object getObject(String type){
		Object obj = null;
		switch (type) {
		case "WaferDao":
			if(table.containsKey(type)){
				obj = table.get(type);
			}else{
				WaferDao waferDao = new WaferDao();
				table.put(type, waferDao);
				obj = waferDao;
			}
			break;

		case "ParameterDao":
			if(table.containsKey(type)){
				obj = table.get(type);
			}else{
				ParameterDao paramDao = new ParameterDao();
				table.put(type, paramDao);
				obj = paramDao;
			}
			break;
		case "ExcelParser":
			if(table.containsKey(type)){
				obj = table.get(type);
			}else{
				ExcelParser parser = new ExcelParser();
				table.put(type, parser);
				obj = parser;
			}
			break;
		case "CoordinateDao":
			if(table.containsKey(type)){
				obj = table.get(type);
			}else{
				CoordinateDao coordinate = new CoordinateDao();
				table.put(type, coordinate);
				obj = coordinate;
			}
			break;
		case "ZipFileParser":
			if(table.containsKey(type)){
				obj = table.get(type);
			}else{
				ZipFileParser zipFile = new ZipFileParser();
				table.put(type, zipFile);
				obj = zipFile;
			}
			break;
		case "ExcelService":
			if(table.containsKey(type)){
				obj = table.get(type);
			}else{
				ExcelService excel = new ExcelService();
				table.put(type, excel);
				obj = excel;
			}
			break;
		case "CurveDao":
			if(table.containsKey(type)){
				obj = table.get(type);
			}else{
				CurveDao curveDao = new CurveDao();
				table.put(type, curveDao);
				obj = curveDao;
			}
			break;
		case "SubdieDao":
			if(table.containsKey(type)){
				obj = table.get(type);
			}else{
				SubdieDao subdieDao = new SubdieDao();
				table.put(type, subdieDao);
				obj = subdieDao;
			}
			break;
		case "ZipService":
			if(table.containsKey(type)){
				obj = table.get(type);
			}else{
				ZipService zipService = new ZipService();
				table.put(type, zipService);
				obj = zipService;
			}
			break;
		}
		return obj;
	}
	
	public static void clear(){
		table.clear();
	}

}
