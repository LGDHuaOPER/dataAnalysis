package com.eoulu.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.service.CorrelationService;
import com.eoulu.service.GaussianService;
import com.eoulu.service.HistogramService;
import com.eoulu.service.impl.CorrelationServiceImpl;
import com.eoulu.service.impl.GaussianServiceImpl;
import com.eoulu.service.impl.HistogramServiceImpl;
import com.google.gson.Gson;

/**
 * Servlet implementation class Correlation
 */
@WebServlet(description = "相关性", urlPatterns = { "/Correlation" })
public class Correlation extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Correlation() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("utf-8");
		response.setContentType("text/html;charset=utf-8");
		String waferIdStr = request.getParameter("waferIdStr") == null ?"":request.getParameter("waferIdStr");
		String status = "",paramX = request.getParameter("paramX")==null?"":request.getParameter("paramX").trim(),
				paramY = request.getParameter("paramY")==null?"":request.getParameter("paramY").trim();
		double minX= request.getParameter("minX")==null?100000:Double.parseDouble(request.getParameter("minX").trim()),
				maxX= request.getParameter("maxX")==null?0:Double.parseDouble(request.getParameter("maxX").trim()),
				minY= request.getParameter("minY")==null?100000:Double.parseDouble(request.getParameter("minY").trim()),
				maxY= request.getParameter("maxY")==null?0:Double.parseDouble(request.getParameter("maxY").trim());
		
		CorrelationService service2 = new CorrelationServiceImpl();
		Map<String, Object> result = null;
		if(!"".equals(paramX) && !"".equals(paramY)){
			result = service2.getCorrelation(waferIdStr, paramX, paramY, minX, maxX, minY, maxY);
			result.put("status", status);
			response.getWriter().write(new Gson().toJson(result));
			return;
		}
		HistogramService service = new HistogramServiceImpl();
		GaussianService gaussian = new GaussianServiceImpl();
		List<String> paramList = service.getWaferParameter(waferIdStr );
		Map<String, List<Double>> rangList = gaussian.getRangList(paramList, waferIdStr);
		if (paramList.size() >= 2) {
			paramX = paramList.get(0);
			paramY = paramList.get(1);
			minX = rangList.get(paramX).get(0);
			maxX = rangList.get(paramX).get(1);
			minY = rangList.get(paramY).get(0);
			maxY = rangList.get(paramY).get(1);
			result = service2.getCorrelation(waferIdStr, paramX, paramY, minX, maxX, minY, maxY);
		} else {
			status = "所选晶圆参数小于两个，无法绘制！";
		}
		result.put("status", status);
		response.getWriter().write(new Gson().toJson(result));
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
	
	public static void main(String[] args) {
		String waferIdStr = "307";
		String status = "",paramX = "",
				paramY = "";
		double minX= 1e-006,
				maxX= 1e-005,
				minY= 1e-006,
				maxY= 5e-006;
		
		CorrelationService service2 = new CorrelationServiceImpl();
		Map<String, Object> result = null;
		if(!"".equals(paramX) && !"".equals(paramY)){
			result = service2.getCorrelation(waferIdStr, paramX, paramY, minX, maxX, minY, maxY);
			result.put("status", status);
			System.out.println(result);
			return;
		}
		HistogramService service = new HistogramServiceImpl();
		GaussianService gaussian = new GaussianServiceImpl();
		List<String> paramList = service.getWaferParameter(waferIdStr );
		Map<String, List<Double>> rangList = gaussian.getRangList(paramList, waferIdStr);
		if (paramList.size() >= 2) {
			paramX = paramList.get(0);
			paramY = paramList.get(1);
			minX = rangList.get(paramX).get(0);
			maxX = rangList.get(paramX).get(1);
			minY = rangList.get(paramY).get(0);
			maxY = rangList.get(paramY).get(1);
			result = service2.getCorrelation(waferIdStr, paramX, paramY, minX, maxX, minY, maxY);
		} else {
			status = "所选晶圆参数小于两个，无法绘制！";
		}
		result.put("status", status);
		System.out.println(new Gson().toJson(result));
	}

}
