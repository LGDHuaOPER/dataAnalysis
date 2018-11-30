/**
 * 
 */
package com.eoulu.parser;

import java.io.BufferedInputStream;
import java.io.File;

import info.monitorenter.cpdetector.io.ASCIIDetector;
import info.monitorenter.cpdetector.io.CodepageDetectorProxy;
import info.monitorenter.cpdetector.io.JChardetFacade;
import info.monitorenter.cpdetector.io.ParsingDetector;
import info.monitorenter.cpdetector.io.UnicodeDetector;

/**
 * @author mengdi
 *
 * 
 */
public class FileCode {

	
	 public static void main(String[] args) {
		 System.out.println(getFileEncode("C:\\Users\\zuo\\Desktop\\厦门三安\\测试文件\\wafer3\\3.map"));
		 System.out.println(getFileEncode("C:\\Users\\zuo\\Desktop\\厦门三安\\测试文件\\1\\15.map"));
		 System.out.println(getFileEncode("C:\\Users\\zuo\\Desktop\\厦门三安\\测试文件\\AR0031-25\\AR0031-25.map"));
	    }
	 
	  public static String getFileEncode(String filePath) {
	        String charsetName = null;
	        try {
	            File file = new File(filePath);
	            CodepageDetectorProxy detector = CodepageDetectorProxy.getInstance();
	            detector.add(new ParsingDetector(false));
	            detector.add(JChardetFacade.getInstance());
	            detector.add(ASCIIDetector.getInstance());
	            detector.add(UnicodeDetector.getInstance());
	            java.nio.charset.Charset charset = null;
	            charset = detector.detectCodepage(file.toURI().toURL());
	            if (charset != null) {
	                charsetName = charset.name();
	            } else {
	                charsetName = "UTF-8";
	            }
	        } catch (Exception ex) {
	            ex.printStackTrace();
	            return null;
	        }
	        return charsetName;
	    }
	  
	  public static String getFileEncode(File file) {
	        String charsetName = null;
	        try {
	            CodepageDetectorProxy detector = CodepageDetectorProxy.getInstance();
	            detector.add(new ParsingDetector(false));
	            detector.add(JChardetFacade.getInstance());
	            detector.add(ASCIIDetector.getInstance());
	            detector.add(UnicodeDetector.getInstance());
	            java.nio.charset.Charset charset = null;
	            charset = detector.detectCodepage(file.toURI().toURL());
	            if (charset != null) {
	                charsetName = charset.name();
	            } else {
	                charsetName = "UTF-8";
	            }
	        } catch (Exception ex) {
	            ex.printStackTrace();
	            return null;
	        }
	        return charsetName;
	    }
	  
	  public static String getEncode(String file){
		  String encode = getFileEncode(file);
		  if("windows-1252".equals(encode)){
			  return "Unicode";
		  }
		  
		  return encode;
	  }
}
