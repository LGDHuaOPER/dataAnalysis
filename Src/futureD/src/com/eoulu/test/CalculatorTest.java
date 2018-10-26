/**
 * 
 */
package com.eoulu.test;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.eoulu.action.calculate.NumericalCalculator;

/**
 * @author mengdi
 *
 * 
 */
public class CalculatorTest {

	public static void main(String[] arr) throws Exception{
//        System.out.println(NumericalCalculator.cal("+(12.3 - 2.3 * 1) - 10/3 +- 2+1+2 "));
        //结果：4.6667
 
//        System.out.println(NumericalCalculator.cal("-pow(min(1 + 2, 2),-1 * *abs(max(1,1/-4+1/4)))"));
        //结果：-0.5
//		System.out.println(NumericalCalculator.cal("(tan(40+5)+3)/5"));
//		System.out.println(NumericalCalculator.cal("(3.15+0.1)/5+sqrt(4)"));
//		System.out.println(NumericalCalculator.cal("cos(π)!"));
		System.out.println(NumericalCalculator.cal("ln(e(4))+logt(100)/logt(10)"));
		System.out.println(Math.log10(Math.exp(6))/Math.log10(Math.E));
		System.out.println(Math.log(Math.exp(6)));
//        List<BigDecimal> param1List = new ArrayList<BigDecimal>();
//        param1List.add(new BigDecimal("1"));
//        param1List.add(new BigDecimal("1.2"));
// 
//        List<BigDecimal> param2List = new ArrayList<BigDecimal>();
//        param2List.add(new BigDecimal("-2"));
//        param2List.add(new BigDecimal("1"));
// 
//        List<BigDecimal> param3List = new ArrayList<BigDecimal>();
//        param3List.add(new BigDecimal("2"));
//        param3List.add(new BigDecimal("2"));
//        System.out.println(NumericalCalculator.cal4Arr("pow($,$) * abs($)", param1List, param2List, param3List));
        //结果：[2.0000, 2.4000]
//        System.out.println(1*Math.PI);
    }

	
}
