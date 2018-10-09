package com.eoulu.action.Log;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import com.alibaba.fastjson.JSONObject;

import me.hupeng.ipLocationService.IpLocationResult;
import me.hupeng.ipLocationService.IpLocationService;



public class iPLocation {

	private final static String Key = "WURBZ-4R6WD-Z4J4B-HIBX6-PC5LV-7MBBE";
	private final static String ReqUrl = "http://apis.map.qq.com/ws/location/v1/ip";

	public static String getUrl(String ip) {

		return ReqUrl + "?ip=" + ip + "&key=" + Key + "&output=json";
	}

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
			request.getSession().setAttribute("IP", util.getIpAddress(request));
//			IpLocationService ipLocationService = new IpLocationService();
//			IpLocationResult ipLocationResult = ipLocationService.getIpLocationResult(util.getIpAddress(request));
//			String city =  ipLocationResult.getCity()==null?"本地":ipLocationResult.getCity();
			String city = "";
			try {
				city = getAddress("ip="+ip, "utf-8");
			} catch (Exception e) {
				e.printStackTrace();
			}
			request.getSession().setAttribute("city", city);
	  }
	  
	  public static String getAddress(String params, String encoding) throws Exception{  
          
	        String path = "http://ip.taobao.com/service/getIpInfo.php";  
	          
	        String returnStr = new URLUtil().getRs(path, params, encoding);
	        JSONObject json=null;  
	          
	        if(returnStr != null){  
	              
	            json = new JSONObject().parseObject(returnStr);  
	            JSONObject obj =  (JSONObject) json.get("data");
//	            System.out.println("test:"+obj.get("country"));
	            if("0".equals(json.get("code").toString())){  
	                  
//	                StringBuffer buffer = new StringBuffer();  
//	                  
//	                //buffer.append(decodeUnicode(json.optJSONObject("data").getString("country")));//国家  
//	                  
//	                //buffer.append(decodeUnicode(json.optJSONObject("data").getString("area")));//地区  
//	                  
//	                buffer.append(decodeUnicode(json.optJSONObject("data").getString("region")));//省份  
//	                  
//	                buffer.append(decodeUnicode(json.optJSONObject("data").getString("city")));//市区  
//	                  
//	                buffer.append(decodeUnicode(json.optJSONObject("data").getString("county")));//地区  
//	                  
//	                buffer.append(decodeUnicode(json.optJSONObject("data").getString("isp")));//ISP公司  
//	                  
//	                System.out.println(buffer.toString());  
//	                  
//	                return buffer.toString();  
	                  return obj.get("city").toString();
	            }else{  
	                  
	                return "获取地址失败?";  
	                  
	            }  
	        }  
	          
	        return returnStr;  
	          
	    }  
	  
	public static void main(String[] args) {
//		IpLocationService ipLocationService = new IpLocationService();
//		IpLocationResult ipLocationResult = ipLocationService.getIpLocationResult("183.175.12.160");
//		System.out.println(ipLocationResult.getCountry() + " -----" + ipLocationResult.getProvince() + "--"
//				+ ipLocationResult.getCity());
//		try {
//			System.out.println(getAddress("ip=183.175.12.160","utf-8"));
//		} catch (Exception e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//		SimpleDateFormat df = new SimpleDateFormat("HH:mm:ss");
//		String date = df.format(new Date());
//		System.out.println(date);
	}
}
