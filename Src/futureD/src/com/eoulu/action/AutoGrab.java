package com.eoulu.action;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.parser.ExcelImageRead;
import com.eoulu.parser.ExcelParser;
import com.eoulu.parser.ZipFileParser;
import com.eoulu.service.WaferService;
import com.eoulu.service.impl.LogServiceImpl;
import com.eoulu.service.impl.WaferServiceImpl;
import com.eoulu.util.FileUtil;
import com.google.gson.Gson;

/**
 * Servlet implementation class AutoGrab
 */
@WebServlet(description = "接收自动抓取到的客户端数据", urlPatterns = { "/AutoGrab" })
public class AutoGrab extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public AutoGrab() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		doGet(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=utf-8");
		FileUtil util = new FileUtil();
		Map<String, Object> PathresultMap = util.getPath(),result=null;
		String temp = (String) PathresultMap.get("temp"), tempPath = (String) PathresultMap.get("tempPath"),
				fileName = null, filePath = null, productCategory = null, currentUser = null, description = null,
				status = null, logWafer = null,editTime=null;
		boolean flag = false;
		WaferService service = new WaferServiceImpl();
		File file01 = (File) PathresultMap.get("file01");
		Map<String, Object> map = util.getForm(file01, request, fileName, tempPath);
		fileName = map.get("fileName").toString();
		filePath = map.get("filePath").toString();
		productCategory = map.get("productCategory").toString();
		currentUser = map.get("currentUser").toString();
		description = map.get("description").toString();
		editTime = map.get("editTime").toString();
		if(service.getWafer(fileName, editTime)){
			response.getWriter().write(new Gson().toJson(status));
			return;
		}
		if (fileName.endsWith(".zip") || fileName.endsWith(".rar")) {
			Map<String,Object> transport = new HashMap<String, Object>();
			transport.put("filePath", filePath);
			transport.put("temp", temp);
			transport.put("fileName", fileName.substring(0, fileName.indexOf(".")));
			transport.put("productCategory", productCategory);
			transport.put("description", description);
			transport.put("currentUser", currentUser);

			ZipFileParser zipUtil = new ZipFileParser();
			result = zipUtil.Zip(transport);
			flag = (Boolean) result.get("flag");
			status = result.get("status").toString();
			logWafer = result.get("logWafer").toString();
			if (flag) {
				status = "上传失败，zip压缩文件中不包含任何一个CSV或者Excel文件！";
			}
		}
		if (fileName.endsWith(".xlsx")) {
		
			result= util.getDataFormat(filePath);
			String dataFormat = result.get("dataFormat").toString();
			logWafer = result.get("waferNO").toString();
			if ("0".equals(dataFormat)) {
				status = ExcelParser.getExcelData(null,filePath, productCategory, description, currentUser, dataFormat,"",0);
			}
			
			if ("2".equals(dataFormat)) {
				status = service.saveExcel(filePath, fileName.substring(0, fileName.indexOf(".")), productCategory,
						description, currentUser, "", 0);
				ExcelImageRead image = new ExcelImageRead();
				image.readImageOfExcel(filePath, "png");
			}
			if ("3".equals(dataFormat)) {
				status = service.saveTxtToExcel(filePath, productCategory, description, currentUser, fileName, 0);
			}
		}

		if ("success".equals(status)) {
			new LogServiceImpl().insertLog(currentUser, "数据列表", "导入了晶圆数据" + logWafer, request.getSession());
		}
		response.getWriter().write(new Gson().toJson(status));
	}

}
