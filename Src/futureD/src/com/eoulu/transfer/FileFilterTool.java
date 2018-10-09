/**
 * 
 */
package com.eoulu.transfer;

import java.io.File;
import java.io.FilenameFilter;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * @author mengdi
 *
 * 
 */
public class FileFilterTool implements FilenameFilter{
	List<String> types;
	public FileFilterTool(){
	  types=new ArrayList<String>();
	}
	
	public FileFilterTool(List<String> types) {
		super();
		this.types = types;
	}

	@Override
	public boolean accept(File dir, String filename) {
		for(Iterator<String> iterator=types.iterator();iterator.hasNext();){
			String type=iterator.next();
			if(filename.endsWith(type)){
				return true;
			}
		}
		return false;
	}
		/** 
	     * 添加指定类型的文件。 
	     *  
	     * @param type 要添加的文件类型，如"CSV"。 
	     */
	public void addType(String type){
		types.add(type);
	}
}