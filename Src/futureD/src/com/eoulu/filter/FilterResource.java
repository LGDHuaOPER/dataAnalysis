/**
 * 
 */
package com.eoulu.filter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;

import com.eoulu.dao.user.AuthorityDao;

/**
 * @author mengdi
 *
 * 
 */
public class FilterResource {
	
	
	private final static String[] resource={
			"/css/","/js/","/image/",".css",".js","/assets/","/dist/","/src/","/font-awesome-4.5.0/" ,"/Login","/Static","html","DataList","WaferData","IndexInterface","Logon","AutoGrab"
		};
		
		public static boolean isExist(HttpServletRequest request){
			boolean flag = false;
			String url = request.getRequestURI();
			for(String rs : resource){
				if(url.contains(rs)){
					flag = true;
				}
			}
			
			return flag;
		}
		public static List<String> list = new ArrayList<>();
		
		static{
			list = new AuthorityDao().getAuthorityUrl();
		}
		
		public static boolean isController(String authority){
			
			return list.contains(authority);
		}
		
		public static boolean isAuthority(String authority,HttpServletRequest req){
			List<String> ls = (List<String>) req.getSession().getAttribute("userAuthority");
			
			String[] att = ls.get(1).split(",");
			boolean flag = false;
			for(int i=0,length=att.length;i<length;i++){
				if(att[i].equals(authority)){
					flag = true;
					break;
				}
			}
			
			return flag;
		}
		
}
