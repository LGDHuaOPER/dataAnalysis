package com.eoulu.action.list;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.transfer.ProgressSingleton;

/**
 * Servlet implementation class UploadProgess
 */
@WebServlet(name = "LoadProgress", description = "加载进度", urlPatterns = { "/LoadProgress" })
public class UploadProgess extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UploadProgess() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=utf-8");
		String id = request.getSession().getId();
		String fileName = request.getParameter("fileName");
		id += id+fileName;
		Object size = ProgressSingleton.get(id + "Size");
		size = size == null ? 100 : size;
		Object progress = ProgressSingleton.get(id + "Progress");
		progress = progress == null ? 0 : progress; 
		long sizeNumber = Long.valueOf(String.valueOf(size)).longValue(); 
		long progressNumber = Long.valueOf(String.valueOf(progress)).longValue(); 
		int percent = (int) (progressNumber/sizeNumber);
		response.getWriter().write(percent+"%");
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
