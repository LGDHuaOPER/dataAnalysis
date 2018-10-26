package com.eoulu.action.analysis;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
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
 * Servlet implementation class MarkerOperate
 */
@WebServlet(description = "marker的增删改", urlPatterns = { "/MarkerOperate" })
public class MarkerOperate extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public MarkerOperate() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("utf-8");
		response.setContentType("text/html;charset=utf-8");
		String classify = request.getParameter("classify")==null?"": request.getParameter("classify").trim(),
			   waferId = request.getParameter("waferId")==null?"":request.getParameter("waferId").trim(),
				curveTypeId = request.getParameter("curveTypeId")==null?"":request.getParameter("curveTypeId").trim(),
				oldMarkerName = request.getParameter("oldMarkerName")==null?"":request.getParameter("oldMarkerName").trim(),
				markerName = request.getParameter("markerName")==null?"":request.getParameter("markerName").trim(),
				xPoint = request.getParameter("xPoint")==null?"":request.getParameter("xPoint").trim(),
				yPoint = request.getParameter("yPoint")==null?"":request.getParameter("yPoint").trim(),
						markerKey = request.getParameter("markerKey")==null?"":request.getParameter("markerKey").trim();
		AnalysisService service = new AnalysisServiceImpl();
		Object[] param = null;
		boolean flag = false;
		Map<String,String> map = new HashMap<>();
		switch (classify) {
		case "add":
			param = new Object[]{Integer.parseInt(waferId),Integer.parseInt(curveTypeId),"TCF",markerName,xPoint,yPoint,markerKey};
			flag = service.operateMarker(param, classify);
			if(flag){
				param = new Object[]{Integer.parseInt(waferId),Integer.parseInt(curveTypeId),"TCF",markerName};
				int markerId = service.getMarkerId(param);
				map.put("markerId", markerId+"");
				map.put("markerName", markerName);
				map.put("xPoint", xPoint);
				map.put("yPoint", yPoint);
				map.put("markerKey", markerKey);
			}
			map.put("flag", flag+"");
			response.getWriter().write(new Gson().toJson(map));
			break;

		case "modify":
			param = new Object[]{markerName,markerKey,oldMarkerName,Integer.parseInt(waferId)};
			flag = service.operateMarker(param, classify);
			response.getWriter().write(new Gson().toJson(flag));
			break;
			
		case "remove":
			param = new Object[]{markerName,Integer.parseInt(waferId)};
			flag = service.deleteMarker(param);
			response.getWriter().write(new Gson().toJson(flag));
			break;
		}
		
	}
	
	

}
