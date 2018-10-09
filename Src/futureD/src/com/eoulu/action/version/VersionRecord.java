package com.eoulu.action.version;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Properties;

public class VersionRecord {
	
	public static void writeData(String filePath, HashMap<String, String> map) {  
       System.out.println("filePath:"+filePath);
        Properties prop = new Properties();  
        try {  
            File file = new File(filePath);  
            if (!file.exists())  
                file.createNewFile();  
            InputStream fis = new FileInputStream(file);  
            prop.load(fis);  
            //一定要在修改值之前关闭fis  
            fis.close();  
            OutputStream fos = new FileOutputStream(filePath);  
            for(String key:map.keySet()){
            	prop.setProperty(key, map.get(key)); 
            }
            //保存，并加入注释  
            prop.store(fos, "Update Version File");  
            fos.close();  
            System.out.println("xiugai");
        } catch (IOException e) {  
            System.err.println("Visit " + filePath + " for updating  value error");  
        }  
    }  
	
	public static void main(String[] args) {
		String filePath = "/src/com/eoulu/action/test.properties";
		String key = "name";
		String value = "Alisa";
//		writeData(filePath, key, value);
		System.out.println("end");
		File file = new File("");
		System.out.println(file.getAbsolutePath());
	}

}
