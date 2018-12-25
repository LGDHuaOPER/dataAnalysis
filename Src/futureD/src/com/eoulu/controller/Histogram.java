package com.eoulu.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
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
//		double left = request.getParameter("leftRange")==null?0:Double.parseDouble(request.getParameter("leftRange")),right=request.getParameter("rightRange")==null?0:Double.parseDouble(request.getParameter("rightRange"));
//		int equal = request.getParameter("equal")==null?8:Integer.parseInt(request.getParameter("equal"));
		double left=0,right=0;
		int equal = 0;
		String[] paramAtt = request.getParameterValues("paramAtt[]"),
				leftRange = request.getParameterValues("leftRange[]"),
				rightRange =  request.getParameterValues("rightRange[]"),
				equalAtt = request.getParameterValues("equal[]");
		HistogramService service = new HistogramServiceImpl();
		GaussianService gaussian = new GaussianServiceImpl();
		List<String> paramList = null;
		Map<String, List<Double>> rangeList = null;
//		if("".equals(parameter)){
		
			if(paramAtt!=null){
				paramList = Arrays.asList(paramAtt);
				rangeList = new LinkedHashMap<>();
				List<Double> limit = null;
				for(int i=0,length=paramAtt.length;i<length;i++){
					if(leftRange==null){
						rangeList = gaussian.getRangList(paramList, waferIdStr);
					}else{
						limit = new ArrayList<>();
						limit.add(Double.parseDouble(leftRange[i]));
						limit.add(Double.parseDouble(rightRange[i]));
						limit.add(Double.parseDouble(equalAtt[i]));
						rangeList.put(paramAtt[i], limit);
					}
					
				}
			}else{
				paramList =  service.getWaferParameter(waferIdStr);	
				rangeList = gaussian.getRangList(paramList, waferIdStr);
			}
//		}else{
//			paramList = new ArrayList<>();
//			paramList.add(parameter);
//		}

		Map<String,Object> result = new LinkedHashMap<>(),map = new HashMap<>();
		List<String> sectionX = null;
		Map<String,Object> percentList = null;
		for(int i=0,size=paramList.size();i<size;i++){
			left = rangeList.get(paramList.get(i)).get(0);
			right =rangeList.get(paramList.get(i)).get(1);
			equal = leftRange==null?8:(new Double(rangeList.get(paramList.get(i)).get(2))).intValue();
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
		String waferIdStr = "307",parameter="";
		double left=0,right=0;
		int equal = 0;
		String[] paramAtt = null,//new String[]{"Demo2.Result","Demo1.Result"},
				leftRange = null,//new String[]{"1e-006","1e-006"},
				rightRange =  null,//new String[]{"1e-005","5e-006"},
				equalAtt = null;//new String[]{"8","7"};
		HistogramService service = new HistogramServiceImpl();
		GaussianService gaussian = new GaussianServiceImpl();
		List<String> paramList = null;
		Map<String, List<Double>> rangeList = null;
//		if("".equals(parameter)){
		
			if(paramAtt!=null){
				paramList = Arrays.asList(paramAtt);
				rangeList = new LinkedHashMap<>();
				List<Double> limit = null;
				for(int i=0,length=paramAtt.length;i<length;i++){
					limit = new ArrayList<>();
					limit.add(Double.parseDouble(leftRange[i]));
					limit.add(Double.parseDouble(rightRange[i]));
					limit.add(Double.parseDouble(equalAtt[i]));
					rangeList.put(paramAtt[i], limit);
				}
			}else{
				paramList =  service.getWaferParameter(waferIdStr);	
				rangeList = gaussian.getRangList(paramList, waferIdStr);
			}
//		}else{
//			paramList = new ArrayList<>();
//			paramList.add(parameter);
//		}

		Map<String,Object> result = new HashMap<>(),map = new HashMap<>();
		List<String> sectionX = null;
		Map<String,Object> percentList = null;
		for(int i=0,size=paramList.size();i<size;i++){
			left = rangeList.get(paramList.get(i)).get(0);
			right =rangeList.get(paramList.get(i)).get(1);
			equal = paramAtt==null?8:(new Double(rangeList.get(paramList.get(i)).get(2))).intValue();
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
