/**
 * 
 */
package com.eoulu.transfer;

import java.math.BigDecimal;
import java.util.List;

/**
 * @author mengdi
 *
 * 
 */
public class FunctionUtil {
	
	/**
	 * 求方差
	 * @param datas
	 * @param avg
	 * @return variance
	 */
	public static double getVariance(List<Double> datas,double avg){
		double sum = 0;
		for(Double data:datas){
			sum+=(data-avg)*(data-avg);
		}
		double variance = sum/datas.size();
		return variance;
	}; 
	/**
	 * 求标准差
	 * @param variance
	 * @return
	 */
	public static double getStandardDeviation(double variance){
		double sd = 0;
		if(variance<0 || Double.isNaN(variance)){
			System.out.println("输入的参数小于0或者是NaN");
			return Double.NaN;
		}else if(Double.isInfinite(variance)){
			System.out.println("输入的参数是无穷大");
			return Double.POSITIVE_INFINITY;
		}else{
			sd = Math.sqrt(variance);
		}
		return sd;
	}

	/**
	 * 除法
	 * @param d
	 * @param e
	 * @param scale
	 * @return
	 */
	public static double div(double d,double e,int scale){
        if(scale<0){
            throw new IllegalArgumentException(
                "The scale must be a positive integer or zero");
        }
        BigDecimal b1 = new BigDecimal(Double.toString(d));
        BigDecimal b2 = new BigDecimal(Double.toString(e));
        return  b1.divide(b2,scale,BigDecimal.ROUND_HALF_UP).doubleValue();
    } 

	/**
	 * 正态分布
	 * @param x
	 * @param standard
	 * @param average
	 * @return
	 */
	public static double getNormality(double x,double standard,double average){
		double power = -Math.pow((x-average), 2)/(2*standard);
		double index = Math.pow(Math.E, power);
		double result = 1/(Math.sqrt(2*Math.PI)*standard)*index;
		return result;
		
	}
	
	
}
