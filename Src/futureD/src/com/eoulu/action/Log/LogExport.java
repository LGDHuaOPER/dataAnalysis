package com.eoulu.action.Log;

import java.io.IOException;
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
		String path = request.getContextPath()+"/down/log-"+df.format(new Date())+".xlsx";
		String logIdStr = request.getParameter("logIdStr")==null?"":request.getParameter("logIdStr");
		
		response.getWriter().write(new Gson().toJson(new LogServiceImpl().exportExcel(path, logIdStr)));
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
