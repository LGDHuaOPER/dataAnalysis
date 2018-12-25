package com.eoulu.action.analysis;

import java.io.IOException;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.eoulu.action.calculate.ExpressionFormatException;
import com.eoulu.action.calculate.NumericalCalculator;
import com.eoulu.service.AnalysisService;
import com.eoulu.service.impl.AnalysisServiceImpl;
import com.google.gson.Gson;

/**
 * Servlet implementation class Calculator
 */
@WebServlet(description = "计算器", urlPatterns = { "/Calculator" })
public class Calculator extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Calculator() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		request.setCharacterEncoding("utf-8");
		response.setContentType("text/html;charset=utf-8");
		String calculation = request.getParameter("formula")==null?"":request.getParameter("formula").trim(),userformula = request.getParameter("userformula")==null?"":request.getParameter("userformula").trim();
		String oldParam = request.getParameter("oldParameter")==null?"":request.getParameter("oldParameter").trim(),
				customParam = request.getParameter("customParameter")==null?"":request.getParameter("customParameter").trim(),
				coordinateId = request.getParameter("coordinateId")==null?"0":request.getParameter("coordinateId").trim(),
					subdieId = request.getParameter("subdieId")==null?"0":request.getParameter("subdieId"),
					subdieFlag = request.getParameter("subdieFlag")==null?"":request.getParameter("subdieFlag"),
						waferId = request.getParameter("waferId")==null?"0":request.getParameter("waferId").trim(),
								calculationId = request.getParameter("calculationId")==null?"":request.getParameter("calculationId").trim();
		if("".equals(customParam)){
			response.getWriter().write(new Gson().toJson("参数不能为空！"));
		}
		AnalysisService service = new AnalysisServiceImpl();
		if(service.getParameterExsit(Integer.parseInt(waferId), customParam,subdieFlag)){
			response.getWriter().write(new Gson().toJson("自定义参数已存在！"));
		}
		String result = "",status = "";
		Map<String,String> map = null;
		try {
			map = NumericalCalculator.cal(calculation);
			result = map.get("result").toString();
			status = map.get("status").toString();
		} catch (ExpressionFormatException e) {
			e.printStackTrace();
			status = e.getMessage();
		}
		if("".equals(status) && !"".equals(result)){
			if("".equals(calculationId)){
				boolean flag =  service.saveCalculation(Integer.parseInt(waferId), Integer.parseInt(coordinateId),Integer.parseInt(subdieId),subdieFlag,customParam, calculation, userformula,Double.parseDouble(result), "TCF");
				
				if(flag){
					int id = service.getCalculationId(Integer.parseInt(waferId), customParam, "TCF");
					map.put("calculationId", id+"");
					map.put("formula", userformula);
					map.put("customParameter", customParam);
				}
			}else{
				boolean flag = service.modifyCalculation(oldParam, customParam, calculation,userformula, result, Integer.parseInt(calculationId), Integer.parseInt(coordinateId),Integer.parseInt(subdieId),subdieFlag, Integer.parseInt(waferId));
				System.out.println("flag==="+flag);
				map.put("calculationId", calculationId);
				map.put("formula", userformula);
				map.put("customParameter", customParam);
			}
			
		}
		response.getWriter().write(new Gson().toJson(map));
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
