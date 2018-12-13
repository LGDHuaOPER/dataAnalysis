/**
 * 
 */
package com.eoulu.transfer;

import java.util.Map;

/**
 * @author mengdi
 *
 * 
 */
public class SubdieDO {

	private String parameter;
	private int qualify;//合格数
	private int unqulify;//不合格数
	private String yield;
	private Map<String,Object> otherSubdieList;
	private Map<String,Object> currentSubdieList;
	public String getParameter() {
		return parameter;
	}
	public void setParameter(String parameter) {
		this.parameter = parameter;
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
	public String getYield() {
		return yield;
	}
	public void setYield(String yield) {
		this.yield = yield;
	}
	public Map<String, Object> getOtherSubdieList() {
		return otherSubdieList;
	}
	public void setOtherSubdieList(Map<String, Object> otherSubdieList) {
		this.otherSubdieList = otherSubdieList;
	}
	public Map<String, Object> getCurrentSubdieList() {
		return currentSubdieList;
	}
	public void setCurrentSubdieList(Map<String, Object> currentSubdieList) {
		this.currentSubdieList = currentSubdieList;
	}
	
}
