/**
 * 
 */
package com.eoulu.test;

import static org.junit.Assert.*;

import java.util.Map;

import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import com.eoulu.action.calculate.ExpressionFormatException;
import com.eoulu.action.calculate.NumericalCalculator;
import com.eoulu.service.AnalysisService;
import com.eoulu.service.impl.AnalysisServiceImpl;
import com.google.gson.Gson;

/**
 * @author mengdi
 *
 * 
 */
public class CalculatorTest {

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
	}

	/**
	 * Test method for {@link com.eoulu.action.analysis.Calculator#doGet(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)}.
	 */
	@Test
	public void testDoGetHttpServletRequestHttpServletResponse() {
		
//		long time0 = System.currentTimeMillis();
//		try {
//			System.out.println(NumericalCalculator.cal("e(2)"));
//		} catch (ExpressionFormatException e) {
//			e.printStackTrace();
//		}
//		System.out.println(System.currentTimeMillis()-time0);
		String userFormula = "e(2)+Marker1.X*200/log(10,1000)-tang(45)-ln(e(2))",
				customParam = "S-PT",oldParam="S-P2",
		coordinateId = "125003",calculationId="8",
		waferId = "188",
		formula = "e(2)+25*200/log(10,1000)-tang(45)-ln(e(2))";
		String result = "",status = "";
		Map<String,String> map = null;
		try {
			map = NumericalCalculator.cal(formula);
			result = map.get("result").toString();
			status = map.get("status").toString();
		} catch (ExpressionFormatException e) {
			e.printStackTrace();
			status = e.getMessage();
		}
//		if("".equals(status) && !"".equals(result)){
//			AnalysisService service = new AnalysisServiceImpl();
//			if("".equals(calculationId)){
////				boolean flag = service.saveCalculation(Integer.parseInt(waferId), Integer.parseInt(coordinateId), customParam, formula, userFormula,Double.parseDouble(result), "TCF");
//				if(flag){
//					int id = service.getCalculationId(Integer.parseInt(waferId), customParam, "TCF");
//					map.put("calculationId", id+"");
//					map.put("formula", userFormula);
//					map.put("customParameter", customParam);
//				}
//			}else{
//				boolean flag = service.modifyCalculation(oldParam, customParam, formula,userFormula, result, Integer.parseInt(calculationId), Integer.parseInt(coordinateId), Integer.parseInt(waferId));
//				System.out.println(flag);
//				map.put("calculationId", calculationId);
//				map.put("formula", userFormula);
//				map.put("customParameter", customParam);
//			}
//			
//		}
//		System.out.println(new Gson().toJson(map));
//		System.out.println(Math.sin(Math.PI*30/180));
//      List<BigDecimal> param1List = new ArrayList<BigDecimal>();
//      param1List.add(new BigDecimal("1"));
//      param1List.add(new BigDecimal("1.2"));
//
//      List<BigDecimal> param2List = new ArrayList<BigDecimal>();
//      param2List.add(new BigDecimal("-2"));
//      param2List.add(new BigDecimal("1"));
//
//      List<BigDecimal> param3List = new ArrayList<BigDecimal>();
//      param3List.add(new BigDecimal("2"));
//      param3List.add(new BigDecimal("2"));
//      System.out.println(NumericalCalculator.cal4Arr("pow($,$) * abs($)", param1List, param2List, param3List));
      //结果：[2.0000, 2.4000]
//      System.out.println(1*Math.PI);
		
	}

	/**
	 * Test method for {@link com.eoulu.action.analysis.Calculator#doPost(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)}.
	 */
	@Ignore
	public void testDoPostHttpServletRequestHttpServletResponse() {
		fail("Not yet implemented");
	}

}
