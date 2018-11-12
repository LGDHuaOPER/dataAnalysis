package com.eoulu.listener;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import com.eoulu.service.WaferService;
import com.eoulu.service.impl.WaferServiceImpl;

/**
 * Application Lifecycle Listener implementation class DataManager
 *
 */
@WebListener
public class DataManager implements ServletContextListener {

    /**
     * Default constructor. 
     */
    public DataManager() {
    	
    }

	/**
     * @see ServletContextListener#contextDestroyed(ServletContextEvent)
     */
    public void contextDestroyed(ServletContextEvent arg0)  { 
    	
    }

	/**
     * @see ServletContextListener#contextInitialized(ServletContextEvent)
     */
    public void contextInitialized(ServletContextEvent arg0)  { 
    	SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    	WaferService waferService = new WaferServiceImpl();
    	 Runnable runnable = new Runnable() {
			@Override
			public void run() {
				waferService.deleteJunkData();
			}
    		 
    	 };
    	  ScheduledExecutorService service = Executors  
	                .newSingleThreadScheduledExecutor();  
	        Calendar cal = Calendar.getInstance();
			Date now = cal.getTime();
			cal.add(Calendar.DAY_OF_MONTH, 1);
			SimpleDateFormat f = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String date = f.format(cal.getTime()).split(" ")[0];
			Date b = null;
			try {
				b = df.parse(date+" 01:00:00");
			} catch (ParseException e) {
				e.printStackTrace();
			}
			//指定每天凌晨1点执行
			//参数1：任务；参数2：从现在开始到首次执行的时间；参数3：执行的间隔时间；参数4：以秒为单位
			 service.scheduleAtFixedRate(runnable, (b.getTime()-now.getTime())/1000, 24*60*60, TimeUnit.SECONDS);  
    }
	
    public static void main(String[] args) {
    	WaferService waferService = new WaferServiceImpl();
    	waferService.deleteJunkData();
    	System.out.println("end");
	}
    
}
