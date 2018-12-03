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
			
//			IpLocationService ipLocationService = new IpLocationService();
//			IpLocationResult ipLocationResult = ipLocationService.getIpLocationResult(util.getIpAddress(request));
//			String city =  ipLocationResult.getCity()==null?"本地":ipLocationResult.getCity();
			String city = "";
			try {
//				city = getAddress("ip="+ip, "utf-8");
			} catch (Exception e) {
				e.printStackTrace();
			}finally{
				request.getSession().setAttribute("IP",ip);
				request.getSession().setAttribute("city", city);
			}
			
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
	  
	public static void main(String[] args) throws IOException, GeoIp2Exception {
		//GeoIP2-City 数据库文件
		File database = new File("/zip/GeoLiteCity.dat");

		// 创建 DatabaseReader对象
		DatabaseReader reader = new DatabaseReader.Builder(database).build();

		InetAddress ipAddress = InetAddress.getByName("128.101.101.101");

		CityResponse response = reader.city(ipAddress);

		Country country = response.getCountry();
		System.out.println(country.getIsoCode());            // 'US'
		System.out.println(country.getName());               // 'United States'
		System.out.println(country.getNames().get("zh-CN")); // '美国'

		Subdivision subdivision = response.getMostSpecificSubdivision();
		System.out.println(subdivision.getName());    // 'Minnesota'
		System.out.println(subdivision.getIsoCode()); // 'MN'

		City city = response.getCity();
		System.out.println(city.getName()); // 'Minneapolis'

		Postal postal = response.getPostal();
		System.out.println(postal.getCode()); // '55455'

		Location location = response.getLocation();
		System.out.println(location.getLatitude());  // 44.9733
		System.out.println(location.getLongitude()); // -93.2323

//		IpLocationService ipLocationService = new IpLocationService();
//		IpLocationResult ipLocationResult = ipLocationService.getIpLocationResult("183.175.12.160");
//		System.out.println(ipLocationResult.getCountry() + " -----" + ipLocationResult.getProvince() + "--"
//				+ ipLocationResult.getCity());
//		System.out.println(getAddress("ip=192.168.3.7", "utf-8"));
		try {
			System.out.println(getAddress("ip=183.175.12.160","utf-8"));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
//		SimpleDateFormat df = new SimpleDateFormat("HH:mm:ss");
//		String date = df.format(new Date());
//		System.out.println(date);
	}
}
