package com.eoulu.action.list;

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
import com.eoulu.parser.FileDelete;
import com.eoulu.parser.ZipFileParser;
import com.eoulu.service.WaferService;
import com.eoulu.service.impl.LogServiceImpl;
import com.eoulu.service.impl.WaferServiceImpl;
import com.eoulu.transfer.ProgressSingleton;
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
						sessionId = request.getSession().getId()+fileName+"Progress",
						temp = pathMap.get("temp").toString(),
						lastModified = request.getParameter("lastModified")==null?"0000-00-00 00:00:00":request.getParameter("lastModified").toString(),
						status = null,logWafer="";
		description = currentUser+":"+description;
		Map<String,Object> result = null,map=new HashMap<String, Object>();
		map.put("filePath", filePath);
		map.put("temp", temp);
//		map.put("fileName", fileName.substring(0, fileName.indexOf(".")));
		map.put("fileName", fileName);
		map.put("lastModified", lastModified);
		map.put("productCategory", productCategory);
		map.put("description", description);
		map.put("currentUser", currentUser);
		map.put("dataFormat", dataFormat);
		map.put("sessionId", sessionId);
		map.put("interval", 5);
		WaferService service = new WaferServiceImpl();
		ZipFileParser zipUtil = new ZipFileParser();
		System.out.println("lastModified:"+lastModified);
//		System.out.println("filePath:"+filePath);
		ProgressSingleton.put(sessionId, 5);
		boolean flag = false;
		switch (dataFormat) {
		case "1":
			if(!fileName.endsWith(".zip") && !fileName.endsWith(".rar")){
				status="文件格式有误！";
			}else{
//			result = zipUtil.Zip(filePath, temp, fileName.substring(0, fileName.indexOf(".")), productCategory, description, currentUser, dataFormat, sessionId, 0);
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
			if(fileName.endsWith(".zip") || fileName.endsWith(".rar")){
				result = zipUtil.Zip(map);
				flag = (Boolean) result.get("flag");
				status = result.get("status").toString();
				logWafer = result.get("logWafer").toString();
				if(flag){
					status="上传失败，zip压缩文件中不包含任何一个CSV或者Excel文件！";
				}
			}else if(fileName.endsWith(".xlsx")){
				 status = ExcelParser.getExcelData(null,filePath, productCategory, description, currentUser, dataFormat,sessionId,5,false,lastModified);
			}else{
				status="文件格式有误！";
			}
			
			break;
		}
		new FileDelete().deleteDirectory(temp);
		if("success".equals(status)){
			new LogServiceImpl().insertLog(currentUser, "数据列表", "导入了晶圆数据"+logWafer, request.getSession());
		}
		ProgressSingleton.put(sessionId, 100);
		status = "success".equals(status)?"上传成功！":status;
		response.getWriter().write(new Gson().toJson(status));
		ProgressSingleton.remove(sessionId);
	}
	
	
	public static void main(String[] args) {
		String filePath = "C:\\Users\\zuo\\Desktop\\测试文件\\EOUWAFER001.xlsx";
		String fileName = "EOUWAFER001.xlsx";
		String temp = "E:/test";
		File file = new File(temp);
		if(!file.exists()){
			file.mkdirs();
		}
		String filename2 = fileName.substring(0, fileName.indexOf("."));//zip压缩文件名
		String productCatagory="1";
		String description="EOUWAFER001.xlsx";
		String currentUser="TEST";
		String dataFormat = "0";
		Map<String,Object> result = null,map=new HashMap<String, Object>();
		map.put("filePath", filePath);
		map.put("temp", temp);
		map.put("fileName", fileName.substring(0, fileName.indexOf(".")));
		map.put("productCategory", productCatagory);
		map.put("description", description);
		map.put("currentUser", currentUser);
		map.put("dataFormat", dataFormat);
		map.put("sessionId", "");
		map.put("interval", 0);
		map.put("lastModified", "2019-01-01 12:12:12");
		long time = System.currentTimeMillis();
		ZipFileParser util = new ZipFileParser();
		String status = ExcelParser.getExcelData(null,filePath, productCatagory, description, currentUser, dataFormat,"",0,true,"2019-01-01 12:12:12");
//	   result = util.Zip(map);
	   new FileDelete().deleteDirectory(temp);
		System.out.println(System.currentTimeMillis()-time);
//		System.out.println(result);
		System.out.println(status);
		
		
	}

}
