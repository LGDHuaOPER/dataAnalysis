/**
 * 
 */
package com.eoulu.service.impl;

import java.math.BigDecimal;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.eoulu.dao.BoxPlotDao;
import com.eoulu.service.BoxPlotService;
import com.eoulu.util.DataBaseUtil;
import com.google.gson.Gson;


/**
 * @author mengdi
 *
 * 
 */
public class BoxPlotServiceImpl implements BoxPlotService{
	double min; // 最小值ֵ
	double firstQuartile; // 第一四分位数：又称“较小四分位数”，等于该样本中所有数值由小到大排列后第25%的数字，=1+(n-1)/4
	double median; // 中位数
	double thirdQuartile; // 第三四分位数：又称“较大四分位数”，等于该样本中所有数值由小到大排列后第75%的数字,=1+(n-1)3/4
	double max; // 最大值ֵ
	double outliers; // 异常值ֵ
	double IQR; // 四分位距：第三四分位数与第一四分位数的差距
	double innerIQRmax; // 最大内限
	double innerIQRmin; // 最小内限
	double outerIQRmax; // 最大外限
	double outerIQRmin; // 最小外限
	@Override
	public Map<String, Object> getBoxPlot(String param, String waferIdStr) {
		BoxPlotDao dao = new BoxPlotDao();
		Map<String, Object> resultMap =new HashMap<String,Object>(),boxData = null,boxMap=null,outliers = null;
		List<Double> boxlist = null,softOutliersList = null,extremeOutliersList = null;
		String att[] = waferIdStr.split(",");
		Map<String,Object> map = dao.getBoxPlot( param, att);
		if(map.size()<1){
			map.put("message", "数据不存在！");
		}else{
			double number=0;
			List<Double> ls = null;
			for(int i=0,length=att.length;i<length;i++){
				boxMap = new HashMap<>();
				ls = (List<Double>) map.get(att[i]);
				boxData = getBoxData(ls, att[i]);
				boxlist = new ArrayList<Double>();
				boxlist.add(Double.parseDouble(boxData.get("min").toString()));//取最小值
	  			boxlist.add(Double.parseDouble(boxData.get("firstQuartile").toString()));//取第一四分位数
	  			boxlist.add(Double.parseDouble(boxData.get("median").toString()));//中位数
	  			boxlist.add(Double.parseDouble(boxData.get("thirdQuartile").toString()));//第三四分位数
	  			boxlist.add(Double.parseDouble(boxData.get("max").toString()));//最大值
	  			boxMap.put("eigenValue", boxlist);
	  			outliers = (Map<String, Object>) boxData.get("outliers");
	  			softOutliersList= (List<Double>) outliers.get("soft");
	  			int len = softOutliersList==null?0:softOutliersList.size();
	  			List<Double>[] soft = new ArrayList[len];
				for(int s=0;s<softOutliersList.size();s++){
					List<Double> temp=new ArrayList<Double>();
	  				temp.add(number);
	  				temp.add(softOutliersList.get(s));
	  				soft[s] = temp;
				}
				boxMap.put("soft", soft);
				extremeOutliersList= (List<Double>) outliers.get("extreme");
	  			List<Double>[] extreme = new ArrayList[extremeOutliersList.size()];
	  			for(int s=0;s<extremeOutliersList.size();s++){
					List<Double> temp=new ArrayList<Double>();
	  				temp.add(number);
	  				temp.add(extremeOutliersList.get(s));
	  				extreme[s] = temp;
				}
	  			boxMap.put("extreme", extreme);
	  			
	  			resultMap.put(att[i], boxMap);
				number++;
			}
		}
		return resultMap;
	}

	
	public Map<String, Object> getBoxData(List<Double> ls, String waferId) {
		List<Double> output = new ArrayList<>();
		Map<String,Object> map = new HashMap<>();
		if (ls != null) {

			for (int i = 0,size=ls.size(); i < size; i++) {
				if (!(ls.get(i).doubleValue() == 0 || ls.get(i).doubleValue() >= 9 * Math.pow(10, 30))) {
					output.add(ls.get(i));
				}
			}
			Double Nums[] = output.toArray(new Double[]{});
			int length = Nums.length;
			if (Nums.length <= 5) {
				map.put("min", 0);
				map.put("firstQuartile", 0);
				map.put("median", 0);
				map.put("thirdQuartile", 0);
				map.put("max", 0);
				map.put("outliers", this.getOutliers(Nums));
				map.put("waferId", waferId);
				map.put("innerIQRmax", 0);
				map.put("innerIQRmin", 0);
				map.put("outerIQRmax", 0);
				map.put("outerIQRmin", 0);
				 return map;
			}
			Arrays.sort(Nums);
			min = Nums[0];
			max = Nums[length - 1];
			int num = length / 4;
			if (length % 2 == 0) {
				median =  (Nums[length / 2 - 1] + Nums[length / 2]) / 2;
//				BigDecimal bd = new BigDecimal(median);
//				median = bd.setScale(3, BigDecimal.ROUND_HALF_UP).doubleValue();
			} else {
				median = Nums[(length + 1) / 2 - 1];
			}
			if (length % 4 == 0) {// 是整数，Q1=1+n/4的位置与n/4位置的平均值
				firstQuartile = (Nums[num - 1] + Nums[num]) / 2;
//				BigDecimal bd = new BigDecimal(firstQuartile);
//				firstQuartile = bd.setScale(3, BigDecimal.ROUND_HALF_UP).doubleValue();
				thirdQuartile =  (Nums[3 * num - 1] + Nums[3 * num]) / 2;
//				BigDecimal bd2 = new BigDecimal(thirdQuartile);
//				thirdQuartile = bd2.setScale(3, BigDecimal.ROUND_HALF_UP).doubleValue();
			} else {// 不是整数，Q1=1+n/4的位置的数据
				firstQuartile = Nums[num];
				thirdQuartile = Nums[length * 3 / 4];
			}
			IQR = thirdQuartile - firstQuartile;
			innerIQRmax = thirdQuartile + 1.5 * IQR;
			innerIQRmin = firstQuartile - 1.5 * IQR;
			outerIQRmax = thirdQuartile + 3 * IQR;
			outerIQRmin = firstQuartile - 3 * IQR;
			map.put("min", min);
			map.put("firstQuartile", firstQuartile);
			map.put("median", median);
			map.put("thirdQuartile", thirdQuartile);
			map.put("max", max);
			map.put("outliers", this.getOutliers(Nums));
			map.put("waferId", waferId);
			map.put("innerIQRmax", innerIQRmax);
			map.put("innerIQRmin", innerIQRmin);
			map.put("outerIQRmax", outerIQRmax);
			map.put("outerIQRmin", outerIQRmin);
			 return map;
		} else {
			map.put("min", 0);
			map.put("firstQuartile", 0);
			map.put("median", 0);
			map.put("thirdQuartile", 0);
			map.put("max", 0);
			map.put("outliers", this.getOutliers(null));
			map.put("waferId", waferId);
			map.put("innerIQRmax", 0);
			map.put("innerIQRmin", 0);
			map.put("outerIQRmax", 0);
			map.put("outerIQRmin", 0);
			 return map;
		}
	}
	
	public Map<String, List<Double>> getOutliers(Double Nums[]){
		Map<String, List<Double>> resultmap=new HashMap<String, List<Double>>();
		List<Double> SoftOutliers =new ArrayList<Double>();
		List<Double> ExtremeOutliers =new ArrayList<Double>();
		IQR=thirdQuartile-firstQuartile;
		innerIQRmax=thirdQuartile+1.5*IQR;
		innerIQRmin=firstQuartile-1.5*IQR;
		outerIQRmax=thirdQuartile+3*IQR;
		outerIQRmin=firstQuartile-3*IQR;
		if(Nums!=null){
		for(int m=0;m<Nums.length;m++){
			if(Nums[m]>outerIQRmax || Nums[m]<outerIQRmin ){
				ExtremeOutliers.add(Nums[m]);
			}else if((Nums[m]>outerIQRmin && Nums[m]<innerIQRmin) || (Nums[m]>innerIQRmax && Nums[m]<outerIQRmax)){
				SoftOutliers.add(Nums[m]);
			}
		}
		resultmap.put("soft", SoftOutliers);
		resultmap.put("extreme", ExtremeOutliers);
		return resultmap;
		}
		return resultmap;
	}
	
	
}
