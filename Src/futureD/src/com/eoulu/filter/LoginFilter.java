/**
 * 
 */
package com.eoulu.filter;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * @author mengdi
 *
 * 
 */
public class LoginFilter implements Filter{

	@Override
	public void destroy() {
		
	}

	@Override
	public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain)
			throws IOException, ServletException {
		HttpServletRequest request = (HttpServletRequest) servletRequest;
		HttpServletResponse response = (HttpServletResponse) servletResponse;
		// 获取根目录所对应的绝对路径
		String currentURL = request.getRequestURI();
		// 截取到当前文件名用于比较
		String targetURL = currentURL.substring(currentURL.indexOf("/", 1), currentURL.length());
		System.out.println(targetURL);
		// 如果session不为空就返回该session，如果为空就返回null
		HttpSession session = request.getSession(false);
		if ("/Login/login.jsp".equals(targetURL)) {// 判断请求是否有权限
			System.out.println(111);
			chain.doFilter(request, response);

		} else {
			if(FilterResource.isExist(request)){
				System.out.println("进来");
				chain.doFilter(request, response);
			}else
			if (session == null || session.getAttribute("userName") == null) {
				// 如果session为空表示用户没有登陆就重定向到login.jsp页面
				System.out.println("request.getContextPath()=" + request.getContextPath());
				response.sendRedirect(request.getContextPath() + "/Login/login.jsp");
				return;
			} else {
				System.out.println(333);
				chain.doFilter(request, response);
			}
		}

	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
		
	}

}
