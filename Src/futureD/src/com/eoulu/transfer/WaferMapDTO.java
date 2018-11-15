/**
 * 
 */
package com.eoulu.transfer;

import java.util.List;
import java.util.Map;

/**
 * @author mengdi
 *
 * 
 */
public class WaferMapDTO {
	
	private String parameter;
	private int qualify;//合格数
	private int unqulify;//不合格数
	private String yield;
	public String getYield() {
		return yield;
	}
	public void setYield(String yield) {
		this.yield = yield;
	}
	private Map<String,Object> otherDieList;
	private Map<String,Object> currentDieList;
	public String getParameter() {
		return parameter;
	}
	public void setParameter(String parameter) {
		this.parameter = parameter;
	}
	public Map<String, Object> getCurrentDieList() {
		return currentDieList;
	}
	public void setCurrentDieList(Map<String, Object> currentDieList) {
		this.currentDieList = currentDieList;
	}
	public Map<String, Object> getOtherDieList() {
		return otherDieList;
	}
	public void setOtherDieList(Map<String, Object> otherDieList) {
		this.otherDieList = otherDieList;
	}
	public int getQualify() {
		return qualify;
	}
	public void setQualify(int qualify) {
		this.qualify = qualify;
	}
	public int getUnqulify() {
		return unqulify;
	}
	public void setUnqulify(int unqulify) {
		this.unqulify = unqulify;
	}
	
	

}
