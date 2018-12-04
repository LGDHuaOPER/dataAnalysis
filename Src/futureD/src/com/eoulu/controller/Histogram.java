package com.eoulu.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
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
import com.eoulu.service.YieldService;
import com.eoulu.service.impl.GaussianServiceImpl;
import com.eoulu.service.impl.HistogramServiceImpl;
import com.eoulu.service.impl.YieldServiceImpl;
import com.eoulu.transfer.FunctionUtil;
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
		String waferIdStr = request.getParameter("waferIdStr")==null?"":request.getParameter("waferIdStr").trim(),parameter = request.getParameter("parameter")==null?"":request.getParameter("parameter").trim();
		double left = request.getParameter("leftRange")==null?0:Double.parseDouble(request.getParameter("leftRange")),right=request.getParameter("rightRange")==null?0:Double.parseDouble(request.getParameter("rightRange"));
		int equal = request.getParameter("equal")==null?8:Integer.parseInt(request.getParameter("equal"));
		HistogramService service = new HistogramServiceImpl();
		GaussianService gaussian = new GaussianServiceImpl();
		List<String> paramList = null;
		
		if("".equals(parameter)){
			String[] paramAtt = request.getParameterValues("paramAtt[]");
			if(paramAtt!=null){
				paramList = new ArrayList<>();
				for(int i=0,length=paramAtt.length;i<length;i++){
					paramList.add(paramAtt[i]);
				}
			}else{
				paramList =  service.getWaferParameter(waferIdStr);	
			}
		}else{
			paramList = new ArrayList<>();
			paramList.add(parameter);
		}
		Map<String, List<Double>> rangeList = gaussian.getRangList(paramList, waferIdStr);
//		System.out.println(new Gson().toJson(rangeList));
		Map<String,Object> result = new HashMap<>(),map = new HashMap<>();
		List<String> sectionX = null;
		Map<String,Object> percentList = null;
		for(int i=0,size=paramList.size();i<size;i++){
			left = "".equals(parameter)?rangeList.get(paramList.get(i)).get(0):left;
			right = "".equals(parameter)?rangeList.get(paramList.get(i)).get(1):right;
			sectionX = FunctionUtil.getRangeOrderAsc(left, right, equal);
			percentList = service.getPercent(paramList.get(i), waferIdStr, sectionX);
			map = new HashMap<>();
			map.put("sectionX", sectionX);
			map.put("percentList", percentList);
			result.put(paramList.get(i), map);
		}
		System.out.println(new Gson().toJson(result));
		response.getWriter().write(new Gson().toJson(result));
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

	public static void main(String[] args) {
		String waferIdStr = "429",parameter="";
		double left = 5500.2,right=6500;
		int equal = 8;
		HistogramService service = new HistogramServiceImpl();
		GaussianService gaussian = new GaussianServiceImpl();
		List<String> paramList = null;
		
		if("".equals(parameter)){
			String[] paramAtt = null;
			if(paramAtt!=null){
				paramList = new ArrayList<>();
				for(int i=0,length=paramAtt.length;i<length;i++){
					paramList.add(paramAtt[i]);
				}
			}else{
				paramList =  service.getWaferParameter(waferIdStr);	
			}
		}else{
			paramList = new ArrayList<>();
			paramList.add(parameter);
		}
		Map<String, List<Double>> rangeList = gaussian.getRangList(paramList, waferIdStr);
		System.out.println(new Gson().toJson(rangeList));
		Map<String,Object> result = new HashMap<>(),map = new HashMap<>();
		List<String> sectionX = null;
		result.put("", sectionX);
		Map<String,Object> percentList = null;
		for(int i=0,size=paramList.size();i<size;i++){
			left = "".equals(parameter)?rangeList.get(paramList.get(i)).get(0):left;
			right = "".equals(parameter)?rangeList.get(paramList.get(i)).get(1):right;
			sectionX = FunctionUtil.getRangeOrderAsc(left, right, equal);
			percentList = service.getPercent(paramList.get(i), waferIdStr, sectionX);
			map = new HashMap<>();
			map.put("sectionX", sectionX);
			map.put("percentList", percentList);
			result.put(paramList.get(i), map);
		}
		System.out.println(new Gson().toJson(result));
	}
	
}
