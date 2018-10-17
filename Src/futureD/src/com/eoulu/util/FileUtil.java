/**
 * 
 */
package com.eoulu.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.eoulu.transfer.ProgressSingleton;

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
		String fileName = null,filePath = null;
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
	
	public String getForm(File file01,HttpServletRequest request,String fileName,String tempPath) {
		DiskFileItemFactory factory = new DiskFileItemFactory();
	    factory.setRepository(file01);//设置临时目录
	    factory.setSizeThreshold(4096); // 设置缓冲区大小，这里是4kb
	    ServletFileUpload upload = new ServletFileUpload(factory);
	    java.util.List<org.apache.commons.fileupload.FileItem> items = null;
	    try {
			items = upload.parseRequest(request);
			byte data[] = new byte[1024];
		    int i = 0;
		    if (items != null){
		        for (Iterator iterator = items.iterator(); iterator.hasNext();) {
		            FileItem item = (FileItem) iterator.next();
		            if (item.isFormField()) {
		                //不是file类型的话，就利用getFieldName判断name属性获取相应的值
		            	
		               
		            } else {
		            	 //获取表单文件，写入项目文件夹中
		                fileName = item.getName().substring(
		                        item.getName().lastIndexOf(File.separator) + 1,
		                        item.getName().length());
		                InputStream inputStream = item.getInputStream();
		                OutputStream outputStream = new FileOutputStream(tempPath + fileName);
		                while ((i = inputStream.read(data)) != -1) {
		                    outputStream.write(data, 0, i);
		                }
		                inputStream.close();
		                outputStream.close();
		            }
		        }
		    }
		} catch (FileUploadException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	    
		return fileName;
	}
	
	
	public static File unZipFiles(String zipFilePath, String descDir){
		Charset gbk = Charset.forName("GBK");
		File zipFile = new File(zipFilePath);
		File pathFile = new File(descDir);
		if (!pathFile.exists()){
			pathFile.mkdirs();
		}
		java.util.zip.ZipFile zip = null;
		InputStream in = null;
		OutputStream out = null;
		try{
			zip = new java.util.zip.ZipFile(zipFile,gbk);
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
}
