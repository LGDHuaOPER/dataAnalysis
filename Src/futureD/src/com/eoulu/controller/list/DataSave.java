package com.eoulu.controller.list;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class DataSave
 */
@WebServlet(description = "上传后提交", urlPatterns = { "/DataSave" })
public class DataSave extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public DataSave() {
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
		
		String dataFormat = request.getParameter("dataFormat")==null?"":request.getParameter("dataFormat");
		String productCatagory = request.getParameter("productCatagory")==null?"":request.getParameter("productCatagory");
		String testOperator = request.getParameter("testOperator")==null?"":request.getParameter("testOperator");
		String description = request.getParameter("description")==null?"":request.getParameter("description");
		String filePath = request.getParameter("filePath")==null?"":request.getParameter("filePath");
		String tempPath = request.getParameter("tempPath")==null?"":request.getParameter("tempPath");
		String fileName = request.getParameter("fileName")==null?"":request.getParameter("fileName");
		String currentUser = request.getSession().getAttribute("userName").toString();
		String zipName=fileName.substring(0, fileName.indexOf("."));
		switch(dataFormat){
		case "0":
			break;
		case "1":
			break;
		case "2":
			break;
		case "3":
			break;
		case "4":
			break;
		default:
			break;
		}
		
		
	}

}
