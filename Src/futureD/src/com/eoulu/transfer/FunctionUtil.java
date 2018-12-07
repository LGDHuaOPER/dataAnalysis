/**
 * 
 */
package com.eoulu.transfer;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;


/**
 * @author mengdi
 *
 * 
 */
public class FunctionUtil {

	/**
	 * 求方差
	 * 
	 * @param datas
	 * @param avg
	 * @return variance
	 */
	public static double getVariance(List<Double> datas, double avg) {
		double sum = 0;
		for (Double data : datas) {
			sum += (data - avg) * (data - avg);
		}
		double variance = sum / datas.size();
		return variance;
	};

	/**
	 * 求标准差
	 * 
	 * @param variance
	 * @return
	 */
	public static double getStandardDeviation(double variance) {
		double sd = 0;
		if (variance < 0 || Double.isNaN(variance)) {
			System.out.println("输入的参数小于0或者是NaN");
			return Double.NaN;
		} else if (Double.isInfinite(variance)) {
			System.out.println("输入的参数是无穷大");
			return Double.POSITIVE_INFINITY;
		} else {
			sd = Math.sqrt(variance);
		}
		return sd;
	}

	/**
	 * 除法
	 * 
	 * @param d
	 * @param e
	 * @param scale
	 * @return
	 */
	public static double div(double d, double e, int scale) {
		if (scale < 0) {
			throw new IllegalArgumentException("The scale must be a positive integer or zero");
		}
		// BigDecimal b1 = new BigDecimal(Double.toString(d));
		// BigDecimal b2 = new BigDecimal(Double.toString(e));
		// return b1.divide(b2,scale,BigDecimal.ROUND_HALF_UP).doubleValue();
		double result = d / e;
		BigDecimal bd = new BigDecimal(result);
		return bd.setScale(scale, BigDecimal.ROUND_HALF_UP).doubleValue();
	}

	public static double multiple(double a, double b, int scale) {
		double result = a * b;
		BigDecimal bd = new BigDecimal(result);
		return bd.setScale(scale, BigDecimal.ROUND_HALF_UP).doubleValue();
	}

	public static double add(double a, double b, int scale) {
		double result = a + b;
		BigDecimal bd = new BigDecimal(result);
		return bd.setScale(scale, BigDecimal.ROUND_HALF_UP).doubleValue();
	}

	/**
	 * 正态分布
	 * 
	 * @param x
	 * @param standard
	 * @param average
	 * @return
	 */
	public static double getNormality(double x, double standard, double average) {
		double power = 0-Math.pow((x - average), 2) / (2 * Math.pow(standard, 2));
		double index = Math.pow(Math.E, power);
//		System.out.println("index:"+index);
		double result = index / (Math.sqrt(2 * Math.PI) * standard) ;
		return result;

	}
	
	public static void main(String[] args) {
		double x = 2.34427E-06,mean = 4.82791E-06,standard= 2.40637E-06;
		double y = getNormality(x, standard, mean);
		System.out.println("y="+y);
	}
	
	
	public static List<String> getRangeOrderAsc(double A,double B,int n){
//		 DecimalFormat format = new DecimalFormat("#.00");
		List<String> getrangelist=new ArrayList<String>();
		String smallthanlimit = "-∞~" + A;
		String bigthanlimit = B + "~+∞";
		getrangelist.add(smallthanlimit);
		double S1,S2;
		String str=null;
		for(int s=1;s<n+1;s++)
		{     
			S1=A+(B-A)*(s-1)/n;
			S2=A+(B-A)*(s)/n;
			str= S1 +"~"+ S2;
			getrangelist.add(str);
		}
		getrangelist.add(bigthanlimit);
		return getrangelist;
	}

}
