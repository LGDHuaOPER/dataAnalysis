/**
 * 
 */
package com.eoulu.service;

import java.sql.Connection;
import java.util.List;
import java.util.Map;

import com.eoulu.entity.MapParameterDO;
import com.eoulu.entity.WaferDO;
import com.eoulu.transfer.PageDTO;

/**
 * @author mengdi
 *
 * 
 */
public interface WaferService {

	/**
	 * 模糊查询，晶圆信息
	 * @param page
	 * @param keyword
	 * @return
	 */
	List<Map<String,Object>> listWafer(PageDTO page,String keyword,String Parameter);
	/**
	 * 模糊查询，总数量
	 * @param keyword
	 * @return
	 */
	int countWafer(String keyword,String Parameter);
	/**
	 * 数据列表的删除
	 * @param waferId
	 * @return
	 */
	boolean remove(String waferId);
	/**
	 * 单条晶圆修改
	 * @param waferId
	 * @return
	 */
	boolean update(WaferDO wafer);
	
	/**
	 * 获取所有用户
	 * @return
	 */
	List<Map<String,Object>> getAllUser();
	/**
	 * 获取产品类别
	 * @return
	 */
	List<Map<String,Object>> getProductCategory();
	
	/**
	 * 获取晶圆编号
	 * @param waferId
	 * @return
	 */
	String getWaferNO(int waferId);
	
	/**
	 * CSV、map、曲线文件的存储
	 * @param mapFileList
	 * @param file
	 * @param productCategory
	 * @param testOperator
	 * @param description
	 * @param csvExcel
	 * @param mapDO  
	 * @param invalidationList 无效die，来自map文件
	 * @return
	 */
	 String saveZipData(Map<String,Object> mapFileList,String file,String productCategory,String testOperator,String description,String csvExcel,MapParameterDO mapDO,List<String> invalidationList);
	 
	 /**
	  * EOULU标准Excel
	  * @param map
	  * @param wafer
	  * @param coordinateFlag
	  * @return
	  */
	 public String saveExcelData( Map<String,Object> map, WaferDO wafer,boolean coordinateFlag);
	
	 
	 /**
	  * 新excel数据格式上传，文件名即为晶圆编号
	  *  第一行为参数名，第二行为参数单位
	  *  第一列为Die编号
	  * @param path
	  * @param waferNO
	  * @param productCategory
	  * @param testOperator
	  * @param description
	  * @param currentUser
	  * @param progress
	  * @param interval
	  * @return
	  */
		String saveExcel(String path,String waferNO, String productCategory, 
				String description, String currentUser,String progress,int interval);
		
		/**
		 * 上传txt文件转成的excel数据
		 * @param path
		 * @param productCategory
		 * @param testOperator
		 * @param description
		 * @param currentUser
		 * @return
		 */
		String saveTxtToExcel(String path, String productCategory, 
				String description, String currentUser,String fileName,int interval);
		
		/**
		 * 自动抓取数据
		 * @param path Excel文件
		 * @return
		 */
		String grabExcelAuto(String path,String fileName,String createTime,String classify,String productCategory, String testOperator,
				String description, String currentUser,String dataFormat);
		
		/**
		 * 删除垃圾数据
		 */
		void deleteJunkData();
}