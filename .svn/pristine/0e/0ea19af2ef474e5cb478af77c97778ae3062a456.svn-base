package com.eoulu.action.list;

import java.io.File;
import java.io.IOException;
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
 * Servlet implementation class UploadStorage
 */
@WebServlet(description = "上传存储", urlPatterns = { "/UploadStorage" })
public class UploadStorage extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UploadStorage() {
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
		request.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=utf-8");
		String filePath = (request.getParameter("filePath") == null || "".equals(request.getParameter("filePath"))) ? ""
				: request.getParameter("filePath").trim();
		if ("".equals(filePath)) {
			response.getWriter().write(new Gson().toJson("未接收到文件路径！"));
		}
		Map<String, Object> pathMap = new FileUtil().getPath();
		String productCategory = request.getParameter("productCategory") == null ? ""
				: request.getParameter("productCategory").trim(),
				dataFormat = request.getParameter("dataFormat") == null ? ""
						: request.getParameter("dataFormat").trim(),
				description = request.getParameter("description") == null ? ""
						: request.getParameter("description").trim(),
				fileName = request.getParameter("fileName") == null ? ""
								: request.getParameter("fileName").trim(),
				currentUser = request.getSession().getAttribute("userName").toString(),
						sessionId = request.getSession().getId()+fileName,
						temp = pathMap.get("temp").toString(),
						status = null,logWafer="";
		description = currentUser+":"+description;
		WaferService service = new WaferServiceImpl();
		ZipFileParser zipUtil = new ZipFileParser();
		Map<String,Object> result = null;
		boolean flag = false;
		switch (dataFormat) {
		case "1":
			if(!fileName.endsWith(".zip")){
				status="文件格式有误！";
			}else{
			result = zipUtil.Zip(filePath, temp, fileName.substring(0, fileName.indexOf(".")), productCategory, description, currentUser, dataFormat, sessionId, 0);
			flag = (Boolean) result.get("flag");
			if(flag){
				status="上传失败，zip压缩文件中不包含任何一个CSV或者Excel文件！";
			}
			}
			break;
		case "2":
			/*注：新Excel上传带图片，目前仅做从Excel中取图片*/
			if(!fileName.endsWith(".xlsx")){
				status="文件格式有误！";
			}else{
				status = service.saveExcel(filePath, fileName.substring(0, fileName.indexOf(".")), productCategory,  description, currentUser, sessionId, 0);
				ExcelImageRead image = new ExcelImageRead();
				image.readImageOfExcel(filePath,"png");
			}
			break;
		case "3":
			if(!fileName.endsWith(".xlsx")){
				status="文件格式有误！";
			}else{
				status = service.saveTxtToExcel(filePath, productCategory,description, currentUser, fileName, 0);
			}
			break;
		default:
			if(fileName.endsWith(".zip") ){
				result = zipUtil.Zip(filePath, temp, fileName.substring(0, fileName.indexOf(".")), productCategory, description, currentUser, dataFormat, sessionId, 0);
				flag = (Boolean) result.get("flag");
				status = result.get("status").toString();
				logWafer = result.get("logWafer").toString();
				if(flag){
					status="上传失败，zip压缩文件中不包含任何一个CSV或者Excel文件！";
				}
			}else if(fileName.endsWith(".xlsx")){
				status = ExcelParser.getExcelData(filePath, productCategory, description, currentUser, dataFormat);
			}else{
				status="文件格式有误！";
			}
			break;
		}
		if("success".equals(status)){
			new LogServiceImpl().insertLog(currentUser, "数据列表", "导入了晶圆数据"+logWafer, request.getSession());
		}
		status = "success".equals(status)?"上传成功！":status;
		response.getWriter().write(new Gson().toJson(status));
	}

}
