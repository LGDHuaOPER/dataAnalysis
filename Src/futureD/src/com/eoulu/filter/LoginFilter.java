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

import com.google.gson.Gson;

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
		request.setCharacterEncoding("utf-8");
		response.setContentType("text/html;charset=utf-8");
		// 获取根目录所对应的绝对路径
		String currentURL = request.getRequestURI();
//		System.out.println("currentURL:"+currentURL);
		HttpSession session = request.getSession(false);
			if(FilterResource.isExist(request)){
				System.out.println(111);
				chain.doFilter(request, response);
			}else
			if (session == null || session.getAttribute("userName") == null) {
				// 如果session为空表示用户没有登陆就重定向到login.jsp页面
				System.out.println("request.getContextPath()=" + request.getContextPath());
//				response.sendRedirect(request.getContextPath() + "/Login/login.jsp");
				request.getRequestDispatcher("/IndexInterface").forward(request, response);
				return;  
			} else {
				String[] result = currentURL.split("/"); 
				String authority = result[result.length-1];
				if(FilterResource.isController(authority)){
					System.out.println(222);
					if(FilterResource.isAuthority(authority, request)){
						chain.doFilter(request, response);
					}else{
						response.getWriter().write(new Gson().toJson("{message:没有对应权限}"));
					}
				} else
				if(FilterResource.isAjax(authority)){
					System.out.println(333);
					chain.doFilter(request, response);
				}
			}

	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
		
	}

}
