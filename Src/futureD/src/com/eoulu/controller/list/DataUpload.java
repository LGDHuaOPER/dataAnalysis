package com.eoulu.controller.list;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.util.FileUtil;
import com.google.gson.Gson;

/**
 * Servlet implementation class DataUpload
 */
@WebServlet(description = "上传", urlPatterns = { "/DataUpload" })
public class DataUpload extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public DataUpload() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=utf-8");
		FileUtil util = new FileUtil();
		String fileName = null;
		Map<String, Object> PathresultMap=util.getPath();
		String temp=(String) PathresultMap.get("temp");
		String tempPath =(String) PathresultMap.get("tempPath");
	    File file01 = (File) PathresultMap.get("file01");//缓存文件
	    fileName = util.getForm(file01, request, fileName, tempPath);
	    Map<String,String> map = new HashMap<>();
	    map.put("fileName", fileName);
	    map.put("tempPath", temp);
	    map.put("filePath", tempPath+"\\"+fileName);
		response.getWriter().write(new Gson().toJson(map));
	}

}
