package com.eoulu.action.list;

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
@WebServlet(description = "上传", urlPatterns = { "/UploadFile" })
public class UploadFile extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UploadFile() {
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
		String temp=(String) PathresultMap.get("temp"),
				tempPath =(String) PathresultMap.get("tempPath");
		//缓存文件
	    File file01 = (File) PathresultMap.get("file01");
	    //key:文件名；value：文件路径
	    Map<String,String> map  = util.getFormByProgress(file01, request, tempPath);
		response.getWriter().write(new Gson().toJson(map));
	}

}
