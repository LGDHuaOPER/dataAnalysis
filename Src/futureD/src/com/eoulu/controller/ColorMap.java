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
import com.eoulu.service.WaferMapService;
import com.eoulu.service.impl.GaussianServiceImpl;
import com.eoulu.service.impl.HistogramServiceImpl;
import com.eoulu.service.impl.WaferMapServiceImpl;
import com.google.gson.Gson;

/**
 * Servlet implementation class ColorMap
 */
@WebServlet(description = "色阶晶圆", urlPatterns = { "/ColorMap" })
public class ColorMap extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ColorMap() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String waferIdStr = request.getParameter("waferIdStr")==null?"":request.getParameter("waferIdStr").trim(),
				parameter = request.getParameter("parameter")==null?"":request.getParameter("parameter").trim();
		double left = request.getParameter("leftRange")==null?0:Double.parseDouble(request.getParameter("leftRange")),right=request.getParameter("rightRange")==null?0:Double.parseDouble(request.getParameter("rightRange"));
		int equal = request.getParameter("equal")==null?8:Integer.parseInt(request.getParameter("equal"));	
		String[] waferAtt = waferIdStr.split(",");
		Map<String,Object> result = new LinkedHashMap<>();
		List<String> paramList  = null;
		Map<String,List<Double>> rangeList = null;
		WaferMapService service = new WaferMapServiceImpl();
		HistogramService histogram = new HistogramServiceImpl();
		if(!"".equals(parameter)){
			paramList = new ArrayList<>();
			paramList.add(parameter);
			List<Double> ls = new ArrayList<>();
			ls.add(right);
			ls.add(left);
			rangeList = new HashMap<>();
			rangeList.put(parameter, ls);
			result  =  service.getColorMap( waferAtt, paramList, rangeList);
			response.getWriter().write(new Gson().toJson(result));
			return;
		}
		String[] paramAtt = request.getParameterValues("paramAtt[]");
		if(paramAtt!=null){
			paramList = new ArrayList<>();
			for(int i=0,length=paramAtt.length;i<length;i++){
				
				paramList.add(paramAtt[i]);
			}
		}else{
			paramList  = histogram.getWaferParameter(waferIdStr);
		}
		
		GaussianService gaussian = new GaussianServiceImpl();
		rangeList = gaussian.getRangList(paramList, waferIdStr);
		result = service.getColorMap( waferAtt, paramList, rangeList);
		response.getWriter().write(new Gson().toJson(result));
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
