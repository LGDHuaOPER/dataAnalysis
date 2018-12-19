/**
 * 
 */
package com.eoulu.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.Charset;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipException;
import java.util.zip.ZipFile;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.eoulu.transfer.ProgressSingleton;

import de.innosystec.unrar.Archive;
import de.innosystec.unrar.exception.RarException;
import de.innosystec.unrar.rarfile.FileHeader;

/**
 * @author mengdi
 *
 * 
 */
public class FileUtil {

	
	//获取项目路径
		public Map<String, Object> getPath() throws UnsupportedEncodingException{
			Map<String, Object> resultMap=new HashMap<String, Object>();
			Date date=new Date();
			String path4 = Thread.currentThread().getContextClassLoader().getResource("../../").getPath()+date.getTime()+"\\";
			String temp=path4;
			String tempPath =temp+"EOULU\\file\\";//zip压缩文件
			String path=temp+"EOULU\\file1";//缓存文件
			path=URLDecoder.decode(temp,"gbk");
		    File file = new File(tempPath);
		    File file01 = new File(path);
			if(!file.exists()){
		        file.mkdirs();
		    }
			if(!file01.exists()){
		        file01.mkdirs();
		    }
			resultMap.put("temp", temp);
			resultMap.put("tempPath", tempPath);
			resultMap.put("path", path);
			resultMap.put("file", file);
			resultMap.put("file01", file01);
			return resultMap;
		}
		
		
	public Map<String, String> getFormByProgress(File file01, HttpServletRequest request, String tempPath) {
		String fileName = null,filePath = null,lastModified=null;
		Map<String, String> map = new HashMap<>();
		DiskFileItemFactory factory = new DiskFileItemFactory();// 1、创建一个DiskFileItemFactory工厂
		factory.setRepository(file01);// 设置临时目录
		factory.setSizeThreshold(4096); // 设置缓冲区大小，这里是4kb
		ServletFileUpload upload = new ServletFileUpload(factory);// 2、创建一个文件上传解析器
		upload.setHeaderEncoding("UTF-8");// 解决上传文件名的中文乱码
		// 3、判断提交上来的数据是否是上传表单的数据
		if (!upload.isMultipartContent(request)) {
			// 按照传统方式获取数据
			System.out.println("不是表单");
		}
		java.util.List<org.apache.commons.fileupload.FileItem> items = null;
		try {
			// 4、使用ServletFileUpload解析器解析上传数据，解析结果返回的是一个List<FileItem>集合，每一个FileItem对应一个Form表单的输入项
			items = upload.parseRequest(request);
			byte data[] = new byte[1024];
			if (items != null) {
				for (Iterator iterator = items.iterator(); iterator.hasNext();) {
					FileItem item = (FileItem) iterator.next();
					String id = request.getSession().getId() + item.getName();
					// 向单例哈希表写入文件长度和初始进度
					ProgressSingleton.put(id + "Size", item.getSize());
					// 文件进度长度
					long progress = 0;
					if (item.isFormField()) {
						
					} else {
						Map<String, String> tempMap = new HashMap<String, String>();
						fileName = item.getName();
						if (fileName == null || fileName.trim().equals("")) {
							continue;
						}
						/*
						 * 注意：不同的浏览器提交的文件名是不一样的，有些浏览器提交上来的文件名是带有路径的，如：
						 * c:\a\b\1.txt，而有些只是单纯的文件名，如：1.txt
						 * 处理获取到的上传文件的文件名的路径部分，只保留文件名部分
						 */
						fileName = fileName.substring(fileName.lastIndexOf(File.separator) + 1);
						// fileName =
						// fileName.substring(item.getName().lastIndexOf(File.separator)
						// + 1,item.getName().length());
						InputStream inputStream = item.getInputStream();
						// OutputStream outputStream = new
						// FileOutputStream(tempPath+ fileName);
						// 创建一个文件输出流
						FileOutputStream outputStream = new FileOutputStream(tempPath + File.separator + fileName);
						int i;
						while ((i = inputStream.read(data)) != -1) {
							progress = progress + i;
							ProgressSingleton.put(id + "Progress", progress);
							outputStream.write(data, 0, i);
						}
						// 当文件上传完成之后，从单例中移除此次上传的状态信息
						ProgressSingleton.remove(id + "Size");
						ProgressSingleton.remove(id + "Progress");
						inputStream.close();
						outputStream.close();
						filePath = tempPath + fileName;
						map.put(fileName, filePath);
					}

				}
			}
		} catch (FileUploadException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} 
		
		return map;
	}
	
	public Map<String, Object> getForm(File file01, HttpServletRequest request, String fileName, String tempPath) {
		DiskFileItemFactory factory = new DiskFileItemFactory();
		factory.setRepository(file01);// 设置临时目录
		factory.setSizeThreshold(4096); // 设置缓冲区大小，这里是4kb
		ServletFileUpload upload = new ServletFileUpload(factory);
		java.util.List<org.apache.commons.fileupload.FileItem> items = null;
		String productCategory = null, currentUser = null, description = null,filePath = null,editTime=null,lastModified=null;
		Map<String,Object> map = new HashMap<>();
		try {
			items = upload.parseRequest(request);
			byte data[] = new byte[1024];
			int i = 0;
			if (items != null) {
				for (Iterator iterator = items.iterator(); iterator.hasNext();) {
					FileItem item = (FileItem) iterator.next();
					if (item.isFormField()) {
						// 不是file类型的话，就利用getFieldName判断name属性获取相应的值
						if ("productCatagories".equals(item.getFieldName())) {
							productCategory = item.getString("utf-8");
						}
						if ("testOperator".equals(item.getFieldName())) {
							currentUser = item.getString("utf-8");
						}
						if ("details".equals(item.getFieldName())) {
							description = item.getString("utf-8");
						}
						if ("editTime".equals(item.getFieldName())) {
							editTime = item.getString("utf-8");
						}
						if ("lastModified".equals(item.getFieldName())) {
							lastModified = item.getString("utf-8");
						}

					} else {
						// 获取表单文件，写入项目文件夹中
						fileName = item.getName().substring(item.getName().lastIndexOf(File.separator) + 1,
								item.getName().length());
						System.out.println(fileName);
						InputStream inputStream = item.getInputStream();
						OutputStream outputStream = new FileOutputStream(tempPath + fileName);
						while ((i = inputStream.read(data)) != -1) {
							outputStream.write(data, 0, i);
						}
						inputStream.close();
						outputStream.close();
						filePath = tempPath+fileName;
					}
				}
			}
		} catch (FileUploadException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		map.put("fileName", fileName);
		map.put("filePath", filePath);
		map.put("productCategory", productCategory);
		map.put("currentUser", currentUser);
		map.put("description", description);
		map.put("editTime", editTime);
		map.put("lastModified", lastModified);
		return map;
	}
	
	
	public static File unZip(String filePath, String descDir){
		Charset gbk = Charset.forName("GBK");
		File zipFile = new File(filePath);
		File pathFile = new File(descDir);
		if (!pathFile.exists()){
			pathFile.mkdirs();
		}
		ZipFile zip = null;
		InputStream in = null;
		OutputStream out = null;
		try{
			zip = new ZipFile(zipFile,gbk);
			for (Enumeration<? extends ZipEntry> entries = zip.entries(); entries.hasMoreElements();){
			ZipEntry entry = entries.nextElement();
			String zipEntryName = entry.getName();
			in = zip.getInputStream(entry);
			String outPath = (descDir + "/" + zipEntryName).replaceAll("\\*", "/");;
			// 判断路径是否存在,不存在则创建文件路径
			File file = new File(outPath.substring(0,outPath.lastIndexOf('/')));
			if (!file.exists()){
				file.mkdirs();
			}
			// 判断文件全路径是否为文件夹,如果是上面已经创建,不需要解压
			if (new File(outPath).isDirectory()){
				continue;
			}
			out = new FileOutputStream(outPath);
			byte[] buf1 = new byte[4 * 1024];
			int len;
			while ((len = in.read(buf1)) > 0){
				out.write(buf1, 0, len);
			}
			in.close();
			out.close();
			}
		}catch (IOException e){
			pathFile.delete();
			e.printStackTrace();
		}finally{
			try{
				if (zip != null){
					zip.close();
				}
				if (in != null){
					in.close();
				}
				if (out != null){
					out.close();
				}
			}catch (IOException e){
				e.printStackTrace();
			}
		
		}
	
	return pathFile;
	}
	
	public static File unRar(String filePath, String descDir) {
		FileOutputStream os = null;
		Archive archive = null;
		File inputFile = new File(filePath);
		
		File destFile = new File(descDir);
		if(!destFile.exists()){
			destFile.mkdirs();
		}
		try {
			// 创建rar文件
			 archive = new Archive(new File(filePath));
			if (archive == null) {
				return null;
			}
			FileHeader header = archive.nextFileHeader();
			File destFileName = null;
			
			while (header != null) {
				String compressFileName = header.getFileNameW().isEmpty()?header.getFileNameString().trim():header.getFileNameW();
				destFileName = new File(destFile.getAbsolutePath() + "/" + compressFileName);
				if (header.isDirectory()) {
					if (!destFileName.exists()) {
						destFileName.mkdirs();
					}
					header = archive.nextFileHeader();
					continue;
				}
				if (!destFileName.getParentFile().exists()) {
					destFileName.getParentFile().mkdirs();
				}
				os = new FileOutputStream(destFileName);
				archive.extractFile(header, os);
				os.close();
				os = null;
				header = archive.nextFileHeader();
			}

		} catch (IOException e) {
			e.printStackTrace();
		} catch (RarException e) {
			e.printStackTrace();
		}finally {
			try {
				if(archive !=null){
					archive.close();
				}
				if(os !=null){
					os.close();
				}
				
			} catch (IOException e) {
				e.printStackTrace();
			}
			
		}

		return destFile;
	}
	
	
	
	
	public static Map<String,Object> getDataFormat(String filepath)
	{
		Map<String,Object> map = new HashMap<>();
		String waferID="",dataFormat = "",fileName="";
		try {
			FileInputStream excelFileInputStream = new FileInputStream(filepath);
			XSSFWorkbook workbook;
			
				workbook = new XSSFWorkbook(excelFileInputStream);
				excelFileInputStream.close();
				XSSFSheet sheet = workbook.getSheetAt(0);
				for (int rowIndex = 0; rowIndex <= sheet.getLastRowNum()-2; rowIndex++)
				{
					XSSFRow row = sheet.getRow(rowIndex);
					if(row == null || row.getCell(0) == null){
						continue;
					}
					if(rowIndex == 0 && "编号".equals(row.getCell(0).toString())){
						dataFormat = "2";
						fileName  = new File(filepath).getName();
						waferID = fileName.substring(0, fileName.lastIndexOf("."));
						break;
					}
					if(  "Device".equals(row.getCell(0).toString()) && "site".equals(row.getCell(1).toString())){
						dataFormat = "3";
						fileName  = new File(filepath).getName();
						waferID = fileName.substring(0, fileName.lastIndexOf("."));
						break;
					}
					if(  "DeviceID".equals(row.getCell(0).toString().trim()) && "LotID".equals(sheet.getRow(rowIndex+1).getCell(0).toString().trim()) && "WaferID".equals(sheet.getRow(rowIndex+2).getCell(0).toString().trim()))
					{
						dataFormat = "0";
						System.out.println("rowIndex:"+rowIndex);
						waferID = sheet.getRow(rowIndex+2).getCell(2).toString();
					}
					if( "Type".equals(row.getCell(0).toString())){
						break;
					}
				}	
				map.put("waferNO", waferID);
				map.put("dataFormat", dataFormat);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}catch (Exception e) {
			e.printStackTrace();
		}
		return map;
	}	
	
	public static void main(String[] args) {
		System.out.println(getDataFormat("E:/test/wafer1.xlsx"));
	}
}
