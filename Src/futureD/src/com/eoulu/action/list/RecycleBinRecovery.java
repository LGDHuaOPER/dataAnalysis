package com.eoulu.action.list;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.service.WaferService;
import com.eoulu.service.impl.LogServiceImpl;
import com.eoulu.service.impl.WaferServiceImpl;
import com.google.gson.Gson;

/**
 * Servlet implementation class RecycleBinRecovery
 */
@WebServlet(description = "回收站恢复", urlPatterns = { "/RecycleBinRecovery" })
public class RecycleBinRecovery extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RecycleBinRecovery() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=utf-8");
		WaferService service = new WaferServiceImpl();
		String waferId = request.getParameter("waferId")==null?"":request.getParameter("waferId");
		boolean flag = service.recovery(waferId);
		if(flag){
			new LogServiceImpl().insertLog(request.getSession().getAttribute("userName").toString(), "回收站", "恢复晶圆"+service.getWaferNO(waferId)+"至数据列表", request.getSession());
		}
		response.getWriter().write(new Gson().toJson(flag));
	}

	
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
