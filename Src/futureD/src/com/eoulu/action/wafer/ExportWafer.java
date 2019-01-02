package com.eoulu.action.wafer;

import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;
import java.net.URLEncoder;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.service.WaferDataService;
import com.eoulu.service.impl.WaferDataServiceImpl;

/**
 * Servlet implementation class ExportWafer
 */
@WebServlet(description = "wafer数据导出", urlPatterns = { "/ExportWafer" })
public class ExportWafer extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ExportWafer() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("utf-8");
		response.setContentType("text/html;utf-8");
		int waferId = request.getParameter("waferId") == null ? 0 : Integer.parseInt(request.getParameter("waferId"));
		String dataFormat = request.getParameter("dataFormat") == null ? "" : request.getParameter("dataFormat").trim(),
				waferNO = request.getParameter("waferNO") == null ? "" : request.getParameter("waferNO").trim();
		StringBuffer wholePath = request.getRequestURL();
		String servletPath = request.getServletPath();
		String path = request.getServletContext().getRealPath("/")+"down/";
		System.out.println(path);
		path=URLDecoder.decode(path,"gbk");
		File file = new File(path);
		if(!file.exists() && !file.isDirectory()){
			file.mkdir();
		}
		WaferDataService service = new WaferDataServiceImpl();
		if("0".equals(dataFormat)){
			service.getExportExcel(waferId, path);
			path = wholePath.toString().split(servletPath)[0]+"/down/"+URLEncoder.encode(waferNO,"utf-8")+".xlsx";
			path=URLDecoder.decode(path,"gbk");
		}
		System.out.println(path);
		response.getWriter().write(path);
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
	
	public static void main(String[] args) {
		WaferDataService service = new WaferDataServiceImpl();
		service.getExportExcel(352, "C:\\Users\\zuo\\Desktop\\厦门三安\\测试文件\\AR0031-25 (1).xlsx");
		System.out.println("end");
	}

}
