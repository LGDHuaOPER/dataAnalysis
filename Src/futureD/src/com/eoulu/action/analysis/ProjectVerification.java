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
 * Servlet implementation class ProjectVerification
 */
@WebServlet(description = "工程分析校验", urlPatterns = { "/ProjectVerification" })
public class ProjectVerification extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ProjectVerification() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=utf-8");
		String classify = request.getParameter("classify")==null?"":request.getParameter("classify").trim();
		String[] waferId = request.getParameterValues("waferId");
		String[] waferNO = request.getParameterValues("waferNO");
		String status = "";
		if("".equals(classify)){
			classify = "non";
			status = "请选择分析类别！";
		}
		if(waferId.length == 0){
			classify = "non";
			status = "请选择晶圆数据！";
		}
		AnalysisService service = new AnalysisServiceImpl();
		switch (classify) {
		case "ID-VD":
			status = service.getVerificationDC(waferId, waferNO, 3);
			break;

		case "ID-VG":
			status = service.getVerificationDC(waferId, waferNO, 2);
			
			break;
		case "SP2":
			status = service.getVerificationS2P(waferId, waferNO);
			break;
		}
		
		response.getWriter().write(new Gson().toJson(status));
	
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
