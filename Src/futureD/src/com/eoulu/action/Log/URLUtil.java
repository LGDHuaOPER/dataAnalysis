package com.eoulu.action.Log;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;



import com.alibaba.fastjson.JSON;

public class URLUtil {

	/*
	 * 返回字段
	 * 
	 * marketrate 汇率 Integer 9(05)V9(05) 10 N N
	 * 当帐户类型为“SY、FD、CD”时，该汇率为客户的账户开户省行的汇率。 ratetime 汇率时间 Integer 12 N N
	 * YYMMDDHHMMSS
	 * 
	 */

	public String getResponse(String reqUrl, String content, String clentid, String userid, String acton, String chnflg,
			String trandt, String trantm) {
		try {
			URL url = new URL(reqUrl);
			HttpURLConnection httpConn = (HttpURLConnection) url.openConnection();
			httpConn.setDoOutput(true); // 使用 URL 连接进行输出
			httpConn.setDoInput(true); // 使用 URL 连接进行输入
			httpConn.setUseCaches(false); // 忽略缓存
			httpConn.setRequestMethod("POST"); // 设置URL请求方法
			httpConn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=utf-8"); // 解决乱码
			httpConn.setRequestProperty("clentid", clentid);
			httpConn.setRequestProperty("userid", userid);
			httpConn.setRequestProperty("acton", acton);
			httpConn.setRequestProperty("chnflg", chnflg);
			httpConn.setRequestProperty("trandt", trandt);
			httpConn.setRequestProperty("trantm", trantm);
			httpConn.setInstanceFollowRedirects(true);
			httpConn.connect();
			OutputStream out = httpConn.getOutputStream();
			out.write(content.getBytes("UTF-8"));
			out.close();
			BufferedReader responseReader = new BufferedReader(
					new InputStreamReader(httpConn.getInputStream(), "UTF-8"));
			String readLine;
			StringBuffer responseSb = new StringBuffer();
			while ((readLine = responseReader.readLine()) != null) {
				responseSb.append(readLine);
			}
			responseReader.close();
			httpConn.disconnect();
			return responseSb.toString();

		} catch (MalformedURLException e) {
			e.printStackTrace();
			return "ERROR";
		} catch (IOException e) {
			e.printStackTrace();
			return "ERROR";
		}

	}

	public String convert(String content) {
		if (content.equals("ERROR")) {
			content = "{\"error\":\"ERROR\"}";
		}

		String str = JSON.parse(content).toString();

		return str;
	}

	public String getResponse(String reqUrl) {
		try {
			URL url = new URL(reqUrl);
			HttpURLConnection httpConn = (HttpURLConnection) url.openConnection();
			httpConn.setDoOutput(true); // 使用 URL 连接进行输出
			httpConn.setDoInput(true); // 使用 URL 连接进行输入
			httpConn.setUseCaches(false); // 忽略缓存
			httpConn.setRequestMethod("POST"); // 设置URL请求方法
			httpConn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=utf-8"); // 解决乱码
			httpConn.connect();
			OutputStream out = httpConn.getOutputStream();
			out.close();
			BufferedReader responseReader = new BufferedReader(
					new InputStreamReader(httpConn.getInputStream(), "UTF-8"));
			String readLine;
			StringBuffer responseSb = new StringBuffer();
			while ((readLine = responseReader.readLine()) != null) {
				responseSb.append(readLine);
			}
			responseReader.close();
			httpConn.disconnect();
			return responseSb.toString();

		} catch (MalformedURLException e) {
			e.printStackTrace();
			return "ERROR";
		} catch (IOException e) {
			e.printStackTrace();
			return "ERROR";
		}

	}

	public String getHttp(String urlInfo) {
		  try {  
	            URL url = new URL(urlInfo);    // 把字符串转换为URL请求地址  
	            HttpURLConnection connection = (HttpURLConnection) url.openConnection();// 打开连接  
	            connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36)"); //防止报403错误。
	            connection.connect();// 连接会话  
	            // 获取输入流  
	            BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));  
	            String line;  
	            StringBuilder sb = new StringBuilder();  
	            while ((line = br.readLine()) != null) {// 循环读取流  
	                sb.append(line);  
	            }  
	            br.close();// 关闭流  
	            connection.disconnect();// 断开连接  
	            System.out.println(sb.toString());  
	            return sb.toString();
	        } catch (Exception e) {  
	            e.printStackTrace();  
	            System.out.println("失败!");  
	            return "ERROR";
	        }  
		  
	}

	
	
	 /** 
     * 从url获取结果 
     * @param path 
     * @param params 
     * @param encoding 
     * @return 
     */  
    public String getRs(String path, String params, String encoding){  
          
        URL url = null;  
          
        HttpURLConnection connection = null;  
              
        try {  
              
            url = new URL(path);  
                  
            connection = (HttpURLConnection)url.openConnection();// 新建连接实例  
                  
            connection.setConnectTimeout(10000);// 设置连接超时时间，单位毫�?  
              
            connection.setReadTimeout(100000);// 设置读取数据超时时间，单位毫�?  
              
            connection.setDoInput(true);// 是否打开输出�? true|false  
              
            connection.setDoOutput(true);// 是否打开输入流true|false  
              
            connection.setRequestMethod("POST");// 提交方法POST|GET  
              
            connection.setUseCaches(false);// 是否缓存true|false  
              
            connection.connect();// 打开连接端口  
              
            DataOutputStream out = new DataOutputStream(connection.getOutputStream());  
              
            out.writeBytes(params);  
              
            out.flush();  
              
            out.close();  
              
            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(),encoding));  
              
            StringBuffer buffer = new StringBuffer();  
              
            String line = "";  
              
            while ((line = reader.readLine())!= null) {  
                  
                buffer.append(line);  
                  
            }  
              
            reader.close();  
              
            return buffer.toString();  
              
        } catch (Exception e) {  
              
            e.printStackTrace();  
              
        }finally{  
              
            connection.disconnect();// 关闭连接  
              
        }  
          
        return null;  
    }  
}
