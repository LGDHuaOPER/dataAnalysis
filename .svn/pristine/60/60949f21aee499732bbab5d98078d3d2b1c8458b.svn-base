package com.eoulu.action.version;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;
import java.util.Properties;

/**
 * 版本号自动生成
 * @author mengdi
 *  
 *  plagiarism offense the rules
 *  
 */
public class Version {

	private static String versionCode = null;
	private static String svnRevision = null;
	public static void setValue(String filepath, Map<String, String> map) {
		
		FileOutputStream oFile;
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		try {
			Properties prop = new Properties();
			oFile = new FileOutputStream(filepath, false);
			String value = "";
			for(String key:map.keySet()){
				value = map.get(key);
				prop.setProperty(key, value);
			}
			prop.setProperty("VersionCode", versionCode);
			prop.store(oFile, " UpdateTime:" + df.format(new Date()));
			oFile.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	/**
	 * 更新版本号
	 * @param path 项目或模块的绝对路径
	 * @param filePath  版本号、文件更新时间的记录文件
	 * @param defaultVersion 默认的初始化版本号
	 * @param recordPath 版本号的记录
	 * @return
	 */
	public String updateVersion(String path,String filePath,String defaultVersion,String recordPath,String rule){
		versionCode = null;
		HashMap<String, String> result = new SVNUtil().listFiles();
		svnRevision = result.get("latestRevision");
//		File srcFile = new File(path);
//		File[] files = srcFile.listFiles();
//		String fileName = "";
//		String date = "";
//		long modifiedTime = 0;
//		Map<String,String> result = new Hashtable<>();
//		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm");
//		for (File file : files) {
//			fileName = file.getName();
//			modifiedTime = file.lastModified();
//			date = df.format(new Date(modifiedTime));
//			result.put(fileName, date);
//		}
		
		if(change(filePath, result,defaultVersion,rule)){
			result.put("versionCode", versionCode);
//			setValue(filePath, result);
			new VersionRecord().writeData(filePath, result);
			setVersionRecord(recordPath);
			System.out.println("更新结束");
		}
		return versionCode;
	}
	/**
	 * 对比文件更改时间，判断版本号是否应该变更
	 * @param path
	 * @param result
	 * @return
	 */
	public boolean change(String path,Map<String,String> result,String defaultVersion,String rule){
		boolean flag = false;
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		String date = df.format(new Date());
		date = date.substring(2).replaceAll("-", "");
		File file = new File(path);
		if(!file.exists()){
			System.out.println("文件不存在！");
			try {
				file.createNewFile();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		Map<String,String> map = new Hashtable<>();
		 try {
			BufferedReader bufferedReader =new BufferedReader(new FileReader(file));
			String str = null;
			String[] att = new String[2];
			while(null != (str = bufferedReader.readLine())){
				if(!str.startsWith("#") && str.contains("=")){
					att = str.split("=");
					map.put(att[0],att[1]);
				}
			}
			bufferedReader.close();
			//初始化版本号
			if(null == map.get("VersionCode")){
				versionCode = defaultVersion+"."+date;
				 return true;
			 }
			//当天的更新版本号不变,但是文件记录要变
			versionCode = map.get("VersionCode");
			System.out.println(versionCode.split("\\.").length);
			if(date.equals(versionCode.split("\\.")[3])){
				return true;
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		String value = null;
		String fileValue = null;
		int base = 0;
		int alpha = 0;
		int beta = 0;
		//以最新的文件集合作为依据进行遍历，与版本记录文件中的进行对比
		 for(String key:result.keySet()){
			 value = result.get(key);
			 fileValue = map.get(key).replaceAll("\\\\", "");
			 if(null != fileValue && !value.equals(fileValue)){
				 System.out.println("变更的文件"+key+"="+value);
				 flag = true;
				 base = Integer.parseInt(versionCode.split("\\.")[0]);
				 alpha = Integer.parseInt(versionCode.split("\\.")[1]);
				 beta = Integer.parseInt(versionCode.split("\\.")[2]);
				 if("YES".equalsIgnoreCase(rule)){
					 beta++;
				 }
				 if(10<beta){
					 beta=0;
					 alpha++;
				 }
				 if(alpha>10){
					 alpha = 0;
					 base++;
				 }
				 versionCode = base+"."+alpha+"."+beta+"."+date;
				 break;
			 }
		 }
		 
		 return flag;
	}
	/**
	 * 版本号更新记录
	 * @param recordPath
	 */
	public static void setVersionRecord(String recordPath) {
		File file = new File(recordPath);

		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		FileOutputStream oFile;
		try {
			if (!file.exists()) {
				file.createNewFile();
			}
			Properties prop = new Properties();
			oFile = new FileOutputStream(recordPath, true);
			prop.setProperty("VersionCode", versionCode);
			prop.setProperty("svnRevision", svnRevision);
			prop.store(oFile, "Update Project Version, date:" + df.format(new Date()));
			oFile.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static void main(String[] args) {
		System.out.println("测试导出jar");
	}
	
}
