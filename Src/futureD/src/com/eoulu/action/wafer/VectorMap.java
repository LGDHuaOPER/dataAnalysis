package com.eoulu.action.wafer;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.service.WaferMapService;
import com.eoulu.service.impl.WaferMapServiceImpl;
import com.google.gson.Gson;

/**
 * Servlet implementation class VectorMap
 */
@WebServlet(description = "矢量map", urlPatterns = { "/VectorMap" })
public class VectorMap extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public VectorMap() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		WaferMapService service = new WaferMapServiceImpl();
		int waferId = request.getParameter("waferId")==null?0:Integer.parseInt(request.getParameter("waferId"));
		Map<String,Object> map  = new HashMap<>();
		map.put("deviceGroup",service.getDeviceGroup(waferId));
		map.put("subdie",service.getSubdie(waferId));
		map.put("mapInfo",service.getVectorMap(waferId));
		response.getWriter().write(new Gson().toJson(map));
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
	
	public static void main(String[] args) {
		Map<String,Object> map  = new HashMap<>();
		WaferMapService service = new WaferMapServiceImpl();
		int waferId = 208;
//		map.put("deviceGroup",service.getDeviceGroup(waferId));
//		map.put("subdie",service.getSubdie(waferId));
		map.put("mapInfo",service.getVectorMap(waferId));
		System.out.println(new Gson().toJson(map));
//		System.out.println(new Gson().toJson(service.getVectorMap(waferId, "", "75C")));
//		System.out.println(service.getVectorCurve(104278, "", "Sweep Voltage"));
//		System.out.println(new Gson().toJson(service.getVectorCurve(104278, "", "Sweep Voltage")));
		
	}

}
