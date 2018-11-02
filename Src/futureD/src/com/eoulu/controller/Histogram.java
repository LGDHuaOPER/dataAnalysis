package com.eoulu.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.service.GaussianService;
import com.eoulu.service.HistogramService;
import com.eoulu.service.impl.GaussianServiceImpl;
import com.eoulu.service.impl.HistogramServiceImpl;
import com.google.gson.Gson;

/**
 * Servlet implementation class Histogram
 */
@WebServlet(description = "直方图", urlPatterns = { "/Histogram" })
public class Histogram extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Histogram() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		request.setCharacterEncoding("utf-8");
		response.setContentType("text/html;charset=utf-8");
		String waferIdStr = request.getParameter("waferIdStr")==null?"":request.getParameter("waferIdStr").trim();
		double left = request.getParameter("leftRange")==null?0:Double.parseDouble(request.getParameter("leftRange")),right=request.getParameter("rightRange")==null?0:Double.parseDouble(request.getParameter("rightRange"));
		int equal = request.getParameter("equal")==null?8:Integer.parseInt(request.getParameter("equal"));
		HistogramService service = new HistogramServiceImpl();
		GaussianService gaussian = new GaussianServiceImpl();
		List<String> paramList = null;
		Map<String,List<Double>> rangList = null;
		if(request.getParameter("parameter")==null){
			String[] paramAtt = request.getParameterValues("paramAtt[]");
			if(paramAtt!=null){
				paramList = new ArrayList<>();
				for(int i=0,length=paramAtt.length;i<length;i++){
					paramList.add(paramAtt[i]);
				}
			}else{
				paramList =  service.getWaferParameter(waferIdStr);	
			}
			rangList = gaussian.getRangList(paramList, waferIdStr);
		}else{
			paramList = new ArrayList<>();
			paramList.add(request.getParameter("parameter"));
		}
		Map<String,Object> result = new LinkedHashMap<>();
		Map<String,Object> percentList = null;
		for(int i=0,size=paramList.size();i<size;i++){
			left = rangList==null?left:rangList.get(paramList.get(i)).get(1);
			right = rangList==null?right: rangList.get(paramList.get(i)).get(0);
			percentList = service.getPercent(paramList.get(i), waferIdStr, left, right, equal);
			result.put(paramList.get(i), percentList);
		}
		response.getWriter().write(new Gson().toJson(result));
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
