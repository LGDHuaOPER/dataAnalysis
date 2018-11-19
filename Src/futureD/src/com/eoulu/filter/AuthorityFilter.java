package com.eoulu.filter;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;

import com.google.gson.Gson;

/**
 * Servlet Filter implementation class AuthorityFilter2
 */
@WebFilter("/*")
public class AuthorityFilter implements Filter {

    /**
     * Default constructor. 
     */
    public AuthorityFilter() {
    }

	/**
	 * @see Filter#destroy()
	 */
	public void destroy() {
	}

	/**
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		HttpServletRequest req = (HttpServletRequest) request;
		String[] result = req.getRequestURI().split("/");
		String authority = result[result.length-1];
		if(FilterResource.isController(authority)){
			if(FilterResource.isAuthority(authority, req)){
				chain.doFilter(request, response);
			}else{
				response.getWriter().write(new Gson().toJson("{message:没有对应权限}"));
			}
		}else{
			chain.doFilter(request, response);
		}
		
	}

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {

	
	}

}
