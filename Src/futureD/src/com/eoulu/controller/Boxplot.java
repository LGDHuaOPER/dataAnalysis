package com.eoulu.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.service.BoxPlotService;
import com.eoulu.service.HistogramService;
import com.eoulu.service.impl.BoxPlotServiceImpl;
import com.eoulu.service.impl.HistogramServiceImpl;
import com.google.gson.Gson;

/**
 * Servlet implementation class Boxplot
 */
@WebServlet(description = "箱线图", urlPatterns = { "/Boxplot" })
public class Boxplot extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Boxplot() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("utf-8");
		response.setContentType("text/html;charset=utf-8");
		String waferIdStr = request.getParameter("waferIdStr")==null?"":request.getParameter("waferIdStr").trim();
		String parameter = request.getParameter("parameter")==null?"":request.getParameter("parameter").trim();
		HistogramService service = new HistogramServiceImpl();
		List<String> paramList =  null;
		if("".equals(parameter)){
			String[] paramAtt = request.getParameterValues("paramAtt[]");
			if(paramAtt!=null){
				paramList = new ArrayList<>();
				for(int i=0,length=paramAtt.length;i<length;i++){
					paramList.add(paramAtt[i]);
				}
			}else{
				paramList = service.getWaferParameter(waferIdStr);
			}
		
		}else{
			paramList = new ArrayList<>();
			paramList.add(parameter);
		}
		BoxPlotService boxService = new BoxPlotServiceImpl();
		Map<String,Object> result = new Hashtable<>();
		for(String param:paramList){
			result.put(param,boxService.getBoxPlot(param, waferIdStr));
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
