package com.eoulu.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.service.HistogramService;
import com.eoulu.service.YieldService;
import com.eoulu.service.impl.HistogramServiceImpl;
import com.eoulu.service.impl.YieldServiceImpl;
import com.google.gson.Gson;

/**
 * Servlet implementation class Yield
 */
@WebServlet(name = "ShowYield", description = "良率", urlPatterns = { "/ShowYield" })
public class Yield extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Yield() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String waferIdStr = request.getParameter("waferIdStr")==null?"":request.getParameter("waferIdStr").trim(),
				parameter = request.getParameter("parameter")==null?"":request.getParameter("parameter").trim();
		List<String> paramList  = null;
		if(!"".equals(parameter)){
			paramList = new ArrayList<>();
			paramList.add(parameter);
		}
		String[] paramAtt = request.getParameterValues("paramAtt[]");
		if(paramAtt!=null){
			paramList = new ArrayList<>();
			for(int i=0,length=paramAtt.length;i<length;i++){
				
				paramList.add(paramAtt[i]);
			}
		}else{
			HistogramService histogram = new HistogramServiceImpl();
			paramList  = histogram.getWaferParameter(waferIdStr);
		}
	
		YieldService yield =  new YieldServiceImpl();
		Map<String,Object> result = yield.getYield(waferIdStr, paramList);
		response.getWriter().write(new Gson().toJson(result));
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
	
	public static void main(String[] args) {
		String waferIdStr = "162",
				parameter = "";
		List<String> paramList  = null;
		if(!"".equals(parameter)){
			paramList = new ArrayList<>();
			paramList.add(parameter);
		}
		String[] paramAtt = null;
		if(paramAtt!=null){
			paramList = new ArrayList<>();
			for(int i=0,length=paramAtt.length;i<length;i++){
				
				paramList.add(paramAtt[i]);
			}
		}else{
			HistogramService histogram = new HistogramServiceImpl();
			paramList  = histogram.getWaferParameter(waferIdStr);
		}
	
		YieldService yield =  new YieldServiceImpl();
		Map<String,Object> result = yield.getYield(waferIdStr, paramList);
		System.out.println(new Gson().toJson(result));
	}

}
