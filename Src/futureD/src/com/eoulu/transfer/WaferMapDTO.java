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
	private int qualifynumber;//合格数
	private int unqulifynumber;//不合格数
	private double qualifiedRate;
	private Map<String,Object> otherDieList;
	private Map<String,Object> currentDieList;
	public String getParameter() {
		return parameter;
	}
	public void setParameter(String parameter) {
		this.parameter = parameter;
	}
	public int getQualifynumber() {
		return qualifynumber;
	}
	public void setQualifynumber(int qualifynumber) {
		this.qualifynumber = qualifynumber;
	}
	public int getUnqulifynumber() {
		return unqulifynumber;
	}
	public void setUnqulifynumber(int unqulifynumber) {
		this.unqulifynumber = unqulifynumber;
	}
	public double getQualifiedRate() {
		return qualifiedRate;
	}
	public void setQualifiedRate(double qualifiedRate) {
		this.qualifiedRate = qualifiedRate;
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
	
	

}
