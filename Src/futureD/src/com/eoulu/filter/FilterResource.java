/**
 * 
 */
package com.eoulu.filter;

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
	public static Map<String,Object> map = new HashMap<String,Object>();
	
	
	private final static String[] resource={
			"/css/","/js/","/image/","/font-awesome-4.5.0/" ,"/Login","/Static","html"
		};
		
		//���url�д�������˵����ݷ���
		public static boolean isExist(HttpServletRequest request){
			boolean flag = false;
			String url = request.getRequestURI();
			System.out.println("url"+url);
			for(String rs : resource){
				if(url.contains(rs)){
					flag = true;
				}
			}
			
			return flag;
		}
	
}