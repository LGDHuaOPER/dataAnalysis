package com.eoulu.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.service.CPKService;
import com.eoulu.service.HistogramService;
import com.eoulu.service.impl.CPKServiceImpl;
import com.eoulu.service.impl.HistogramServiceImpl;
import com.google.gson.Gson;

/**
 * Servlet implementation class CPKServlet
 */
@WebServlet(description = "CPK图", urlPatterns = { "/CPKServlet" })
public class CPKServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CPKServlet() {
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
		CPKService service = new CPKServiceImpl();
		String waferIdStr = request.getParameter("waferIdStr") == null ? "" : request.getParameter("waferIdStr"),
				parameter = request.getParameter("parameter") == null ? "" : request.getParameter("parameter");
		Map<String, Object> result = new HashMap<>();
		if (!"".equals(parameter)) {
			result.put(parameter, service.getCPK(waferIdStr, parameter));
			response.getWriter().write(new Gson().toJson(result));
			return;
		}
		List<String> paramList = null;
		String[] paramAtt = request.getParameterValues("paramAtt[]");
		if(paramAtt!=null){
			paramList = new ArrayList<>();
			for(int i=0,length=paramAtt.length;i<length;i++){
				paramList.add(paramAtt[i]);
			}
		}else{
			HistogramService histogram = new HistogramServiceImpl();
			paramList = histogram.getWaferParameter(waferIdStr);
		}
		
		for (int i=0,size=paramList.size();i<size;i++) {
			result.put(paramList.get(i), service.getCPK(waferIdStr, paramList.get(i)));
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
		CPKService service = new CPKServiceImpl();
		String waferIdStr = "354",
				parameter = "";
		Map<String, Object> result = new HashMap<>();
		if (!"".equals(parameter)) {
			result.put(parameter, service.getCPK(waferIdStr, parameter));
			return;
		}
		List<String> paramList = null;
		String[] paramAtt = null;
		if(paramAtt!=null){
			paramList = new ArrayList<>();
			for(int i=0,length=paramAtt.length;i<length;i++){
				paramList.add(paramAtt[i]);
			}
		}else{
			HistogramService histogram = new HistogramServiceImpl();
			paramList = histogram.getWaferParameter(waferIdStr);
		}
		
		for (int i=0,size=paramList.size();i<1;i++) {
			result.put(paramList.get(i), service.getCPK(waferIdStr, paramList.get(i)));
		}
		System.out.println( new Gson().toJson(result));
	}

}
