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
 * Servlet implementation class VectorCurve
 */
@WebServlet(description = "矢量map曲线", urlPatterns = { "/VectorCurve" })
public class VectorCurve extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public VectorCurve() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		int coordinateId = request.getParameter("coordinateId")==null?0:Integer.parseInt(request.getParameter("coordinateId"));
		String subdieName = request.getParameter("subdie")==null?"":request.getParameter("subdie"),
				deviceGroup = request.getParameter("deviceGroup")==null?"":request.getParameter("deviceGroup");
		WaferMapService service = new WaferMapServiceImpl();
		Map<String,Object> map  = service.getVectorCurve(coordinateId, subdieName, deviceGroup);
		
		response.getWriter().write(new Gson().toJson(map));
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
