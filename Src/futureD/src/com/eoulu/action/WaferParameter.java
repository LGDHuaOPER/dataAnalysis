package com.eoulu.action;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.service.GaussianService;
import com.eoulu.service.WaferService;
import com.eoulu.service.impl.GaussianServiceImpl;
import com.eoulu.service.impl.WaferServiceImpl;
import com.google.gson.Gson;

/**
 * Servlet implementation class WaferParameter
 */
@WebServlet(description = "加载参数", urlPatterns = { "/WaferParameter" })
public class WaferParameter extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public WaferParameter() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("utf-8");
		response.setContentType("text/html;charset=utf-8");
		String waferIdStr = request.getParameter("waferIdStr")==null?"":request.getParameter("waferIdStr");
		WaferService service = new WaferServiceImpl();
		List<String> paramList  = service.getWaferParameter(waferIdStr);
		GaussianService gaussian = new GaussianServiceImpl();
		Map<String, List<Double>> rangeList = gaussian.getRangList(paramList,waferIdStr);
		Map<String,Object> result = new HashMap<>();
		result.put("paramList", paramList);
		result.put("rangeList", rangeList);
		response.getWriter().write(new Gson().toJson(result));
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
