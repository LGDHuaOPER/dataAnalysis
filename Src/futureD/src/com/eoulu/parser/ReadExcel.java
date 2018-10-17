/**
 * 
 */
package com.eoulu.parser;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

/**
 * @author mengdi
 *
 * 
 */
public class ReadExcel {

	public Map<String,Object> readExcel(String filePath){
		System.out.println(filePath);
		Map<String,Object> result = new HashMap<>();
		  FileInputStream excelFileInputStream;
		  List<String> paramList = new ArrayList<>();
		  List<String> unitList = new ArrayList<>();
		  List<Object> dataList = new ArrayList<>();
		  List<Object> temp = null;
		  String status = "success";
		try {
			excelFileInputStream = new FileInputStream(filePath);
			XSSFWorkbook workbook = new XSSFWorkbook(excelFileInputStream);
			excelFileInputStream.close();
			XSSFSheet sheet = workbook.getSheetAt(0);
			int colCount = 0;
			String value = "";
			colCount = sheet.getRow(0).getLastCellNum();
			for(int i=0,length = sheet.getLastRowNum();i<=length;i++) {
				
				temp = new ArrayList<>();
				XSSFRow row = sheet.getRow(i);
				if(row==null){
					break;
				}
				if(i==0){
					for(int j=0;j<colCount;j++){
						 value = (row.getCell(j)==null || row.getCell(j).toString().equals(""))?"":row.getCell(j).toString();
						paramList.add(value);
					}
				}else
				if(i==1){
					for(int j=0;j<colCount;j++){
						 value = (row.getCell(j)==null || row.getCell(j).toString().equals(""))?"":row.getCell(j).toString();
						unitList.add(value);
					}
				}else{
					for(int j=0;j<colCount;j++){
						 value = (row.getCell(j)==null || row.getCell(j).toString().equals(""))?"":row.getCell(j).toString();
						temp.add(value);
					}
					dataList.add(temp);	
				}
				
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
			status = "文件找不到！";
		} catch (IOException e) {
			e.printStackTrace();
			status = "文件读取失败！";
		} 
		result.put("paramList", paramList)	;
		result.put("unitList", unitList)	;
		result.put("dataList", dataList)	;
		result.put("status", status)	;
		return result;
	}
	
	/**
	 * 读取TXT格式数据
	 * @param path
	 * @return
	 */
	public static Map<String, Object> getExcelDataByTxt(String path) {
		Map<String, Object> result = new HashMap<>();
		FileInputStream excelFileInputStream;
		List<String> paramList = new ArrayList<>();
		List<String> upLimit = new ArrayList<>();
		List<String> downLimit = new ArrayList<>();
		List<Object> dataList = new ArrayList<>();
		List<String> temp = null;
		List<Integer> hex = new ArrayList<>();
		String status = "success";
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String time = df.format(new Date());
		String fileName = "";
		try {
			excelFileInputStream = new FileInputStream(path);
			XSSFWorkbook workbook = new XSSFWorkbook(excelFileInputStream);
			excelFileInputStream.close();
			XSSFSheet sheet = workbook.getSheetAt(0);
			int colCount = 0;
			int index = 0;
			for (int i = 0, length = sheet.getLastRowNum(); i <= length; i++) {
				XSSFRow row = sheet.getRow(i);
				if(row==null){
					continue;
				}
				String firstValue = row.getCell(0).toString();
				String secondValue = row.getCell(2)==null?"":row.getCell(2).toString().trim();
				if ("FileName".equalsIgnoreCase(firstValue)) {
					result.put("FileName", secondValue);
					fileName = secondValue;
				}
				if ("ComputerName".equalsIgnoreCase(firstValue)) {
					result.put("ComputerName", secondValue);
				}
				if ("Tester".equalsIgnoreCase(firstValue)) {
					result.put("Tester", secondValue);
				}
				if ("TestStarTime".equalsIgnoreCase(firstValue)) {
					secondValue = secondValue.equals("")?time:secondValue;
					result.put("TestStarTime", secondValue);
				}
				if ("TestStopTime".equalsIgnoreCase(firstValue)) {
					
					secondValue = secondValue.equals("")?time:secondValue;
					result.put("TestStopTime", secondValue);
				}
				if ("TotalTestTime".equalsIgnoreCase(firstValue)) {
					secondValue = secondValue.equals("")?time:secondValue;
					result.put("TotalTestTime", secondValue);
				}
				if ("TotalTested".equalsIgnoreCase(firstValue)) {
					secondValue = secondValue.equals("")?"0":secondValue;
					result.put("TotalTested", secondValue);
				}
				if ("Passed".equalsIgnoreCase(firstValue)) {
					secondValue = secondValue.equals("")?"0":secondValue;
					result.put("Passed", secondValue);
				}
				if ("Failed".equalsIgnoreCase(firstValue)) {
					secondValue = secondValue.equals("")?"0":secondValue;
					result.put("Failed", secondValue);
				}
				if ("Yield(%)".equalsIgnoreCase(firstValue)) {
					secondValue = secondValue.equals("")?"0":secondValue;
					result.put("Yield(%)", secondValue);
				}
				if ("DeviceID".equalsIgnoreCase(firstValue)) {
					result.put("DeviceID", secondValue);
				}
				if ("LotID".equalsIgnoreCase(firstValue)) {
					secondValue = secondValue.equals("")?time.substring(0, 10):secondValue;
					result.put("LotID", secondValue);
				}
				if ("WaferID".equalsIgnoreCase(firstValue)) {
					secondValue = secondValue.equals("")?fileName:secondValue;
					result.put("WaferID", secondValue);
				}
				if ("BinTable".equalsIgnoreCase(firstValue)) {
					colCount = row.getLastCellNum()-1;
					for(int j=2;j<=colCount;j++){
						paramList.add(row.getCell(j).toString());
					}
				}
				if ("min".equalsIgnoreCase(firstValue)) {
					String down = "";
					for(int j=2;j<=colCount;j++){
						down = row.getCell(j)==null?"":row.getCell(j).toString();
						downLimit.add(down);
					}
				}
				if ("max".equalsIgnoreCase(firstValue)) {
					String up = "";
					for(int j=2;j<=colCount;j++){
						up = row.getCell(j)==null?"":row.getCell(j).toString();
						upLimit.add(up);
					}
					index = i+3;
					break;
				}

			}
			String data = "";
			for (int i = index, length = sheet.getLastRowNum(); i <= length; i++) {
				XSSFRow row = sheet.getRow(i);
				if(row==null){
					break;
				}
				temp = new ArrayList<>();
				for(int j=0,length2=colCount+1;j<=length2;j++){
					data = row.getCell(j)==null?"":row.getCell(j).toString();
					if((data.endsWith("h") || data.endsWith("H")) && !isExist(j, hex)){
						hex.add(j-2);
					}
					data.replaceAll("\r\n", "");
					data.replaceAll("\n", "");
					temp.add(data);
				}
				dataList.add(temp);
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
			status = "文件找不到！";
		} catch (IOException e) {
			e.printStackTrace();
			status = "文件读取失败！";
		}
		result.put("paramList", paramList);
		result.put("downLimit", downLimit);
		result.put("upLimit", upLimit);
		result.put("dataList", dataList);
		result.put("hex", hex);
		result.put("status", status);
		System.out.println(paramList);
		return result;
	}
	
	public static boolean isExist(int index,List<Integer> ls){
		boolean flag = false;
		for(int i=0,length=ls.size();i<length;i++){
			if(ls.get(i)==index){
				flag = true;
				break;
			}
		}
		return flag;
	}
	
}
