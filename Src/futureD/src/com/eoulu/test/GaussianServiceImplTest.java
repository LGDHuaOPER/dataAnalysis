/**
 * 
 */
package com.eoulu.test;

import static org.junit.Assert.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import com.eoulu.service.GaussianService;
import com.eoulu.service.HistogramService;
import com.eoulu.service.impl.GaussianServiceImpl;
import com.eoulu.service.impl.HistogramServiceImpl;
import com.google.gson.Gson;

/**
 * @author mengdi
 *
 * 
 */
public class GaussianServiceImplTest {

	String waferId = "188",parameter="";
	double left = 5500.2,
			right= 6500;
	int equal = 8;
	
	@Before
	public void setUp() throws Exception {
	}

	
	@Ignore
	public void testGetGaussian() {
		Map<String,Object> result = new HashMap<>(),map = null;
		HistogramService histogram = new HistogramServiceImpl();
		List<String> paramList =  histogram.getWaferParameter(waferId);
		GaussianService service = new GaussianServiceImpl();
		Map<String, List<Double>> rangeList = service.getRangList(paramList, waferId);
		List<Double> ls = null;
		for (int j=0,size=paramList.size();j<size;j++) {
			ls = rangeList.get(paramList.get(j));
			left = "".equals(parameter)?ls.get(0):left;
			right = "".equals(parameter)?ls.get(1):right;
			map = new HashMap<>();
			map.put("waferId", waferId);
			map.put("left", left);
			map.put("right", right);
			map.put("param", paramList.get(j));
			result.put(paramList.get(j), service.getGaussian(map));
		}
		System.out.println(new Gson().toJson(result));
	}

	@Test
	public void testGetRangList() {
		double a = 1,b = 2;
		assertEquals(a, b);
	}

	@Ignore
	public void testGetPercent() {
		
	}

}
