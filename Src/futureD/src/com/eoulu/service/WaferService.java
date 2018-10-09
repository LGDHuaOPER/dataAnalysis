/**
 * 
 */
package com.eoulu.service;

import java.sql.Connection;
import java.util.List;
import java.util.Map;

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
	
	 String saveZipData(Connection conn,String file,String productCategory,String testOperator,String description,String csvExcel,Map<String, Object> mapParameter,String dataFormat);
	
}
