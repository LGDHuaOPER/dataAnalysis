package com.eoulu.action.analysis;

import java.io.IOException;
import java.util.HashMap;
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
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("utf-8");
		response.setContentType("text/html;charset=utf-8");
		Map<String, String[]> paramMap = request.getParameterMap();
	
		String key = "";
		String classify = null;
		int waferId = 0;
		String curveTypeId = "";
		String sParameter = "";
		
		Map<String,String[]> markerMap = new HashMap<>();
		for(Map.Entry<String,String[]> entry : paramMap.entrySet()){
			key = entry.getKey();
			String[] valueObj = entry.getValue();
			if(valueObj == null){
				continue;
			}
			if(valueObj.length>1){
				markerMap.put(key, (String[]) valueObj);	
			}else{
				switch (key) {
				case "classify":
					classify = valueObj[0];
					break;
				case "waferId":
					waferId = Integer.parseInt(valueObj[0]);
					break;
				case "curveTypeId":
					curveTypeId = valueObj[0];
					break;
				case "sParameter":
					sParameter = valueObj[0];
					break;
				default:
					break;
				}			
			}
			
		}

	
		AnalysisService service = new AnalysisServiceImpl();
		boolean flag = false;
		switch (classify) {
		case "add":
			flag = service.insertMarker(markerMap, waferId,"TCF",sParameter);
			response.getWriter().write(new Gson().toJson(flag));
			break;

		case "modify":
			flag = service.updateMarker(markerMap, waferId,"TCF");
			response.getWriter().write(new Gson().toJson(flag));
			break;

		case "remove":
			flag = service.deleteMarker(curveTypeId,sParameter);
			response.getWriter().write(new Gson().toJson(flag));
			break;
		}

	}

}
