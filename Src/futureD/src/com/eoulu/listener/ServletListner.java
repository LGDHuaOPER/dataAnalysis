/**
 * 
 */
package com.eoulu.listener;

import java.io.IOException;
import java.util.Properties;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import com.eoulu.action.version.LoadVersion;
import com.eoulu.action.version.Version;
import com.eoulu.action.version.VersionRecord;


/**
 * @author mengdi
 *
 * 
 */
@WebListener
public class ServletListner implements ServletContextListener{

	/* (non-Javadoc)
	 * @see javax.servlet.ServletContextListener#contextDestroyed(javax.servlet.ServletContextEvent)
	 */
	@Override
	public void contextDestroyed(ServletContextEvent arg0) {
		
	}

	/* (non-Javadoc)
	 * @see javax.servlet.ServletContextListener#contextInitialized(javax.servlet.ServletContextEvent)
	 */
	@Override
	public void contextInitialized(ServletContextEvent arg0) {
		System.out.println("进来了么");
		Properties prop = new Properties();
		try {
			prop.load(LoadVersion.class.getResourceAsStream("versionLog.properties"));
		} catch (IOException e) {
			e.printStackTrace();
		}
		String update = prop.getProperty("update");
		if("YES".equals(update)){
			String defaultVersion = prop.getProperty("defaultVersion");
			String flag = prop.getProperty("flag");
			String ProjectName = "futureDT2";
			String absolute = VersionRecord.class.getResource("/").toString();
			System.out.println("absolute:"+absolute);
			absolute = absolute.substring(6);
			if(absolute.contains(".metadata")){
				String[] att = absolute.split("/");
				String str = "";
				for(String temp:att){
					if(".metadata".equals(temp)){
						break;
					}
					str += temp+"/";
				}
				absolute = str.replaceAll("%20", " ");
			}
			System.out.println("absolute:"+absolute);
			String fileLog = "/src/com/eoulu/action/version/fileLog.properties";
			fileLog = absolute+ProjectName+fileLog;
			String versionLog = "/src/com/eoulu/action/version/versionLog.properties";
			versionLog = absolute+ProjectName+versionLog;
			System.out.println("fileLog:"+fileLog);
			System.out.println("versionLog:"+versionLog);
			String version = new Version().updateVersion("",fileLog,defaultVersion,versionLog,flag);
			System.out.println("version:"+version);
		}		
	}

}
