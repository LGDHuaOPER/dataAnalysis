package com.eoulu.action.analysis;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.service.AnalysisService;
import com.eoulu.service.impl.AnalysisServiceImpl;
import com.google.gson.Gson;

/**
 * Servlet implementation class AnalysisCurve
 */
@WebServlet(description = "分析页面加载曲线数据", urlPatterns = { "/AnalysisCurve" })
public class AnalysisCurve extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public AnalysisCurve() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("utf-8");
		response.setContentType("text/html;charset=utf-8");
		AnalysisService service = new AnalysisServiceImpl();
		String[] curveTypeId = request.getParameterValues("curveTypeId[]");
		String[] legend = request.getParameterValues("legend[]");
		String graphStyle = request.getParameter("graphStyle")==null?"":request.getParameter("graphStyle"),
				sParameter = request.getParameter("sParameter")==null?"":request.getParameter("sParameter");
		Map<String,Object> result = new HashMap<>();
		if(!"".equals(graphStyle) && !"".equals(sParameter)){
			Map<String,Object> map = service.getSmithData(curveTypeId,legend,"Smith","S11");
			result.put("S11", map);
			map = service.getSmithData(curveTypeId,legend,"XYdBOfMagnitude","S12");
			result.put("S12", map);
			map = service.getSmithData(curveTypeId,legend,"XYdBOfMagnitude","S21");
			result.put("S21", map);
			map = service.getSmithData(curveTypeId,legend,"Smith","S22");
			result.put("S22", map);
			response.getWriter().write(new Gson().toJson(result));
			return;
		}
		result.put(sParameter, service.getSmithData(curveTypeId,legend,graphStyle,sParameter));
		
		response.getWriter().write(new Gson().toJson(result));
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
