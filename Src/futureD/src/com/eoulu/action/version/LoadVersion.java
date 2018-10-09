package com.eoulu.action.version;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;


/**
 * Servlet implementation class LoadVersion
 */
@WebServlet(description = "版本号获取", urlPatterns = { "/LoadVersion" })
public class LoadVersion extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static String versionCode = "";

       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LoadVersion() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		Properties pro = new Properties();
		try {
			pro.load(LoadVersion.class.getResourceAsStream("fileLog.properties"));
		} catch (IOException e) {
			e.printStackTrace();
		}
	
		String version = pro.getProperty("versionCode");
		if("".equals(version)){
			version = versionCode;
		}
		System.out.println("version:"+version);
		response.getWriter().write(new Gson().toJson(version));
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
	
	public void changeVesion(String version){
		versionCode = version;
	}
	
	
	public static String readVersion(String path){
		String version = "";
		try {
			BufferedReader reader = new BufferedReader(new FileReader(path));
			String line = "";
			String key = "";
			while(null != (line = reader.readLine())){
				if(line.contains("=")){
					key = line.split("=")[0];
					if("VersionCode".equals(key)){
						version = line.split("=")[1];
						break;
					}
				}
			}
			reader.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return version;
	}

	
}
