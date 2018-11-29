/**
 * 
 */
package com.eoulu.service.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.eoulu.dao.Log.LogDao;
import com.eoulu.service.LogService;
import com.eoulu.transfer.PageDTO;
import com.google.gson.Gson;

/**
 * @author mengdi
 *
 * 
 */
public class LogServiceImpl implements LogService{
	
	private static LogDao dao = new LogDao();
	private static SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

	@Override
	public List<Map<String, Object>> listLog(PageDTO page,String keyword) {
		return dao.listLog(page, keyword);
	}

	@Override
	public boolean insertLog(String userName, String page, String description,HttpSession session) {
		String ip = (session==null || session.getAttribute("IP")==null)?"":session.getAttribute("IP").toString();
		String city = (session==null || session.getAttribute("city")==null)?"":session.getAttribute("city").toString();
		Object[] param = new Object[]{userName,page,description,df.format(new Date()),ip,city};
		
		return dao.insertLog(param);
	}
	
	public static void main(String[] args) {
		
		LogService service = new LogServiceImpl();
		PageDTO page = new PageDTO();
		page.setCurrentPage(1);
		page.setRow(10);
		page.setPageCount(2);
		System.out.println(service.insertLog("Admin", "数据列表", "ceshi", null));
//		System.out.println(new Gson().toJson(service.listLog(page,"数")));
//		System.out.println(dao.countLog("不"));
//		System.out.println(exportExcel("E:/test.xlsx", "1"));
		
	}

	@Override
	public int countLog(String keyword) {
		return dao.countLog(keyword);
	}
	
	public static void exportExcel(String path ,String logIdStr){
		List<Map<String,Object>> list = dao.listLog(logIdStr);
		//创建HSSFWorkbook对象  
		XSSFWorkbook wb = new XSSFWorkbook();  
		//创建HSSFSheet对象  
		XSSFSheet sheet = wb.createSheet("sheet0");
		String[] header = new String[]{"序号","操作账号","操作页面","操作记录","操作日期","操作时间","IP地址","所属位置"};
		XSSFRow row1 = sheet.createRow(0);
		for(int i=0,length=header.length;i<length;i++){
			XSSFCell cell = row1.createCell(i);
			cell.setCellValue(header[i]);
		}
		Map<String,Object> map = null;
		for(int i=0,size=list.size();i<size;i++){
			XSSFRow row = sheet.createRow(i+1);
			map = list.get(i);
			for(int j=0,size2=map.size()+1;j<size2;j++){
				XSSFCell cell = row.createCell(j);
				if(j==0){
					cell.setCellValue(j+1);
				}
				if(j==1){
					cell.setCellValue(map.get("user_name").toString());
				}
				if(j==2){
					cell.setCellValue(map.get("page").toString());
				}
				if(j==3){
					cell.setCellValue(map.get("description").toString());
				}
				if(j==4){
					cell.setCellValue(map.get("operate_date").toString());
				}
				if(j==5){
					cell.setCellValue(map.get("operate_time").toString());
				}
				if(j==6){
					cell.setCellValue(map.get("ip_address").toString());
				}
				if(j==7){
					cell.setCellValue(map.get("location").toString());
				}
				
				
			}
			
		}
		
		//输出Excel文件  
		FileOutputStream output = null;
			try {
				output = new FileOutputStream(path);
				wb.write(output);  
			} catch (FileNotFoundException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}finally{
				try {
					if(output != null){
						output.flush();
						output.close();
					}
				} catch (IOException e) {
					e.printStackTrace();
				}
				
			}
			
			
		
			
	}

	/* (non-Javadoc)
	 * @see com.eoulu.service.LogService#delete()
	 */
	@Override
	public void delete() {
		dao.delete();

	}

}
