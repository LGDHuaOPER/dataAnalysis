package com.eoulu.action.analysis;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.service.AnalysisService;
import com.eoulu.service.impl.AnalysisServiceImpl;
import com.google.gson.Gson;

/**
 * Servlet implementation class CustomParameter
 */
@WebServlet(description = "自定义参数", urlPatterns = { "/CustomParameter" })
public class CustomParameter extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CustomParameter() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("urf-8");
		response.setContentType("text/html;charset=utf-8");
		String waferId = request.getParameter("waferId")==null?"":request.getParameter("waferId").trim(),
				customParameter = request.getParameter("customParameter")==null?"":request.getParameter("customParameter").trim();
		AnalysisService service = new AnalysisServiceImpl();
		String str = service.getParameterExsit(Integer.parseInt(waferId), customParameter)?"":"参数已存在！";
		response.getWriter().write(new Gson().toJson(str));
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
