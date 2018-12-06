package com.eoulu.action.Log;

import java.io.File;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;

import javax.servlet.http.HttpServletRequest;

import com.alibaba.fastjson.JSONObject;
import com.maxmind.geoip2.DatabaseReader;
import com.maxmind.geoip2.exception.GeoIp2Exception;
import com.maxmind.geoip2.model.CityResponse;
import com.maxmind.geoip2.record.City;
import com.maxmind.geoip2.record.Country;
import com.maxmind.geoip2.record.Location;
import com.maxmind.geoip2.record.Postal;
import com.maxmind.geoip2.record.Subdivision;




public class iPLocation {

	private final static String ReqUrl = "https://api.map.baidu.com/location/ip";//此地址次数有限，不可应用于其他项目
	private final static String ak = "bKjC2wyvKT8AwhHIAKnTGm3EiItUvlA2";


	public static JSONObject getResult(String url) {
		String result = new URLUtil().getHttp(url);
		JSONObject obj = JSONObject.parseObject(result);
		return obj;
	}

	 /** 
	   * 获取用户真实IP地址，不使用request.getRemoteAddr();的原因是有可能用户使用了代理软件方式避免真实IP地址, 
	   * 
	   * 可是，如果通过了多级反向代理的话，X-Forwarded-For的值并不止一个，而是一串IP值，究竟哪个才是真正的用户端的真实IP呢？ 
	   * 答案是取X-Forwarded-For中第一个非unknown的有效IP字符串。 
	   * 
	   * 如：X-Forwarded-For：192.168.1.110, 192.168.1.120, 192.168.1.130, 
	   * 192.168.1.100 
	   * 
	   * 用户真实IP为： 192.168.1.110 
	   * 
	   * @param request 
	   * @return 
	   */
	  public static String getIpAddress(HttpServletRequest request) { 
	    String ip = request.getHeader("x-forwarded-for"); 
	    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
	      ip = request.getHeader("Proxy-Client-IP"); 
	    } 
	    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
	      ip = request.getHeader("WL-Proxy-Client-IP"); 
	    } 
	    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
	      ip = request.getHeader("HTTP_CLIENT_IP"); 
	    } 
	    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) { 
	      ip = request.getHeader("HTTP_X_FORWARDED_FOR"); 
	    } 
	    if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
	      ip = request.getRemoteAddr(); 
	    } 
	    int index = ip.indexOf(",");
	    if(index != -1){
	    	ip = ip.substring(0, index);
	    }
	    if(ip.equals("0:0:0:0:0:0:0:1")){
	    	try {
				ip=InetAddress.getLocalHost().getHostAddress();
			} catch (UnknownHostException e) {
				e.printStackTrace();
			}
	    }
	    return ip; 
	  } 
	
	  public void getIPAndCity(HttpServletRequest request){
			iPLocation util = new iPLocation();
			String ip = util.getIpAddress(request);
				String city = getIPLocation(ip);
				request.getSession().setAttribute("IP",ip);
				request.getSession().setAttribute("city", city);
	  }
	  
	  public static String getIPLocation(String ip){
		  String url = ReqUrl+"?ip="+ip+"&ak="+ak;
		  JSONObject obj = getHttpResult(url);
		  String status = obj.getString("status");
		  if("0".equals(status)){
			 return getCity(obj);
		  }else
		  if("2".equals(status)){
			  url = ReqUrl+"?ak="+ak;
			  obj = getHttpResult(url);
			  return getCity(obj);
		  }
		  return "";
	  }
	  
	  public static JSONObject getHttpResult(String url){
		  String returnStr = new URLUtil().getResponse(url);
		  JSONObject obj = JSONObject.parseObject(returnStr);
		  return obj;
	  }
	  
	  public static String getCity(JSONObject obj){
		  String content = obj.getString("content");
		  obj = JSONObject.parseObject(content);
		  String address = obj.getString("address_detail");
		  obj = JSONObject.parseObject(address);
		  String city = obj.getString("city");
		  return city;
	  }
	  
	  public static void main(String[] args) {
		System.out.println(getIPLocation("192.168.3.8"));
		System.out.println(getIPLocation("119.248.161.65"));
	}
	  
}
