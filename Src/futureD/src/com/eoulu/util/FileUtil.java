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
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.zip.ZipEntry;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

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
