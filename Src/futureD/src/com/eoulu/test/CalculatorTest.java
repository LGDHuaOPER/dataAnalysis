/**
 * 
 */
package com.eoulu.test;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * @author mengdi
 *
 * 
 */
public class CalculatorTest {

	public static void main(String[] arr) throws Exception{
        System.out.println(NumericalCalculator.cal("+(12.3 - 2.3 * 1) - 10/3 +- 2+1+2 "));
        //结果：4.6667
 
        System.out.println(NumericalCalculator.cal("-pow(min(1 + 2, 2),-1 * abs(max(1,1/-4+1/4)))"));
        //结果：-0.5
 
        List<BigDecimal> param1List = new ArrayList<BigDecimal>();
        param1List.add(new BigDecimal("1"));
        param1List.add(new BigDecimal("1.2"));
 
        List<BigDecimal> param2List = new ArrayList<BigDecimal>();
        param2List.add(new BigDecimal("-2"));
        param2List.add(new BigDecimal("1"));
 
        List<BigDecimal> param3List = new ArrayList<BigDecimal>();
        param3List.add(new BigDecimal("2"));
        param3List.add(new BigDecimal("2"));
        System.out.println(NumericalCalculator.cal4Arr("pow($,$) * abs($)", param1List, param2List, param3List));
        //结果：[2.0000, 2.4000]
        System.out.println(1*Math.PI);
    }

	
}
