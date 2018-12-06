package com.eoulu.action.list;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.service.WaferService;
import com.eoulu.service.impl.WaferServiceImpl;
import com.google.gson.Gson;

/**
 * Servlet implementation class Examine
 */
@WebServlet(description = "检验是否能够绘制晶圆图", urlPatterns = { "/Examine" })
public class Examine extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Examine() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		WaferService service = new WaferServiceImpl();
		int waferId = request.getParameter("waferId")==null?0:Integer.parseInt(request.getParameter("waferId"));
		if(waferId == 0){
			response.getWriter().write(new Gson().toJson("未收到参数数据！"));
		}
		response.getWriter().write(new Gson().toJson(service.getMapFlag(waferId)));
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
