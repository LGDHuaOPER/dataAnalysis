package com.eoulu.action.Log;

import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.service.LogService;
import com.eoulu.service.impl.LogServiceImpl;
import com.google.gson.Gson;

/**
 * Servlet implementation class LogExport
 */
@WebServlet(description = "导出日志", urlPatterns = { "/LogExport" })
public class LogExport extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LogExport() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=utf-8");
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		StringBuffer wholePath = request.getRequestURL();
		String servletPath = request.getServletPath();
		String path = request.getServletContext().getRealPath("/")+"down/";
		path=URLDecoder.decode(path,"gbk");
		File file = new File(path);
		if(!file.exists() && !file.isDirectory()){
			file.mkdir();
		}
		 path = path+"/log-"+df.format(new Date())+".xlsx";
		String logIdStr = request.getParameter("logIdStr")==null?"":request.getParameter("logIdStr");
		 new LogServiceImpl().exportExcel(path, logIdStr);
		path = wholePath.toString().split(servletPath)[0]+"/down/log-"+df.format(new Date())+".xlsx";
		response.getWriter().write(new Gson().toJson(path));
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
