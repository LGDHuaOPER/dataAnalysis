/**
 * 
 */
package com.eoulu.entity;

/**
 * @author mengdi
 *
 * 
 */
public class AuthorityDO {
	
	private Integer authorityId;
	private String authorityName;
	private String authorityUrl;
	private String page;
	
	
	public String getPage() {
		return page;
	}
	public void setPage(String page) {
		this.page = page;
	}
	public Integer getAuthorityId() {
		return authorityId;
	}
	public void setAuthorityId(Integer authorityId) {
		this.authorityId = authorityId;
	}
	public String getAuthorityName() {
		return authorityName;
	}
	public void setAuthorityName(String authorityName) {
		this.authorityName = authorityName;
	}
	public String getAuthorityUrl() {
		return authorityUrl;
	}
	public void setAuthorityUrl(String authorityUrl) {
		this.authorityUrl = authorityUrl;
	}
	
	

}
