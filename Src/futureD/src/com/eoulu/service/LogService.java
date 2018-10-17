/**
 * 
 */
package com.eoulu.service;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import com.eoulu.transfer.PageDTO;

/**
 * @author mengdi
 *
 * 
 */
public interface LogService {
	
	/**
	 * 日志分页
	 * @param page
	 * @return
	 */
	List<Map<String,Object>> listLog(PageDTO page,String keyword);
	
	/**
	 * 日志记录
	 * @param userName
	 * @param page
	 * @param description
	 * @return
	 */
	boolean insertLog(String userName,String page,String description,HttpSession session);
	
	/**
	 * 日志总数量
	 * @return
	 */
	int countLog(String keyword);
	
	void delete();

}
