package com.eoulu.controller.wafer;

import java.io.IOException;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.service.WaferDataService;
import com.eoulu.service.impl.WaferDataServiceImpl;
import com.google.gson.Gson;

/**
 * Servlet implementation class WaferData
 */
@WebServlet(description = "晶圆的详细数据", urlPatterns = { "/WaferData" })
public class WaferData extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public WaferData() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("utf-8");
		response.setContentType("text/html;utf-8");
		int waferId = request.getParameter("waferId") == null ? 0 : Integer.parseInt(request.getParameter("waferId"));
		String dataFormat = request.getParameter("dataFormat") == null ? "" : request.getParameter("dataFormat").trim();

		WaferDataService service = new WaferDataServiceImpl();
		Map<String,Object> result = null;
		switch (dataFormat) {
		case "0":
			result = service.getWaferData(waferId);
			break;

		case "1":

			break;
		case "2":

			break;
		case "3":

			break;
		}
		
		request.setAttribute("result", new Gson().toJson(result));
		request.getRequestDispatcher("").forward(request, response);

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
	
	public static void main(String[] args) {
		WaferDataService service = new WaferDataServiceImpl();
		long time = System.currentTimeMillis();
//		service.getWaferData(183);
		System.out.println(service.getWaferData(183));
		System.out.println(System.currentTimeMillis()-time);
		
	}

}
