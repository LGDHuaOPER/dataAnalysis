/**
 * 
 */
package com.eoulu.transfer;

/**
 * @author mengdi
 *
 * 
 */
public class PageDTO {
	
	private Integer currentPage;
	private Integer row;
	private Integer pageCount;
	private Integer totalPage;
	public Integer getCurrentPage() {
		return currentPage;
	}
	public void setCurrentPage(Integer currentPage) {
		this.currentPage = currentPage;
	}
	public Integer getRow() {
		return row;
	}
	public void setRow(Integer row) {
		this.row = row;
	}
	public Integer getPageCount() {
		return pageCount;
	}
	public void setPageCount(Integer pageCount) {
		this.pageCount = pageCount;
	}
	public Integer getTotalPage() {
		if(pageCount%row>0){
			totalPage = pageCount/row+1;
		}else{
			totalPage = pageCount/row;
		}
		return totalPage;
	}
	
	
	
	
	

}
