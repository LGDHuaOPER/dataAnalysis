/**
 * 
 */
package com.eoulu.test;

import static org.junit.Assert.fail;

import java.util.HashMap;
import java.util.Map;

import org.junit.Before;
import org.junit.Ignore;

import com.eoulu.service.AnalysisService;
import com.eoulu.service.impl.AnalysisServiceImpl;
import com.google.gson.Gson;

/**
 * @author mengdi
 *
 * 
 */
public class AnalysisServiceImplTest {

	/**
	 * @throws java.lang.Exception
	 */
	@Before
	public void setUp() throws Exception {
	}

	/**
	 * Test method for {@link com.eoulu.service.impl.AnalysisServiceImpl#getVerificationDC(java.lang.String[], java.lang.String[], int)}.
	 */
	@Ignore
	public void testGetVerificationDC() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for {@link com.eoulu.service.impl.AnalysisServiceImpl#getVerificationS2P(java.lang.String[], java.lang.String[])}.
	 */
	@Ignore
	public void testGetVerificationS2P() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for {@link com.eoulu.service.impl.AnalysisServiceImpl#getCurveFile(java.lang.String[])}.
	 */
	@Ignore
	public void testGetCurveFile() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for {@link com.eoulu.service.impl.AnalysisServiceImpl#getSmithData(java.lang.String[], java.lang.String[], java.lang.String, java.lang.String)}.
	 */
	@Ignore
	public void testGetSmithData() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for {@link com.eoulu.service.impl.AnalysisServiceImpl#getMarkerCurve(java.lang.String[], java.lang.String, int, java.lang.String)}.
	 */
	@Ignore
	public void testGetMarkerCurve() {
		String[] curveTypeId = new String[]{"2129","2128"};
		String sParameter = "S11",
				module = "TCF";
		int waferId = 188;
		Map<String, Object> map = service.getMarkerCurve(curveTypeId, sParameter,module);
		System.out.println(new Gson().toJson(map));
	}

	@Ignore
	public void testGetParameterExsit() {
		String customParameter = "S-P2";
//		System.out.println(new Gson().toJson(service.getParameterExsit(waferId, customParameter)));
		
	}

	@Ignore
	public void testSaveCalculation() {
		fail("Not yet implemented");
	}

	@Ignore
	public void testModifyCalculation() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for {@link com.eoulu.service.impl.AnalysisServiceImpl#updateCalculation(int, int)}.
	 */
	@Ignore
	public void testUpdateCalculation() {
		fail("Not yet implemented");
	}

	@Ignore
	public void testGetMarkerExsit() {
		
	}

	/**
	 * Test method for {@link com.eoulu.service.impl.AnalysisServiceImpl#saveMarkerByX(int, java.lang.String, int, java.lang.String[], java.lang.String)}.
	 */
	@Ignore
	public void testSaveMarkerByX() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for {@link com.eoulu.service.impl.AnalysisServiceImpl#saveMarkerByY(int, java.lang.String, int, java.lang.String[], java.lang.String)}.
	 */
	@Ignore
	public void testSaveMarkerByY() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for {@link com.eoulu.service.impl.AnalysisServiceImpl#getMarker(java.util.List, double)}.
	 */
	@Ignore
	public void testGetMarker() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for {@link com.eoulu.service.impl.AnalysisServiceImpl#getMarkerX(java.util.List, double)}.
	 */
	@Ignore
	public void testGetMarkerX() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for {@link com.eoulu.service.impl.AnalysisServiceImpl#operateMarker(java.lang.Object[], java.lang.String)}.
	 */
	@Ignore
	public void testOperateMarker() {
		Map<String, String[]> paramMap = new HashMap<>();
		paramMap.put("1", new String[]{"2120","Marker1","10000000","0.9109224","y"});
		paramMap.put("2", new String[]{"2120","Marker2","NaN","NaN","y"});
		paramMap.put("3", new String[]{"2121","Marker3","10000000","0.9109224","y"});
		paramMap.put("4", new String[]{"2121","Marker4","NaN","NaN","y"});
//		paramMap.put("1", new String[]{"3","Marker1-T"});
//		paramMap.put("2", new String[]{"4","Marker2"});
//		paramMap.put("3", new String[]{"5","Marker3-T"});
//		paramMap.put("4", new String[]{"6","Marker4"});
		String classify = "",
						curveTypeId = "2120,2121";

		AnalysisService service = new AnalysisServiceImpl();
		boolean flag = false;
		switch (classify) {
		case "add":
			flag = service.insertMarker(paramMap, waferId,"TCF","S11");
			break;

		case "modify":
			flag = service.updateMarker(paramMap, waferId,"TCF");
			break;

		case "remove":
			flag = service.deleteMarker(curveTypeId,"S11");
			break;
		}
		System.out.println(flag);
//		System.out.println(new Gson().toJson(service.getMarker(curveTypeId)));
	}

	/**
	 * Test method for {@link com.eoulu.service.impl.AnalysisServiceImpl#getMarkerId(java.lang.Object[])}.
	 */
	@Ignore
	public void testGetMarkerId() {
		fail("Not yet implemented");
	}
	private int waferId = 188;
	private String module = "TCF";
	private AnalysisService service = new AnalysisServiceImpl();

	/**
	 * Test method for {@link com.eoulu.service.impl.AnalysisServiceImpl#getCalculation(int, java.lang.String)}.
	 */
	@Ignore
	public void testGetCalculation() {
		
		System.out.println(new Gson().toJson(service.getCalculation(waferId, module)));
		
	}

	/**
	 * Test method for {@link com.eoulu.service.impl.AnalysisServiceImpl#getCalculationId(int, java.lang.String, java.lang.String)}.
	 */
	@Ignore
	public void testGetCalculationId() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for {@link com.eoulu.service.impl.AnalysisServiceImpl#deleteMarker(java.lang.Object[])}.
	 */
	@Ignore
	public void testDeleteMarker() {
		fail("Not yet implemented");
	}

	/**
	 * Test method for {@link com.eoulu.service.impl.AnalysisServiceImpl#deleteMarkerById(java.lang.String[])}.
	 */
	@Ignore
	public void testDeleteMarkerById() {
		fail("Not yet implemented");
	}

}
